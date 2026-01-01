import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as E from 'fp-ts/lib/Either.js';
type Either<E, A> = E.Either<E, A>;
import { generateGoogleAuthUrl, loginWithGoogleCode } from './auth.service.js';
import { retrieveUserStats } from '../users/users-model.js';
import prisma from '../../prisma.js';
import { createWalletRepository } from '../wallet/wallet.repository.js';
import { createWalletService } from '../wallet/wallet.service.js';
import { createSolanaBlockchainService } from '../../infrastructure/blockchain/solana-blockchain.service.js';
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

// Helper to convert AppError to HTTP status
const toHttpStatus = (error: AppError): number => {
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

const getErrorMessage = (error: AppError): string => {
  if ('message' in error) return error.message;
  if (error._tag === 'NotFoundError') return `${error.resource} not found`;
  if (error._tag === 'DatabaseError') return 'Database error';
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
      referralCode: z.string().optional(),
      platform: z.enum(['web', 'mobile']).optional().default('web'),
      redirectUrl: z.string().optional()
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
  const { referralCode, platform, redirectUrl } = c.req.valid('query');
  const url = generateGoogleAuthUrl(referralCode, platform, redirectUrl);
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
    let platform: 'web' | 'mobile' = 'web';
    let redirectUrl: string | undefined;

    if (state) {
        try {
            const parsedState = JSON.parse(state);
            referralCode = parsedState.referralCode;
            if (parsedState.platform) platform = parsedState.platform;
            if (parsedState.redirectUrl) redirectUrl = parsedState.redirectUrl;
        } catch (e) {
            // Ignore state parsing error
        }
    }

    const result = await loginWithGoogleCode(code, referralCode, redirectUrl)();

    if (E.isRight(result)) {
        const { token } = result.right;
        
        if (platform === 'mobile') {
            return c.redirect(`fantasypro://auth/callback?token=${token}`);
        }
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8100';
        return c.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } else {
        const error = result.left;
        const msg = getErrorMessage(error);
        return c.json({ error: msg }, 400); // Or redirect to frontend error page
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

  // Return user info from DB
  // TODO: WalletService needs refactor to accept SolanaService or we just use simple balance check here?
  // For 'getUserWallet' in legacy, it returned address and balance.
  // We can just return what's in DB for address. Balance might need a quick RPC call if we want it live.
  
  let walletAddress: string | undefined | null = user.walletAddress;
  
  // If we really need balance, we should implement it in SolanaService or here.
  // Legacy logic:
  // const walletResult = await walletService.getUserWallet(user.id)();
  // if (E.isRight(walletResult)) { walletAddress = walletResult.right.address; }
  
  // New Logic: Just use DB address for now or simple Solana check if address exists.
  // If user has no address in DB, they haven't connected.


  const statsResult = await retrieveUserStats(user.id)();
  let matches = 0;
  let points = 0;
  let trophies = 0;

  if (E.isRight(statsResult)) {
      matches = statsResult.right.matches;
      points = statsResult.right.points;
      trophies = statsResult.right.trophies;
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
