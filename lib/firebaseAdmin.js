import * as admin from "firebase-admin";

// Parse the service account JSON from environment variable
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY );

// console.log("Service Account:", serviceAccount);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
