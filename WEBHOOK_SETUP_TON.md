# Webhook Setup Guide (TON)

This project is configured to receive **TON Events** via Webhook.

## 1. Prerequisites

- **Contract Address**: (Result of your deployment)
- **API Endpoint**: `https://<YOUR_API_DOMAIN>/api/webhooks/ton`

## 2. Configuration (e.g. TonAPI / Helius equivalence)

Since TON does not have a single standard "Webhook" provider like Helius for Solana, you likely use **TonAPI.io** or a custom indexer.

1.  **Register**: Go to your provider (e.g., [tonapi.io](https://tonapi.io/)).
2.  **Create Webhook**:
    - **Endpoint**: `https://fantasy-pro-api.onrender.com/api/webhooks/ton`
    - **Events**: Subscribe to events for your Contract Address.
    - **Event Types**: `Trace`, `Transaction`, or specific decoded events if supported.

## 3. Payload Structure

The `ton-webhook-route.ts` is designed to handle a generic event structure. Adjust `TonEventSchema` in the code if your provider sends a different format.

Expected generic format:

```json
{
  "event_name": "LeagueCreated",
  "data": {
    "leagueId": "league_1",
    "userId": "user_1",
    ...
  },
  "tx_hash": "abcd...",
  "timestamp": 1678900000
}
```

If your provider sends raw blocks/transactions, you will need to update the parser in `src/features/webhooks/ton-webhook-route.ts`.
