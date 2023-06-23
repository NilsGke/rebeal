"use client";
import { User } from "next-auth";
import useReBeals from "@/hooks/useReBeals";
import Image from "next/image";

const ReBealList = ({
  user,
  friendIds,
}: {
  user: User;
  friendIds: string[];
}) => {
  console.log({ friendIds });
  const {
    reBeals: rebeals,
    newAvalible,
    showNewReBeals,
  } = useReBeals(user.id, friendIds);

  return (
    <>
      <div>
        {newAvalible ? (
          <button onClick={showNewReBeals}>load new</button>
        ) : null}
        {rebeals.map((rebeal) => (
          <div key={rebeal.id}>
            <div>{rebeal.user.id}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rebeal.images.environment}
              alt={rebeal.user.id + "'s environment image"}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ReBealList;
