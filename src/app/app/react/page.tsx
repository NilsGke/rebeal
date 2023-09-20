"use client";

import { stringIsReactionEmoji } from "@/app/types";
import uploadReactionImage from "@/firebase/client/uploadReaction";
import { base64ToFile } from "@/helpers/base64ToFile";
import reactToReBeal from "@/helpers/reactToReBeal";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import PaperPlaneIcon from "@/../public/assets/paperPlane.svg";
import CloseIcon from "@/../public/assets/closeIcon.svg";
import BackIcon from "@/../public/assets/backArrow.svg";
import Image from "next/image";
import toast from "react-simple-toasts";
import LoadingCircle from "@/components/LoadingCircle";
import Link from "next/link";

export default function Page() {
  const { data: session, status: sessionStatus } = useSession();

  const uid = session?.user.id;
  if (sessionStatus !== "loading" && uid === undefined)
    throw new Error("you are not logged in!");

  const params = useSearchParams();
  const [callbackUrl] = useState(params.get("callbackUrl"));
  const [reactTo] = useState(params.get("reactTo"));
  const [_reactionType] = useState(params.get("reactionType"));

  if (_reactionType === null || !stringIsReactionEmoji(_reactionType))
    throw new Error("reaction emoji specified in url is not a valid emoji");
  const reactionType = _reactionType;

  const camRef = useRef<Webcam>(null);

  const [image, setImage] = useState<string | null>(null);

  const router = useRouter();

  const capture = async () => {
    if (camRef.current === null) throw new Error("webcam ref is null");

    const image = camRef.current.getScreenshot();
    if (image === null) throw new Error("could not capture screenshot");

    setImage(image);
  };

  const send = async () => {
    if (image === null) return;

    const file = base64ToFile(image, `reaction_${reactionType}.webp`);

    if (uid === undefined) throw Error("you are not logged in");

    if (reactionType === "⚡") {
      if (reactTo === null)
        throw Error("cannot upload live reaction but not react to a rebeal");

      try {
        const imageUrl = await uploadReactionImage(file, uid, reactionType);
        await reactToReBeal(reactTo, imageUrl, reactionType);
        router.replace(callbackUrl || "/app");
      } catch (error) {
        toast("something went wrong");
        console.error(error);
      }
    } else {
      try {
        const imageUrl = await uploadReactionImage(file, uid, reactionType);
        fetch("/api/reactions/saveReaction", {
          method: "POST",
          body: JSON.stringify({
            imageUrl,
            reactionType,
          }),
        }).catch((error) => {
          toast("could not save your reaction");
          throw Error(error);
        });
        if (reactTo !== null)
          await reactToReBeal(reactTo, imageUrl, reactionType)
            .then(() => toast("reacted to rebeal ✅"))
            .catch((error) => {
              toast("could not react to rebeal");
              throw Error(error);
            });
      } catch (error) {
        toast("error");
        console.error(error);
      }

      router.replace(callbackUrl || "/app");
    }
  };

  const BackButton = () => (
    <button
      className="absolute top-4 left-4"
      onClick={callbackUrl ? () => router.push(callbackUrl) : router.back}
    >
      <Image className="invert h-6 w-6" src={BackIcon} alt="back button" />
    </button>
  );

  if (sessionStatus === "loading")
    return (
      <div className="w-full h-full flex justify-center items-center">
        <BackButton />
        <LoadingCircle />
      </div>
    );

  if (image)
    return (
      <div className="flex flex-col gap-8 justify-center items-center h-[75%] w-full">
        <BackButton />
        <div className="text-5xl">{reactionType}</div>

        <div className="rounded-full overflow-hidden aspect-square w-[90%] border-2 border-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="your reaction" />
        </div>

        <div className="absolute flex justify-center items-center gap-3 bottom-14 w-full">
          <button
            className="h-12 w-12 flex justify-center items-center aspect-square rounded-full bg-zinc-800"
            onClick={() => setImage(null)}
          >
            <Image
              className="invert h-3/5 w-3/5"
              src={CloseIcon}
              alt="cancel"
            />
          </button>

          <button
            className="h-12 w-12 flex justify-center items-center aspect-square rounded-full bg-blue-700"
            onClick={send}
          >
            <Image
              className="invert h-3/5 w-3/5"
              src={PaperPlaneIcon}
              alt="send icon"
            />
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-[75%] w-full">
      <BackButton />
      <div className="text-5xl">{reactionType}</div>

      <div className="rounded-full overflow-hidden aspect-square w-[90%] border-2 border-white">
        <Webcam
          ref={camRef}
          screenshotFormat="image/webp"
          height={1000}
          width={1000}
          className=" aspect-[3/4] w-full h-full"
          audio={false}
          mirrored
          videoConstraints={{ facingMode: "user", aspectRatio: 1 }}
        />
      </div>

      <button
        className="absolute bottom-14 left-[calc(50%-(5rem/2))] rounded-full h-20 w-20 border-4 active:bg-white"
        onClick={capture}
      ></button>
    </div>
  );
}
