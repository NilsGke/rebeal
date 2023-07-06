import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  endpoint: z.string().url("endpoint url is invalid"),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export async function POST(request: Request) {
  const session = await serverAuth();
  const firestore = admin.firestore();
  const body = await request.json();

  const data = schema.safeParse(body);

  if (!data.success)
    return new Response("error", {
      status: 400,
      statusText: JSON.stringify(data.error),
    });

  const doc = await firestore.collection("notification-subscriptions").add({
    user: firestore.doc(`users/${session.user.id}`),
    data: JSON.stringify(data.data),
  });

  return NextResponse.json({
    doc,
  });
}
