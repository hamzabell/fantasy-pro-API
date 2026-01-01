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
const crypto_1 = require("@ton/crypto");
const ton_1 = require("@ton/ton");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate new mnemonic
        const mnemonic = yield (0, crypto_1.mnemonicNew)(24);
        const key = yield (0, crypto_1.mnemonicToWalletKey)(mnemonic);
        const wallet = ton_1.WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        console.log("=== NEW WALLET CREDENTIALS ===");
        console.log("Mnemonic:", mnemonic.join(" "));
        console.log("Address:", wallet.address.toString({ testOnly: true }));
        console.log("==============================");
    });
}
main();
