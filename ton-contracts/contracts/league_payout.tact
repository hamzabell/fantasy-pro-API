// import "@stdlib/deploy";

message Deploy {
    queryId: Int as uint64;
}

message DeployOk {
    queryId: Int as uint64;
}

trait Deployable {
    receive(msg: Deploy) {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: 64, // SendRemainingValue (+ 2 for IgnoreErrors? usually just 64 is enough for reply, or 64+2=66)
            body: DeployOk{queryId: msg.queryId}.toCell()
        });
    }
}

// Messages
message CreateLeague {
    leagueId: String;
    userId: String;
    commissionPercentage: Int as uint64;
    feeAmount: Int as coins;
    initialStake: Int as coins;
}

message Stake {
    leagueId: String;
    userId: String;
    amount: Int as coins;
}

message CreatePublicLeague {
    leagueId: String;
    commissionPercentage: Int as uint64;
    feeAmount: Int as coins; // What users will pay to join
}

message PayoutWinners {
    leagueId: String;
    winningPercentages: map<Int, Int>; // Winner index -> Percentage (basis points)
    winners: map<Int, Address>; // Winner index -> Address
    count: Int as uint8;
    commissionPercentage: Int as uint64;
}

message Withdraw {
    amount: Int as coins;
}

// Events
message LeagueCreated {
    leagueId: String;
}
message StakeEvent {
    leagueId: String;
    userId: String;
    amount: Int as coins;
}
message PayoutEvent {
    leagueId: String;
    winner: Address;
    amount: Int as coins;
}
message PayoutCompletedEvent {
    leagueId: String;
}

