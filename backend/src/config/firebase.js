const admin = require('firebase-admin');
require('dotenv').config();

let firebaseApp;

const requiredEnvKeys = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_STORAGE_BUCKET',
];

try {
  const hasRequiredConfig = requiredEnvKeys.every((key) => Boolean(process.env[key]));

  if (hasRequiredConfig) {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    };

    firebaseApp = admin.apps.length
      ? admin.app()
      : admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });

    console.log('Firebase Admin SDK initialized');
  } else {
    const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);
    console.warn(
      `Firebase credentials not fully configured. Missing: ${missingKeys.join(', ')}`
    );
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}

module.exports = {
  bucket: firebaseApp ? admin.storage().bucket() : null,
  isFirebaseConfigured: Boolean(firebaseApp),
  admin,
};
