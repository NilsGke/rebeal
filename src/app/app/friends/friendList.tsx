import ActualFriendRequestButton from "@/components/FriendRequestButton";
import SearchBar from "@/components/SearchBar";
import { UserDoc } from "@/firebase/firestore/types";
import serverAuth from "@/helpers/serverComponentAuth";
import Link from "next/link";

const FriendList: React.FC<{
  searchResults: UserDoc[];
  friends: UserDoc[];
  incoming: UserDoc[];
  outgoing: UserDoc[];
}> = async ({ searchResults, friends, incoming, outgoing }) => {
  const session = await serverAuth();
  return (
    <div className="p-3">
      <SearchBar />

      {incoming.length > 0 ? (
        <div>
          <Heading>INCOMING</Heading>
          {incoming.map((user) => (
            <User data={user} key={user.id} isIncoming />
          ))}
        </div>
      ) : null}

      {outgoing.length > 0 ? (
        <details>
          <Heading toggle>SENT</Heading>
          {outgoing.map((user) => (
            <User data={user} key={user.id} isOutgoing />
          ))}
        </details>
      ) : null}

      {friends.length > 0 ? (
        <div>
          <Heading>MY FRIENDS</Heading>
          {friends.map((friend) => (
            <User data={friend} key={friend.id} isFriend />
          ))}
        </div>
      ) : null}

      {searchResults.length > 0 ? (
        <div>
          <Heading>RESULTS</Heading>
          {searchResults.map((user) => (
            <User
              data={user}
              key={user.id}
              isSessionUser={user.id === session.user.id}
              isStranger
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Heading: React.FC<{ children?: React.ReactNode; toggle?: boolean }> = ({
  children,
  toggle,
}) => (
  <summary
    className={
      "text-zinc-500 text-xs font-bold mt-4 mb-2 " +
      (toggle ? " hover:cursor-pointer" : " list-none")
    }
  >
    {children}
  </summary>
);

const User: React.FC<{
  data: UserDoc;
  isFriend?: boolean;
  isIncoming?: boolean;
  isOutgoing?: boolean;
  isStranger?: boolean;
  isSessionUser?: boolean;
}> = ({
  data: friend,
  isFriend = false,
  isIncoming = false,
  isOutgoing = false,
  isStranger = false,
  isSessionUser = false,
}) => {
  console.log(isIncoming);
  return (
    <Link
      href={`/app/users/${friend.id}`}
      className="mb-2 grid grid-cols-[3rem_auto_4rem] gap-4  items-center "
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="rounded-full h-12 w-h-12"
        src={friend.image}
        alt={friend.name + "'s profile picture"}
      />
      <span className="flex items-center">
        {friend.name}
        {isSessionUser ? " (you)" : null}
      </span>

      <div className="grid place-items-end">
        {isFriend ? (
          <ActualFriendRequestButton to={friend.id} friends small />
        ) : null}

        {isIncoming ? (
          <ActualFriendRequestButton to={friend.id} incoming small />
        ) : null}

        {isOutgoing ? (
          <ActualFriendRequestButton to={friend.id} outgoing small />
        ) : null}

        {isStranger && !isSessionUser ? (
          <ActualFriendRequestButton to={friend.id} small />
        ) : null}
      </div>
    </Link>
  );
};

export default FriendList;
