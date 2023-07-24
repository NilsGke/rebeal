"use client";
import { DbNotificationSubscription } from "@/worker/subscribe";
import Image from "next/image";
import RemoveIcon from "@/../public/assets/closeIcon.svg";
import CheckIcon from "@/../public/assets/check.svg";
import { useState } from "react";
import { User } from "next-auth";
import LoadingCircle from "@/components/LoadingCircle";
import { twMerge } from "tailwind-merge";

export default function Subscription({
  subscription,
  createdAt,
}: {
  subscription: Omit<DbNotificationSubscription, "user"> & {
    user: User["id"];
  };
  createdAt: Date;
}) {
  const [state, setState] = useState<"existing" | "removing" | "removed">(
    "existing"
  );

  const remove = () => {
    setState("removing");
    fetch("/api/notifications/unsubscribe", {
      method: "POST",
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    }).then((res) => {
      if (!res.ok) return setState("existing");
      setState("removed");
    });
  };

  return (
    <div
      className={twMerge(
        "flex gap-1 p-2 justify-between bg-zinc-800 rounded",
        state === "removed" ? "opacity-30" : ""
      )}
    >
      <div>{subscription.name}</div>
      <div className="text-zinc-500">{createdAt.toLocaleDateString()}</div>
      {state === "existing" ? (
        <button onClick={remove}>
          <Image className="invert" src={RemoveIcon} alt="remove" />
        </button>
      ) : state === "removing" ? (
        <LoadingCircle />
      ) : (
        <Image className="invert" src={CheckIcon} alt="success" />
      )}
    </div>
  );
}
