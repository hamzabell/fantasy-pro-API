var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as E from 'fp-ts/lib/Either.js';
import { generateGoogleAuthUrl, loginWithGoogleCode } from './auth.service.js';
import prisma from '../../prisma.js';
import { createWalletRepository } from '../wallet/wallet.repository.js';
import { createWalletService } from '../wallet/wallet.service.js';
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
const app = new OpenAPIHono();
// Schemas
const GoogleLoginRequestSchema = z.object({
    token: z.string().describe('Google ID Token')
}).openapi('GoogleLoginRequest');
const AuthResponseSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string().optional().nullable(),
        image: z.string().optional().nullable(),
        walletAddress: z.string().optional().nullable()
    })
}).openapi('AuthResponse');
const ErrorResponseSchema = z.object({
    error: z.string()
}).openapi('ErrorResponse');
const UserResponseSchema = z.object({
    id: z.string().openapi({ example: '123' }),
    email: z.string().email().openapi({ example: 'user@example.com' }),
    name: z.string().optional().nullable().openapi({ example: 'Data Boy' }),
    image: z.string().optional().nullable().openapi({ example: 'https://lh3.googleusercontent.com/...' }),
    walletAddress: z.string().optional().nullable().openapi({ example: '0x123...' }),
}).openapi('UserResponse');
const GoogleAuthUrlResponseSchema = z.object({
    url: z.string()
}).openapi('GoogleAuthUrlResponse');
// Helper to convert AppError to HTTP status
const toHttpStatus = (error) => {
    switch (error._tag) {
        case 'AuthenticationError':
            return 401;
        case 'NotFoundError':
            return 404;
        case 'ValidationError':
            return 400;
        case 'DatabaseError':
            return 500;
        default:
            return 500;
    }
};
const getErrorMessage = (error) => {
    if ('message' in error)
        return error.message;
    if (error._tag === 'NotFoundError')
        return `${error.resource} not found`;
    if (error._tag === 'DatabaseError')
        return 'Database error';
    return 'Unknown error';
};
// Routes
// 1. GET /auth/google/url - Get Auth URL
const getGoogleAuthUrlRoute = createRoute({
    method: 'get',
    path: '/google/url',
    summary: 'Get Google Auth URL for redirect',
    responses: {
        200: {
            content: { 'application/json': { schema: GoogleAuthUrlResponseSchema } },
            description: 'Google Auth URL'
        }
    }
});
app.openapi(getGoogleAuthUrlRoute, (c) => {
    const url = generateGoogleAuthUrl();
    return c.json({ url });
});
// 2. GET /auth/google/callback - Handle Redirect Code
const googleCallbackRoute = createRoute({
    method: 'get',
    path: '/google/callback',
    summary: 'Google Auth Callback',
    request: {
        query: z.object({
            code: z.string(),
            state: z.string().optional()
        })
    },
    responses: {
        302: {
            description: 'Redirect to Frontend'
        },
        400: {
            content: { 'application/json': { schema: ErrorResponseSchema } },
            description: 'Authentication Failed'
        }
    }
});
app.openapi(googleCallbackRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = c.req.valid('query');
    const result = yield loginWithGoogleCode(code)();
    if (E.isRight(result)) {
        const { token } = result.right;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8100';
        return c.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    }
    else {
        const error = result.left;
        const msg = getErrorMessage(error);
        return c.json({ error: msg }, 400); // Or redirect to frontend error page
    }
}));
// 3. GET /user - Get Authenticated User
const getUserRoute = createRoute({
    method: 'get',
    path: '/user',
    summary: 'Get authenticated user details',
    security: [{ BearerAuth: [] }],
    responses: {
        200: {
            description: 'User details',
            content: { 'application/json': { schema: UserResponseSchema } }
        },
        401: {
            description: 'Unauthorized',
            content: { 'application/json': { schema: ErrorResponseSchema } }
        }
    }
});
app.openapi(getUserRoute, (c) => __awaiter(void 0, void 0, void 0, function* () {
    const user = c.get('user'); // Cast to any to access custom properties added by passport or schema
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    // Initialize Wallet Service (TODO: Dependency Injection)
    const blockchainService = createBlockchainService(process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com', process.env.USDC_ADDRESS || '0x0', process.env.LEAGUE_ESCROW_ADDRESS || '0x0');
    const walletRepository = createWalletRepository(prisma);
    const walletService = createWalletService(walletRepository, blockchainService);
    const walletResult = yield walletService.getUserWallet(user.id)();
    let walletAddress = user.walletAddress;
    // If not already on user object, fetch it
    if (!walletAddress && E.isRight(walletResult)) {
        walletAddress = walletResult.right.address;
    }
    return c.json({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        walletAddress
    }, 200);
}));
export default app;
