import { TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { LeaguePayout } from "../build/league_payout/league_payout_LeaguePayout";
import { toNano, Address, Contract, OpenedContract } from "@ton/core";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
    // NEW MNEMONIC (Generated for User)
    const mnemonic = "power snap scout pear sweet able this edit demand onion renew air nothing dawn various phone dove must struggle wedding eagle panda divide physical";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    
    // Standard V4 Wallet
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    console.log("Wallet Address:", wallet.address.toString({ testOnly: true }));

    // Use TonHub V4 Endpoint (Different API, less congested)
    const client = new TonClient4({
        endpoint: "https://testnet-v4.tonhubapi.com",
    });

    const leaguePayout = await LeaguePayout.fromInit();
    const lpOpened = client.open(leaguePayout);
    console.log("Contract Address (Future):", leaguePayout.address.toString({ testOnly: true }));
    
    // Check balance
    console.log("Checking balance...");
    let balance = 0n;
    while(true) {
        try {
            const lastBlock = await client.getLastBlock();
            const account = await client.getAccount(lastBlock.last.seqno, wallet.address);
            if (account.account.state.type === 'active') { // Check if active
                 balance = BigInt(account.account.balance.coins);
            } else if (account.account.state.type === 'uninit') {
                 balance = BigInt(account.account.balance.coins);
            }
            console.log("Wallet Balance:", balance.toString());
            break;
        } catch(e) {
            console.log("Balance check failed, waiting 2s...");
            await sleep(2000);
        }
    }
    
    if (balance === 0n) {
        console.warn("Wallet has 0 balance! Please top up.");
        // return; 
    }

    const walletContract = client.open(wallet);
    console.log("Checking seqno...");
    let seqno = 0;
    while(true) {
        try {
             seqno = await walletContract.getSeqno();
             console.log("Current Seqno:", seqno);
             break;
        } catch(e) {
            console.log("Seqno check failed, waiting 2s...");
            await sleep(2000);
        }
    }

    // Deploy
    console.log("Sending deploy transaction...");
    let sent = false;
    for(let i=0; i<5; i++) {
        try {
            console.log(`Attempt ${i+1}...`);
            await lpOpened.send(
                walletContract.sender(key.secretKey),
                {
                    value: toNano("0.05"),
                },
                {
                    $$type: "Deploy",
                    queryId: 0n,
                }
            );
            sent = true;
            console.log("Deploy transaction sent successfully.");
            break;
        } catch (e: any) {
            console.log(`Send failed (attempt ${i+1}):`, e.message);
            console.log("Waiting 5s before retry...");
            await sleep(5000);
        }
    }
    
    if (!sent) {
        console.error("Failed to send transaction after multiple attempts.");
        return;
    }

    console.log("Waiting for deployment confirmation...");
    
    let attempts = 0;
    while (attempts < 30) {
        await sleep(4000); // V4 blocks are fast but sync might take a moment
        try {
            const lastBlock = await client.getLastBlock();
            const isDeployed = await client.isContractDeployed(lastBlock.last.seqno, leaguePayout.address);
            if (isDeployed) {
                console.log("Contract deployed!");
                console.log("Contract Address:", leaguePayout.address.toString({ testOnly: true }));
                return;
            }
        } catch (e) {
            console.log("Checking deployment status failed, retrying...");
        }
        attempts++;
        if (attempts % 5 === 0) console.log(`Waiting... (${attempts*4}s)`);
    }
    console.warn("Timeout waiting for deployment.");
    console.log("Contract Address:", leaguePayout.address.toString({ testOnly: true }));
}

main();
