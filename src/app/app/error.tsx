"use client"; // Error components must be Client Components

import { AuthRequiredError } from "@/helpers/authRequiredException";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";

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
    <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
      <h2>Something went wrong!</h2>

      <code className="bg-zinc-800 px-2 py-1 rounded text-red-300">
        {error.message}
      </code>

      <div className="flex justify-center gap-3">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Link href={"/"}>
          <Button>Home Page</Button>
        </Link>
      </div>
    </div>
  );
}

const Button = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) => (
  <button
    className="px-4 py-2 h-12 rounded bg-zinc-900 border border-zinc-600"
    onClick={onClick}
  >
    {children}
  </button>
);
