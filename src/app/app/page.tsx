import Link from "next/link";
import serverAuth from "@/helpers/serverComponentAuth";
import ReBealList from "../ReBealList";
import PeopleIcon from "@/../public/assets/people.svg";
import AccountIcon from "@/../public/assets/profile.svg";
import Image from "next/image";
import getFriends from "@/firebase/server/getFriends";

export default async function App() {
  const session = await serverAuth();

  if (!session || session.user === undefined)
    return <p>you need to log in to use this app</p>;

  const friends = await getFriends(session.user.id);

  return (
    <>
      <header className="sticky w-full max-w-3xl top-2 p-3 flex flex-row justify-center items-center">
        <Link className="absolute left-3" href="/app/friends">
          <Image className="invert" src={PeopleIcon} alt="friends icon" />
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
            <Image className="invert" src={AccountIcon} alt="account icon" />
          )}
        </Link>
      </header>

      <main>
        <ReBealList user={session.user} friendIds={friends} />
      </main>

      <Link
        className="absolute bottom-5 left-[calc(50%-(5rem/2))] rounded-full h-20 w-20 border-4 active:bg-white"
        href="app/upload"
      ></Link>
    </>
  );
}
