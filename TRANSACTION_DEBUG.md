# Transaction Sending Investigation

## Current Status

**Problem**: Transactions return a hash but don't appear on testnet blockchain.

**Evidence**:

- Seeding creates leagues successfully
- Transaction hashes are stored in database
- Hashes don't exist in contract's transaction history on testnet
- Latest contract tx: `eb903dc4...` from 23:30:51
- Stored hash example: `6130fff3...` (not found)

## Possible Root Causes

1. **Wallet has no balance** - Can't send transactions without TON for gas
2. **Wrong network** - Sending to mainnet instead of testnet
3. **Seqno mismatch** - Wallet sequence number incorrect
4. **Silent failure** - `sendExternalMessage` succeeds but transaction rejected

## Next Steps

1. Check admin wallet balance on testnet
2. Verify endpoint is testnet (currently: `https://testnet.toncenter.com/api/v2/jsonRPC`)
3. Check transaction logs for errors
4. Test manual transaction send

## Logs to Find

Looking for:

- `[TON] Wallet seqno: ...`
- `[TON] External message sent successfully`
- Any errors in transaction sending
