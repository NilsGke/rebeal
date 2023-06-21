import admin from "@/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import BackArrow from "@/../public/assets/backArrow.svg";
import { User } from "next-auth";
import getDicebearImage from "@/helpers/dicebear";
import ShareButton from "@/components/ShareButton";
import FriendRequestButton from "@/components/FriendRequestButtonWrapper";
import InlineCode from "@/components/InlineCode";
import BackButton from "@/components/BackButton";

const Page: FC<{
  params: {
    uid: string;
  };
}> = async ({ params }) => {
  const uid = decodeURI(params.uid);

  const firestore = admin.firestore();
  const userDoc = await firestore.doc(`users/${uid}`).get();
  const user: User | undefined = userDoc.exists
    ? { ...userDoc.data(), id: uid }
    : undefined;

  if (user === undefined)
    return (
      <div className="w-full h-full flex justify-center items-center">
        could not find user:
        <InlineCode>{uid}</InlineCode>
      </div>
    );

  return (
    <div className="w-full">
      <header className="relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-between items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <BackButton className="flex gap-3 justify-center items-center">
            <span className="flex items-center justify-center">
              {user.name}
            </span>
          </BackButton>
        </div>
      </header>

      <main className="relative w-full h-full -translate-y-14 -z-0">
        <div className="w-full aspect-[10/9] grid grid-cols-1 grid-rows-1 -top-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full row-start-1 row-end-2 col-start-1 col-end-2 grid-rows-1 aspect-square brightness-50 -z-20"
            src={user.image ?? getDicebearImage(user.name || "")}
            alt="your profile picture"
          />
          <div className="w-full aspect-square row-start-1 row-end-2 col-start-1 col-end-2 grid-rows-1 -z-10 bg-gradient-to-b from-black/60 via-transparent via-20% to-transparent" />
          <div className="w-full aspect-square row-start-1 row-end-2 col-start-1 col-end-2 grid-rows-1 -z-10 bg-gradient-to-b from-transparent via-transparent via-80% to-black" />
        </div>

        <div className="relative p-3 flex justify-between items-center">
          <h1 className="text-4xl ">{user.name}</h1>
          <ShareButton url={`users/${user.id}`} />
        </div>

        <section className="p-3">
          <FriendRequestButton to={uid} />
        </section>
      </main>
    </div>
  );
};
export default Page;
