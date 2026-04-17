const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

let db;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
  const resolvedPath = path.resolve(serviceAccountPath);
  
  if (fs.existsSync(resolvedPath)) {
    const serviceAccount = require(resolvedPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Firebase connected successfully.");
  } else {
    console.warn(`[WARN] Firebase service account key not found at ${resolvedPath}.`);
    console.warn("Please add your serviceAccountKey.json to the backend directory.");
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error.message);
}

module.exports = { admin, db };
