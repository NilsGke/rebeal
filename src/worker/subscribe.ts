import admin from "@/firebase/config";
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { User } from "next-auth";

export default async function subscribeUserToPush(
  registration: ServiceWorkerRegistration
) {
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;
  console.log(PUBLIC_KEY);

  if (PUBLIC_KEY === undefined)
    throw new Error(
      "public web-push key is undefined (process.env.WEB_PUSH_PUBLIC_KEY)"
    );

  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
  };

  const pushSubscription = await registration.pushManager.subscribe(
    subscribeOptions
  );

  console.log("Received PushSubscription: ", JSON.stringify(pushSubscription));

  return pushSubscription;
}

/**
 * @source https://gist.github.com/Klerith/80abd742d726dd587f4bd5d6a0ab26b6
 */
function urlBase64ToUint8Array(base64String: string) {
  //   debugger;
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export type DbNotificationSubscription = {
  data: string;
  endpoint: string;
  name: string;
  user: admin.firestore.DocumentReference<User>;
};

export async function sendSubscriptionToBackEnd(
  pushSubscription: PushSubscription,
  subscriptionName: string
) {
  return fetch("/api/notifications/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...pushSubscription.toJSON(),
      name: subscriptionName,
    }),
  });
}

export const notificationSubscriptionConveriter: FirestoreDataConverter<DbNotificationSubscription> =
  {
    toFirestore: (sub: DbNotificationSubscription) => sub,
    fromFirestore: (doc: QueryDocumentSnapshot<DbNotificationSubscription>) =>
      doc.data(),
  };
