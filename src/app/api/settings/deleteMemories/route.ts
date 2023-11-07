import { rebealConverter } from "@/app/types";
import admin, { bucketId } from "@/firebase/config";
import deleteReBeal from "@/firebase/server/deleteReBeal";
import getLastTTRB from "@/firebase/server/getLastTTRB";
import serverAuth from "@/helpers/serverComponentAuth";
import { Timestamp } from "firebase-admin/firestore";

const bucket = admin.storage().bucket(bucketId);

export async function DELETE() {
  const session = await serverAuth();

  const firestore = admin.firestore();

  const userDoc = firestore.doc(`users/${session.user.id}`);

  const lastTTRB = await getLastTTRB();

  const reBealsSnapshot = await firestore
    .collection("rebeals")
    .where("user", "==", userDoc)
    .where("postedAt", "<", Timestamp.fromDate(lastTTRB.time))
    .withConverter(rebealConverter)
    .get();

  const reBeals = reBealsSnapshot.docs.map((doc) => doc.data());

  // const proms = reBeals.map(
  //   async (reBeal) =>
  //     await Promise.all([
  //       deleteImageFromBucket(reBeal.images.environment),
  //       deleteImageFromBucket(reBeal.images.selfie),
  //     ])
  // );

  // await Promise.all(proms).catch(console.error);

  // const reBealsProms = reBealsSnapshot.docs.map((doc) => doc.ref.delete());
  // await Promise.all(reBealsProms).catch(console.error);

  await Promise.all(reBeals.map(deleteReBeal));

  return new Response("ok");
}

async function deleteImageFromBucket(imageURL: string) {
  const encodedImagePath = new URL(imageURL).pathname
    .replace(bucketId, "")
    .split("/")
    .at(-1);
  if (encodedImagePath === undefined) return new Promise<void>((r) => r());
  const imagePath = decodeURIComponent(encodedImagePath);
  return await bucket.file(imagePath).delete();
}
