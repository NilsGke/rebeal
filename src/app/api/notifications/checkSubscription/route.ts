import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const [session, body] = await Promise.all([serverAuth(), request.json()]);

  const endpoint = z.string().url().safeParse(body.endpoint);
  if (!endpoint.success)
    return new Response("endpoint is undefined or invalid", {
      status: 400,
    });

  const firestore = admin.firestore();

  const snapshot = await firestore
    .collection("notification-subscriptions")
    .where("user", "==", firestore.collection("users").doc(session.user.id))
    .where("endpoint", "==", endpoint.data)
    .get();

  if (snapshot.empty)
    return NextResponse.json({
      subscriptionOnServer: false,
    });

  const doc = snapshot.docs[0];

  if (doc?.exists)
    return NextResponse.json({
      subscriptionOnServer: true,
    });
}
