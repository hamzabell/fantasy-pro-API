import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import fantasyPremierLeagueApp from './features/fantasy-premier-league/fantasy-premier-league-route.js';
import { validateUserAuth } from './features/supabase/supabase-helpers.js';
import { swaggerUI } from '@hono/swagger-ui';
const app = new OpenAPIHono();
// Mount Fantasy Premier League API
// Add OpenAPI documentation for all routes
app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        title: 'FantasyPro API',
        version: '1.0.0',
        description: 'API documentation for FantasyPro',
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
    ],
});
app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});
app.use('/api/*', validateUserAuth);
app.route('/api/fantasy-premier-league', fantasyPremierLeagueApp);
app.get('/swagger', swaggerUI({ url: '/doc' }));
import fantasyTeamsApp from './features/fantasy-teams/fantasy-teams-route.js';
import authenticationApp from './features/authentication/authentication-route.js';
import fantasyLeaguesApp from './features/fantasy-leagues/fantasy-leagues-route.js';
import powerUpsApp from './features/power-ups/power-ups-route.js';
// Add other routes here
app.route('/api/fantasy-teams', fantasyTeamsApp);
app.route('/api/auth', authenticationApp);
app.route('/api/fantasy-leagues', fantasyLeaguesApp);
app.route('/api/power-ups', powerUpsApp);
app.get('/', (c) => c.text('Welcome to the API!'));
// Serve the combined app only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    serve({
        fetch: app.fetch,
        port: 3000,
    }, (info) => {
        console.log(`API is running on http://localhost:${info.port}`);
        console.log(`OpenAPI documentation is available at http://localhost:${info.port}/doc`);
        console.log(`Swagger UI is available at http://localhost:${info.port}/swagger`);
    });
}
export default app;
