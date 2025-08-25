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
// Apply user authentication middleware to all /api/* routes except /api/admin/*
app.use('/api/*', (c, next) => {
    // Check if the request is for an admin OTP endpoint
    if (c.req.path.startsWith('/api/admin/otp')) {
        // Skip user auth for admin OTP endpoints
        return next();
    }
    if (c.req.path.startsWith('/api/admin/power-ups')) {
        // Apply admin auth for admin power-ups endpoints
        return validateAdminAuth(c, next);
    }
    // Apply user auth for all other /api/* routes
    return validateUserAuth(c, next);
});
app.route('/api/fantasy-premier-league', fantasyPremierLeagueApp);
app.get('/swagger', swaggerUI({ url: '/doc' }));
import fantasyTeamsApp from './features/fantasy-teams/fantasy-teams-route.js';
import authenticationApp from './features/authentication/authentication-route.js';
import fantasyLeaguesApp from './features/fantasy-leagues/fantasy-leagues-route.js';
import powerUpsApp from './features/power-ups/power-ups-route.js';
import adminOtpApp from './features/admin-otp/admin-otp-route.js'; // Import the new admin OTP routes
import adminPowerUpsApp from './features/admin-power-ups/admin-power-ups-route.js'; // Import the new admin power-ups routes
import { validateAdminAuth } from './features/admin-otp/admin-auth-middleware.js';
// Add other routes here
app.route('/api/fantasy-teams', fantasyTeamsApp);
app.route('/api/auth', authenticationApp);
app.route('/api/fantasy-leagues', fantasyLeaguesApp);
app.route('/api/power-ups', powerUpsApp);
app.route('/api/admin/otp', adminOtpApp); // Mount the new admin OTP routes
app.route('/api/admin/power-ups', adminPowerUpsApp); // Mount the new admin power-ups routes
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
