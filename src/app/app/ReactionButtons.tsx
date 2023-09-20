"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ReBeal, Reaction, SavedReactionUserRecord } from "../types";
import { twMerge } from "tailwind-merge";
import { User } from "next-auth";
import useClickOutside from "@/hooks/useClickOutside";
import Link from "next/link";
import reactToReBeal from "@/helpers/reactToReBeal";
import getReBeals from "@/firebase/server/getReBeals";
import Smiley from "@/../public/assets/smiley.svg";
import Image from "next/image";
import toast from "react-simple-toasts";
import { useLongPress } from "use-long-press";
import { useRouter } from "next/navigation";

export default function ReactionButtons({
  rebealId,
  savedReactions,
  reactions: fetchedReactions,
  sessionUserId,
  reactionsOpen,
}: {
  rebealId: ReBeal["id"];
  savedReactions: SavedReactionUserRecord;
  reactions: Awaited<ReturnType<typeof getReBeals>>[number]["reactions"];
  sessionUserId: User["id"];
  reactionsOpen?: boolean;
}) {
  const [reactions, setReactions] =
    useState<((Reaction | Omit<Reaction, "user">) & { userId: string })[]>(
      fetchedReactions
    );

  const ownReaction = reactions.find(
    (reaction) => reaction.userId === sessionUserId
  );

  const [reactionsVisible, setReactionsVisible] = useState(
    reactionsOpen || false
  );
  const [transition, setTransition] = useState(reactionsVisible);

  const toggle = useCallback(() => {
    if (reactionsVisible) {
      setTransition(false);
      setTimeout(() => setReactionsVisible(false), 150);
    } else {
      setReactionsVisible(true);
    }
  }, [reactionsVisible]);

  useEffect(() => {
    setTransition(reactionsVisible);
  }, [reactionsVisible]);

  const reactionOptions = [
    { type: "👍", image: savedReactions["👍"] },
    { type: "😃", image: savedReactions["😃"] },
    { type: "😯", image: savedReactions["😯"] },
    { type: "😍", image: savedReactions["😍"] },
    { type: "😂", image: savedReactions["😂"] },
  ] as const;

  const buttonsRef = useClickOutside(() => toggle());

  const reacted = (image: string, type: Reaction["type"]) => {
    setReactions((prev) => [
      {
        image: image,
        type: type,
        id: "customReaction",
        userId: sessionUserId,
      },
      ...prev.filter((reaction) => reaction.userId !== sessionUserId),
    ]);
    setReactionsVisible(false);
  };

  const unreacted = (image: string) => {
    setReactions((prev) => prev.filter((reaction) => reaction.image !== image));
    setReactionsVisible(false);
  };

  return (
    <>
      <div
        className={twMerge(
          "absolute bottom-0 flex justify-between w-full opacity-100 transition-opacity ",
          transition && "opacity-0"
        )}
      >
        <div className="ml-3 mb-3 flex flex-row-reverse items-center">
          {(reactions.length >= 3
            ? reactions.slice(0, 2) || []
            : reactions.slice().reverse()
          ).map((reaction, index) => (
            <div
              key={reaction.id}
              className={twMerge(
                "inline-block w-7 h-7 rounded-full overflow-hidden",
                index !== 0 && "absolute left-5",
                ownReaction?.type === reaction.type && "border border-white"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={reaction.image} alt="reaction preview" />
            </div>
          ))}
        </div>
        <button
          className="mb-3 mr-3 opacity-60 h-8 w-8 flex justify-center items-center"
          onClick={toggle}
        >
          <Image
            className="invert h-4/5 w-4/5"
            src={Smiley}
            alt="reaction button"
          />
        </button>
      </div>

      {reactionsVisible && (
        <div
          ref={buttonsRef}
          className={twMerge(
            "absolute flex gap-3 px-2 justify-around bottom-2 w-full opacity-0 -z-10 transition-opacity",
            transition && "opacity-100",
            reactionsVisible && "z-0"
          )}
        >
          {reactionOptions.map((reaction) => (
            <ReactionButton
              rebealId={rebealId}
              key={reaction.image + reaction.type}
              active={ownReaction?.type === reaction.type}
              reaction={reaction}
              reacted={reacted}
              unreacted={unreacted}
            />
          ))}
          <ReactionButton
            rebealId={rebealId}
            reaction={{
              image: ownReaction?.type === "⚡" ? ownReaction.image : "",
              type: "⚡",
            }}
            reacted={reacted}
            unreacted={unreacted}
            active={ownReaction?.type === "⚡"}
          />
        </div>
      )}
    </>
  );
}

const ReactionButton = ({
  reaction,
  active = false,
  rebealId,
  reacted,
  unreacted,
}: {
  reaction: { type: Reaction["type"]; image: string };
  active?: boolean;
  rebealId: ReBeal["id"];
  reacted: (image: string, type: Reaction["type"]) => void;
  unreacted: (image: string) => void;
}) => {
  const router = useRouter();

  const liveReaction = reaction.type === "⚡";

  const cooldown = useRef<Promise<void>>(
    new Promise((r) => {
      r();
    })
  );
  const startCooldown = () =>
    (cooldown.current = new Promise((r) => setTimeout(r, 1000)));

  const react = async () => {
    await cooldown.current;
    startCooldown();

    reacted(reaction.image, reaction.type);
    reactToReBeal(rebealId, reaction.image, reaction.type).catch((error) => {
      console.error(error);
      toast("could not react :/");
    });
  };

  const unreact = async () => {
    await cooldown.current;
    startCooldown();

    unreacted(reaction.image);
    fetch("/api/reactions/unreact", {
      method: "POST",
      body: JSON.stringify({
        reBealId: rebealId,
        reactionType: reaction.type,
      }),
    })
      .then(() => unreacted(reaction.image))
      .catch((error) => {
        console.error(error);
        toast("could not unreact :/");
      });
  };

  const callbackUrl = new URL(window.location.href.split("?")[0]);
  callbackUrl.searchParams.set("scrollToReBeal", rebealId);

  const reactUrl = new URL(window.location.origin + "/app/react");
  reactUrl.searchParams.set("reactionType", reaction.type);
  reactUrl.searchParams.set("reactTo", rebealId);
  reactUrl.searchParams.set("callbackUrl", callbackUrl.toString());

  const longPress = useLongPress(() => router.push(reactUrl.toString()));

  const htmlImage = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-full aspect-square rounded-full"
      src={reaction.image}
      alt={"reaction: " + reaction.type}
    />
  );

  const className = twMerge(
    "rounded-full w-full scale-95 aspect-square backdrop-brightness-75 flex justify-center items-center",
    active && "outline outline-2 outline-white"
  );

  if ((liveReaction && !active) || reaction.image === "")
    return (
      <Link href={reactUrl.toString()} className={className}>
        <span className="text-xl">{reaction.type}</span>
      </Link>
    );
  else
    return (
      <button
        onClick={active ? unreact : react}
        key={reaction.image + reaction.type}
        className={className}
        {...(reaction.type !== "⚡" ? longPress() : {})}
      >
        {htmlImage}
      </button>
    );
};
