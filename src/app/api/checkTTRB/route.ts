import admin from "@/firebase/config";
import sendNotification from "@/helpers/sendNotification";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

const firestore = admin.firestore();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token !== process.env.CUSTOM_COMMUNICATION_TOKEN) {
    return new Response("missing or invalid token", {
      status: 401,
    });
  }

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const id = todayMidnight
    .toLocaleDateString("DE-de")
    .split(".")
    .reverse()
    .map((d) => (d.length == 1 ? "0" + d : d))
    .join("-")
    .trim();

  const todaysReBealTime = await firestore
    .collection("timeToReBeal")
    .doc(id)
    .get();

  if (!todaysReBealTime.exists)
    return new Response("rebeal doc for today does not exist", {
      status: 400,
    });

  const data = todaysReBealTime.data() as {
    time: Timestamp;
    announced: boolean;
    announcedAt?: Timestamp;
  };

  const milliseconds = data.time.seconds * 1000,
    currentMS = Date.now(),
    diff = currentMS - milliseconds;

  if (diff < 0) return new Response("not time yet");
  else if (diff > 120000) return new Response("TTRB is already over");

  if (data.announced)
    return new Response("It's TTRB but it was already announced");

  const announceProm = announce();

  console.log("⚠️ It's time to ReBeal!⚠️");

  await todaysReBealTime.ref.set(
    {
      announced: true,
      announcedAt: new Timestamp(Math.round(Date.now() / 1000), 0),
    },
    {
      merge: true,
    }
  );

  await announceProm;
  return new Response("It's time to ReBeal!");
}

async function announce() {
  const users = await firestore.collection("users").get();
  const notificationProms: Promise<void>[] = [];
  users.docs.forEach((userDocRef) => {
    const id = userDocRef.id;
    notificationProms.push(
      sendNotification(
        {
          title: "⚠️It's time to ReBeal!⚠️",
          content: "You got two minutes to take a photo, be quick!",
          url: "/app/upload",
        },
        id
      )
    );
  });

  await Promise.allSettled(notificationProms);
}
