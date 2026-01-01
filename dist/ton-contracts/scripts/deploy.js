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
exports.run = run;
const core_1 = require("@ton/core");
const tact_LeaguePayout_1 = require("../build/league_payout/tact_LeaguePayout");
const deploy_1 = require("@stdlib/deploy");
function run(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const leaguePayout = provider.open(yield tact_LeaguePayout_1.LeaguePayout.fromInit());
        yield leaguePayout.send(provider.sender(), {
            value: (0, core_1.toNano)('0.05'),
        }, {
            $$type: 'Deploy',
            queryId: 0n,
        });
        yield provider.waitForDeploy(leaguePayout.address);
        console.log('ID', yield leaguePayout.getLeague('league_1'));
    });
}
