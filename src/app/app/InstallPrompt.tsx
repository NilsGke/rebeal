"use client";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import CloseIcon from "@/../public/assets/closeIcon.svg";
import { twMerge } from "tailwind-merge";
import isStandalone from "@/helpers/isStandalone";

enum State {
  hidden,
  accepted,
  visible,
  dismissed,
}

/**
 *
 * @param aggressive checks on initial render if app is PWA or not (uses `isStandalone` function)
 */
export default function InstallPrompt({
  className = "",
  noCancel = false,
  ignoreUserHidden = false,
}: {
  className?: string;
  noCancel?: boolean;
  ignoreUserHidden?: boolean;
}) {
  const userHidden = ignoreUserHidden
    ? false
    : Date.now() - parseInt(localStorage.getItem("hidePWAPrompt") || "0") <
      1000 * 60 * 60 * 24 * 7;

  const [state, setState] = useState<State>(
    !isStandalone() ? State.visible : State.hidden
  );
  const defferedPrompt = useRef<BeforeInstallPromptEvent>();

  useEffect(() => {
    const beforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      defferedPrompt.current = e as BeforeInstallPromptEvent;
      setState(State.visible);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
  }, []);

  const prompt = async () => {
    if (defferedPrompt.current === undefined) return;
    defferedPrompt.current.prompt();
    const choice = await defferedPrompt.current.userChoice;
    if (choice.outcome === "accepted") setState(State.accepted);
  };

  const cancel = () => {
    setState(State.dismissed);
    localStorage.setItem("hidePWAPrompt", Date.now().toString());
  };
  const hide = () => setState(State.hidden);

  let content: ReactNode | null = null;

  if (userHidden) return null;

  if (state === State.visible)
    content = (
      <>
        <div className="w-full flex justify-around gap-2">
          <h2 className="text-xl">Do you want to download the app?</h2>
        </div>
        {!noCancel && (
          <button
            onClick={hide}
            className="absolute top-1 right-1 h-6 aspect-square text-zinc-500 grid place-items-center"
          >
            <Image className="invert" src={CloseIcon} alt="close" />
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          {!noCancel && (
            <button
              onClick={cancel}
              className="border border-zinc-300  rounded-md p-1 flex justify-between gap-2"
            >
              Nope
            </button>
          )}
          <button
            onClick={prompt}
            className={twMerge(
              "bg-zinc-100 text-black rounded-md p-1 flex justify-between gap-2",
              noCancel && "col-span-2 px-5"
            )}
          >
            Install
          </button>
        </div>
      </>
    );

  if (state === State.accepted)
    content = (
      <>
        <div className="w-full flex justify-around gap-2">
          <h2 className="text-xl">Thank you for installing! ✅</h2>
        </div>
      </>
    );

  if (state === State.dismissed)
    content = (
      <>
        <div className="w-full flex justify-around gap-2">
          <h2 className="text-sm">
            You can always install the app in the settings (in your profile)
          </h2>
        </div>
      </>
    );

  if (state === State.hidden || content === null) return null;

  return (
    <div className="w-full flex justify-center">
      <div
        className={twMerge(
          "relative p-6 border rounded-xl border-zinc-600 flex gap-3 flex-col items-center justify-center",
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}
