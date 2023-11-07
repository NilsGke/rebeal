import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { settingsConverter } from "@/app/types";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session === null)
    return NextResponse.json({ message: "you need to login" });
  session.user;

  const body = await request.json();

  const value = z.boolean().safeParse(body.value);
  if (!value.success)
    return new Response("invalid request, value is missing or wrong type", {
      status: 400,
    });

  const firestore = getFirestore();
  await firestore
    .doc(`settings/${session.user.id}`)
    .withConverter(settingsConverter)
    .set(
      {
        saveMemories: value.data,
      },
      {
        merge: true,
      }
    );

  return new Response("ok");
}
