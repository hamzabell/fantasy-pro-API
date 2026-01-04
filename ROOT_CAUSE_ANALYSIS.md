# Public League Seeding - Root Cause Analysis

## Problem Summary

Public league seeding creates leagues and "sends" transactions, but verification always fails because the transaction hash stored in the database doesn't match any transaction on the blockchain.

## Root Cause: Hash Mismatch

**What's Happening:**

1. `createPublicLeague` calls `transfer.hash()` → Returns external message hash (e.g., `078913b5...`)
2. Stores this hash in `blockchainTxHash` field
3. Transaction IS sent to blockchain successfully
4. On-chain, the transaction appears with a DIFFERENT hash (e.g., `729144c2...`)
5. Verification worker looks for `078913b5...` but only finds `729144c2...`
6. Verification fails → Retries 5 times → Marks as failed

**Evidence:**

- Admin wallet has 1.71 TON ✅
- Transactions appear on contract (latest: `729144c2...` at 23:37:29) ✅
- Stored hash `078913b5...` not found on-chain ❌
- Timing matches: Seeding at ~23:37, transaction at 23:37:29 ✅

## Why Hashes Don't Match

In TON:

- **External message hash**: Hash of the message sent FROM wallet TO contract
- **Incoming message hash**: Hash of the message as it appears IN the transaction on-chain
- These are DIFFERENT values for the same transaction

## Solution Options

### Option 1: Don't Verify (Quick Fix)

Mark public leagues as 'open' immediately without verification since we control the wallet.

**Pros**: Simple, fast
**Cons**: No on-chain confirmation

### Option 2: Poll for Recent Transactions (Recommended)

Instead of checking for a specific hash, check if a transaction with the correct:

- OpCode (1462801691 for CreatePublicLeague)
- LeagueId (in payload)
- Timestamp (within last 60 seconds)

appeared on the contract.

**Pros**: Reliable, confirms on-chain
**Cons**: Slightly more complex

### Option 3: Wait and Get Real Hash

After sending, wait for transaction to confirm (~5-10 seconds) and query the wallet's recent transactions to get the actual on-chain hash.

**Pros**: Stores correct hash
**Cons**: Slower, blocks seeding

## Recommended Fix

Implement **Option 2** in `TransactionVerificationService.verifyLeagueTransaction`:

```typescript
// For public leagues, check recent contract transactions
// Look for CreatePublicLeague opcode + matching leagueId
const recentTxs = await this.tonClient.getTransactions(contractAddress, {
  limit: 20,
});

for (const tx of recentTxs) {
  if (tx.inMessage) {
    // Parse message body
    const body = tx.inMessage.body;
    if (body) {
      const slice = body.beginParse();
      const opcode = slice.loadUint(32);

      if (opcode === 1462801691) {
        // CreatePublicLeague
        const leagueId = slice.loadStringRefTail();
        if (leagueId === expectedLeagueId) {
          // Found it! Check if successful
          return tx.description.computePhase?.success;
        }
      }
    }
  }
}
```

This way we verify the transaction actually happened without relying on hash matching.

## Current Status

- ✅ Wallet initialized
- ✅ Transactions sending successfully
- ✅ Appearing on blockchain
- ❌ Verification failing due to hash mismatch
- ✅ Worker marks as failed after 5 attempts
- ✅ Seeding deletes failed and retries

**Next Step**: Implement Option 2 to fix verification.
