import admin from 'firebase-admin';
import * as path from 'path';
import { existsSync } from 'fs';
import { config } from '../config';
import { CustomError } from '../../entities/utils/custom.error';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '../constants';

const serviceAccountPath = path.resolve(__dirname, '../../../', config.FIREBASE_SERVICE_ACCOUNT_PATH || '');

if (!existsSync(serviceAccountPath)) {
  throw new CustomError(`${ERROR_MESSAGES.FIREBASE_ERROR} at: ${serviceAccountPath}`,StatusCodes.INTERNAL_SERVER_ERROR);
}

const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();

export { admin, messaging };