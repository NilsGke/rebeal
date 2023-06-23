import { User } from "next-auth";
import admin from "../config";

export default async function getFriends(uid: User["id"]): Promise<string[]> {
  const firestore = admin.firestore();

  return (
    await Promise.all([
      firestore
        .collection("friends")
        .where("a", "==", firestore.doc(`users/${uid}`))
        .where("pending", "==", false)
        .get()
        .then((s) => s.docs.map((f) => f.data().b.id)),
      firestore
        .collection("friends")
        .where("b", "==", firestore.doc(`users/${uid}`))
        .where("pending", "==", false)
        .get()
        .then((s) => s.docs.map((f) => f.data().a.id)),
    ])
  ).flat();
}
