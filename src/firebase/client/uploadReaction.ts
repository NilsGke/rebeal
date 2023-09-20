import {
  UploadResult,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import firebase_app from "../client";
import { reactionEmojis, stringIsReactionEmoji } from "@/app/types";

export default async function uploadReactionImage(
  image: File,
  userId: string,
  reactionEmoji: (typeof reactionEmojis)[number]
) {
  const storage = getStorage(firebase_app);

  if (!stringIsReactionEmoji(reactionEmoji as unknown as string))
    throw new Error(
      "reaction emoji passed to `uploadReaction` function is invalid"
    );

  const liveReactionExtra = reactionEmoji === "⚡" ? `_${Date.now()}` : "";

  const imageRef = ref(
    storage,
    `users/${userId}/savedReactions/${reactionEmoji}${liveReactionExtra}_selfie.webp`
  );

  const imageUrl = await uploadBytes(imageRef, image).then(
    (snapshot: UploadResult) => getDownloadURL(snapshot.ref)
  );

  return imageUrl;
}
