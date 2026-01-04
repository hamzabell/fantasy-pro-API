import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppEnvironment } from '../../fp/infrastructure/Environment.js';
import { verificationEvents } from '../league-integration/TransactionVerificationService.js';
import { EventEmitter } from 'events';

const sseApp = new OpenAPIHono<{ Variables: { env: AppEnvironment } }>();

const sseRoute = createRoute({
    method: 'get',
    path: '/stream',
    summary: 'Subscribe to Server-Sent Events',
    description: 'Stream real-time updates for league status and other notifications.',
    responses: {
        200: {
            description: 'SSE Stream',
            content: {
                'text/event-stream': {
                    schema: z.string()
                }
            }
        }
    },
    tags: ['Notifications']
});

sseApp.openapi(sseRoute, async (c) => {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const sendEvent = (event: string, data: any) => {
                const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            // Send initial connection message
            sendEvent('connected', { message: 'SSE Stream Connected' });

            // Listener for League Status Updates
            const onLeagueUpdate = (data: { leagueId: string, status: string, reason?: string }) => {
                sendEvent('league_status_update', data);
            };

            // Subscribe
            verificationEvents.on('league_status_update', onLeagueUpdate);

            // Ping to keep connection alive every 30s
            const interval = setInterval(() => {
                sendEvent('ping', { timestamp: Date.now() });
            }, 30000);

            // Cleanup on close is harder to detect in Hono/Node streams strictly without socket access,
            // but usually controller close handles downstream stuff. 
            // However, we need to remove listener when the client disconnects.
            // In standard Fetch API streams, 'cancel' is called.
            // Hono's `stream` helper might be better but here we use raw ReadableStream.
            
            // To handle disconnect cleanup properly in Node/Hono context:
            // This basic implementation might leak listeners if not careful.
            // But strict cleaning is complex without `c.req.raw.signal`.
            
            c.req.raw.signal.addEventListener('abort', () => {
                verificationEvents.off('league_status_update', onLeagueUpdate);
                clearInterval(interval);
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });
});

export default sseApp;
