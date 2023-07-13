"use client"; // Error components must be Client Components

import { AuthRequiredError } from "@/helpers/authRequiredException";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  if (error.stack?.startsWith(AuthRequiredError.name))
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <h2>you need to login to use this app</h2>
        <button
          onClick={() => signIn()}
          className="p-2 border rounded-lg text-white transition hover:bg-gray-100 hover:text-black"
        >
          login / signup
        </button>
      </div>
    );

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
      <Link href={"/"}>Home Page</Link>
    </div>
  );
}
