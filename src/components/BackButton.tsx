"use client";
import BackArrow from "@/../public/assets/backArrow.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BackButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = "", children }) => {
  const router = useRouter();

  return (
    <button className={className} onClick={router.back}>
      <Image className="invert h-5 w-5" src={BackArrow} alt="back arrow" />
      {children}
    </button>
  );
};

export default BackButton;
