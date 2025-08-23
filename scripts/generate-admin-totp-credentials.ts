import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { generateAdminTotpSecret } from '../src/features/admin-otp/admin-otp-model.js'; // Adjust path if needed
import prisma from '../src/prisma.js'; // Import Prisma client

/**
 * Script to create an admin user and generate TOTP credentials for Google Authenticator.
 * This script should be run on the server by an administrator to set up an initial admin account with 2FA.
 * 
 * Usage: 
 * 1. Run this script. It will generate a new admin user ID and TOTP credentials.
 *    Example: npx tsx scripts/generate-admin-totp-credentials.ts
 * 2. The script will print the Admin User ID, the secret, and a QR code data URL.
 * 3. Scan the QR code with the Google Authenticator app or enter the secret manually.
 * 4. The script will attempt to store the secret in the database.
 * 
 * Note: This is a basic example. In a production environment, you should have a more robust
 * process for creating admin accounts, including setting a secure password and verifying identity.
 */

async function main() {
  try {
    console.log('Creating a new admin user and generating TOTP credentials...');

    // 1. Generate a new Admin User ID
    const newAdminUserId = uuidv4();
    console.log(`Generated Admin User ID: ${newAdminUserId}`);

    // 2. Create the admin user in the database
    // You would need to define the User model in Prisma and adjust this accordingly.
    // This step is necessary because of the foreign key constraint.
    // For this example, we'll create a minimal user entry.
    // A secure password setup process would be needed for actual login (if applicable).
    const newAdminUser = await prisma.user.create({
      data: {
        id: newAdminUserId,
        email: `admin-${newAdminUserId}@fantasypro.com`, // Placeholder email
        // Add other necessary user fields if required by your schema
        // role: 'ADMIN', // Or however you denote admin roles in your User model
      },
    });
    console.log(`Created new admin user in database with ID: ${newAdminUser.id}`);

    // 3. Generate the TOTP secret and QR code URL
    const { secret, otpauthUrl } = await generateAdminTotpSecret(newAdminUserId);

    // 4. Generate a QR code as a Data URL (base64 encoded image)
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    console.log('\n--- Admin User & TOTP Credentials ---');
    console.log(`Admin User ID: ${newAdminUserId}`);
    console.log(`Secret (to be stored SECURELY in your database): ${secret}`);
    console.log(`Issuer: FantasyPro`);
    console.log(`User Identifier: admin-${newAdminUserId}`);
    console.log('-------------------------------------\n');

    console.log('Scan the QR code below with your Google Authenticator app:');
    console.log(qrCodeDataUrl); // This can be pasted into a browser to view the QR code
    console.log('\nOr, manually enter the secret into your authenticator app.');

    // 5. Store the secret in the database
    // Assuming you have a Prisma model like `AdminOtpSecret` to store the secret
    // linked to the userId. Adjust the model name as needed.
    // Make sure the model exists in your Prisma schema (prisma/schema.prisma).
    try {
      await prisma.adminOtpSecret.create({
        data: {
          userId: newAdminUserId,
          secret: secret, // In production, consider encrypting this secret before storing.
          issuer: 'FantasyPro',
        },
      });
      console.log('\n--- Success ---');
      console.log('TOTP secret successfully stored in the database.');
      console.log('You can now use the Google Authenticator app to generate codes for this user.');
      console.log('Use the Admin User ID and a generated TOTP code to obtain a JWT at the /api/admin/otp/verify endpoint.');
      console.log('--------------');
    } catch (dbError) {
       console.error('\n--- Database Error ---');
       console.error('Failed to store TOTP secret in the database:', dbError);
       console.error('You will need to manually store the secret in your `AdminOtpSecret` table.');
       console.error('----------------------');
    }

  } catch (error) {
    console.error('Error generating admin credentials:', error);
    process.exit(1);
  }
}

main();