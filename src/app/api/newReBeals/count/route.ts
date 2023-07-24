import { NextResponse } from "next/server";
import serverAuth from "@/helpers/serverComponentAuth";
import getFriends from "@/firebase/server/getFriends";
import admin from "@/firebase/config";

export async function GET() {
  const session = await serverAuth();
  const friendIds = await getFriends(session.user.id);

  if (friendIds.length === 0) return NextResponse.json({ count: 0 });

  const firestore = admin.firestore();

  const snapshot = await firestore
    .collection("rebeals")
    .where(
      "user",
      "in",
      friendIds.map((id) => firestore.doc(`users/${id}`))
    )
    .count()
    .get();

  return NextResponse.json({
    count: snapshot.data().count,
  });
}
