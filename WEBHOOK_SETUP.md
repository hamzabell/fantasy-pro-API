# Webhook Setup Guide (Alchemy)

This project is configured to receive **Alchemy Custom Webhooks** for Solana.

## 1. Prerequisites

- **Program ID**: `Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN` (Devnet)
- **API Endpoint**: `https://<YOUR_API_DOMAIN>/api/webhooks/solana`

## 2. Alchemy Dashboard Configuration

1.  **Login**: Go to [dashboard.alchemy.com](https://dashboard.alchemy.com/).
2.  **Navigate**: Go to **Notify** -> **Webhooks**.
3.  **Create Webhook**:
    - **Chain**: Solana
    - **Network**: Devnet
    - **Webhook Type**: Address Activity (or "Account Activity")
    - **Webhook URL**: Enter your deployed API URL:
      `https://fantasy-pro-api.onrender.com/api/webhooks/solana`
      _(Replace domain if different)_.
    - **Addresses**: Enter the deployed Program ID: `Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN`.
4.  **Test**: Triger a test notification from the dashboard to ensure your API returns `200 OK`.

## 3. Payload Structure

The webhook expects a JSON payload matching the Alchemy "Address Activity" format:

```json
[
  {
    "blockTime": 1678900000,
    "slot": 123456789,
    "txHash": "5c...",
    "fee": 5000,
    "status": "Success",
    "logs": [
      "Program Gcm... invoke [1]",
      "Program data: LEAGUE_CREATED_DATA...",
      "Program Gcm... consumed 20000 of 200000 compute units",
      "Program Gcm... success"
    ]
  }
]
```

The server parses `logs` looking for "Program data: " strings, which are then decoded using the Anchor IDL to identify events like `LeagueCreated` or `StakeEvent`.
