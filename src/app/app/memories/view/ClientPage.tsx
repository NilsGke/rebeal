"use client";

import { ReBeal } from "@/app/types";
import RebealCarousel from "./Carousel";
import BackButton from "@/components/BackButton";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { z } from "zod";

export default function ClientPage({
  reBeals,
}: {
  reBeals: (Omit<ReBeal, "user" | "postedAt"> & { postedAt: Date })[];
}) {
  const [activeReBeal, setActiveReBeal] = useState<
    (typeof reBeals)[number] | null
  >(null);

  const params = useSearchParams();
  const d = params.get("d");
  // 12/24/2023
  // mm/dd/yyyy

  let date: Date;
  if (
    d !== undefined &&
    typeof d === "string" &&
    /^[0-9]+\/[0-9]+\/[0-9]+$/.test(d)
  )
    date = new Date(d);
  else date = new Date();

  const activeIndex = reBeals.findIndex(
    (reBeal) => reBeal.postedAt.toLocaleDateString("en-US") === d
  );
  const startAt = activeIndex === -1 ? reBeals.length : activeIndex;

  return (
    <>
      <header className="relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-between items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <BackButton
            to="/app/memories"
            className="flex gap-3 justify-center items-center"
          >
            <span className="flex items-center justify-center">Memories</span>
          </BackButton>
          {activeReBeal?.postedAt.toLocaleDateString()}
        </div>
      </header>

      <RebealCarousel
        activeReBealCallback={(reBeal) => setActiveReBeal(reBeal)}
        reBeals={reBeals}
        startAt={startAt}
      />
    </>
  );
}
