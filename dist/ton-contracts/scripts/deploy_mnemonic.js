"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ton_1 = require("@ton/ton");
const crypto_1 = require("@ton/crypto");
const league_payout_LeaguePayout_1 = require("../build/league_payout/league_payout_LeaguePayout");
const core_1 = require("@ton/core");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // NEW MNEMONIC (Generated for User)
        const mnemonic = "power snap scout pear sweet able this edit demand onion renew air nothing dawn various phone dove must struggle wedding eagle panda divide physical";
        const key = yield (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
        // Standard V4 Wallet
        const wallet = ton_1.WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        console.log("Wallet Address:", wallet.address.toString({ testOnly: true }));
        // Use TonHub V4 Endpoint (Different API, less congested)
        const client = new ton_1.TonClient4({
            endpoint: "https://testnet-v4.tonhubapi.com",
        });
        const leaguePayout = yield league_payout_LeaguePayout_1.LeaguePayout.fromInit();
        const lpOpened = client.open(leaguePayout);
        console.log("Contract Address (Future):", leaguePayout.address.toString({ testOnly: true }));
        // Check balance
        console.log("Checking balance...");
        let balance = 0n;
        while (true) {
            try {
                const lastBlock = yield client.getLastBlock();
                const account = yield client.getAccount(lastBlock.last.seqno, wallet.address);
                if (account.account.state.type === 'active') { // Check if active
                    balance = BigInt(account.account.balance.coins);
                }
                else if (account.account.state.type === 'uninit') {
                    balance = BigInt(account.account.balance.coins);
                }
                console.log("Wallet Balance:", balance.toString());
                break;
            }
            catch (e) {
                console.log("Balance check failed, waiting 2s...");
                yield sleep(2000);
            }
        }
        if (balance === 0n) {
            console.warn("Wallet has 0 balance! Please top up.");
            // return; 
        }
        const walletContract = client.open(wallet);
        console.log("Checking seqno...");
        let seqno = 0;
        while (true) {
            try {
                seqno = yield walletContract.getSeqno();
                console.log("Current Seqno:", seqno);
                break;
            }
            catch (e) {
                console.log("Seqno check failed, waiting 2s...");
                yield sleep(2000);
            }
        }
        // Deploy
        console.log("Sending deploy transaction...");
        let sent = false;
        for (let i = 0; i < 5; i++) {
            try {
                console.log(`Attempt ${i + 1}...`);
                yield lpOpened.send(walletContract.sender(key.secretKey), {
                    value: (0, core_1.toNano)("0.05"),
                }, {
                    $$type: "Deploy",
                    queryId: 0n,
                });
                sent = true;
                console.log("Deploy transaction sent successfully.");
                break;
            }
            catch (e) {
                console.log(`Send failed (attempt ${i + 1}):`, e.message);
                console.log("Waiting 5s before retry...");
                yield sleep(5000);
            }
        }
        if (!sent) {
            console.error("Failed to send transaction after multiple attempts.");
            return;
        }
        console.log("Waiting for deployment confirmation...");
        let attempts = 0;
        while (attempts < 30) {
            yield sleep(4000); // V4 blocks are fast but sync might take a moment
            try {
                const lastBlock = yield client.getLastBlock();
                const isDeployed = yield client.isContractDeployed(lastBlock.last.seqno, leaguePayout.address);
                if (isDeployed) {
                    console.log("Contract deployed!");
                    console.log("Contract Address:", leaguePayout.address.toString({ testOnly: true }));
                    return;
                }
            }
            catch (e) {
                console.log("Checking deployment status failed, retrying...");
            }
            attempts++;
            if (attempts % 5 === 0)
                console.log(`Waiting... (${attempts * 4}s)`);
        }
        console.warn("Timeout waiting for deployment.");
        console.log("Contract Address:", leaguePayout.address.toString({ testOnly: true }));
    });
}
main();
