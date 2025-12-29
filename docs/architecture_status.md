# Project Status & Implementation Guide

## What Completed So Far

1.  **Database Schema**: Updated to include `User` financial fields (balance, KYC), `Wallet` (custodial keys), `Deposit`/`Withdrawal` records, and merged `FantasyLeague` with financial data.
2.  **Functional Architecture**: Established `fp-ts` patterns (`TaskEither`, `AppError`) and helpers (`safePrisma`).
3.  **Wallet Domain**:
    - Securely creating wallets with encrypted private keys.
    - `GET /balance` endpoint.
    - Encryption utilities.

## How to Implement Remaining Flows

### 1. Deposits (Yellow Card)

**Goal**: User sends Fiat (NGN/GHS) -> Receives USDC in App.

- **Step 1**: Create `PaymentService` to interact with Yellow Card API.
  - `initiateDeposit(amount, currency)`: Calls YC, returns a payment URL.
- **Step 2**: Create `POST /api/deposits`.
  - Validates input.
  - Calls `PaymentService`.
  - Stores `Deposit` record with status `pending`.
- **Step 3**: Webhook Handler (`POST /api/webhooks/yellow-card`).
  - Verifies signature.
  - If success:
    - **On-Chain**: Service wallet sends USDC to User's Custodial Wallet.
    - **DB**: Update `User.balanceUsd`.

### 2. Joining League (Staking)

**Goal**: User pays entry fee -> Funds locked in Escrow.

- **Step 1**: Create `BlockchainService` (Ethers.js).
  - `approve(privateKey, spenderAddress, amount)`: User wallet approves Escrow.
  - `joinLeague(privateKey, leagueId, fee)`: Calls Smart Contract `joinLeague`.
- **Step 2**: Refactor `POST /api/fantasy-leagues/:id/join`.
  - Retrieve User's Encrypted Key -> Decrypt.
  - Call `BlockchainService` to execute transaction.
  - Update `FantasyLeagueMembership` with `stakeAmount` and `txHash`.

### 3. Withdrawals

**Goal**: User redeems USDC -> Receives Fiat.

- **Step 1**: `POST /api/withdrawals`.
- **Step 2**: `BlockchainService` transfers USDC from User Wallet -> Yellow Card / Liquidity Wallet.
- **Step 3**: `PaymentService` triggers Fiat payout via Yellow Card API.

---

## Next Steps

I will now proceed to implement:

1.  `PaymentService` (Yellow Card Mock).
2.  `BlockchainService` (Ethers logic).
3.  `Deposit` routes.
