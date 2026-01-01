import { mnemonicNew, mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";

async function main() {
    // Generate new mnemonic
    const mnemonic = await mnemonicNew(24);
    const key = await mnemonicToWalletKey(mnemonic);
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

    console.log("=== NEW WALLET CREDENTIALS ===");
    console.log("Mnemonic:", mnemonic.join(" "));
    console.log("Address:", wallet.address.toString({ testOnly: true }));
    console.log("==============================");
}

main();
