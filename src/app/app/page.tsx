import Link from "next/link";
import serverAuth from "@/helpers/serverComponentAuth";
import PeopleIcon from "@/../public/assets/people.svg";
import AccountIcon from "@/../public/assets/profile.svg";
import Image from "next/image";
import getFriends from "@/firebase/server/getFriends";
import getDicebearImage from "@/helpers/dicebear";
import getReBeals from "@/firebase/server/getReBeals";
import ReBealImageViewer from "@/components/RebealImageViewer";
import VerticalDots from "@/../public/assets/verticalDots.svg";
import DropDown from "@/components/DropDown";
import ShareButton from "@/components/ShareButton";
import ProfileIcon from "@/../public/assets/profile.svg";
import ReportIcon from "@/../public/assets/report.svg";
import NotificationPermissionBanner from "./NotificationPermission";
import RefreshBanner from "./RefreshBanner";
import InstallPrompt from "./InstallPrompt";
import admin from "@/firebase/config";
import { Timestamp } from "firebase-admin/firestore";
import { rebealConverter } from "../types";
import { Session } from "next-auth";
import getLastTTRB from "@/firebase/server/getLastTTRB";
import getLateness from "@/helpers/getLateness";
import PostPromptLink from "@/components/PostPromptLink";

export default async function App() {
  const session = await serverAuth();

  if (!session || session.user === undefined)
    return <p>you need to log in to use this app</p>;

  const lastTTRB = await getLastTTRB();

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const firestore = admin.firestore();
  const ownReBealSnapshot = await firestore
    .collection("rebeals")
    .where("user", "==", firestore.doc(`users/${session.user.id}`))
    .where("postedAt", ">=", Timestamp.fromDate(todayMidnight))
    .limit(1)
    .withConverter(rebealConverter)
    .get();

  const ownReBeal = ownReBealSnapshot.docs.at(0)?.data();

  const userHasPosted = !ownReBealSnapshot.empty;

  return (
    <>
      <header className="sticky w-full max-w-3xl top-2 p-3 flex flex-row justify-center items-center z-40">
        <Link className="absolute left-3" href="/app/friends">
          <Image className="invert" src={PeopleIcon} alt="friends icon" />
        </Link>
        <h1 className="text-2xl">ReBeal.</h1>
        <Link className="absolute right-3" href="/app/profile">
          {typeof session.user.image === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              className="h-30 w-8 h-8 rounded-full"
              alt="your profile picture"
            />
          ) : (
            <Image className="invert" src={AccountIcon} alt="account icon" />
          )}
        </Link>
      </header>

      {!userHasPosted ? (
        <>
          <section className="w-full flex flex-col gap-2 justify-center items-center bg-no-repeat bg-cover bg-center">
            <PostPromptLink date={lastTTRB.announcedAt} />
          </section>
        </>
      ) : null}

      {userHasPosted && ownReBeal !== undefined ? (
        <section className="w-full flex flex-col gap-2 justify-center items-center bg-no-repeat bg-cover bg-center relative">
          {/* background image */}
          <div className="absolute w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full absolute blur-md brightness-20"
              src={ownReBeal.images.environment}
              alt="your last ReBeal (environment)"
            />
          </div>

          {/* actual image */}
          <div className="aspect-[3/4] w-2/5 relative mt-4 ">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ownReBeal.images.environment}
              alt="your last ReBeal (environment)"
              className="w-full rounded-md border-2 border-black"
            />
          </div>

          <div className="relative">
            <h2 className="text-white">
              {getLateness(lastTTRB.announcedAt, ownReBeal.postedAt.toDate())}
            </h2>
          </div>
        </section>
      ) : null}

      <NotificationPermissionBanner />

      <InstallPrompt />

      {userHasPosted ? (
        <FriendReBeals session={session} lastTTRB={lastTTRB} />
      ) : null}

      {!userHasPosted && (
        <div className="w-[95%] text-center mt-2 text-zinc-500">
          Post your ReBeal to see your friends ReBeals
        </div>
      )}

      {!userHasPosted ? (
        <Link
          className="fixed bottom-2 left-[calc(50%-(5rem/2))] rounded-full h-[85px] w-[85px] border-[6px] active:bg-white"
          href="app/upload"
        />
      ) : null}
    </>
  );
}

