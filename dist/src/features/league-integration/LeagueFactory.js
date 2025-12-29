var _a;
import { RealLifeLeague } from '../../generated/prisma/index.js';
import { PremierLeagueService } from './PremierLeagueService.js';
export class LeagueFactory {
    /**
     * Get the service instance for a specific league
     * @param league The RealLifeLeague enum
     * @returns The service instance
     * @throws Error if service not found for the league
     */
    static getService(league) {
        const service = this.services.get(league);
        if (!service) {
            throw new Error(`Service for league ${league} not implemented.`);
        }
        return service;
    }
    /**
     * Get all registered services
     * @returns Array of services
     */
    static getAllServices() {
        return Array.from(this.services.values());
    }
    /**
     * Get available leagues
     * @returns Array of RealLifeLeague enums
     */
    static getAvailableLeagues() {
        return Array.from(this.services.keys());
    }
}
_a = LeagueFactory;
LeagueFactory.services = new Map();
(() => {
    // Register services
    const plService = new PremierLeagueService();
    _a.services.set(plService.getLeagueEnum(), plService);
})();
