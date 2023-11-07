import admin from "firebase-admin";

const adminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
};

export const bucketId = "rebeal-1eac1.appspot.com";

try {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: bucketId,
    projectId: "rebeal-1eac1",
  });
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test((error as any).message)) {
    console.error("Firebase admin initialization error", (error as any).stack);
  }
}

export default admin;
