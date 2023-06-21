import admin from "@/firebase/config";
import { User, getServerSession } from "next-auth";
import ActualFriendRequestButton from "./FriendRequestButton";
import SignInButton from "./SignInButton";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const revalidate = 60;

const FriendRequestButton: React.FC<{
  to: User["id"];
  small?: boolean;
  className?: string;
}> = async ({ to, small = false, className = "" }) => {
  const session = await getServerSession(authOptions);

  const firestore = admin.firestore();

  if (session === null)
    return (
      <SignInButton
        className={
          "border-2 border-zinc-700 rounded p-2 w-full flex justify-center items-center " +
          className
        }
      >
        sign in to send request
      </SignInButton>
    );

  if (session.user.id === to) redirect("/app/profile");

  const handleDocs = (
    snapshot: admin.firestore.QuerySnapshot<admin.firestore.DocumentData>
  ) => {
    const doc = snapshot.docs.at(0);
    if (doc === undefined || !doc.exists) return undefined;
    else
      return doc.data() as {
        a: admin.firestore.DocumentReference<admin.firestore.DocumentData>;
        b: admin.firestore.DocumentReference<admin.firestore.DocumentData>;
        pending: boolean;
      };
  };

  const [incomingReq, outgoingReq] = await Promise.all([
    firestore
      .collection("friends")
      .where("a", "==", firestore.doc(`users/${to}`))
      .where("b", "==", firestore.doc(`users/${session.user.id}`))
      .get()
      .then(handleDocs),
    firestore
      .collection("friends")
      .where("a", "==", firestore.doc(`users/${session.user.id}`))
      .where("b", "==", firestore.doc(`users/${to}`))
      .get()
      .then(handleDocs),
  ]);

  let incoming = incomingReq !== undefined && incomingReq.pending,
    outgoing = outgoingReq !== undefined && outgoingReq.pending,
    friends =
      (incomingReq !== undefined && !incomingReq.pending) ||
      (outgoingReq !== undefined && !outgoingReq.pending);

  return (
    <ActualFriendRequestButton
      to={to}
      className={className}
      incoming={incoming}
      outgoing={outgoing}
      friends={friends}
      small={small}
    />
  );
};

export default FriendRequestButton;
