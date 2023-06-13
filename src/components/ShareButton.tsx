"use client";

import Image from "next/image";
import ShareIcon from "../../public/assets/share.svg";

const ShareButton = ({ url }: { url: string }) => {
  const share = () =>
    navigator.share({
      url,
    });
  return (
    <button
      onClick={share}
      className="h-8 aspect-square flex justify-center items-center rounded-full bg-gray-50"
    >
      <Image className="h-5 w-5" src={ShareIcon} alt="share" />
    </button>
  );
};

export default ShareButton;
