import { NextResponse } from "next/server";
import admin from "@/firebase/config";
import datesAreSameDay from "@/helpers/datesAreSameDay";
import { Timestamp } from "firebase-admin/firestore";

/**
 * LTTRB -> LastTimeToReBeal
 */
export async function GET() {
  const query = await admin
    .firestore()
    .collection("timeToReBeal")
    .where("time", "<=", new Timestamp(Math.round(Date.now() / 1000), 0))
    .orderBy("time", "desc")
    .limit(1)
    .get();

  const lastTTRB = query.docs.at(0);
  if (lastTTRB === undefined || !lastTTRB.exists)
    return new Response("Internal Server Error", { status: 500 });

  console.log(lastTTRB.data().time);

  const milliseconds = lastTTRB.data().time._seconds * 1000;

  return NextResponse.json({
    time: milliseconds,
    isToday: datesAreSameDay(milliseconds, new Date()),
  });
}
