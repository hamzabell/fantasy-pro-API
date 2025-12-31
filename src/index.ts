import 'dotenv/config';
import './types/hono.js'; // Import Hono type extensions
import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
// import fantasyPremierLeagueApp from './features/fantasy-premier-league/fantasy-premier-league-route.js';

import passport from './features/authentication/passport.config.js';


import { swaggerUI } from '@hono/swagger-ui'
import fantasyTeamsApp from './features/fantasy-teams/fantasy-teams-route.js';
import authenticationApp from './features/authentication/authentication-route.js';
import fantasyLeaguesApp from './features/fantasy-leagues/fantasy-leagues-route.js';
import solanaWebhookApp from './features/webhooks/solana-webhook-route.js';
import gameweekWebhookApp from './features/webhooks/gameweek-webhook-route.js';
import leagueIntegrationApp from './features/league-integration/league-integration-route.js';
import prisma from './prisma.js';
import { createEnvironment, defaultConfig } from './fp/infrastructure/Environment.js';
import { createLogger } from './fp/infrastructure/Logger.js';
import { payoutScheduler } from './features/webhooks/payout-scheduler.js';
// import paymentApp from './features/payments/payment.routes.js';

import { cors } from 'hono/cors';
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = new OpenAPIHono();

// Add cors middleware
app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:8100', 'https://www.fantasypro.app'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Add authentication middleware
app.use('/api/*', authMiddleware);

	// Create the application environment for dependency injection
const env = createEnvironment(
	prisma,
	createLogger(),
	defaultConfig
);

// Start Automated Services
env.publicLeagueService.startScheduler();
if (process.env.NODE_ENV !== 'test') {
	// env.blockchainService.listenForEvents(); // Removed in favor of Webhooks
    payoutScheduler.initializeScheduler(); // Start Payout Scheduler
}
//...
app.route('/api/auth', authenticationApp);
// app.route('/api/payment', paymentApp); // Mount payment webhook section
app.route('/api/webhooks', gameweekWebhookApp); // Keep existing generic/gameweek webhook
app.route('/api/webhooks/solana', solanaWebhookApp); // Mount Solana webhook
app.route('/api/fantasy-leagues', fantasyLeaguesApp);
app.route('/api/fantasy-teams', fantasyTeamsApp); // Restore Fantasy Teams
app.route('/api/league-data', leagueIntegrationApp); // Generic endpoint
// app.route('/api/fpl', fantasyPremierLeagueApp); // Restore FPL specific routes if needed
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

app.get('/swagger', swaggerUI({ url: '/doc' }))

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