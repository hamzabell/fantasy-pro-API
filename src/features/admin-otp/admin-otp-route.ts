import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { verifyAdminTotp, generateAdminJwt } from './admin-otp-model.js';
import prisma from '../../prisma.js'; // Import Prisma client

const adminOtpApp = new OpenAPIHono();

// Schema for verifying a TOTP
const VerifyTotpSchema = z.object({
  adminUserId: z.string().min(1, "Admin User ID is required"),
  token: z.string().min(6, "Token must be at least 6 characters").max(6, "Token must be 6 characters"),
});

// Schema for the response containing the JWT
const JwtResponseSchema = z.object({
  token: z.string(),
});

// Route to verify TOTP and generate JWT (This endpoint is NOT protected)
const verifyTotpAndGenerateJwtRoute = createRoute({
  method: 'post',
  path: '/verify',
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyTotpSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: JwtResponseSchema,
        },
      },
      description: 'TOTP verified successfully. JWT returned.',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Bad Request or Invalid TOTP',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'User not found or TOTP secret not set up',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Internal Server Error',
    },
  },
  tags: ['Admin OTP'],
});

adminOtpApp.openapi(verifyTotpAndGenerateJwtRoute, async (c) => {
  const { adminUserId, token } = c.req.valid('json');

  try {
    // 1. Retrieve the admin user to confirm existence
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
    });

    if (!adminUser) {
      return c.json({ message: 'Admin user not found' }, 404);
    }

    // 2. Retrieve the stored TOTP secret for this admin user from the database
    const storedSecretRecord = await prisma.adminOtpSecret.findUnique({
      where: { userId: adminUserId },
      select: { secret: true }
    });

    if (!storedSecretRecord || !storedSecretRecord.secret) {
      return c.json({ message: 'TOTP secret not found or not set up for this user' }, 404);
    }

    const storedSecret = storedSecretRecord.secret;

    // 3. Verify the provided TOTP token against the stored secret
    const isValid = verifyAdminTotp(storedSecret, token);
    if (!isValid) {
      return c.json({ message: 'Invalid or expired TOTP token' }, 400);
    }

    // 4. Generate a short-lived JWT for the admin
    const jwtToken = generateAdminJwt(adminUserId);

    return c.json({ token: jwtToken }, 200);

  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return c.json({ message: 'Failed to verify TOTP' }, 500);
  }
});

export default adminOtpApp;
