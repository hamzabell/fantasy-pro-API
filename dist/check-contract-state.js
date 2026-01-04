var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TonClient4, Address } from "@ton/ton";
import { sha256_sync } from "@ton/crypto";
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new TonClient4({
            endpoint: "https://sandbox-v4.tonhubapi.com",
        });
        const contractAddress = Address.parse("kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S");
        const leagueId = "pl_1767398829652_let4ci7f";
        console.log("Checking League ID:", leagueId);
        // Call getter 'league'
        // Note: Tact getters might require different arguments depending on how they are named
        // 'get league(id: String)' becomes 'getLeague' in JS usually, or we use callGetter
        try {
            const lastBlock = yield client.getLastBlock();
            const result = yield client.runMethod(lastBlock.last.seqno, contractAddress, "league", [
                { type: "slice", cell: (yield import("@ton/core")).beginCell().storeStringTail(leagueId).endCell() }
            ]);
            console.log("Result:", result);
        }
        catch (e) {
            console.error("Getter failed:", e);
        }
    });
}
run();
