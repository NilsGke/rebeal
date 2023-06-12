"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function Home() {
  const { data: session } = useSession();

  console.log(session);

  return (
    <>
      <header className="fixed w-screen p-2 flex justify-center top-0">
        <div className="flex mt-3 justify-between items-center max-w-screen-xl w-full h-full">
          <h1 className="text-4xl">ReBeal.</h1>

          {session === null ? (
            <div>
              <button
                onClick={() => signIn()}
                className="p-2 border rounded-lg text-white transition hover:bg-gray-100 hover:text-black"
              >
                login / signup
              </button>
            </div>
          ) : (
            <div className="">
              <Link
                href="/app"
                className="border rounded-lg p-3 border-gray-700 hover:bg-gray-700"
              >
                go to App <OpenInNewIcon />
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-col items-center justify-between p-24">
        <p>product overview info page</p>
        {/* <pre>{JSON.stringify(session)}</pre> */}
      </main>
    </>
  );
}
