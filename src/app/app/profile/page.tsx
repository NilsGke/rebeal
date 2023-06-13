import Link from "next/link";
import BackArrow from "../../../../public/assets/backArrow.svg";
import VerticalDots from "../../../../public/assets/verticalDots.svg";
import LockIcon from "../../../../public/assets/lock.svg";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getDicebearImage from "@/helpers/dicebear";
import ShareButton from "@/components/ShareButton";
import { AuthRequiredError } from "@/helpers/authRequiredException";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session === null || session.user === undefined)
    throw new AuthRequiredError();

  return (
    <>
      <header className="relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-between items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <Link href="/app" className="flex justify-center items-center">
            <Image
              className="invert h-5 w-5"
              src={BackArrow}
              alt="back arrow"
            />
          </Link>
          <span className="flex items-center justify-center">
            {session.user.name}
          </span>
        </div>
        <Link href="/app/profile/settings">
          <Image
            className="invert h-5 w-5"
            src={VerticalDots}
            alt="settings-dots"
          />
        </Link>
      </header>

      <main className="relative w-full h-full -translate-y-14 -z-0">
        <div className="w-full aspect-[10/9] grid grid-cols-1 grid-rows-1 -top-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full row-start-1 row-end-2 col-start-1 col-end-2 grid-rows-1 aspect-square brightness-50 -z-20"
            src={
              session.user.image ?? getDicebearImage(session.user.name || "")
            }
            alt="your profile picture"
          />
          <div className="w-full aspect-square row-start-1 row-end-2 col-start-1 col-end-2 grid-rows-1 -z-10 bg-gradient-to-b from-black/60 via-transparent via-20% to-transparent" />
          <div className="w-full aspect-square row-start-1 row-end-2 col-start-1 col-end-2 grid-rows-1 -z-10 bg-gradient-to-b from-transparent via-transparent via-80% to-black" />
        </div>

        <div className="relative p-3 flex justify-between items-center">
          <h1 className="text-4xl ">{session.user.name}</h1>
          <ShareButton url={`users/${session.user.name}`} />
        </div>

        <section className="p-3">
          <header className="flex justify-between items-center">
            <h2 className="text-xl">Your Memories</h2>
            <span className="text-xs flex justify-center items-center gap-1 opacity-50">
              <Image
                src={LockIcon}
                alt="lock-icon"
                className="invert opacity-90"
              />
              Only visible for you
            </span>
          </header>
        </section>
      </main>
    </>
  );
}
