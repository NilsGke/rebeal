import Link from "next/link";
import VerticalDots from "@/../public/assets/verticalDots.svg";
import LockIcon from "@/../public/assets/lock.svg";
import Image from "next/image";
import getDicebearImage from "@/helpers/dicebear";
import ShareButton from "@/components/ShareButton";
import serverAuth from "@/helpers/serverComponentAuth";
import BackButton from "@/components/BackButton";
import admin from "@/firebase/config";
import { rebealConverter } from "@/app/types";

export default async function Page() {
  const session = await serverAuth();

  const now = Date.now();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  twoWeeksAgo.setHours(0, 0, 0, 0);

  const firestore = admin.firestore();
  const userDoc = firestore.doc(`users/${session.user.id}`);
  const memories = await firestore
    .collection("rebeals")
    .withConverter(rebealConverter)
    .where("user", "==", userDoc)
    .where(
      "postedAt",
      ">=",
      new admin.firestore.Timestamp(Math.round(twoWeeksAgo.getSeconds()), 0)
    )
    .orderBy("postedAt", "desc")
    .limit(14)
    .get()
    .then((snapshot) =>
      snapshot.docs.map((doc) => ({
        ...doc.data(),
        daysAgo: Math.floor(
          Math.abs(now - doc.data().postedAt.seconds * 1000) /
            (1000 * 60 * 60 * 24)
        ),
      }))
    );

  return (
    <>
      <header className="relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-between items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <BackButton className="flex gap-3 justify-center items-center">
            <span className="flex items-center justify-center">
              {session.user.name}
            </span>
          </BackButton>
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
          <ShareButton url={`/app/users/${session.user.id}`} />
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
          <section className="p-5 rounded-xl bg-zinc-900 ">
            The last 14 days
            <div className="mt-3 grid grid-cols-7 gap-2">
              {Array.from(new Array(14)).map((a, index) => {
                const rebeal = memories.find(
                  (memory) => memory.daysAgo === 13 - index
                );

                const date = new Date();
                date.setDate(date.getDate() - (13 - index));

                const border =
                  rebeal !== undefined &&
                  (rebeal.late === undefined || rebeal.late === false);

                return (
                  <div
                    key={index}
                    className={
                      "aspect-[3/4] w-full rounded-md overflow-hidden bg-zinc-800 flex justify-center items-center " +
                      (border ? " border" : "")
                    }
                  >
                    {rebeal === undefined ? null : (
                      <Link
                        href={`app/memories/${date
                          .toLocaleDateString("EN-us", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replaceAll("/", "-")}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          key={index}
                          src={rebeal.images.environment}
                          alt={`rebeal from ${13 - index} days ago`}
                        />
                      </Link>
                    )}
                    <div className="absolute">
                      {date.toLocaleDateString("de-DE").split(".").at(0)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex justify-center items-center mt-5">
              <Link
                href={"app/memories"}
                className="p-2 border-2 border-zinc-700 rounded-md"
              >
                Show all Memories
              </Link>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
