import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import admin from "@/firebase/config";
import { getStorage } from "firebase-admin/storage";
import { Timestamp, getFirestore } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session === null)
    return NextResponse.json({ message: "you need to login" });
  if (session.user === undefined)
    return NextResponse.json({ message: "no user found for your session" });

  const body = await request.json();

  const environmentURL = z
    .string()
    .startsWith(
      `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/users`
    )
    .safeParse(body.environmentURL);
  const selfieURL = z
    .string()
    .startsWith(
      `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/users`
    )
    .safeParse(body.selfieURL);
  const postedAt = z
    .number()
    .min(1687541598947)
    .max(Date.now())
    .safeParse(body.postedAt);

  //#region validate
  if (!environmentURL.success)
    return NextResponse.json({
      message: "environment image url invalid",
    });
  if (!selfieURL.success)
    return NextResponse.json({
      message: "selfie image url invalid",
    });
  if (!postedAt.success)
    return NextResponse.json({
      message: "postedAt timestamp invalid",
    });

  //#endregion

  const firestore = getFirestore();
  const doc = firestore.collection("rebeals").doc();
  let documentId: string;
  try {
    doc.create({
      images: {
        environment: environmentURL.data,
        selfie: selfieURL.data,
      },
      postedAt: new Timestamp(Math.round(postedAt.data / 1000), 0),
      user: firestore.collection("users").doc(session.user.id),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "failed uploading rebeal",
      error,
    });
  }

  return NextResponse.json({ success: "documentId" });
}
