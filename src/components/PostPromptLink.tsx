"use client";
import getLateness from "@/helpers/getLateness";
import { Timestamp } from "firebase-admin/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * component to display a button with text to suggest posting a rebeal
 */
export default function PostPromptLink({
  timestamp,
  date,
}: {
  timestamp?: Timestamp;
  date?: Date;
}) {
  const ttrb = timestamp?.toDate() || date;

  if (ttrb === undefined) throw Error("postPromitLink did not get the TTRB");

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const update = () => setCurrentTime(new Date());
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const deltaTime = currentTime.getTime() - ttrb.getTime();
  const withinTwoMinutes = deltaTime <= 120_000;

  return (
    <Link href="/app/upload" className="bg-white rounded text-black m-2 p-2">
      {withinTwoMinutes ? "post Your ReBeal" : "post a late ReBeal"}
    </Link>
  );
}
