import { rebealConverter } from "@/app/types";
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
    return { ...d.data(), commentsCount: 0 } as typeof data & {
      commentsCount: number;
    };
  });

  const proms: Promise<any>[] = [];

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

  const users = await getUsers(userIds);

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
