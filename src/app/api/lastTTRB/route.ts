import { NextResponse } from "next/server";
import admin from "@/firebase/config";
import datesAreSameDay from "@/helpers/datesAreSameDay";
import { Timestamp } from "firebase-admin/firestore";
import getLastTTRB from "@/firebase/server/getLastTTRB";

/**
 * LTTRB -> LastTimeToReBeal
 */
export async function GET() {
  const { time } = await getLastTTRB();
  const milliseconds = time.getTime();

  return NextResponse.json({
    time: milliseconds,
    isToday: datesAreSameDay(milliseconds, new Date()),
  });
}
