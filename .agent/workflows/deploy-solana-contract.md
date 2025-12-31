---
description: Deploy Solana Smart Contract to Devnet
---

This workflow guides you through deploying your Anchor smart contract to the Solana Devnet.

## Prerequisites

- Solana CLI installed (`sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"`)
- Anchor CLI installed (`cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`)

## Steps

1.  **Configure Solana CLI for Devnet**

    ```bash
    solana config set --url devnet
    ```

2.  **Generate a Wallet (if you haven't already)**

    ```bash
    mkdir -p ~/.config/solana
    solana-keygen new --outfile ~/.config/solana/id.json
    ```

3.  **Airdrop some SOL for deployment fees**

    ```bash
    solana airdrop 2 ~/.config/solana/id.json
    ```

4.  **Navigate to the Contract Directory**

    ```bash
    cd solana-contracts
    ```

5.  **Build the Project (Initial)**
    This step generates the keypair for your program.

    ```bash
    anchor build
    ```

6.  **Get Your Program ID**
    Run this command to see the address of your new program:

    ```bash
    solana address -k target/deploy/league_payout-keypair.json
    ```

7.  **Update Configuration Files**
    Copy the address from the previous step and update the following files:

    - **`programs/league-payout/src/lib.rs`**:
      Update the `declare_id!("...")` macro.
    - **`Anchor.toml`**:
      Update `[programs.localnet]` (and add `[programs.devnet]` if you wish, or just replace the address).
      ```toml
      [programs.devnet]
      league_payout = "YOUR_NEW_PROGRAM_ID"
      ```

8.  **Build Again**
    Re-build with the correct Program ID embedded.

    ```bash
    anchor build
    ```

9.  **Deploy**

    ```bash
    anchor deploy --provider.cluster devnet
    ```

10. **Verify Deployment**
    To verify, you can inspect the program logs or run your tests against devnet:
    ```bash
    anchor test --provider.cluster devnet
    ```

## Post-Deployment

Once deployed, remember to update your **API Environment**:

- Set `SOLANA_RPC_ENDPOINT` to `https://api.devnet.solana.com` (or your QuickNode/Alchemy devnet URL).
- Set `LEAGUE_PROGRAM_ID` (if you added this variable) or update the `PROGRAM_ID` constant in `src/infrastructure/blockchain/solana-blockchain.service.ts` to matching your deployed ID.
