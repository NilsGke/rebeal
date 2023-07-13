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

export default async function App() {
  const session = await serverAuth();

  if (!session || session.user === undefined)
    return <p>you need to log in to use this app</p>;

  const friends = await getFriends(session.user.id);

  const reBeals = await getReBeals(friends);

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

      <NotificationPermissionBanner />

      <RefreshBanner initialCount={reBeals.length} />

      <main className="flex flex-col gap-5">
        {reBeals.map((reBeal) => (
          <ReBeal key={reBeal.id} rebeal={reBeal} />
        ))}
      </main>

      <Link
        className="fixed bottom-2 left-[calc(50%-(5rem/2))] rounded-full h-[85px] w-[85px] border-[6px] active:bg-white"
        href="app/upload"
      ></Link>
    </>
  );
}

const ReBeal = ({
  rebeal,
}: {
  rebeal: Awaited<ReturnType<typeof getReBeals>>[0];
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

          <div>
            <div className="h-[50%] ">
              <Link href={profileURL}>{rebeal.user.name}</Link>
            </div>
            <div className="h-[50%] text-zinc-400 text-sm">
              {new Date(rebeal.postedAt.seconds * 1000).toLocaleTimeString(
                "DE-de"
              )}
            </div>
          </div>
        </div>

        {/* show profile */}
        {/* share profile */}
        {/* report rebeal */}
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
