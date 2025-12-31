# Mobile Wallet Interaction Guide (Solana)

**Program ID (Devnet)**: `Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN`

## Configuration Instructions for LLMs / Developers

If you are an AI assistant or developer configuring the mobile wallet (React Native / Expo) to talk to this contract, follow these specific steps:

1.  **Hardcode the Program ID**:
    Ensure the constant `PROGRAM_ID` is set to `Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN`. Do not use a placeholder.

2.  **Initialize the Provider**:
    Use `@solana/web3.js` for the connection and `@coral-xyz/anchor` for the program interface.

    ```typescript
    import { Connection, PublicKey } from "@solana/web3.js";
    import { Program, AnchorProvider } from "@coral-xyz/anchor";
    import IDL from "./path/to/league_payout.json"; // You must load the IDL JSON

    const programId = new PublicKey(
      "Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN"
    );
    const connection = new Connection("https://api.devnet.solana.com");

    // Note: On mobile, 'provider' setup depends on the specific wallet adapter (e.g. mobile-wallet-adapter-protocol)
    ```

3.  **Data Flow Rule**:
    **ALWAYS** pass the `league_id` and `user_id` strings from your application's database to the contract instructions. This maps the on-chain event back to your off-chain database record.

---

## 1. Create League Escrow (`create_league`)

Call this **after** the backend has created the league record and returned a `leagueId`.

**Parameters to Pass:**

1.  `league_id` (String): The UUID string from your backend (e.g., `"550e8400-e29b..."`).
2.  `user_id` (String): The UUID string of the creating user.
3.  `commission_percentage` (u64): Platform fee (e.g., `500` for 5.00%).
4.  `entry_fee` (u64): The entry fee in Lamports (1 SOL = 1,000,000,000 Lamports).

**Javascript Example:**

```typescript
// Assume 'program' is your Anchor program instance linked to the wallet
// 'network_fee' should be passed if > 0 (for commission-based leagues)

await program.methods
  .createLeague(
    "league_123_id_from_backend", // league_id
    "user_456_id_from_backend", // user_id
    new anchor.BN(500), // commission_percentage (500 = 5.00%)
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

**Back-End Event Handling:**

- Webhook receives `LeagueCreated`.
- Found via `league_id` -> Status updated to `OPEN`.

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

**Back-End Event Handling:**

- Webhook receives `StakeEvent`.
- Found via `league_id` + `user_id` -> Membership Status updated to `ACTIVE`.

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
