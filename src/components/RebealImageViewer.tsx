"use client";

import { ReBeal } from "@/app/types";

export default function ReBealImageViewer({
  images,
}: {
  images: ReBeal["images"];
}) {
  return (
    <div className="relative w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="rounded-2xl w-full max-w-screen-lg"
        src={images.environment}
        alt="environment image"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="rounded-xl absolute top-4 left-4 h-40 border-2 border-black"
        src={images.selfie}
        alt="selfie"
      />
    </div>
  );
}
