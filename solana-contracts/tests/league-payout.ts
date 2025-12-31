/// <reference types="mocha" />
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
// import { LeaguePayout } from "../target/types/league_payout";

describe("league-payout", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.LeaguePayout as any; // Program<LeaguePayout>;
  
  const leagueId = "gw_01_pl_10";
  const userId = "user_123";
  const commissionPercentage = new anchor.BN(1000); // 10%
  const feeAmount = new anchor.BN(0);

  it("Creates a league", async () => {
    const [leaguePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("league"), Buffer.from(leagueId)],
      program.programId
    );
    
    const [userStakePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user_stake"), Buffer.from(leagueId), provider.wallet.publicKey.toBuffer()],
        program.programId
    );

    const admin = provider.wallet.publicKey; // Self as admin for test

    await program.methods
      .createLeague(leagueId, userId, commissionPercentage, feeAmount)
      .accounts({
        league: leaguePda,
        userStake: userStakePda,
        signer: provider.wallet.publicKey,
        admin: admin,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const leagueAccount = await program.account.league.fetch(leaguePda);
    assert.equal(leagueAccount.leagueId, leagueId);
    assert.equal(leagueAccount.commissionPercentage.toString(), "1000");
    assert.equal(leagueAccount.owner.toBase58(), provider.wallet.publicKey.toBase58());
  });

  it("Stakes in a league", async () => {
     const [leaguePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("league"), Buffer.from(leagueId)],
      program.programId
    );
    
    // Use a different user? Or same.
    const user = anchor.web3.Keypair.generate();
    // Airdrop
    const sig = await provider.connection.requestAirdrop(user.publicKey, 1000000000);
    await provider.connection.confirmTransaction(sig);

    const [userStakePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user_stake"), Buffer.from(leagueId), user.publicKey.toBuffer()],
        program.programId
    );

    const stakeAmount = new anchor.BN(100000000); // 0.1 SOL

    await program.methods
      .stake(leagueId, "user_2", stakeAmount)
      .accounts({
        league: leaguePda,
        userStake: userStakePda,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
      
    const leagueAccount = await provider.connection.getAccountInfo(leaguePda);
    assert.isNotNull(leagueAccount);
    if(leagueAccount) {
        assert.isTrue(leagueAccount.lamports >= 100000000);
    }
  });

  it("Payouts winners", async () => {
    // We reuse the league from previous test which has balance
    const [leaguePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("league"), Buffer.from(leagueId)],
      program.programId
    );

    // Create a winner account
    const winner = anchor.web3.Keypair.generate().publicKey;
    
    // Percentages: 1 winner gets 90% (after 10% commission fee calc? No, input percentages are basis points matching logic)
    // The contract logic says: amount = (distributable * pct / 10000)
    // Distributable = Total - Commission.
    // So if commission is 10%, distributable is 90%.
    // To give ALL remaining to winner, pct should be 10000 (100% of distributable).
    
    const winningPercentages = [new anchor.BN(10000)]; 
    const commissionPct = new anchor.BN(1000); // 10% platform fee
    
    const admin = provider.wallet.publicKey;
    const adminBalanceBefore = await provider.connection.getBalance(admin);

    await program.methods
      .payoutWinners(leagueId, winningPercentages, commissionPct)
      .accounts({
        league: leaguePda,
        signer: provider.wallet.publicKey, // Admin
        admin: admin,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .remainingAccounts([
          { pubkey: winner, isWritable: true, isSigner: false }
      ])
      .rpc();
      
    // Verify balance was transferred (roughly)
    const winnerBalance = await provider.connection.getBalance(winner);
    assert.isTrue(winnerBalance > 0);
  });
});