async function FriendReBeals({
  session,
  lastTTRB,
}: {
  session: Session;
  lastTTRB: Awaited<ReturnType<typeof getLastTTRB>>;
}) {
  const friends = await getFriends(session.user.id);

  const reBeals = await getReBeals(friends, lastTTRB.announcedAt);

  return (
    <>
      <RefreshBanner initialCount={reBeals.length} />

      <main className="flex flex-col gap-5">
        {friends.length === 0 ? (
          <div className="text-zinc-400 h-32 w-full flex justify-center items-center">
            add some frineds to see their reBeals in your feed
          </div>
        ) : reBeals.length === 0 ? (
          <div className="text-zinc-400 h-32 w-full flex justify-center items-center">
            your friends have not posted yet
          </div>
        ) : (
          reBeals
            .sort((a, b) => b.postedAt.toMillis() - a.postedAt.toMillis())
            .map((reBeal) => (
              <ReBeal
                key={reBeal.id}
                rebeal={reBeal}
                ttrb={lastTTRB.announcedAt}
              />
            ))
        )}
      </main>
    </>
  );
}

const ReBeal = ({
  rebeal,
  ttrb,
}: {
  rebeal: Awaited<ReturnType<typeof getReBeals>>[0];
  ttrb: Date;
}) => {
  const profileURL = `/app/users/${rebeal.user.id}`;
  return (
    <div>
      <div className="relative w-full p-2 pl-4 flex justify-between h-14 aspect-square">
        <div className="flex gap-2">
          <Link href={profileURL} className="h-18">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rounded-full h-full aspect-square"
              src={
                rebeal.user.image || getDicebearImage(rebeal.user.name || "")
              }
              alt={`${rebeal.user.name || ""}'s profile picture`}
            />
          </Link>

          <div className="flex flex-col gap-1">
            <div className="h-[50%] ">
              <Link href={profileURL}>{rebeal.user.name}</Link>
            </div>
            <div className="h-[50%] text-zinc-400 text-xs">
              {new Date(rebeal.postedAt.seconds * 1000).toLocaleTimeString(
                "DE-de"
              )}{" "}
              {rebeal.postedAt.toDate().toLocaleDateString("DE-de", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              ({getLateness(ttrb, rebeal.postedAt.toDate())})
            </div>
          </div>
        </div>

        <DropDown
          buttonContent={
            <Image src={VerticalDots} alt="" className="h-4/6 w-4/6 invert" />
          }
          items={[
            <Link
              className="w-full h-full flex gap-2"
              key="profile"
              href={profileURL}
            >
              <Image src={ProfileIcon} alt="profile icon" className="invert" />
              Show profile
            </Link>,
            <ShareButton
              className="w-full bg-transparent rounded-none justify-start gap-2 h-6"
              key="share"
              url={profileURL}
              whiteIcon
            >
              Share profile
            </ShareButton>,
            <Link
              className="w-full h-full flex gap-2 text-red-500 font-bold"
              key="profile"
              href={`/app/users/${rebeal.user.id}`}
            >
              <Image src={ReportIcon} alt="report icon" className="invert" />
              {/* TODO: add report functionality */}
              Report ReBeal
            </Link>,
          ]}
        />
      </div>

      <ReBealImageViewer images={rebeal.images} />

      <div className="p-2 pl-4">
        <Link href={`/app/rebeals/${rebeal.id}`} className="text-zinc-400">
          {rebeal.commentsCount === 0
            ? "Leave a comment..."
            : `view ${rebeal.commentsCount} comments...`}
        </Link>
      </div>
    </div>
  );
};
