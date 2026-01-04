import { TonClient4, Address } from "@ton/ton";
import { sha256_sync } from "@ton/crypto";

async function run() {
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
        const lastBlock = await client.getLastBlock();
        const result = await client.runMethod(lastBlock.last.seqno, contractAddress, "league", [
            { type: "slice", cell: (await import("@ton/core")).beginCell().storeStringTail(leagueId).endCell() }
        ]);
        
        console.log("Result:", result);
    } catch (e) {
        console.error("Getter failed:", e);
    }
}

run();
