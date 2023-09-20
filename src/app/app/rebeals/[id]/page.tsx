import admin from "@/firebase/config";
import getLastTTRB from "@/firebase/server/getLastTTRB";
import serverAuth from "@/helpers/serverComponentAuth";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/../public/assets/backArrow.svg";
import {
  Reaction as ReactionImage,
  reactionConverter,
  rebealConverter,
  userConverter,
} from "@/app/types";
import getLateness from "@/helpers/getLateness";
import ScrollingDisplay from "./ScrollingDisplay";
import { ReactNode } from "react";
import { User } from "next-auth";
import Drawer from "./ReactionPopupDrawer";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await serverAuth();

  const id = params.id;

  const firestore = admin.firestore();

  const [rebealRequest, lastTTRBReq] = await Promise.allSettled([
    firestore
      .collection("rebeals")
      .doc(id)
      .withConverter(rebealConverter)
      .get(),
    getLastTTRB(),
  ]);

  if (
    rebealRequest.status === "rejected" ||
    rebealRequest.value.exists === false
  )
    return <Error>404 ReBeal not found</Error>;

  if (lastTTRBReq.status === "rejected")
    return <Error>500 could not get lastTimeToReBeal from database</Error>;
  const lastTTRB = lastTTRBReq.value;

  const rebeal = rebealRequest.value.data();
  if (rebeal === undefined)
    return <Error> 500 ReBeal data returned undefined</Error>;

  const userDoc = firestore.doc(`users/${session.user.id}`);
  const opDoc = rebeal.user;

  const isFriendsWithUser =
    (await Promise.all([
      firestore
        .collection("friends")
        .where("a", "==", opDoc)
        .where("b", "==", userDoc)
        .limit(1)
        .get(),
      firestore
        .collection("friends")
        .where("b", "==", opDoc)
        .where("a", "==", userDoc)
        .limit(1)
        .get(),
    ]).then((requests) =>
      requests.map((request) => request.size).reduce((t, c) => t + c)
    )) !== 0;

  if (
    userDoc.id !== opDoc.id &&
    (rebeal.postedAt.toDate() < lastTTRB.announcedAt || !isFriendsWithUser)
  )
    return <Error>404 ReBeal not found</Error>;

  const op = (await rebeal.user.withConverter(userConverter).get()).data();
  if (op === undefined) return <Error>500 could not get op doc</Error>;

  const reactionDocs = await firestore
    .collection(`rebeals/${rebeal.id}/reactions`)
    .withConverter(reactionConverter)
    .get()
    .then((snapshot) => snapshot.docs);

  const reactionUsers =
    reactionDocs.length === 0
      ? []
      : await firestore
          .getAll(...reactionDocs.map((doc) => doc.data().user))
          .then((snapshots) =>
            snapshots.map(
              (snapshot) => ({ ...snapshot.data(), id: snapshot.id } as User)
            )
          );

  const reactions = reactionDocs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: doc.createTime.toDate(),
      userData: reactionUsers.find((user) => user.id === data.user.id),
    };
  });

  return (
    <>
      <header className="sticky w-full max-w-3xl top-2 p-3 flex flex-row justify-between items-center z-40">
        <Link href="/app" className="">
          <Image
            className="invert aspect-square w-6"
            src={BackButton}
            alt="close icon"
          />
        </Link>
        <div className="flex flex-col gap-1 justify-center items-center ">
          <div>{op.name}</div>
          <div className="h-[50%] text-zinc-400 text-xs">
            {new Date(rebeal.postedAt.seconds * 1000).toLocaleTimeString(
              "DE-de"
            )}
            {" - "}
            {getLateness(lastTTRB.announcedAt, rebeal.postedAt.toDate())}
          </div>
        </div>
        <div></div> {/* TODO: add three dot menu */}
      </header>

      <main>
        <div className="fixed overflow-hidden blur-xl brightness-[.2] -z-10 top-0 left-0 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full"
            src={rebeal.images.environment}
            alt="rebeal environment image"
          />
        </div>

        <section className="h-[70vh] w-full px-4 flex flex-col justify-center items-center ">
          <ScrollingDisplay images={rebeal.images} />
        </section>

        <section className="min-h-[70vh] max-h-[calc(100vh+75px)] w-full overflow-scroll">
          <div className="p-10 flex flex-wrap gap-4 justify-center items-center">
            <Chip>Wiesbaden, Deutschland [placeholder]</Chip>
            <Chip>2 Retakes [placeholder]</Chip>
          </div>

          <div className="w-full overflow-x-scroll">
            <div
              className={`whitespace-nowrap gap-4 w-auto p-3 overflow-x-scroll`}
            >
              {reactions.length === 0 && <span>no reactions</span>}
              {reactions.map((reaction) => {
                return (
                  <ReactionImage
                    key={reaction.id}
                    reaction={reaction}
                    user={reaction.userData}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const Error = ({ children: message }: { children: string }) => (
  <>
    <Link href="/app" className="absolute top-6 left-5 z-10 ">
      <Image
        className="invert aspect-square w-6"
        src={BackButton}
        alt="close icon"
      />
    </Link>
    <div className="flex justify-center items-center text-zinc-200 h-full w-full">
      {message}
    </div>
  </>
);

const Chip = ({ children }: { children: ReactNode }) => (
  <div className="text-sm rounded-3xl p-[6px] px-3 bg-zinc-800 font-bold shadow-xl">
    {children}
  </div>
);

const ReactionImage = ({
  reaction,
  user,
}: {
  reaction: ReactionImage & {
    createdAt: Date;
  };
  user: User | undefined;
}) => {
  return (
    <Drawer
      trigger={
        <>
          <div className="aspect-square rounded-full overflow-hidden flex justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rounded-full w-full"
              src={reaction.image}
              alt="reaction image"
            />
          </div>
          <div className="absolute top-12 right-0 text-2xl">
            {reaction.type}
          </div>
          <div className="w-full text-center text-xs mt-2">
            {user?.name || "asdf"}
          </div>
        </>
      }
      className="relative w-20 inline-block mr-4 last:mr-0"
      drawerClassName="pt-4"
    >
      <Link
        href={`app/users/${user?.id}`}
        className="flex flex-col gap-4 justify-center items-center"
      >
        <h2 className="text-xl">BealMoji</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="relative aspect-square w-[50vw] flex justify-center items-center">
          <div className="rounded-full overflow-hidden aspect-square h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rounded-full w-full"
              src={reaction.image}
              alt="reaction image"
            />
          </div>
          <div className="absolute bottom-0 right-0 text-6xl ">
            {reaction.type}
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <p className="font-bold">{user?.name}</p>
          <p className="text-zinc-500 text-xs mb-5">
            {reaction.createdAt.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </Link>
    </Drawer>
  );
};
