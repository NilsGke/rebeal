import { ReBeal, rebealConverter } from "@/app/types";
import BackButton from "@/components/BackButton";
import ReBealImageViewer from "@/components/RebealImageViewer";
import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type Month = {
  year: number;
  month: number;
  rebeals: ReBeal[];
};

export default async function Memories() {
  const session = await serverAuth();

  const firestore = admin.firestore();
  const userDoc = firestore.doc(`users/${session.user.id}`);
  const rebeals = await firestore
    .collection("rebeals")
    .where("user", "==", userDoc)
    .withConverter(rebealConverter)
    .get()
    .then((snapshot) =>
      snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          timeStamp: doc.data().postedAt.toDate(),
        }))
        .sort((a, b) => a.postedAt.seconds - b.postedAt.seconds)
    );

  const months: Month[] = [];

  rebeals.forEach((rebeal) => {
    const month = rebeal.timeStamp.getMonth();
    const year = rebeal.timeStamp.getFullYear();

    const existing = months.find(
      (enty) => enty.year === year && enty.month === month
    );

    if (existing === undefined)
      months.push({
        year,
        month,
        rebeals: [rebeal],
      });
    else existing.rebeals.push(rebeal);
  });

  const sortedMonths = months.sort(
    (a, b) => a.year + a.month / 100 - b.year + b.month / 100
  );

  return (
    <>
      <header className="relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-between items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <BackButton
            to="/app/profile"
            className="flex gap-3 justify-center items-center"
          >
            <span className="flex items-center justify-center">Memories</span>
          </BackButton>
        </div>
      </header>

      <main className="h-[calc(100vh-56px)] overflow-y-scroll flex flex-col-reverse">
        {sortedMonths.reverse().map((month) => (
          <Month month={month} key={month.year + month.month / 100} />
        ))}
      </main>
    </>
  );
}

const Month = ({ month }: { month: Month }) => {
  const date = new Date(month.year, month.month, 1); // 2009-11-10
  const monthName = date.toLocaleString("EN", { month: "long" });
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const firstDay = date.getDay();

  const entries: (ReBeal | number | { placeholder: true })[] = [
    ...Array.from(Array(firstDay)).map(() => ({
      placeholder: true as const,
    })),
    ...Array.from(Array(new Date(month.year, month.month, 0).getDate())).map(
      (a, index) =>
        month.rebeals.find(
          (rebeal) => rebeal.postedAt.toDate().getDay() === index + 1
        ) || index
    ),
  ];

  const isPlaceholder = (obj: Object): obj is { placeholder: true } =>
    obj.hasOwnProperty("placeholder");

  return (
    <div className="w-full p-4">
      <h2 className="text-sm">
        {monthName} {month.year}
      </h2>
      <div className="grid gap-2 grid-cols-7 items-center">
        {days.map((d) => (
          <span key={d} className="text-xs w-min justify-self-center">
            {d}
          </span>
        ))}
        {entries.map((entry, index) => {
          if (typeof entry === "number")
            return (
              <div className="aspect-[3/4] flex justify-center items-center text-zinc-400">
                {index}
              </div>
            );
          if (isPlaceholder(entry)) return <span />;

          const date = entry.postedAt.toDate();

          return (
            <div
              key={entry.id}
              className={twMerge(
                "rounded aspect-[3/4] flex justify-center items-center overflow-hidden",
                !entry.late && "border"
              )}
            >
              <Link
                href={`app/memories/view?d=${date.toLocaleDateString("en-US")}`}
              >
                <ReBealImageViewer
                  className=""
                  images={entry.images}
                  envClassName="rounded-none"
                  selfieClassName="rounded border"
                  padding={4}
                  disabled
                  lazy
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