contract LeaguePayout with Deployable {
    // State
    owner: Address;
    
    // We can use maps to store league state
    // League ID (String) -> League Data
    // Staking info: (LeagueID + User Address hash) -> Staked Amount or Bool
    
    // For simplicity in Tact 1.5, we might use a dedicated child contract for each league 
    // to avoid massive maps in one contract if scalability is key.
    // GUIDANCE: "Do away with Solana contract... implement TON contract... same logic"
    // The Solana contract used a PDA per league. 
    // In TON, it's best to have a MASTER contract that deploys LEAGUE contracts (Jetton-style or similar pattern).
    // OR we can keep it simple: One contract managing everything using Maps, 
    // but extensive usage might hit limits. 
    // Given the request is "same logic", I'll stick to a single contract with Maps for now 
    // as it mirrors the "one program" mental model, but I will note limits. 
    // ACTUALLY, "PDA" (Program Derived Address) in Solana is akin to a child contract in TON.
    // But to speed up migration, I will use a single contract with Maps if the expected usage is low-ish, 
    // or better allow the architecture to be robust. 
    // Let's stick to Single Contract for MVP velocity unless I hit limits. 
    // Using `map<Int, ...>` with hash of leagueId is common.
    
    // Maps
    // leagueId (sha256 hash as Int) -> LeagueInfo
    leagues: map<Int, LeagueInfo>;
    // (leagueId_hash + user_address_hash) -> StakeInfo
    stakes: map<Int, StakeInfo>;

    init() {
        self.owner = sender();
    }

    // --- Create League ---
    receive(msg: CreateLeague) {
        let ctx: Context = context();
        let leagueHash: Int = sha256(msg.leagueId);
        
        // check if exists
        require(self.leagues.get(leagueHash) == null, "League already exists");
        
        let feePaid: Bool = false;
        let requiredValue: Int = 0;

        if (msg.feeAmount > 0) {
            requiredValue = requiredValue + msg.feeAmount;
        }
        
        if (msg.initialStake > 0) {
            requiredValue = requiredValue + msg.initialStake;
        }

        require(ctx.value >= requiredValue, "Insufficient value sent");

        // Handle Fee
        if (msg.feeAmount > 0) {
            // Fee logic: Send to owner/admin
            send(SendParameters{
                to: self.owner,
                value: msg.feeAmount,
                mode: SendIgnoreErrors,
                bounce: false,
                body: "League Creation Fee".asComment()
            });
            feePaid = true;
        }
        
        // Handle Initial Stake
        let stakedAmount: Int = 0;
        if (msg.initialStake > 0) {
            stakedAmount = msg.initialStake;
            
            // Record Stake
            // Fix: Use hash of (leagueHash + userAddress) to avoid integer overflow from simple addition
            // Note: ctx.sender is the user creating the league/stake
            let stakeKey: Int = beginCell().storeUint(leagueHash, 256).storeAddress(ctx.sender).endCell().hash(); 
            require(self.stakes.get(stakeKey) == null, "User already staked");

            let stakeInfo: StakeInfo = StakeInfo{
                user: ctx.sender,
                amount: stakedAmount,
                hasStaked: true
            };
            self.stakes.set(stakeKey, stakeInfo);
            emit(StakeEvent{leagueId: msg.leagueId, userId: msg.userId, amount: stakedAmount}.toCell());
        }

        let info: LeagueInfo = LeagueInfo{
            owner: ctx.sender,
            leagueId: msg.leagueId,
            commissionPercentage: msg.commissionPercentage,
            feePaid: feePaid,
            totalStaked: stakedAmount
        };
        
        self.leagues.set(leagueHash, info);
        emit(LeagueCreated{leagueId: msg.leagueId}.toCell());
    }

    // --- Create Public League (Owner Only) ---
    receive(msg: CreatePublicLeague) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can create public leagues");
        
        let leagueHash: Int = sha256(msg.leagueId);
        
        // check if exists
        require(self.leagues.get(leagueHash) == null, "League already exists");
        
        // For public leagues, no fee is paid upfront
        // The feeAmount is stored so users know what to pay when staking
        let info: LeagueInfo = LeagueInfo{
            owner: self.owner, // Public leagues are owned by the contract owner
            leagueId: msg.leagueId,
            commissionPercentage: msg.commissionPercentage,
            feePaid: false, // No fee paid for public league creation
            totalStaked: 0
        };
        
        self.leagues.set(leagueHash, info);
        emit(LeagueCreated{leagueId: msg.leagueId}.toCell());
    }

    // --- Stake ---
    receive(msg: Stake) {
        let ctx: Context = context();
        let leagueHash: Int = sha256(msg.leagueId);
        let league: LeagueInfo = self.leagues.get(leagueHash)!!; // Throw if null
        
        require(ctx.value >= msg.amount, "Insufficient stake amount sent");
        
        // Check for double stake?
        // Fix: Use hash of (leagueHash + userAddress) to avoid integer overflow from simple addition
        let stakeKey: Int = beginCell().storeUint(leagueHash, 256).storeAddress(ctx.sender).endCell().hash(); 
        require(self.stakes.get(stakeKey) == null, "User already staked");

        let stakeInfo: StakeInfo = StakeInfo{
            user: ctx.sender,
            amount: msg.amount,
            hasStaked: true
        };
        
        self.stakes.set(stakeKey, stakeInfo);
        emit(StakeEvent{leagueId: msg.leagueId, userId: msg.userId, amount: msg.amount}.toCell());
        
        // Update Total Staked
        let newTotal: Int = league.totalStaked + msg.amount;
        self.leagues.set(leagueHash, LeagueInfo{
            owner: league.owner,
            leagueId: league.leagueId,
            commissionPercentage: league.commissionPercentage,
            feePaid: league.feePaid,
            totalStaked: newTotal
        });
    }

    // --- Payout Winners ---
    receive(msg: PayoutWinners) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can payout");
        
        let leagueHash: Int = sha256(msg.leagueId);
        let league: LeagueInfo = self.leagues.get(leagueHash)!!;
        
        // Calculate Total Staked
        let totalStaked: Int = league.totalStaked;
        require(totalStaked > 0, "No funds in league");
        
        // Validation: Commission constraints
        if (league.feePaid) {
            require(msg.commissionPercentage == 0, "Fee paid, no commission allowed");
        }

        // Commission Calculation
        let commAmount: Int = 0;
        let distributableAmount: Int = totalStaked;

        if (!league.feePaid && msg.commissionPercentage > 0) {
            commAmount = totalStaked * msg.commissionPercentage / 10000;
            distributableAmount = totalStaked - commAmount;
            
            if (commAmount > 0) {
                 send(SendParameters{
                    to: self.owner,
                    value: commAmount,
                    mode: SendIgnoreErrors,
                    bounce: false,
                    body: "Commission".asComment()
                });
            }
        }
        
        // Payout Loop
        let i: Int = 0;
        let paidOut: Int = 0;
        
        repeat(msg.count) {
             let winnerAddr: Address = msg.winners.get(i)!!;
             let pct: Int = msg.winningPercentages.get(i)!!;
             
             // Check if winner staked
             // Fix: Match the stakeKey derivation from Stake message
             let stakeKey: Int = beginCell().storeUint(leagueHash, 256).storeAddress(winnerAddr).endCell().hash();
             require(self.stakes.get(stakeKey) != null, "Winner did not stake");
             
             let amount: Int = distributableAmount * pct / 10000;
             if (amount > 0) {
                 send(SendParameters{
                    to: winnerAddr,
                    value: amount,
                    mode: SendIgnoreErrors,
                    bounce: false,
                    body: "Payout".asComment()
                });
                emit(PayoutEvent{leagueId: msg.leagueId, winner: winnerAddr, amount: amount}.toCell());
                paidOut = paidOut + amount;
             }
             i = i + 1;
        }

        // Update Total Staked to 0 (Assuming full payout)
        // Or deduct paidOut + commAmount?
        // Logic implies the league is "done" or empty.
        // We set to 0 to prevent double spending.
        self.leagues.set(leagueHash, LeagueInfo{
            owner: league.owner,
            leagueId: league.leagueId,
            commissionPercentage: league.commissionPercentage,
            feePaid: league.feePaid,
            totalStaked: 0 
        });
        emit(PayoutCompletedEvent{leagueId: msg.leagueId}.toCell());
    }

    // --- Withdraw ---
    receive(msg: Withdraw) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can withdraw");
        
        send(SendParameters{
            to: self.owner,
            value: msg.amount,
            mode: SendIgnoreErrors,
            bounce: false,
            body: "Withdrawal".asComment()
        });
    }
    
    // Getter for League
    get fun league(id: String): LeagueInfo? {
        return self.leagues.get(sha256(id));
    }
}

struct LeagueInfo {
    owner: Address;
    leagueId: String;
    commissionPercentage: Int;
    feePaid: Bool;
    totalStaked: Int as coins;
}

struct StakeInfo {
    user: Address;
    amount: Int;
    hasStaked: Bool;
}
