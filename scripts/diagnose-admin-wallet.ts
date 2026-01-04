import 'dotenv/config';
import { TonClient, WalletContractV4, fromNano } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

async function diagnose() {
    console.log('--- Admin Wallet Diagnostic ---');

    const mnemonic = process.env.TON_MNEMONIC;
    const apiKey = process.env.TON_API_KEY;
    const endpoint = process.env.TON_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC';

    console.log(`Endpoint: ${endpoint}`);
    console.log(`API Key Provided: ${apiKey ? 'YES' : 'NO'}`);
    console.log(`Mnemonic Provided: ${mnemonic ? 'YES' : 'NO'}`);

    if (!mnemonic) {
        console.error('ERROR: TON_MNEMONIC is missing in environment variables.');
        process.exit(1);
    }

    try {
        console.log('Deriving wallet from mnemonic...');
        const key = await mnemonicToPrivateKey(mnemonic.split(" "));
        const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
        const address = wallet.address.toString({ testOnly: endpoint.includes('testnet') });
        
        console.log(`Admin Wallet Address: ${address}`);

        console.log('Connecting to TON...');
        const client = new TonClient({
            endpoint: endpoint,
            apiKey: apiKey
        });

        console.log('Fetching balance...');
        const balanceNano = await client.getBalance(wallet.address);
        const balance = fromNano(balanceNano);

        console.log(`Current Balance: ${balance} TON`);

        if (Number(balance) < 0.5) {
            console.warn('WARNING: Low balance! You may not have enough TON to pay for gas fees.');
            console.warn('Recommended: > 1.0 TON for smooth operations.');
        } else {
            console.log('Balance looks sufficient for basic operations.');
        }

    } catch (e: any) {
        console.error('Diagnostic Failed:', e.message);
    }
}

diagnose();
