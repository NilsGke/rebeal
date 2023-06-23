import { NextRequest, NextResponse } from "next/server";
import serverAuth from "@/helpers/serverComponentAuth";
import getFriends from "@/firebase/server/getFriends";
import admin from "@/firebase/config";

export async function GET() {
  const session = await serverAuth();
  const friendIds = await getFriends(session.user.id);

  const firestore = admin.firestore();
  const friends = await firestore
    .getAll(...friendIds.map((id) => firestore.collection("users").doc(id)))
    .then((docs) => docs.map((doc) => ({ ...doc.data(), id: doc.id })));

  return NextResponse.json({
    friends,
  });
}
