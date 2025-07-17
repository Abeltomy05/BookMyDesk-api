import admin from 'firebase-admin';
import * as path from 'path';
import { existsSync } from 'fs';
import { config } from '../config';

const serviceAccountPath = path.resolve(__dirname, '../../../', config.FIREBASE_SERVICE_ACCOUNT_PATH || '');

if (!existsSync(serviceAccountPath)) {
  throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
}

const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();

export { admin, messaging };