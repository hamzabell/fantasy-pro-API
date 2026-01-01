# TonConnect Integration Guide - Calling LeaguePayout Contract

This guide provides **working code examples** for integrating TonConnect to call your LeaguePayout smart contract functions.

## Prerequisites

### 1. Install Dependencies

```bash
npm install @tonconnect/ui-react @ton/ton @ton/core
```

### 2. Copy Contract Wrapper

Copy the generated contract wrapper to your frontend:

```bash
# From your project root
cp ton-contracts/build/league_payout/league_payout_LeaguePayout.ts src/contracts/
```

### 3. Environment Variables

```env
VITE_TON_CONTRACT_ADDRESS=EQxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TON_NETWORK=testnet  # or mainnet
```

## Setup TonConnect

### 1. Create TonConnect Manifest

Create `public/tonconnect-manifest.json`:

```json
{
  "url": "https://your-app.com",
  "name": "FantasyPro",
  "iconUrl": "https://your-app.com/logo.png",
  "termsOfUseUrl": "https://your-app.com/terms",
  "privacyPolicyUrl": "https://your-app.com/privacy"
}
```

### 2. Setup TonConnect Provider

In your `App.tsx` or `main.tsx`:

```typescript
import { TonConnectUIProvider } from "@tonconnect/ui-react";

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://your-app.com/tonconnect-manifest.json">
      {/* Your app components */}
    </TonConnectUIProvider>
  );
}
```

## Understanding Gas Costs

### Gas Cost Breakdown

TON transactions require gas to execute. Here's what you need to send:

**Formula**: `Total Value = Stake/Fee Amount + Gas Cost`

#### CreateLeague Gas Costs

- **Base transaction**: ~0.05 TON
- **Message processing**: ~0.02 TON
- **Storage allocation**: ~0.01 TON
- **Event emission**: ~0.01 TON
- **Safety buffer**: ~0.01 TON
- **Recommended minimum**: **0.1 TON**

**Example**:

```typescript
// Creating league with 0.5 TON fee
const feeAmount = "0.5";
const totalValue = toNano("0.5") + toNano("0.1"); // 0.6 TON total
```

#### Stake Gas Costs

- **Base transaction**: ~0.05 TON
- **Message processing**: ~0.03 TON (includes stake key generation)
- **Storage update**: ~0.01 TON
- **Event emission**: ~0.01 TON
- **Recommended minimum**: **0.1 TON**

**Example**:

```typescript
// Staking 1.0 TON
const stakeAmount = "1.0";
const totalValue = toNano("1.0") + toNano("0.1"); // 1.1 TON total
```

### Gas Cost Calculator

Add this helper to your utilities:

```typescript
// src/utils/contract.ts

/**
 * Calculate exact TON amount to send including gas
 */
export function calculateTotalWithGas(
  amount: string,
  gasAmount: string = "0.1"
): {
  amount: string;
  gas: string;
  total: string;
  totalNano: bigint;
} {
  const amountNano = toNano(amount);
  const gasNano = toNano(gasAmount);
  const totalNano = amountNano + gasNano;

  return {
    amount,
    gas: gasAmount,
    total: (Number(amount) + Number(gasAmount)).toFixed(2),
    totalNano,
  };
}

// Usage
const { total, totalNano } = calculateTotalWithGas("1.0"); // Stake 1 TON
console.log(`Send ${total} TON total (${1.0} stake + ${0.1} gas)`);
```

### Real-World Examples

Based on actual test results:

| Operation               | Amount  | Gas     | Total to Send |
| ----------------------- | ------- | ------- | ------------- |
| Create League (no fee)  | 0 TON   | 0.1 TON | **0.1 TON**   |
| Create League (0.5 fee) | 0.5 TON | 0.1 TON | **0.6 TON**   |
| Create League (1.0 fee) | 1.0 TON | 0.1 TON | **1.1 TON**   |
| Stake 0.1 TON           | 0.1 TON | 0.1 TON | **0.2 TON**   |
| Stake 1.0 TON           | 1.0 TON | 0.1 TON | **1.1 TON**   |
| Stake 10 TON            | 10 TON  | 0.1 TON | **10.1 TON**  |

