"use client";

import LoadingCircle from "@/components/LoadingCircle";
import registerServiceWorker from "@/helpers/registerServiceWorker";
import subscribeUserToPush, {
  sendSubscriptionToBackEnd,
} from "@/worker/subscribe";
import { useState } from "react";
import toast from "react-simple-toasts";

enum SubscriptionState {
  existing,
  nonExistent,
  loading,
}

export default function SubscriptionButton({
  existingSubscription,
}: {
  existingSubscription: boolean;
}) {
  const [state, setState] = useState<SubscriptionState>(
    existingSubscription
      ? SubscriptionState.existing
      : SubscriptionState.nonExistent
  );
  const loading = state === SubscriptionState.loading;
  const existing = state === SubscriptionState.existing;

  const subscribe = async () => {
    setState(SubscriptionState.loading);

    await navigator.serviceWorker
      .getRegistration("/app/")
      .then(async (registration) => {
        if (registration === undefined) await registerServiceWorker();
        else
          await subscribeUserToPush(registration).then(
            sendSubscriptionToBackEnd
          );
      })
      .then(() => setState(SubscriptionState.existing))
      .catch((err) => {
        console.error(err);
        toast(err);
      });
  };

  const unsubscribe = () => {
    setState(SubscriptionState.loading);
    fetch("/api/notifications/unsubscribe", {
      method: "DELETE",
    }).then(() => setState(SubscriptionState.nonExistent));
  };

  return (
    <button
      onClick={
        state === SubscriptionState.loading
          ? undefined
          : existing
          ? unsubscribe
          : subscribe
      }
      className=" w-fullrounded flex justify-center gap-2"
    >
      {loading ? (
        <>
          <LoadingCircle /> Loading...
        </>
      ) : existing ? (
        "disable Notifications"
      ) : (
        "enable Notifications"
      )}
    </button>
  );
}
