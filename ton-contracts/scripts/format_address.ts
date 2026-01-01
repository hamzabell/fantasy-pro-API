import { Address } from "@ton/core";

async function main() {
    const addrStr = "kQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okvZJ";
    const address = Address.parse(addrStr);

    console.log("=== Address Formats ===");
    console.log("Testnet (kQ):", address.toString({ testOnly: true }));
    console.log("Mainnet/Standard (EQ):", address.toString({ testOnly: false, bounceable: true }));
    console.log("Non-Bounceable (UQ):", address.toString({ testOnly: false, bounceable: false }));
    console.log("Raw (0:hash):", address.toRawString());
    console.log("=======================");
}

main();
