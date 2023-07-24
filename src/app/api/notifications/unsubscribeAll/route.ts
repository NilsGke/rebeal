import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";

export async function DELETE() {
  const session = await serverAuth();
  const firestore = admin.firestore();
  await Promise.all([
    ...(await firestore
      .collection("notification-subscriptions")
      .where("user", "==", firestore.doc(`users/${session.user.id}`))
      .get()
      .then((q) => q.docs.map((doc) => doc.ref.delete()))),
  ]);
  return new Response("ok");
}
