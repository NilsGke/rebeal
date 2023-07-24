import admin from "@/firebase/config";
import { User } from "next-auth";
import { z } from "zod";
import webpush from "web-push";

const schema = z.object({
  endpoint: z.string().url("endpoint url is invalid"),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type NotificationData = {
  title: string;
  content: string;
  url?: string;
};

export default async function sendNotification(
  content: NotificationData,
  to: User["id"]
) {
  const firestore = admin.firestore();
  const notificationDocsQuery = await firestore
    .collection("notification-subscriptions")
    .where("user", "==", firestore.doc(`users/${to}`))
    .get();

  const PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    PRIVATE_KEY = process.env.WEB_PUSH_PRIVATE_KEY;

  if (PUBLIC_KEY === undefined)
    throw new Error("public web push key is undefined");
  if (PRIVATE_KEY === undefined)
    throw new Error("private web push key is undefined");

  webpush.setVapidDetails("mailto:ekeogs@gmail.com", PUBLIC_KEY, PRIVATE_KEY);

  await Promise.all(
    notificationDocsQuery.docs.map(async (doc) => {
      const obj = schema.safeParse(JSON.parse(doc.data().data));
      if (!obj.success)
        throw new Error(
          "document invalid. Error: " + JSON.stringify(obj.error)
        );

      await webpush.sendNotification(obj.data, JSON.stringify(content));
    })
  ).catch((err) => console.warn(err));
}
