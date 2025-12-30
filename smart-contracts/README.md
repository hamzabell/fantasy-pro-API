# Smart Contract Integration

This directory contains the `LeaguePayout` smart contract used for distributing league winnings on the Polygon network.

## Prerequisites

- Node.js
- `.env` file with `SERVER_PRIVATE_KEY`
- Install dependencies:
  ```bash
  cd smart-contracts
  npm install
  ```

## Contract

`contracts/LeaguePayout.sol`: A simple contract that allows the owner (server) to:

1. Deposit funds (POL).
2. Distribute funds to multiple winners in a batch transaction.

## Tests

Run tests using Hardhat:

```bash
npx hardhat test
```

## Deployment

Deploy to Polygon Amoy Testnet:

```bash
npx hardhat run scripts/deploy.ts --network amoy
```

Deploy to Polygon Mainnet:

```bash
npx hardhat run scripts/deploy.ts --network polygon
```

After deployment, update `LEAGUE_CONTRACT_ADDRESS` in your root `.env` file with the new contract address.

## Verification

You can verify the contract on Polygonscan using:

```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```
