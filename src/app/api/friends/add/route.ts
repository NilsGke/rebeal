import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import admin from "firebase-admin";
import { z } from "zod";
import sendNotification from "@/helpers/sendNotification";

export async function POST(request: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (session === null)
    return NextResponse.json({
      message: "no session found, please log in",
    });

  const body = await request.json();
  const _id = z.string().safeParse(body.id);
  if (!_id.success)
    return NextResponse.json({ message: "body does not contain id" });
  const id = _id.data;

  // test for any characters other that numbers and letters (-> filter ids with slash...)
  if (/[^A-Za-z0-9]+/.test(id))
    return NextResponse.json({ message: "id is invalid" });

  const firestore = admin.firestore();

  const existingDoc = (
    await Promise.all([
      firestore
        .collection("friends")
        .where("a", "==", firestore.doc(`users/${session.user.id}`))
        .where("b", "==", firestore.doc(`users/${id}`))
        .get()
        .then((r) => r.docs),
      firestore
        .collection("friends")
        .where("b", "==", firestore.doc(`users/${session.user.id}`))
        .where("a", "==", firestore.doc(`users/${id}`))
        .get()
        .then((r) => r.docs),
    ])
  )
    .flat()
    .at(0);

  if (existingDoc?.exists) {
    if (existingDoc.data().pending === false)
      return new Response("already friends", {
        status: 400,
      });
    else if (existingDoc.data().a === firestore.doc(`users/${session.user.id}`))
      return new Response("already existing request", {
        status: 400,
      });
    else return new Response("existing incoming request", { status: 400 });
  }

  await firestore.collection("friends").add({
    a: firestore.doc(`users/${session.user.id}`),
    b: firestore.doc(`users/${id}`),
    pending: true,
  });

  sendNotification(
    {
      title: `new friend request from ${session.user.name}`,
      content: `${session.user.name} sent you a friend request`,
      url: `/app/users/${session.user.id}`,
    },
    id
  );

  return NextResponse.json({ success: true });
}

export async function GET() {}
