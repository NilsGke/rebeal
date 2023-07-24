import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import SubscriptionButton, { UnsubAllButton } from "./SubscriptionButton";
import { notificationSubscriptionConveriter } from "@/worker/subscribe";
import Subscription from "./Subscription";
import { twMerge } from "tailwind-merge";

const Page = async () => {
  const session = await serverAuth();

  const firestore = admin.firestore();
  const existing = await firestore
    .collection("notification-subscriptions")
    .where("user", "==", firestore.doc(`users/${session.user.id}`))
    .withConverter(notificationSubscriptionConveriter)
    .get();

  return (
    <div>
      <main className="p-3 flex flex-col flex-nowrap gap-1 ">
        <Block title="THIS DEVICE" className="items-center">
          <SubscriptionButton />
        </Block>

        <Block title="ALL NOTIFICATION SUBSCRIPTIONS">
          {existing.docs.map((sub) => {
            const data = sub.data();

            return (
              <Subscription
                key={sub.id}
                subscription={{ ...data, user: data.user.id }}
                createdAt={new Date(sub.createTime.seconds * 1000)}
              />
            );
          })}
          {existing.docs.length === 0 ? (
            <div className="w-full text-center text-zinc-500">
              you have no notification subscriptions
            </div>
          ) : null}

          {existing.docs.length >= 2 ? <UnsubAllButton /> : null}
        </Block>
      </main>
    </div>
  );
};

const Block: React.FC<{
  title: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, children, className = "" }) => {
  return (
    <>
      <h2 className="text-xs mt-2 font-bold">{title}</h2>
      <div
        className={twMerge(
          "p-3 rounded-xl bg-zinc-900 flex flex-col gap-3 flex-nowrap",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};

export default Page;
