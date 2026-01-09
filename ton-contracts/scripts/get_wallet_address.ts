import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
    const mnemonic = "power snap scout pear sweet able this edit demand onion renew air nothing dawn various phone dove must struggle wedding eagle panda divide physical";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

    console.log("Bounceable (Testnet):", wallet.address.toString({ testOnly: true, bounceable: true }));
    console.log("Non-Bounceable (Testnet):", wallet.address.toString({ testOnly: true, bounceable: false }));
}

main();
