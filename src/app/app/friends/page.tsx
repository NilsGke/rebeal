import Image from "next/image";
import Link from "next/link";
import BackArrow from "@/../public/assets/backArrow.svg";
import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import { DocumentReference } from "firebase-admin/firestore";
import { UserDoc, isUserDoc } from "@/firebase/firestore/types";
import FriendList from "./friendList";

const page = async ({
  searchParams,
}: {
  searchParams: {
    search?: string;
  };
}) => {
  const searchQuery = searchParams.search;
  const firestore = admin.firestore();

  console.log("\x1b[33m", { searchQuery }, "\x1b[0m");

  // search users
  const searchPromise =
    searchQuery === undefined || searchQuery === ""
      ? new Promise<UserDoc[]>((r) => r([]))
      : searchUsers(firestore, searchQuery);

  // friends
  const friendsPromise = getFriends(firestore, searchQuery);

  const [searchResults, { friends, incoming, outgoing }] = await Promise.all([
    searchPromise,
    friendsPromise,
  ]);

  const [friendIds, incomingIds, outgoingIds] = [
    friends.map((u) => u.id),
    incoming.map((u) => u.id),
    outgoing.map((u) => u.id),
  ];
  const filteredResults = searchResults.filter(
    (user) =>
      !friendIds.includes(user.id) &&
      !incomingIds.includes(user.id) &&
      !outgoingIds.includes(user.id)
  );

  return (
    <div className="w-full h-full">
      <header className="sticky w-full max-w-3xl top-2 p-3 flex flex-row justify-center items-center">
        <h1 className="text-2xl">ReBeal.</h1>
        <Link
          href="/app"
          className="absolute right-3 flex justify-center items-center"
        >
          <Image
            className="invert h-5 w-5 rotate-180"
            src={BackArrow}
            alt="back arrow"
          />
        </Link>
      </header>

      <main>
        <FriendList
          searchResults={filteredResults}
          friends={friends}
          incoming={incoming}
          outgoing={outgoing}
        />
      </main>
    </div>
  );
};

export default page;

const getFriends = async (
  firestore: admin.firestore.Firestore,
  searchQuery: string | undefined
) => {
  const session = await serverAuth();
  const ownDocument = firestore.doc(`users/${session.user.id}`);

  const friendshipDocs = (
    await Promise.all([
      firestore
        .collection("friends")
        .where("a", "==", ownDocument)
        .get()
        .then((s) => s.docs),
      firestore
        .collection("friends")
        .where("b", "==", ownDocument)
        .get()
        .then((s) => s.docs),
    ])
  )
    .flat()
    .map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as {
          a: DocumentReference;
          b: DocumentReference;
          pending: boolean;
          id: string;
        })
    );

  const incomingRequests = friendshipDocs.filter(
    (doc) => doc.pending && doc.b.id === ownDocument.id
  );
  const outgoingRequests = friendshipDocs.filter(
    (doc) => doc.pending && doc.a.id === ownDocument.id
  );
  const friendships = friendshipDocs.filter(
    (doc) =>
      !doc.pending &&
      (doc.a.id === ownDocument.id || doc.b.id === ownDocument.id)
  );

  const noDocs =
    incomingRequests.length + outgoingRequests.length + friendships.length ===
    0;

  const friendRefs = noDocs
    ? []
    : await firestore.getAll(
        ...incomingRequests.map((r) => r.a),
        ...outgoingRequests.map((r) => r.b),
        ...friendships.map((r) => (r.a.id === ownDocument.id ? r.b : r.a))
      );

  let friendDocs = friendRefs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as UserDoc)
  );
  if (searchQuery)
    friendDocs = friendDocs.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const friends = friendships
    .map((doc) =>
      friendDocs.find(
        (user) => user.id === (doc.a.id === ownDocument.id ? doc.b : doc.a).id
      )
    )
    .filter(isUserDoc);
  const incoming = incomingRequests
    .map((doc) => friendDocs.find((friendship) => doc.a.id === friendship.id))
    .filter(isUserDoc);
  const outgoing = outgoingRequests
    .map((doc) => friendDocs.find((friendship) => doc.b.id === friendship.id))
    .filter(isUserDoc);

  return {
    friends,
    incoming,
    outgoing,
  };
};

const searchUsers = async (
  firestore: admin.firestore.Firestore,
  searchQuery: string
) => {
  const users = await firestore
    .collection("users")
    .where("tags", "array-contains", searchQuery.toLowerCase())
    .orderBy("name")
    .limit(12)
    .get();

  return users.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as UserDoc)
  );
};
