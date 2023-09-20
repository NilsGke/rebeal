import { SavedReactionUserRecord, stringIsReactionEmoji } from "@/app/types";
import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const [session, body] = await Promise.all([serverAuth(), request.json()]);

  const reactionType = body.reactionType;
  if (
    !reactionType ||
    !stringIsReactionEmoji(reactionType) ||
    reactionType === "⚡"
  )
    return new Response("reaction type is undefined or invalid", {
      status: 400,
    });

  const imageUrl = z
    .string()
    .startsWith(
      `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/users`
    )
    .safeParse(body.imageUrl);

  if (!imageUrl.success)
    return new Response("image url is invalid or undefined", { status: 400 });

  const firestore = admin.firestore();

  const newReaction = {} as SavedReactionUserRecord;
  newReaction[reactionType] = imageUrl.data;

  await firestore.doc(`savedReactions/${session.user.id}`).set(
    {
      ...newReaction,
    },
    {
      merge: true,
    }
  );

  return new NextResponse();
}