### Important Notes

1. **Always add gas**: Never send exactly the stake/fee amount
2. **Minimum 0.1 TON gas**: This covers most scenarios
3. **Excess is returned**: Unused gas is refunded to sender
4. **Insufficient gas = failure**: Transaction will fail if gas is too low

### Testing Gas Costs

From the test suite (`league_payout.spec.ts`):

```typescript
// CreateLeague with fee
await leaguePayout.send(
  deployer.getSender(),
  { value: toNano("2.0") }, // 1.0 fee + 1.0 buffer (generous)
  {
    $$type: "CreateLeague",
    leagueId: "league_paid",
    userId: "user_1",
    commissionPercentage: 500n,
    feeAmount: toNano("1.0"),
  }
);

// Stake
await leaguePayout.send(
  staker.getSender(),
  { value: toNano("2.0") }, // 1.0 stake + 1.0 buffer (generous)
  {
    $$type: "Stake",
    leagueId: "league_123",
    userId: "user_1",
    amount: toNano("1.0"),
  }
);
```

The tests use generous buffers (2x the amount), but **0.1 TON gas is sufficient** for production.

## Contract Integration Utilities (Updated)

### 1. Create Contract Helper (`src/utils/contract.ts`)

`````typescript
import { Address, beginCell, toNano } from '@ton/core';
import {
  storeCreateLeague,
  storeStake,
  CreateLeague,
  Stake
} from '../contracts/league_payout_LeaguePayout';

export const CONTRACT_ADDRESS = Address.parse(
  import.meta.env.VITE_TON_CONTRACT_ADDRESS
);

// Minimum gas required for each operation
export const GAS_COSTS = {
  CREATE_LEAGUE: '0.1',  // 0.1 TON
  STAKE: '0.1',          // 0.1 TON
  PAYOUT: '0.2',         // 0.2 TON (more complex operation)
} as const;

/**
 * Build CreateLeague message body
 */
export function buildCreateLeagueMessage(params: {
  leagueId: string;
  userId: string;
  commissionPercentage: number;  // e.g., 500 for 5%
  feeAmount: string;  // in TON, e.g., "0.5"
}) {
  const message: CreateLeague = {
    $$type: 'CreateLeague',
    leagueId: params.leagueId,
    userId: params.userId,
    commissionPercentage: BigInt(params.commissionPercentage),
    feeAmount: toNano(params.feeAmount)
  };

  return beginCell()
    .store(storeCreateLeague(message))
    .endCell();
}

/**
 * Build Stake message body
 */
export function buildStakeMessage(params: {
  leagueId: string;
  userId: string;
  amount: string;  // in TON, e.g., "1.0"
}) {
  const message: Stake = {
    $$type: 'Stake',
    leagueId: params.leagueId,
    userId: params.userId,
    amount: toNano(params.amount)
  };

  return beginCell()
    .store(storeStake(message))
    .endCell();
}

/**
 * Calculate total value to send for CreateLeague
 * Returns both the bigint value and human-readable breakdown
 */
export function calculateCreateLeagueValue(feeAmount: string) {
  const fee = toNano(feeAmount);
  const gas = toNano(GAS_COSTS.CREATE_LEAGUE);
  const total = fee + gas;

  return {
    fee: feeAmount,
    gas: GAS_COSTS.CREATE_LEAGUE,
    total: (Number(feeAmount) + Number(GAS_COSTS.CREATE_LEAGUE)).toFixed(2),
    totalNano: total
  };
}

/**
 * Calculate total value to send for Stake
 * Returns both the bigint value and human-readable breakdown
 */
export function calculateStakeValue(stakeAmount: string) {
  const stake = toNano(stakeAmount);
  const gas = toNano(GAS_COSTS.STAKE);
  const total = stake + gas;

  return {
    stake: stakeAmount,
    gas: GAS_COSTS.STAKE,
    total: (Number(stakeAmount) + Number(GAS_COSTS.STAKE)).toFixed(2),
    totalNano: total
  };
}


### 1. Create Contract Helper (`src/utils/contract.ts`)

````typescript
import { Address, beginCell, toNano } from "@ton/core";
import {
  storeCreateLeague,
  storeStake,
  CreateLeague,
  Stake,
} from "../contracts/league_payout_LeaguePayout";

export const CONTRACT_ADDRESS = Address.parse(
  import.meta.env.VITE_TON_CONTRACT_ADDRESS
);

/**
 * Build CreateLeague message body
 */
export function buildCreateLeagueMessage(params: {
  leagueId: string;
  userId: string;
  commissionPercentage: number; // e.g., 500 for 5%
  feeAmount: string; // in TON, e.g., "0.5"
}) {
  const message: CreateLeague = {
    $$type: "CreateLeague",
    leagueId: params.leagueId,
    userId: params.userId,
    commissionPercentage: BigInt(params.commissionPercentage),
    feeAmount: toNano(params.feeAmount),
  };

  return beginCell().store(storeCreateLeague(message)).endCell();
}

/**
 * Build Stake message body
 */
export function buildStakeMessage(params: {
  leagueId: string;
  userId: string;
  amount: string; // in TON, e.g., "1.0"
}) {
  const message: Stake = {
    $$type: "Stake",
    leagueId: params.leagueId,
    userId: params.userId,
    amount: toNano(params.amount),
  };

  return beginCell().store(storeStake(message)).endCell();
}

/**
 * Calculate total value to send for CreateLeague
 * Must include: gas + feeAmount
 *
 * Gas breakdown:
 * - Base transaction: ~0.05 TON
 * - Message processing: ~0.02 TON
 * - Storage: ~0.01 TON
 * - Event emission: ~0.01 TON
 * - Safety buffer: ~0.01 TON
 * Total recommended: 0.1 TON
 */
export function calculateCreateLeagueValue(feeAmount: string): bigint {
  const fee = toNano(feeAmount);
  const gas = toNano('0.1');  // Minimum gas for CreateLeague
  return fee + gas;
}

/**
 * Calculate total value to send for Stake
 * Must include: stakeAmount + gas
 *
 * Gas breakdown:
 * - Base transaction: ~0.05 TON
 * - Message processing: ~0.03 TON (includes stake key generation)
 * - Storage update: ~0.01 TON
 * - Event emission: ~0.01 TON
 * Total recommended: 0.1 TON
 */
export function calculateStakeValue(stakeAmount: string): bigint {
  const stake = toNano(stakeAmount);
  const gas = toNano('0.1');  // Minimum gas for Stake
  return stake + gas;
}

### 2. Create TonConnect Hook (`src/hooks/useTonContract.ts`)

```typescript
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { useState } from "react";
import {
  CONTRACT_ADDRESS,
  buildCreateLeagueMessage,
  buildStakeMessage,
  calculateCreateLeagueValue,
  calculateStakeValue,
} from "../utils/contract";

