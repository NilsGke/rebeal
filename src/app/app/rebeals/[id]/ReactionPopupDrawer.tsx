"use client";

import Image from "next/image";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import CloseIcon from "@/../public/assets/closeIcon.svg";
import { twMerge } from "tailwind-merge";

const fadeoutTime = 300;

export default function Drawer({
  children,
  trigger,
  className = "",
  drawerClassName = "",
}: {
  children: ReactNode;
  trigger: ReactNode;
  className?: string;
  drawerClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (open === false) {
      setOpen(true);
      setTransition(false);
    } else {
      setTransition(false);
      setTimeout(() => setOpen(false), fadeoutTime);
    }
  };

  useEffect(() => setTransition(open), [open]);

  const overlayRef = useRef<HTMLDivElement>(null);

  const clickOutside = (e: MouseEvent) =>
    e.target === overlayRef.current && toggle();

  const [transition, setTransition] = useState(false);

  return (
    <>
      <button className={className} onClick={toggle}>
        {trigger}
      </button>
      {open && (
        <div
          ref={overlayRef}
          onClick={clickOutside}
          className={twMerge(
            "fixed z-50 top-0 left-0 h-screen w-screen backdrop-brightness-100",
            transition && "backdrop-brightness-50"
          )}
        >
          <div
            className={twMerge(
              "absolute -bottom-[100%] left-0 w-full transition-all ",
              transition && "bottom-0"
            )}
          >
            <div
              className={twMerge(
                "relative h-auto w-full pt-10 rounded-t-3xl bg-zinc-800",
                drawerClassName
              )}
            >
              <button
                onClick={toggle}
                className="absolute h-8 w-8 aspect-square top-4 right-4"
              >
                <Image
                  className="invert h-4/5 w-4/5"
                  src={CloseIcon}
                  alt="close"
                />
              </button>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
