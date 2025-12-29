var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import './types/hono.js'; // Import Hono type extensions
import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
// import fantasyPremierLeagueApp from './features/fantasy-premier-league/fantasy-premier-league-route.js';
import passport from './features/authentication/passport.config.js';
import { swaggerUI } from '@hono/swagger-ui';
import fantasyTeamsApp from './features/fantasy-teams/fantasy-teams-route.js';
import authenticationApp from './features/authentication/authentication-route.js';
import fantasyLeaguesApp from './features/fantasy-leagues/fantasy-leagues-route.js';
import gameweekWebhookApp from './features/webhooks/gameweek-webhook-route.js';
import leagueIntegrationApp from './features/league-integration/league-integration-route.js';
import prisma from './prisma.js';
import { createEnvironment, defaultConfig } from './fp/infrastructure/Environment.js';
import walletApp from './features/wallet/wallet.routes.js';
import { createLogger } from './fp/infrastructure/Logger.js';
import { cors } from 'hono/cors';
const app = new OpenAPIHono();
// Add cors middleware
app.use('/api/*', cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
// Create the application environment for dependency injection
const env = createEnvironment(prisma, createLogger(), defaultConfig);
// Start Automated Services
env.publicLeagueService.startScheduler();
// Inject environment into all requests
app.use('*', (c, next) => {
    c.set('env', env);
    return next();
});
app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});
// Add OpenAPI documentation for all routes - BEFORE registering routes!
app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        title: 'FantasyPro API',
        version: '1.0.0',
        description: 'API documentation for FantasyPro',
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
        { url: 'https://fantasy-pro-api.onrender.com', description: 'Production Server' },
    ],
});
// Initialize Passport
app.use('*', (c, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield passport.initialize();
    yield next();
}));
// Apply user authentication middleware to all /api/* routes except webhooks and auth
// Passport middleware removed in favor of manual JWT verification
// app.use('/api/*', ...);
// Actually, let's replace the above with a manual JWT verify middleware for simplicity and robustness in Hono.
import jwt from 'jsonwebtoken';
import { retrieveUserFromDatabaseById } from './features/users/users-model.js';
import { either as E } from 'fp-ts';
app.use('/api/*', (c, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (c.req.path.startsWith('/api/webhooks') ||
        c.req.path.startsWith('/api/auth/google') ||
        c.req.path === '/api/auth/login') {
        return next();
    }
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('[Middleware] Decoded ID:', decoded.id);
        // Optional: Verify user exists in DB
        const userResult = yield retrieveUserFromDatabaseById(decoded.id)();
        if (E.isLeft(userResult) || !userResult.right) {
            console.log('[Middleware] User not found or DB error', userResult);
            return c.json({ error: 'Unauthorized' }, 401);
        }
        c.set('user', userResult.right);
        yield next();
    }
    catch (err) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
}));
// app.route('/api/fantasy-premier-league', fantasyPremierLeagueApp);
app.route('/api/fantasy-teams', fantasyTeamsApp);
app.route('/api/auth', authenticationApp);
app.route('/api/webhooks', gameweekWebhookApp);
app.route('/api/fantasy-leagues', fantasyLeaguesApp);
app.route('/api/league-data', leagueIntegrationApp); // Generic endpoint
app.route('/api/wallet', walletApp);
// Deposits and Withdrawals removed
app.get('/swagger', swaggerUI({ url: '/doc' }));
app.get('/', (c) => c.text('Welcome to the API!'));
// Serve the combined app only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    serve({
        fetch: app.fetch,
        port: Number(process.env.PORT) || 3000,
    }, (info) => {
        console.log(`API is running on http://localhost:${info.port}`);
        console.log(`OpenAPI documentation is available at http://localhost:${info.port}/doc`);
        console.log(`Swagger UI is available at http://localhost:${info.port}/swagger`);
    });
}
export default app;
