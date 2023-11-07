import { ReBeal } from "@/app/types";
import admin, { bucketId } from "../config";

const bucket = admin.storage().bucket(bucketId);

const firestore = admin.firestore();

export default async function deleteReBeal(reBeal: ReBeal) {
  await Promise.allSettled([
    deleteImageFromBucket(reBeal.images.environment),
    deleteImageFromBucket(reBeal.images.selfie),
    deleteComments(reBeal.id),
    deleteReactions(reBeal.id),
  ]).catch(console.error);
  return firestore.doc(`rebeals/${reBeal.id}`).delete();
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

async function deleteComments(reBealId: ReBeal["id"]) {
  return Promise.all([
    ...(
      await firestore.collection(`rebeals/${reBealId}/comments`).listDocuments()
    ).map(async (doc) => await doc.delete()),
  ]).catch(console.error);
}
async function deleteReactions(reBealId: ReBeal["id"]) {
  return Promise.all([
    ...(
      await firestore
        .collection(`rebeals/${reBealId}/reactions`)
        .listDocuments()
    ).map(async (doc) => await doc.delete()),
  ]).catch(console.error);
}
