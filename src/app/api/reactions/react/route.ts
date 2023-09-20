import { reactionConverter, stringIsReactionEmoji } from "@/app/types";
import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const session = await serverAuth();

  const body = await request.json();

  const reBealId = z.string().safeParse(body.reBealId),
    reactionImageUrl = z
      .string()
      .url()
      .startsWith(
        `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/users`
      )
      .safeParse(body.reactionImageUrl),
    reactionType = z.string().emoji().safeParse(body.reactionType);

  if (!reBealId.success)
    return new Response("rebeal id is undefined or invalid", {
      status: 400,
    });
  if (!reactionImageUrl.success)
    return new Response("reaction image url is undefined or invalid", {
      status: 400,
    });
  if (!reactionType.success || !stringIsReactionEmoji(reactionType.data))
    return new Response("reaction type is undefined or invalid", {
      status: 400,
    });

  const firestore = admin.firestore();

  return await firestore
    .collection(`rebeals/${reBealId.data}/reactions`)
    .withConverter(reactionConverter)
    .doc(session.user.id)
    .set({
      image: reactionImageUrl.data,
      type: reactionType.data,
      user: firestore.doc(`users/${session.user.id}`),
      id: session.user.id,
    })
    .then(() => new Response("ok"))
    .catch((error) => {
      console.error(error);
      new Response("error", {
        status: 500,
      });
    });
}
