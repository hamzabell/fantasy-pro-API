var _a, _b;
// Constructor for creating the environment (called at app startup)
export const createEnvironment = (prisma, supabase, logger, config) => ({
    prisma,
    supabase,
    logger,
    config
});
// Default configuration from environment variables
export const defaultConfig = {
    budgetLimit: 100,
    minPlayers: 11,
    maxPlayers: 11,
    webhookApiToken: (_a = process.env.WEBHOOK_API_TOKEN) !== null && _a !== void 0 ? _a : '',
    polygonNetwork: (_b = process.env.POLYGON_NETWORK) !== null && _b !== void 0 ? _b : 'mumbai'
};
