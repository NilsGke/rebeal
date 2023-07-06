import BackButton from "@/components/BackButton";
import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import SubscriptionButton from "./SubscriptionButton";

const Page = async () => {
  const session = await serverAuth();

  const firestore = admin.firestore();
  const existing =
    (
      await firestore
        .collection("notification-subscriptions")
        .where("user", "==", firestore.doc(`users/${session.user.id}`))
        .count()
        .get()
    ).data().count > 0;

  return (
    <div>
      <main className="p-3 flex flex-col flex-nowrap gap-1 ">
        <Block title="NOTIFICATION SUBSCRIPTION">
          <SubscriptionButton existingSubscription={existing} />
        </Block>
      </main>
    </div>
  );
};

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
