import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import admin from "firebase-admin";
import { z } from "zod";

export async function POST(request: NextRequest) {
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
  await firestore.collection("friends").add({
    a: firestore.doc(`users/${session.user.id}`),
    b: firestore.doc(`users/${id}`),
    pending: true,
  });
  return NextResponse.json({ success: true });
}

export async function GET() {}
