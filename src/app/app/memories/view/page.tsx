import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { rebealConverter } from "@/app/types";
import ClientPage from "./ClientPage";

export default async function MemoryDate() {
  const session = await serverAuth();

  const firestore = admin.firestore();
  const userDoc = firestore.doc(`users/${session.user.id}`);
  const reBeals = await firestore
    .collection("rebeals")
    .where("user", "==", userDoc)
    .withConverter(rebealConverter)
    .get()
    .then((snapshot) =>
      snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            ...data,
            user: undefined,
            postedAt: data.postedAt.toDate(),
          };
        })
        .sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime())
    );

  return (
    <>
      <ClientPage reBeals={reBeals} />
    </>
  );
}
