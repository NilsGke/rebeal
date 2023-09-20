import {
  Reaction,
  reactionConverter,
  stringIsReactionEmoji,
} from "@/app/types";
import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const session = await serverAuth();

  const body = await request.json();

  const reBealId = z.string().safeParse(body.reBealId),
    reactionId = z.string().safeParse(body.reactionId),
    reactionType = z.string().emoji().safeParse(body.reactionType);

  console.log({
    typeSuccess: reactionType.success,
    data: reactionType.success ? reactionType.data : reactionType.error,
  });

  if (!reBealId.success)
    return new Response("rebeal id is undefined or invalid", {
      status: 400,
    });
  if (
    !reactionId.success &&
    (!reactionType.success || !stringIsReactionEmoji(reactionType.data))
  )
    return new Response(
      "reaction id is undefined or invalid AND reaction type is undefined or invalid",
      {
        status: 400,
      }
    );

  const firestore = admin.firestore();

  let reactionDoc: admin.firestore.DocumentSnapshot<Reaction> | undefined;

  if (reactionId.success)
    reactionDoc = await firestore
      .doc(`rebeals/${reBealId.data}/reactions/${reactionId.data}`)
      .withConverter(reactionConverter)
      .get();
  else if (reactionType.success)
    reactionDoc = await firestore
      .collection(`rebeals/${reBealId.data}/reactions`)
      .where("type", "==", reactionType.data)
      .limit(1)
      .withConverter(reactionConverter)
      .get()
      .then((snap) => snap.docs.at(0));

  if (reactionDoc === undefined || !reactionDoc.exists)
    return new Response("this reaction does not exist", {
      status: 404,
    });
  if (reactionDoc.data()?.user.id !== session.user.id)
    return new Response("forbidden, this reaction is not yours", {
      status: 403,
    });

  return await reactionDoc.ref
    .delete()
    .then(() => new Response("ok"))
    .catch((error) => {
      console.error(error);
      new Response("error", {
        status: 500,
      });
    });
}
