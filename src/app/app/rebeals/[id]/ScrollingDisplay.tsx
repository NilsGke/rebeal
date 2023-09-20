"use client";

import { ReBeal } from "@/app/types";
import ReBealImageViewer from "@/components/RebealImageViewer";
import { useEffect, useRef } from "react";

const offset = 68;
const max = 443;

export default function ScrollingDisplay({
  images,
}: {
  images: ReBeal["images"];
}) {
  const spacerRef = useRef<HTMLDivElement>(null);

  const callback = () => {
    const spacer = spacerRef.current;
    if (spacer === null) return;
    const rect = spacer.getBoundingClientRect();
    const height = Math.abs(rect.y - offset);
    spacer.style.height =
      (height >= 0 ? (height <= max ? height : max) : 0) + "px";
  };

  useEffect(() => {
    callback();
    document.addEventListener("scroll", callback);
    return () => document.removeEventListener("scroll", callback);
  }, []);

  return (
    <div className="relative aspect-[3/4] flex flex-col h-full">
      <div className=" h-0" ref={spacerRef} />
      <div className="relative flex justify-center items-center w-full flex-grow  h-auto overflow-hidden">
        <ReBealImageViewer
          className="absolute max-h-full w-auto"
          images={images}
        />
      </div>
    </div>
  );
}
