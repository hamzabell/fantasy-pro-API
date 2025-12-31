import 'dotenv/config';
import crypto from 'crypto';
const apiKey = crypto.randomBytes(32).toString('hex');
console.log('\nGenerated Payment Webhook API Key:\n');
console.log(apiKey);
console.log('\nStep 1: Add this to your .env file as PAYMENT_WEBHOOK_API_KEY=' + apiKey);
console.log('Step 2: Use this key in the x-api-key header when calling the webhook.\n');
