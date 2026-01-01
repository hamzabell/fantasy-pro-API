import { toNano } from '@ton/core';
import { LeaguePayout } from '../build/league_payout/tact_LeaguePayout';
import { NetworkProvider } from '@stdlib/deploy';

export async function run(provider: NetworkProvider) {
    const leaguePayout = provider.open(await LeaguePayout.fromInit());

    await leaguePayout.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(leaguePayout.address);

    console.log('ID', await leaguePayout.getLeague('league_1'));
}
