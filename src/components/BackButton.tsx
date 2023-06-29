"use client";
import BackArrow from "@/../public/assets/backArrow.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BackButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
  to?: string;
}> = ({ className = "", children, to }) => {
  const router = useRouter();

  return (
    <button
      className={className}
      onClick={to ? () => router.push(to) : router.back}
    >
      <Image className="invert h-5 w-5" src={BackArrow} alt="back arrow" />
      {children}
    </button>
  );
};

export default BackButton;
