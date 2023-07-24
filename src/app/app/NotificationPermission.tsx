"use client";

import LoadingCircle from "@/components/LoadingCircle";
import generateSubscriptionName from "@/helpers/generateSubscriptionName";
import getNotificationSubscription from "@/helpers/getNotificationSubscription";
import registerServiceWorker from "@/helpers/registerServiceWorker";
import subscribeUserToPush, {
  sendSubscriptionToBackEnd,
} from "@/worker/subscribe";
import { useEffect, useRef, useState } from "react";
import toast from "react-simple-toasts";

export default function NotificationPermissionBanner() {
  const [permission, setPermission] = useState<
    NotificationPermission | "noSupport" | "loading" | undefined
  >(undefined);
  const [workerState, setWorkerState] = useState<
    "notInstalled" | "installed" | "installing" | "noSupport" | undefined
  >(undefined);
  const [pushSubscriptionState, setPushSubscriptionState] = useState<
    "subscribed" | "notSubscribed" | "subscribing" | undefined
  >(undefined);

  // set initial states
  useEffect(() => {
    setPermission(
      typeof Notification === "undefined"
        ? "noSupport"
        : Notification.permission
    );
  }, []);

  // check for existing worker
  useEffect(() => {
    if (workerState !== undefined) return;
    const newWorkerState =
      typeof navigator === "undefined" ? "noSupport" : undefined;
    setWorkerState(newWorkerState);

    if (newWorkerState === "noSupport") return;
    if (newWorkerState === undefined)
      navigator.serviceWorker
        .getRegistration("/app")
        .then((registration) =>
          setWorkerState(
            registration === undefined ? "notInstalled" : "installed"
          )
        )
        .catch((error) => {
          console.error(error);
          setWorkerState("notInstalled");
        });
  }, [workerState]);

  // check push subscription state
  useEffect(() => {
    if (
      pushSubscriptionState !== undefined ||
      permission !== "granted" ||
      workerState !== "installed"
    )
      return;

    (async () => {
      await getNotificationSubscription()
        .then((registration) => {
          setPushSubscriptionState("subscribed");
        })
        .catch(() => setPushSubscriptionState("notSubscribed"));
    })();
  }, [permission, workerState, pushSubscriptionState]);

  // keep track if needed action -> display "all set"-box at end (otherwise dont)
  const neededAction = useRef(false);
  useEffect(() => {
    if (
      permission === "default" ||
      workerState === "notInstalled" ||
      pushSubscriptionState === "notSubscribed"
    )
      neededAction.current = true;
  }, [permission, workerState, pushSubscriptionState]);

  const enableNotifications = async () => {
    await Notification.requestPermission()
      .then(() => toast("✅ You will now recieve ReBeal notifications!"))
      .catch(() =>
        toast("❌ Please enable Notifications, or you'll miss Time To Re-Beal")
      )
      .finally(() => setPermission(Notification.permission));
  };

  const installServiceWorker = async () => {
    if (workerState !== "notInstalled") return;
    setWorkerState("installing");

    // uninstall service worker if somehow installed
    if (typeof navigator !== "undefined") {
      await navigator.serviceWorker
        .getRegistration("/app")
        .then((registration) => registration?.unregister())
        .catch((error) => {
          console.error(error);
          setWorkerState("notInstalled");
        });
    }

    await registerServiceWorker()
      .then(() => {
        toast("✅ Notifications enabled!");
        setWorkerState("installed");
        setPushSubscriptionState(undefined);
      })
      .catch(() => setWorkerState("notInstalled"));
  };

  const subscribeToNotifications = async () => {
    setPushSubscriptionState("subscribing");

    const registration = await navigator.serviceWorker.getRegistration("/app");
    if (registration === undefined) {
      setPushSubscriptionState("notSubscribed");
      setWorkerState((prev) =>
        prev === "noSupport" ? "noSupport" : "notInstalled"
      );
      return;
    }

    subscribeUserToPush(registration)
      .then((sub) => sendSubscriptionToBackEnd(sub, generateSubscriptionName()))
      .then((res) => setPushSubscriptionState("subscribed"))
      .catch((err) => {
        console.error(err);
        setPushSubscriptionState("notSubscribed");
      });
  };

  if (permission === "noSupport")
    return (
      <div className="w-full p-4 flex justify-center">
        <div className="p-4 border rounded-xl border-zinc-600 flex gap-3 flex-col items-center justify-center">
          <h2 className="text-md">
            ⚠️ Your browser does not support Notifications!
          </h2>
        </div>
      </div>
    );

  if (workerState === "noSupport")
    return (
      <div className="w-full p-4 flex justify-center">
        <div className="p-4 border rounded-xl border-zinc-600 flex gap-3 flex-col items-center justify-center">
          <h2 className="text-md">
            ⚠️ Your browser does not support Notifications!
          </h2>
        </div>
      </div>
    );

  if (permission === "default")
    return (
      <>
        <Box
          header="🔔 Dont miss ReBeal notifications!"
          buttonContent="grant permission"
          onClick={enableNotifications}
          progress="1/3"
        />
      </>
    );

  if (permission === "denied")
    return (
      <div className="w-full p-4 flex justify-center">
        <div className="p-4 border rounded-xl border-zinc-600 flex gap-3 flex-col items-center justify-center">
          <h2 className="text-md">⚠️ You are not recieving Notifications!</h2>
        </div>
      </div>
    );

  if (workerState === "notInstalled")
    return (
      <Box
        header="Enable Notifications"
        buttonContent="enable background worker"
        onClick={installServiceWorker}
        progress="2/3"
      />
    );
  if (workerState === "installing")
    return (
      <Box
        header="Enable Notifications"
        buttonContent={
          <>
            <LoadingCircle /> installing / registering...
          </>
        }
        progress="2/3"
      />
    );

  if (pushSubscriptionState === "notSubscribed")
    return (
      <Box
        header="This device is not subscribed to recieve Notifications"
        buttonContent="Subscribe"
        progress="3/3"
        onClick={subscribeToNotifications}
      />
    );

  if (pushSubscriptionState === "subscribing")
    return (
      <Box
        header="This device is not subscribed to recieve Notifications"
        progress="3/3"
        buttonContent={
          <>
            <LoadingCircle /> subscribing...
          </>
        }
      />
    );

  if (
    neededAction.current === true &&
    permission === "granted" &&
    workerState === "installed" &&
    pushSubscriptionState === "subscribed"
  )
    return <Box header="✅ You will now recive Notifications!" fadeOut />;
  return null;
}

const Box = ({
  header,
  buttonContent,
  progress = "",
  fadeOut = false,
  onClick,
}: {
  header: string;
  buttonContent?: React.ReactNode;
  progress?: string;
  fadeOut?: boolean;
  onClick?: () => any;
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fadeOut && boxRef.current) {
      boxRef.current.animate(
        [
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
        ],
        {
          duration: 500,
          delay: 2000,
          fill: "forwards",
        }
      );
      setTimeout(() => {
        if (boxRef.current) boxRef.current.style.display = "none";
      }, 2500);
    }
  }, [fadeOut]);

  return (
    <div className="w-full p-4 flex justify-center" ref={boxRef}>
      <div className="p-4 border rounded-xl border-zinc-600 flex gap-3 flex-col items-center justify-center">
        <div className="w-full flex justify-around gap-2">
          <h2 className="text-xl">{header}</h2>
          <span className="text-zinc-500">{progress}</span>
        </div>
        {buttonContent ? (
          <button
            onClick={onClick}
            className="bg-zinc-100 text-black rounded-md p-1 flex justify-between gap-2"
          >
            {buttonContent}
          </button>
        ) : null}
      </div>
    </div>
  );
};
