"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function App() {
  const { data: session } = useSession();

  if (!session || session.user === undefined)
    return <p>you need to log in to use this app</p>;

  return (
    <>
      <header className="sticky w-full max-w-3xl top-2 p-3 flex flex-row justify-center items-center">
        <Link className="absolute left-3" href="/app/friends">
          <PeopleIcon />
        </Link>
        <h1 className="text-2xl">ReBeal.</h1>
        <Link className="absolute right-3" href="/app/profile">
          {typeof session.user.image === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              className="h-30 w-8 h-8 rounded-full"
              alt="your profile picture"
            />
          ) : (
            <AccountCircleIcon />
          )}
        </Link>
      </header>
      <main></main>
      <Link
        className="absolute bottom-5 left-[calc(50%-(5rem/2))] rounded-full h-20 w-20 border-4 active:bg-white"
        href="app/upload"
      ></Link>
    </>
  );
}
