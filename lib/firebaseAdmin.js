import * as admin from "firebase-admin";

// Parse the service account JSON from environment variable
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://geofenceat-default-rtdb.asia-southeast1.firebasedatabase.app/" // 🔴 Replace with your actual DB URL
  });
}

// Export Firestore and Realtime Database
export const db = admin.firestore();
export const rtdb = admin.database();
