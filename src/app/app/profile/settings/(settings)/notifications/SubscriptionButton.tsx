"use client";

import LoadingCircle from "@/components/LoadingCircle";
import getNotificationSubscription from "@/helpers/getNotificationSubscription";
import generateSubscriptionName from "@/helpers/generateSubscriptionName";
import registerServiceWorker from "@/helpers/registerServiceWorker";
import subscribeUserToPush, {
  sendSubscriptionToBackEnd,
} from "@/worker/subscribe";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-simple-toasts";

export default function SubscriptionButton() {
  const [state, setState] = useState<
    "subscribed" | "loading" | "notSubscribed" | "error"
  >("loading");

  const router = useRouter();

  useEffect(() => {
    getNotificationSubscription()
      .then((subscription) => setState("subscribed"))
      .catch((error: Error) => {
        if (error.message.startsWith("Not subscribed Error"))
          setState("notSubscribed");
        else {
          setState("error");
          console.error(error);
        }
      });
  }, []);

  const subscribe = async () => {
    setState("loading");

    await navigator.serviceWorker
      .getRegistration("/app")
      .then(async (registration) => {
        if (registration === undefined) await registerServiceWorker();
        else
          await subscribeUserToPush(registration).then((subscription) =>
            sendSubscriptionToBackEnd(subscription, generateSubscriptionName())
          );
      })
      .then(() => {
        setState("subscribed");
        router.refresh();
      })
      .catch((err) => {
        console.error(err);
        toast(err);
      });
  };

  const unsubscribe = async () => {
    setState("loading");

    const subscription = await getNotificationSubscription().catch(
      (err) => null
    );
    if (subscription === null) return setState("notSubscribed");

    fetch("/api/notifications/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    }).then((res) => {
      if (!res.ok) return setState("error");
      setState("notSubscribed");
      router.refresh();
    });
  };

  return (
    <>
      <div className="w-full text-center">
        {state === "subscribed"
          ? "🔔 Notifications Enabled"
          : state === "loading"
          ? "🕑 Notifications Loading"
          : "🔕 Notifications Disabled"}
      </div>

      <button
        onClick={
          state === "loading"
            ? undefined
            : state === "error"
            ? undefined
            : state === "subscribed"
            ? unsubscribe
            : subscribe
        }
        className="mt-2 flex flex-row gap-2 whitespace-nowrap p-2 bg-zinc-800 rounded-md "
      >
        {state === "loading" ? (
          <>
            <LoadingCircle /> Loading...
          </>
        ) : state === "error" ? (
          "error"
        ) : state === "subscribed" ? (
          "disable Notifications"
        ) : (
          "enable Notifications"
        )}
      </button>
    </>
  );
}

export function UnsubAllButton() {
  const router = useRouter();
  const unsubAll = () =>
    fetch("/api/notifications/unsubscribeAll", {
      method: "DELETE",
    })
      .then(() => router.refresh())
      .catch((error) => {
        console.error(error);
        toast("❌ Error!");
      });

  return <button onClick={unsubAll}>Unsubscribe All</button>;
}
