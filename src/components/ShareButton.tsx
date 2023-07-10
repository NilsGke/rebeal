"use client";

import Image from "next/image";
import ShareIcon from "../../public/assets/share.svg";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const ShareButton = ({
  url,
  children,
  className = "",
  whiteIcon = false,
}: {
  url: string;
  children?: ReactNode;
  className?: string;
  whiteIcon?: boolean;
}) => {
  const share = () =>
    navigator.share({
      url,
    });
  return (
    <button
      onClick={share}
      className={twMerge(
        "h-8 aspect-square flex justify-center items-center rounded-full bg-gray-50",
        className
      )}
    >
      <Image
        className={"h-5 w-5" + (whiteIcon ? " invert" : "")}
        src={ShareIcon}
        alt="share"
      />{" "}
      {children}
    </button>
  );
};

export default ShareButton;
