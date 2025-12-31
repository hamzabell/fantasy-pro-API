# Solana Contract Deployment & Webhook Configuration Guide

**Contract Build Status**: SUCCESS ✅
**Program ID**: `GnJfcroEEbhkUcrCKoV7UB3iBJ97kyeefxHnLFqBqMMC` (Configured in code)

## Step 1: Recover Your Deployer Wallet

You provided a recovery phrase image. Please recover it to a file named `solana-deploy-wallet.json` in this directory:

```bash
# Run this command and type your mnemonic when prompted
solana-keygen recover 'prompt:?key=0/0' -o solana-deploy-wallet.json
```

## Step 2: Fund & Deploy

Since the contract is already built with the correct ID, you just need to deploy it to devnet.

1.  **Set Config to Devnet**:
    ```bash
    solana config set --url https://api.devnet.solana.com
    ```
2.  **Fund Wallet** (if needed):
    ```bash
    solana airdrop 2 $(solana address -k solana-deploy-wallet.json)
    ```
3.  **Deploy**:
    ```bash
    # This deploys the binary from target/deploy
    anchor deploy --provider.wallet solana-deploy-wallet.json --provider.cluster devnet
    ```

**Note for Production**: If deploying to Mainnet, change url to `https://api.mainnet-beta.solana.com` and ensure you have real SOL.

## Step 3: Configure Backend

We have already updated:

- `src/infrastructure/blockchain/solana-blockchain.service.ts`
- `src/features/webhooks/solana-webhook-route.ts`

**Start the Backend**:
You need to provide the **Server Private Key** (the one that will _sign_ transactions on behalf of the app, usually the Admin/Creator of leagues) in your `.env`.

1.  **Add to `.env`**:
    ```env
    SERVER_PRIVATE_KEY="<base58_secret_key_of_admin_wallet>"
    SOLANA_RPC_ENDPOINT="https://api.devnet.solana.com"
    ```
    - To get the base58 secret key from your `solana-deploy-wallet.json` (array format):
      ```bash
      # Provide a script or use a tool to convert JSON array to Base58
      # Simple Node script:
      node -e 'console.log(require("bs58").encode(Buffer.from(require("./solana-deploy-wallet.json"))))'
      ```

## Step 4: Configure Helius Webhook

To receive real-time updates:

1.  Go to [Helius Dashboard](https://dev.helius.xyz/).
2.  Create Webhook for address: `GnJfcroEEbhkUcrCKoV7UB3iBJ97kyeefxHnLFqBqMMC`.
3.  URL: `https://your-api.onrender.com/api/webhooks/solana`.
4.  Types: `Any` (Enhanced).

The backend route `src/features/webhooks/solana-webhook-route.ts` is ready to handle `LeagueCreated` and `StakeEvent`.
