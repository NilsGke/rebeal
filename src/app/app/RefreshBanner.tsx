"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function RefreshBanner({
  initialCount,
}: {
  initialCount: number;
}) {
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const check = () =>
      fetch("/api/newReBeals/count", { cache: "no-store" })
        .then((res) => res.json())
        .then((data: { count: number }) => {
          if (data.count > initialCount) setVisible(true);
        });

    const interval = setInterval(check, 1000 * 10);

    return () => clearInterval(interval);
  }, [initialCount]);

  const reload = () => {
    router.refresh();
    setVisible(false);
  };

  return (
    <button
      onClick={reload}
      className={twMerge(
        "fixed top-16 w-44 h-9 rounded-full left-[calc(50%-11rem/2)] bg-zinc-700 z-20 transition-all",
        visible ? "opacity-100 top-16" : "opacity-0 top-0"
      )}
    >
      new ReBeals!
    </button>
  );
}
