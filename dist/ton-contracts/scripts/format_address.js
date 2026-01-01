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
const core_1 = require("@ton/core");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const addrStr = "kQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okvZJ";
        const address = core_1.Address.parse(addrStr);
        console.log("=== Address Formats ===");
        console.log("Testnet (kQ):", address.toString({ testOnly: true }));
        console.log("Mainnet/Standard (EQ):", address.toString({ testOnly: false, bounceable: true }));
        console.log("Non-Bounceable (UQ):", address.toString({ testOnly: false, bounceable: false }));
        console.log("Raw (0:hash):", address.toRawString());
        console.log("=======================");
    });
}
main();
