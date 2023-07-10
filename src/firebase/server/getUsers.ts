import admin from "../config";
import { userConverter } from "@/app/types";

const firestore = admin.firestore();

export default async function getUsers(ids: string[]) {
  return (
    await firestore
      .collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", ids)
      .withConverter(userConverter)
      .get()
  ).docs.map((d) => d.data());
}
