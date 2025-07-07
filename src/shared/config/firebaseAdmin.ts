import admin from 'firebase-admin';
import * as path from 'path';

const serviceAccountPath = path.resolve(__dirname, "../../", process.env.FIREBASE_SERVICE_ACCOUNT || "");
const serviceAccount = require(path.resolve(serviceAccountPath));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();

export { admin, messaging };