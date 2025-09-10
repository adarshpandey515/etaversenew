import * as admin from "firebase-admin";
import serviceAccount from "@/lib/servicekey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
