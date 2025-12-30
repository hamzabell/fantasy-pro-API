import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { generateGoogleAuthUrl, loginWithGoogleCode } from './auth.service.js';
import { retrieveUserStats } from '../users/users-model.js';
import prisma from '../../prisma.js';
import { createWalletRepository } from '../wallet/wallet.repository.js';
import { createWalletService } from '../wallet/wallet.service.js';
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import type { User } from '../../generated/prisma/index.js';

const app = new OpenAPIHono<{ Variables: { user: User | null } }>();

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
  matches: z.number().optional().openapi({ example: 5 }),
  points: z.number().optional().openapi({ example: 150 }),
  trophies: z.number().optional().openapi({ example: 2 }),
  referralId: z.string().openapi({ example: '123' }),
  referralLink: z.string().openapi({ example: 'http://localhost:8100/signup?ref=123' }),
  coins: z.number().openapi({ example: 50 }),
}).openapi('UserResponse');

const GoogleAuthUrlResponseSchema = z.object({
  url: z.string()
}).openapi('GoogleAuthUrlResponse');

const getErrorMessage = (error: any): string => {
  if (error && typeof error === 'object' && 'message' in error) return error.message;
  return 'Unknown error';
};

// Routes

// 1. GET /auth/google/url - Get Auth URL
const getGoogleAuthUrlRoute = createRoute({
  method: 'get',
  path: '/google/url',
  summary: 'Get Google Auth URL for redirect',
  request: {
    query: z.object({
      referralCode: z.string().optional()
    })
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GoogleAuthUrlResponseSchema } },
      description: 'Google Auth URL'
    }
  }
});

app.openapi(getGoogleAuthUrlRoute, (c) => {
  const { referralCode } = c.req.valid('query');
  const url = generateGoogleAuthUrl(referralCode);
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

app.openapi(googleCallbackRoute, async (c) => {
    const { code, state } = c.req.valid('query');
    console.log('[Auth] Google Callback received. Code:', code ? 'present' : 'missing', 'State:', state);
    let referralCode: string | undefined;

    if (state) {
        try {
            const parsedState = JSON.parse(state);
            referralCode = parsedState.referralCode;
        } catch (e) {
            // Ignore state parsing error
        }
    }

    try {
        const result = await loginWithGoogleCode(code, referralCode);
        const { token } = result;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8100';
        return c.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (e: any) {
        const msg = getErrorMessage(e);
        return c.json({ error: msg }, 400); 
    }
});


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

app.openapi(getUserRoute, async (c) => {
  const user = c.get('user') as any; // Cast to any to access custom properties added by passport or schema
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  // Initialize Wallet Service (TODO: Dependency Injection)
  const blockchainService = createBlockchainService(
      process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC',
      process.env.TON_API_KEY || '',
      process.env.LEAGUE_ESCROW_ADDRESS || '0x0',
      process.env.SERVER_MNEMONIC || ''
  );
  const walletRepository = createWalletRepository(prisma);
  const walletService = createWalletService(walletRepository, blockchainService);
  
  let walletAddress: string | undefined | null = user.walletAddress;
  
  // If not already on user object, fetch it
  if (!walletAddress) {
      try {
          const wallet = await walletService.getUserWallet(user.id);
          walletAddress = wallet.address;
      } catch (e) {
          // Ignore wallet fetch error probably
      }
  }

  let matches = 0;
  let points = 0;
  let trophies = 0;

  try {
      const stats = await retrieveUserStats(user.id);
      matches = stats.matches;
      points = stats.points;
      trophies = stats.trophies;
  } catch(e) {
      // Ignore stats error
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8100';

  return c.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      image: user.image, 
      walletAddress,
      matches,
      points,
      trophies,
      referralId: user.id,
      referralLink: `${frontendUrl}/signup?ref=${user.id}`,
      coins: user.coins || 0
  }, 200);
});

export default app;
