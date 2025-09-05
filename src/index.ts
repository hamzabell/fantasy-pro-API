import 'dotenv/config';
import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import fantasyPremierLeagueApp from './features/fantasy-premier-league/fantasy-premier-league-route.js';
import { validateUserAuth } from './features/supabase/supabase-helpers.js';
import { swaggerUI } from '@hono/swagger-ui'
import fantasyTeamsApp from './features/fantasy-teams/fantasy-teams-route.js';
import authenticationApp from './features/authentication/authentication-route.js';
import fantasyLeaguesApp from './features/fantasy-leagues/fantasy-leagues-route.js';
import leaguePowerUpsApp from './features/fantasy-leagues/league-power-ups-route.js';
import gameweekWebhookApp from './features/webhooks/gameweek-webhook-route.js';

const app = new OpenAPIHono();

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

app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT',
});

// Apply user authentication middleware to all /api/* routes except webhooks
app.use('/api/*', (c, next) => {
  // Skip auth for webhook endpoints
  if (c.req.path.startsWith('/api/webhooks')) {
    return next();
  }
  // Apply user auth for all other /api/* routes
  return validateUserAuth(c, next);
});

app.route('/api/fantasy-premier-league', fantasyPremierLeagueApp);
app.route('/api/fantasy-teams', fantasyTeamsApp);
app.route('/api/auth', authenticationApp);
app.route('/api/webhooks', gameweekWebhookApp);
app.route('/api/fantasy-leagues', fantasyLeaguesApp);
app.route('/api/leagues', leaguePowerUpsApp);

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