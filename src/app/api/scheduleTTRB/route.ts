import admin from "@/firebase/config";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

/**
 * generate next TimeToReBeal
 */
export async function GET(request: Request) {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const id = todayMidnight
    .toLocaleDateString("DE-de")
    .split(".")
    .reverse()
    .map((d) => (d.length == 1 ? "0" + d : d))
    .join("-");

  const firestore = admin.firestore();

  const existing = await firestore.collection("timeToReBeal").doc(id).get();

  if (existing !== undefined && existing.exists)
    return new Response("already existing timeToReBeal for this day", {
      status: 409,
    });

  const newTime = new Date();

  const hours = Math.round(Math.random() * 14) + 8;
  const minutes = Math.round(Math.random() * 60);

  newTime.setHours(hours);
  newTime.setMinutes(minutes);

  await firestore
    .collection("timeToReBeal")
    .doc(id)
    .set({
      time: new Timestamp(Math.round(newTime.getTime() / 1000), 0),
      announced: false,
    });

  return new Response("ok", {
    status: 200,
    statusText: `requested: ${request.url}`,
  });
}
