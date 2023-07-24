import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const session = await serverAuth();

  const body = await request.json();

  const endpoint = z.string().url().safeParse(body.endpoint);

  if (!endpoint.success)
    return new Response("no/incorrect endpoint", {
      status: 400,
    });

  const firestore = admin.firestore();

  const docList = await firestore
    .collection("notification-subscriptions")
    .where("user", "==", firestore.doc(`users/${session.user.id}`))
    .where("endpoint", "==", endpoint.data)
    .get();

  const doc = docList.docs.at(0);

  if (docList.empty || doc === undefined)
    return new Response("no subscription doc found for the provided endpoint", {
      status: 400,
    });

  await doc.ref.delete();

  return new Response("ok");
}