export function useTonContract() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a league on the blockchain
   */
  const createLeague = async (params: {
    leagueId: string;
    userId: string;
    commissionPercentage: number;
    feeAmount: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      if (!userAddress) {
        throw new Error('Wallet not connected');
      }

      const body = buildCreateLeagueMessage(params);
      const { total, totalNano, fee, gas } = calculateCreateLeagueValue(params.feeAmount);

      console.log('Sending CreateLeague transaction:', {
        to: CONTRACT_ADDRESS.toString(),
        leagueId: params.leagueId,
        userId: params.userId,
        commission: params.commissionPercentage,
        feeAmount: fee,
        gasAmount: gas,
        totalToSend: `${total} TON (${fee} fee + ${gas} gas)`
      });

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360, // 6 minutes
        messages: [
          {
            address: CONTRACT_ADDRESS.toString(),
            amount: totalNano.toString(),
            payload: body.toBoc().toString('base64')
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);

      console.log('Transaction sent:', result);
      return result;

    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create league';
      console.error('CreateLeague error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Stake in a league
   */
  const stake = async (params: {
    leagueId: string;
    userId: string;
    amount: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      if (!userAddress) {
        throw new Error("Wallet not connected");
      }

      const body = buildStakeMessage(params);
      const { total, totalNano, stake: stakeAmount, gas } = calculateStakeValue(params.amount);

      console.log('Sending Stake transaction:', {
        to: CONTRACT_ADDRESS.toString(),
        leagueId: params.leagueId,
        userId: params.userId,
        stakeAmount,
        gasAmount: gas,
        totalToSend: `${total} TON (${stakeAmount} stake + ${gas} gas)`
      });

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: CONTRACT_ADDRESS.toString(),
            amount: totalNano.toString(),
            payload: body.toBoc().toString('base64')
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);

      console.log('Transaction sent:', result);
      return result;

    } catch (err: any) {
      const errorMessage = err?.message || "Failed to stake";
      console.error("Stake error:", err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLeague,
    stake,
    loading,
    error,
    userAddress,
    isConnected: !!userAddress,
  };
}
`````

## React Component Examples

### 1. Wallet Connection Component

```typescript
// src/components/WalletConnect.tsx
import { TonConnectButton } from "@tonconnect/ui-react";

export function WalletConnect() {
  return (
    <div>
      <TonConnectButton />
    </div>
  );
}
```

### 2. Create League Component

```typescript
// src/components/CreateLeague.tsx
import { useState } from "react";
import { useTonContract } from "../hooks/useTonContract";

export function CreateLeague() {
  const { createLeague, loading, error, isConnected } = useTonContract();
  const [leagueId, setLeagueId] = useState("");
  const [userId, setUserId] = useState("");
  const [commission, setCommission] = useState("500"); // 5%
  const [fee, setFee] = useState("0.5"); // 0.5 TON

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. First create the league in your database
      const response = await fetch("/api/fantasy-leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leagueId,
          name: "My League",
          // ... other fields
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create league in database");
      }

      const { league } = await response.json();

      // 2. Send blockchain transaction
      await createLeague({
        leagueId: league.id,
        userId: userId,
        commissionPercentage: parseInt(commission),
        feeAmount: fee,
      });

      alert(
        "League created successfully! Waiting for blockchain confirmation..."
      );

      // 3. Poll for status update (or use WebSocket)
      // The webhook will update the league status to 'open' when confirmed
    } catch (err: any) {
      console.error("Error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (!isConnected) {
    return <div>Please connect your wallet first</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create League</h2>

      <div>
        <label>League ID:</label>
        <input
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          required
        />
      </div>

      <div>
        <label>User ID:</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Commission (basis points, e.g., 500 = 5%):</label>
        <input
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Fee Amount (TON):</label>
        <input value={fee} onChange={(e) => setFee(e.target.value)} required />
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create League"}
      </button>
    </form>
  );
}
```

### 3. Join League (Stake) Component

```typescript
// src/components/JoinLeague.tsx
import { useState } from "react";
import { useTonContract } from "../hooks/useTonContract";

export function JoinLeague({ leagueCode }: { leagueCode: string }) {
  const { stake, loading, error, isConnected } = useTonContract();
  const [userId, setUserId] = useState("");
  const [stakeAmount, setStakeAmount] = useState("1.0");

  const handleJoin = async () => {
    try {
      // 1. Get league info and create membership in database
      const response = await fetch("/api/fantasy-leagues/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: leagueCode,
          teamName: "My Team",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to join league in database");
      }

      const { membership } = await response.json();

      // 2. Send stake transaction
      await stake({
        leagueId: membership.leagueId,
        userId: userId,
        amount: stakeAmount,
      });

      alert("Stake sent! Waiting for blockchain confirmation...");

      // 3. Webhook will update membership status to 'active' when confirmed
    } catch (err: any) {
      console.error("Error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (!isConnected) {
    return <div>Please connect your wallet first</div>;
  }

  return (
    <div>
      <h2>Join League</h2>

      <div>
        <label>User ID:</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Stake Amount (TON):</label>
        <input
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          required
        />
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button onClick={handleJoin} disabled={loading}>
        {loading ? "Joining..." : "Join League"}
      </button>
    </div>
  );
}
```

## Debugging Failed Transactions

### Common Issues & Solutions

#### 1. **"Insufficient funds" Error**

**Problem**: Not sending enough TON to cover gas + stake/fee

**Solution**: Ensure you're calculating the total value correctly:

```typescript
// For CreateLeague
const totalValue = toNano(feeAmount) + toNano("0.1"); // fee + gas

// For Stake
const totalValue = toNano(stakeAmount) + toNano("0.1"); // stake + gas
```

#### 2. **"Invalid prefix" Error**

**Problem**: Wrong opcode being used

**Solution**: Always use the generated wrapper functions:

```typescript
// ❌ DON'T: Manual construction
const body = beginCell()
  .storeUint(123456789, 32) // Wrong!
  .storeStringRefTail(leagueId)
  .endCell();

// ✅ DO: Use generated wrapper
import { storeCreateLeague } from "./contracts/league_payout_LeaguePayout";

const body = beginCell()
  .store(
    storeCreateLeague({
      $$type: "CreateLeague",
      leagueId,
      userId,
      commissionPercentage: BigInt(500),
      feeAmount: toNano("0.5"),
    })
  )
  .endCell();
```

#### 3. **Transaction Rejected**

**Problem**: User rejected in wallet, or wallet timeout

**Solution**: Add proper error handling:

```typescript
try {
  await tonConnectUI.sendTransaction(transaction);
} catch (err: any) {
  if (err.message?.includes("reject")) {
    alert("Transaction was rejected");
  } else if (err.message?.includes("timeout")) {
    alert("Transaction timed out. Please try again.");
  } else {
    alert(`Error: ${err.message}`);
  }
}
```

#### 4. **Contract Address Wrong**

**Problem**: Sending to wrong contract address

**Solution**: Verify contract address:

```typescript
console.log("Contract Address:", CONTRACT_ADDRESS.toString());
// Should match your deployed contract
```

### Enable Debug Logging

Add this to see detailed transaction info:

```typescript
const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: CONTRACT_ADDRESS.toString(),
      amount: value.toString(),
      payload: body.toBoc().toString("base64"),
    },
  ],
};

console.log("Transaction Details:", {
  address: transaction.messages[0].address,
  amount: transaction.messages[0].amount,
  payload: transaction.messages[0].payload,
  payloadHex: body.toBoc().toString("hex"),
});

const result = await tonConnectUI.sendTransaction(transaction);
console.log("Result:", result);
```

## Testing on Testnet

1. **Get Testnet TON**: Use [TON Testnet Faucet](https://testnet.tonscan.org/faucet)

2. **Deploy Contract to Testnet**:

```bash
cd ton-contracts
npm run deploy
```

3. **Update Contract Address**:

```env
VITE_TON_CONTRACT_ADDRESS=<your-deployed-address>
VITE_TON_NETWORK=testnet
```

4. **Test Transactions**: Use the components above to test CreateLeague and Stake

5. **Monitor Transactions**: Check [Testnet Explorer](https://testnet.tonscan.org/)

## Complete Integration Checklist

- [ ] Install dependencies (`@tonconnect/ui-react`, `@ton/ton`, `@ton/core`)
- [ ] Copy contract wrapper to frontend
- [ ] Create `tonconnect-manifest.json`
- [ ] Setup TonConnect provider in App
- [ ] Create contract utility functions
- [ ] Create `useTonContract` hook
- [ ] Implement CreateLeague component
- [ ] Implement JoinLeague component
- [ ] Test on testnet
- [ ] Setup webhook to listen for confirmations
- [ ] Add transaction status polling/WebSocket
- [ ] Deploy to production

## Next Steps

1. **Copy the code** from this guide into your frontend
2. **Update contract address** in environment variables
3. **Test CreateLeague** with small amounts on testnet
4. **Test Stake** to verify the full flow
5. **Monitor webhook** to see events coming through
6. **Add UI polish** (loading states, error messages, success notifications)

The key to success is using the **generated wrapper functions** (`storeCreateLeague`, `storeStake`) and ensuring you send **enough TON** to cover both the stake/fee AND gas costs.
