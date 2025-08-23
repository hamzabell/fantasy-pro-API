import { authenticator } from 'otplib';
import jwt from 'jsonwebtoken';
// Remove the direct import of 'User' type if it causes issues

// Ensure a strong secret is used in production, ideally from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

/**
 * Generates a new TOTP secret for an admin user setup.
 * This function is intended for initial setup and does not persist the secret.
 * The secret must be stored securely in the database by the calling script/function.
 * @param adminUserId The ID of the admin user (used for generating the URI)
 * @returns An object containing the secret and the otpauth URL
 */
export async function generateAdminTotpSecret(adminUserId: string): Promise<{ secret: string; otpauthUrl: string }> {
  const secret = authenticator.generateSecret();
  const userIdentifier = `admin-${adminUserId}`; // A unique identifier for the user in your system
  const issuer = 'FantasyPro'; // Your application's name
  const otpauthUrl = authenticator.keyuri(userIdentifier, issuer, secret);

  return { secret, otpauthUrl };
}

/**
 * Verifies a TOTP provided by an admin user against a stored secret.
 * @param storedSecret The TOTP secret stored for the user in the database.
 * @param token The TOTP token provided by the user.
 * @returns true if the token is valid, false otherwise.
 */
export function verifyAdminTotp(storedSecret: string, token: string): boolean {
  try {
    return authenticator.check(token, storedSecret);
  } catch (err) {
    console.error('Error verifying TOTP:', err);
    return false;
  }
}

/**
 * Generates a short-lived JWT for an admin user upon successful OTP verification.
 * @param adminUserId The ID of the admin user.
 * @returns A signed JWT token.
 */
export function generateAdminJwt(adminUserId: string): string {
  const payload = {
    id: adminUserId,
    role: 'admin', // Explicitly mark as admin
  };

  // Sign the token with a 10-minute expiration
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });
  return token;
}

/**
 * Verifies the admin JWT.
 * @param token The JWT token from the Authorization header.
 * @returns The decoded payload if valid, null otherwise.
 */
export function verifyAdminJwt(token: string): { id: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    // Ensure the role is 'admin'
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded;
  } catch (err) {
    console.error('Error verifying admin JWT:', err);
    return null;
  }
}
