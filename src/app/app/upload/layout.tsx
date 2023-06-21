import Link from "next/link";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky w-full max-w-3xl top-2 mb-2 p-3 flex flex-row justify-center items-center">
        <Link className="absolute left-5 text-2xl" href="/app">
          &lt;
        </Link>
        <h1 className="text-2xl">ReBeal.</h1>
        <div />
      </header>
      {children}
    </>
  );
}
