import Link from "next/link";
import BackArrow from "../../../../public/assets/backArrow.svg";
import VerticalDots from "../../../../public/assets/verticalDots.svg";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getDicebearImage from "@/helpers/dicebear";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session === null || session.user === undefined)
    return "you need to login";

  return (
    <>
      <header className="fixed mt-2 w-[calc(100%-2*0.75rem)] max-w-3xl top-0 p-3 flex flex-row justify-between items-center z-10">
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

      <main className="w-full h-full">
        <div className="w-full aspect-square grid grid-cols-1 grid-rows-1">
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
      </main>
    </>
  );
}
