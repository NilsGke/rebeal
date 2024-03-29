import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthRequiredError } from "@/helpers/authRequiredException";
import getDicebearImage from "@/helpers/dicebear";
import LogoutButton from "./_LogoutButton";
import BackButton from "@/components/BackButton";
import InstallPrompt from "../../InstallPrompt";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session === null || session.user === undefined)
    throw new AuthRequiredError();

  return (
    <div>
      <header className="relative w-full h-14 max-w-3xl p-3 pt-5 flex flex-row justify-start items-center z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          <BackButton />

          <h1 className="">Settings</h1>
        </div>
      </header>

      <main className="p-3 flex flex-col flex-nowrap gap-1 ">
        <div className="p-3 rounded-xl bg-zinc-900 flex flex-row justify-start items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rounded-full h-16 w-16"
            src={
              session.user.image || getDicebearImage(session.user.name || "")
            }
            alt="your profile picture"
          />
          <div className="text-xl font-semibold">{session.user.name}</div>
        </div>

        <InstallPrompt
          noCancel
          ignoreUserHidden
          className="mt-1 p-6 rounded-xl bg-zinc-900 flex-nowrap border-none w-full"
        />

        <Block title="FEATURES">
          <Link href={"/app/profile/settings/saveMemories"}>Memories</Link>
          <HR />
          <Link href={""}>Music</Link>
        </Block>
        <Block title="SETTINGS">
          <Link href={"/app/profile/settings/notifications"}>
            Notifications
          </Link>
          <HR />
          <Link href={""}>Other</Link>
        </Block>
        <Block title="ABOUT">
          <Link href={process.env.NEXTAUTH_URL || "/"}>Home Page</Link>
          <HR />
          <Link target="_blank" href="https://github.com/NilsGke/rebeal">
            Github
          </Link>
        </Block>
        <Block title="ACTIONS">
          <LogoutButton />
        </Block>
      </main>
    </div>
  );
};

const HR = () => <hr className="border-zinc-700" />;

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <h2 className="text-xs mt-2 font-bold">{title}</h2>
      <div className="p-3 rounded-xl bg-zinc-900 flex flex-col gap-3 flex-nowrap">
        {children}
      </div>
    </>
  );
};

export default Page;
