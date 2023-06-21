"use client";

import { User } from "next-auth";
import { useState } from "react";
import LoadingCircle from "./LoadingCircle";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddFriend from "@/../public/assets/addFriend.svg";
import CloseIcon from "@/../public/assets/closeIcon.svg";
import AcceptIcon from "@/../public/assets/check.svg";

const ActualFriendRequestButton: React.FC<{
  to: User["id"];
  className?: string;
  incoming?: boolean;
  outgoing?: boolean;
  friends?: boolean;
  small?: boolean;
}> = ({
  to,
  incoming = false,
  outgoing = false,
  friends = false,
  small = false,
  className = "",
}) => {
  const [status, setStatus] = useState<
    "outgoing" | "default" | "loading" | "failed" | "incoming" | "friends"
  >(
    incoming
      ? "incoming"
      : outgoing
      ? "outgoing"
      : friends
      ? "friends"
      : "default"
  );

  console.log(status);

  function send(e: React.MouseEvent) {
    e.preventDefault();
    setStatus("loading");
    fetch("/api/friends/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: to,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setStatus("outgoing");
        else {
          setStatus("failed");
          console.error(
            "sending friend request returned following message: " + res.message
          );
        }
      });
  }

  function cancel(e: React.MouseEvent) {
    e.preventDefault();
    setStatus("loading");
    fetch("/api/friends/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: to,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setStatus("default");
        else {
          setStatus("failed");
          console.error(
            "removing friend request returned following message: " + res.message
          );
        }
      });
  }

  function accept(e: React.MouseEvent) {
    e.preventDefault();
    setStatus("loading");
    fetch("/api/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: to,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setStatus("friends");
        else {
          setStatus("failed");
          console.error(
            "accepting request returned following message: " + res.message
          );
        }
      });
  }

  function reject(e: React.MouseEvent) {
    e.preventDefault();
    setStatus("loading");
    fetch("/api/friends/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: to,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setStatus("default");
        else {
          setStatus("failed");
          console.error(
            "sending friend request returned following message: " + res.message
          );
        }
      });
  }

  function remove(e: React.MouseEvent) {
    e.preventDefault();
    setStatus("loading");
    fetch("/api/friends/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: to,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setStatus("default");
        else {
          setStatus("failed");
          console.error(
            "removing friend request returned following message: " + res.message
          );
        }
      });
  }
  const router = useRouter();

  const styles =
    "h-12 border-2 border-zinc-700 rounded p-2 flex justify-center items-center " +
    className +
    (small ? " p-[2px] w-6 h-6 rounded-md aspect-square border-1" : " w-full");

  if (status === "default")
    return (
      <button onClick={send} className={styles}>
        {small ? (
          <Image className="invert" src={AddFriend} alt="add friend icon" />
        ) : (
          "add Friend"
        )}
      </button>
    );
  else if (status === "failed")
    return (
      <button
        onClick={() => router.refresh()}
        className={styles + " text-red-400"}
      >
        {small ? "error" : "failed 😅"}
      </button>
    );
  else if (status === "friends")
    return (
      <button onClick={remove} className={styles + " text-red-300"}>
        {small ? (
          <Image className="invert" src={CloseIcon} alt="remove friend" />
        ) : (
          "remove friend"
        )}
      </button>
    );
  else if (status === "incoming")
    return (
      <div className="flex gap-2">
        <button onClick={accept} className={styles + " text-green-300"}>
          {small ? (
            <Image className="invert" src={AcceptIcon} alt="accept" />
          ) : (
            "accept"
          )}
        </button>
        <button onClick={reject} className={styles + " text-red-400"}>
          {small ? (
            <Image className="invert" src={CloseIcon} alt="decline" />
          ) : (
            "decline"
          )}
        </button>
      </div>
    );
  else if (status === "outgoing")
    return (
      <button onClick={cancel} className={styles}>
        {small ? (
          <Image className="invert" src={CloseIcon} alt="cancel" />
        ) : (
          "cancel request"
        )}
      </button>
    );
  else if (status === "loading")
    return (
      <button className={styles}>
        <LoadingCircle />
      </button>
    );
};

export default ActualFriendRequestButton;
