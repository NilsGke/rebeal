"use client";

import LoadingCircle from "@/components/LoadingCircle";
import registerServiceWorker from "@/helpers/registerServiceWorker";
import { useEffect, useState } from "react";
import toast from "react-simple-toasts";

export default function NotificationPermissionBanner() {
  const [permission, setPermission] = useState<
    NotificationPermission | "noSupport" | "loading"
  >(
    typeof Notification === "undefined" ? "noSupport" : Notification.permission
  );
  const [workerState, setWorkerState] = useState<
    "notInstalled" | "installed" | "installing" | "noSupport" | undefined
  >(typeof navigator === "undefined" ? "noSupport" : undefined);

  // check for existing worker
  useEffect(() => {
    if (workerState === "noSupport") return;
    if (workerState === undefined)
      navigator.serviceWorker
        .getRegistration("/app/")
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

  const enableNotifications = async () => {
    await Notification.requestPermission()
      .then(() => toast("✅ You will now recieve ReBeal notifications!"))
      .catch(() =>
        toast("❌ Please enable Notifications, or you'll miss Time To Re-Beal")
      )
      .finally(() => setPermission(Notification.permission));
  };

  const installServiceWorker = async () => {
    setWorkerState("installing");
    await registerServiceWorker()
      .then(() => {
        toast("✅ Notifications enabled!");
        setWorkerState("installed");
      })
      .catch(() => setWorkerState("notInstalled"));
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
          progress="1/2"
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
        progress="2/2"
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
        progress="2/2"
      />
    );

  if (permission === "granted" && workerState === "installed") return null;
  return null;
}

const Box = ({
  header,
  buttonContent,
  progress = "",
  onClick,
}: {
  header: string;
  buttonContent: React.ReactNode;
  progress?: string;
  onClick?: () => any;
}) => (
  <div className="w-full p-4 flex justify-center">
    <div className="p-4 border rounded-xl border-zinc-600 flex gap-3 flex-col items-center justify-center">
      <div className="w-full flex justify-around gap-2">
        <h2 className="text-xl">{header}</h2>
        <span className="text-zinc-500">{progress}</span>
      </div>
      <button
        onClick={onClick}
        className="bg-zinc-100 text-black rounded-md p-1 flex justify-between gap-2"
      >
        {buttonContent}
      </button>
    </div>
  </div>
);
