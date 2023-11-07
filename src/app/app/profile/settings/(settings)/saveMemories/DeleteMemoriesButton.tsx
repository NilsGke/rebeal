"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import CloseIcon from "@/../public/assets/closeIcon.svg";
import toast from "react-simple-toasts";
import { twMerge } from "tailwind-merge";
import LoadingCircle from "@/components/LoadingCircle";
import useClickOutside from "@/hooks/useClickOutside";

export default function DeleteMemoriesButton({
  reBealsCount: defaultReBealsCount,
}: {
  reBealsCount: number;
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [reBealsCount, setReBealsCount] = useState(defaultReBealsCount);

  const deleteMemories = () => {
    setLoading(true);
    fetch("/api/settings/deleteMemories", {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) throw Error(await res.text());
        setDisabled(true);
        toast("✅ Memories deleted!");
        setLoading(false);
        setPopupOpen(false);
        setReBealsCount(0);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast("❌ Something went wrong!");
      });
  };

  const popupContentRef = useClickOutside(
    () => !loading && setPopupOpen(false)
  );

  return (
    <>
      <>
        <h2>Delete all your past ReBeals ({reBealsCount})</h2>
        <button
          onClick={() => setPopupOpen((prev) => !prev)}
          disabled={disabled}
          className={twMerge(
            "text-red-400 border-2 border-red-400 rounded px-2",
            disabled && "text-zinc-500 border-zinc-500"
          )}
        >
          Delete
        </button>
      </>

      {popupOpen && (
        <div className="absolute top-0 left-0 h-full w-full backdrop-blur-sm backdrop-brightnes-75 flex justify-center items-center p-4">
          <div
            ref={popupContentRef}
            className="relative bg-zinc-900 rounded-xl p-5 flex flex-col gap-4"
          >
            {loading ? (
              <LoadingCircle />
            ) : (
              <>
                <button
                  className="absolute top-3 right-3 w-8 h-8 flex justify-center items-center rounded-full"
                  autoFocus
                  onClick={() => setPopupOpen(false)}
                >
                  <Image className="invert w-3/5" src={CloseIcon} alt="close" />
                </button>

                <h2 className="w-full text-center text-2xl">Are you sure?</h2>
                <p>
                  Deleting your memories cannot be undone. <br /> All Your past
                  ReBeals will be deleted forever!
                </p>

                <div className="w-full flex justify-center items-center gap-4">
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="rounded px-2 py-1 border border-white"
                  >
                    cancel
                  </button>
                  <button
                    onClick={deleteMemories}
                    className="rounded px-2 py-1 border border-red-400 text-red-400"
                  >
                    delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
