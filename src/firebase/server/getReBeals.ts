import { Reaction, reactionConverter, rebealConverter } from "@/app/types";
import admin from "../config";
import getUsers from "./getUsers";
import { Timestamp } from "firebase-admin/firestore";

const firestore = admin.firestore();

export default async function getReBeals(
  userIds: string[],
  fromTimestamp?: Timestamp | Date
) {
  if (userIds.length === 0) return [];

  // convert Date to Timestamp
  fromTimestamp =
    fromTimestamp instanceof Date
      ? Timestamp.fromDate(fromTimestamp)
      : fromTimestamp;

  fromTimestamp = fromTimestamp || Timestamp.fromDate(new Date(0));

  const userDocs = userIds.map((id) => firestore.doc(`users/${id}`));

  const rebeals = (
    await firestore
      .collection("rebeals")
      .where("user", "in", userDocs)
      .where("postedAt", ">=", fromTimestamp)
      .withConverter(rebealConverter)
      .get()
  ).docs.map((d) => {
    const data = d.data();
    return { ...data, commentsCount: 0, reactions: [] } as typeof data & {
      commentsCount: number;
      reactions: (Omit<Reaction, "user"> & { userId: string })[];
    };
  });

  const proms: Promise<any>[] = [];

  // get comments
  rebeals.forEach((rebeal, index) => {
    const query = firestore
      .collection(`rebeals/${rebeal.id}/comments`)
      .count()
      .get();

    proms.push(
      new Promise<void>(async (resolve) => {
        const commentsCount = (await query).data().count;
        rebeal.commentsCount = commentsCount;
        resolve();
      })
    );
  });

  // get reactions
  rebeals.forEach((rebeal, index) => {
    const query = firestore
      .collection(`rebeals/${rebeal.id}/reactions`)
      .withConverter(reactionConverter)
      .get();

    proms.push(
      new Promise<void>(async (resolve) => {
        const reactions = (await query).docs.map((doc) => {
          const data = doc.data();
          return { ...data, user: undefined, userId: data.user.id };
        });
        rebeal.reactions = reactions;
        resolve();
      })
    );
  });

  const users = await getUsers(userIds);

  await Promise.all(proms);

  const finalReBeals = rebeals.map((rebeal) => {
    const user = users.find((u) => u.id === rebeal.user.id);
    if (user === undefined) throw new Error("could not find user for rebeal");
    return {
      ...rebeal,
      user,
    };
  });

  return finalReBeals;
}
