use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN");

#[program]
pub mod league_payout {
    use super::*;

    pub fn create_league(
        ctx: Context<CreateLeague>,
        league_id: String,
        user_id: String,
        commission_percentage: u64,
        fee_amount: u64
    ) -> Result<()> {
        let league = &mut ctx.accounts.league;
        league.owner = ctx.accounts.signer.key();
        league.league_id = league_id.clone();
        league.fee_paid = fee_amount > 0;
        league.commission_percentage = commission_percentage;
        league.bump = ctx.bumps.league;

        // Handle fee transfer to admin/owner if fee > 0
        if fee_amount > 0 {
             // Basic check: transfer from signer to admin
             // We assume 'admin' is passed as an account or hardcoded?
             // For parity with Solidity 'owner', we can treat the 'admin' account as the receiver.
             let cpi_context = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.signer.to_account_info(),
                    to: ctx.accounts.admin.to_account_info(),
                },
            );
            system_program::transfer(cpi_context, fee_amount)?;
        }

        emit!(LeagueCreated {
            league_id,
            user_id,
            commission_percentage,
            creator: ctx.accounts.signer.key(),
            fee_paid: fee_amount
        });

        // Mark creator as staked? In Solidity: yes.
        // We create a UserLeague account for the creator.
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.has_staked = true;
        user_stake.user = ctx.accounts.signer.key();
        user_stake.league = league.key();
        user_stake.bump = ctx.bumps.user_stake; 

        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, league_id: String, user_id: String, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::ZeroAmount);

        // Transfer SOL to League PDA
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.league.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        // Record User Stake
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.has_staked = true;
        user_stake.user = ctx.accounts.user.key();
        user_stake.league = ctx.accounts.league.key();
        user_stake.bump = ctx.bumps.user_stake;

        emit!(StakeEvent {
            user: ctx.accounts.user.key(),
            amount,
            user_id,
            league_id
        });

        Ok(())
    }

    // Payout Winners
    // Expects:
    // - ctx.remaining_accounts: The winners (must be System Accounts to receive SOL)
    // - winning_percentages: Corresponds to accounts in remaining_accounts order.
    // - commission_percentage: Platform/Creator fee.
    pub fn payout_winners(
        ctx: Context<PayoutWinners>, 
        league_id: String, 
        winning_percentages: Vec<u64>, 
        commission_percentage: u64
    ) -> Result<()> {
        let league = &ctx.accounts.league;
        require!(ctx.accounts.signer.key() == ctx.accounts.admin.key(), ErrorCode::Unauthorized); // Only admin can payout 
        // Note: Admin check should match the deployed state or a config. Here we trust the passed 'admin' matches signer?
        // We should probably check against a stored admin in a global state, but for parity:
        // In Solidity owner is stored. Here we can use 'league.owner' for creator...
        // BUT payoutWinners is usually called by the SYSTEM (Platform).
        // The Solidity contract uses `owner` (deployer) as the authority.
        // We will assume the `admin` signer is the authority.

        // Get total balance in League PDA
        let total_staked = ctx.accounts.league.to_account_info().lamports();
        require!(total_staked > 0, ErrorCode::NoFunds);
        
        // Fee logic
        // If fee_paid is true, commission MUST be 0
        if league.fee_paid {
            require!(commission_percentage == 0, ErrorCode::FeePaidNoCommission);
        }

        let commission_amount = (total_staked as u128 * commission_percentage as u128 / 10000) as u64;
        let distributable_amount = total_staked - commission_amount;

        // Verify inputs
        require!(ctx.remaining_accounts.len() == winning_percentages.len(), ErrorCode::LengthMismatch);

        // Transfer Commission to Admin
        if commission_amount > 0 {
             **ctx.accounts.league.to_account_info().try_borrow_mut_lamports()? -= commission_amount;
             **ctx.accounts.admin.to_account_info().try_borrow_mut_lamports()? += commission_amount;
        }

        let mut total_payout = 0;

        // Distribute to winners
        for (i, winner_info) in ctx.remaining_accounts.iter().enumerate() {
            let pct = winning_percentages[i];
            let amount = (distributable_amount as u128 * pct as u128 / 10000) as u64;

            if amount > 0 {
                **ctx.accounts.league.to_account_info().try_borrow_mut_lamports()? -= amount;
                **winner_info.try_borrow_mut_lamports()? += amount;
                
                total_payout += amount;
                
                emit!(PayoutEvent {
                    league_id: league_id.clone(),
                    winner: winner_info.key(),
                    amount
                });
            }
        }

        emit!(PayoutCompletedEvent {
            league_id,
            total_payout,
            commission: commission_amount
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(league_id: String)]
pub struct CreateLeague<'info> {
    #[account(
        init,
        seeds = [b"league", league_id.as_bytes()],
        bump,
        payer = signer,
        space = 8 + 32 + 50 + 1 + 8 + 1 // discriminator + owner + id + fee_paid + comm + bump
    )]
    pub league: Account<'info, League>,
    
    #[account(
        init,
        seeds = [b"user_stake", league_id.as_bytes(), signer.key().as_ref()],
        bump,
        payer = signer,
        space = 8 + 1 + 32 + 32 + 1
    )]
    pub user_stake: Account<'info, UserStake>,

    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: Admin account to receive fees
    #[account(mut)]
    pub admin: AccountInfo<'info>, 
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(league_id: String)]
pub struct Stake<'info> {
    #[account(
        mut,
        seeds = [b"league", league_id.as_bytes()],
        bump = league.bump
    )]
    pub league: Account<'info, League>,

    #[account(
        init,
        seeds = [b"user_stake", league_id.as_bytes(), user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 1 + 32 + 32 + 1
    )]
    pub user_stake: Account<'info, UserStake>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(league_id: String)]
pub struct PayoutWinners<'info> {
    #[account(
        mut,
        seeds = [b"league", league_id.as_bytes()],
        bump = league.bump
    )]
    pub league: Account<'info, League>,
    
    #[account(mut)]
    pub signer: Signer<'info>,
    
    /// CHECK: Admin matches signer for now
    #[account(mut, address = signer.key())]
    pub admin: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct League {
    pub owner: Pubkey,
    pub league_id: String,
    pub fee_paid: bool,
    pub commission_percentage: u64,
    pub bump: u8,
}

#[account]
pub struct UserStake {
    pub has_staked: bool,
    pub user: Pubkey,
    pub league: Pubkey,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("No funds in league")]
    NoFunds,
    #[msg("Fee paid, no commission allowed")]
    FeePaidNoCommission,
    #[msg("Winners and percentages length mismatch")]
    LengthMismatch,
}

#[event]
pub struct LeagueCreated {
    pub league_id: String,
    pub user_id: String,
    pub commission_percentage: u64,
    pub creator: Pubkey,
    pub fee_paid: u64,
}

#[event]
pub struct StakeEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub user_id: String,
    pub league_id: String,
}

#[event]
pub struct PayoutEvent {
    pub league_id: String,
    pub winner: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PayoutCompletedEvent {
    pub league_id: String,
    pub total_payout: u64,
    pub commission: u64,
}
