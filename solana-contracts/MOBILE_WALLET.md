# Mobile Wallet Interaction Guide

This guide explains how the mobile app interacts with the Solana Smart Contract (`league_payout`).

**Crucial Point**: To ensure the backend can link blockchain events to the database, you **MUST** pass the `leagueId` and `userId` (as strings) to the contract instructions.

## 1. Create League Escrow (`create_league`)

Call this **after** the backend has created the league record and returned a `leagueId`.

**Parameters to Pass:**

1.  `league_id` (String): The UUID string from your backend (e.g., `"550e8400-e29b..."`).
2.  `user_id` (String): The UUID string of the creating user.
3.  `commission_percentage` (u64): Platform fee (e.g., `5` for 5%).
4.  `entry_fee` (u64): The entry fee in Lamports (1 SOL = 1,000,000,000 Lamports).

**Javascript Example:**

```typescript
// Assume 'program' is your Anchor program instance linked to the wallet
// 'network_fee' should be passed if > 0 (for commission-based leagues)

await program.methods
  .createLeague(
    "league_123_id_from_backend", // league_id
    "user_456_id_from_backend", // user_id
    new anchor.BN(500), // commission_percentage (e.g. 5.00% = 500 basis points or just 5? Check contract math)
    // Contract divides by 10000, so 500 = 5%.
    new anchor.BN(1000000000) // fee_amount (1 SOL)
  )
  .accounts({
    league: leaguePda, // PDA derived from ["league", league_id]
    userStake: userStakePda, // PDA derived from ["user_stake", league_id, user_pubkey]
    signer: userWallet.publicKey,
    admin: adminPublicKey, // The account receiving the fee (if fee_amount > 0)
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

**What happens on Backend:**

1.  Webhook receives `LeagueCreated` event containing `league_id` and `user_id`.
2.  Backend finds the League by `league_id`.
3.  Backend updates League status to `OPEN` and sets `blockchainTxHash`.

---

## 2. Join League (`stake`)

Call this when a user wants to pay the entry fee to join.

**Parameters to Pass:**

1.  `league_id` (String): The ID of the league they are joining.
2.  `user_id` (String): The ID of the joining user.
3.  `amount` (u64): The amount to stake (entry fee) in Lamports.

**Javascript Example:**

```typescript
await program.methods
  .stake(
    "league_123_id_from_backend", // league_id
    "user_789_id_from_backend", // user_id
    new anchor.BN(1000000000) // amount (1 SOL)
  )
  .accounts({
    league: leaguePda, // PDA derived from ["league", league_id]
    userStake: userStakePda, // PDA derived from ["user_stake", league_id, user_pubkey]
    user: userWallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

**What happens on Backend:**

1.  Webhook receives `StakeEvent` event containing `league_id`, `user_id`, and `amount`.
2.  Backend finds the user's membership using `league_id` and `user_id`.
3.  Backend updates membership status to `ACTIVE`.

---

## 3. PDA Derivation (Important)

The contract uses **Program Derived Addresses (PDAs)** to deterministically locate accounts. You must derive these on the frontend to pass as accounts.

```typescript
const PROGRAM_ID = new PublicKey(
  "Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN"
);

// 1. Derive League PDA
const [leaguePda] = PublicKey.findProgramAddressSync(
  [Buffer.from("league"), Buffer.from("league_123_id_from_backend")],
  PROGRAM_ID
);

// 2. Derive User Stake PDA
const [userStakePda] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("user_stake"),
    Buffer.from("league_123_id_from_backend"),
    userWallet.publicKey.toBuffer(),
  ],
  PROGRAM_ID
);
```
