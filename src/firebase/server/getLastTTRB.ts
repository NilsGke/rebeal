import { Timestamp } from "firebase-admin/firestore";
import admin from "../config";
import { TTRBConverter } from "@/app/types";

export default async function getLastTTRB() {
  const query = await admin
    .firestore()
    .collection("timeToReBeal")
    .where("time", "<=", Timestamp.fromDate(new Date()))
    .orderBy("time", "desc")
    .limit(1)
    .withConverter(TTRBConverter)
    .get();

  const lastTTRB = query.docs.at(0);
  if (lastTTRB === undefined || !lastTTRB.exists)
    throw Error("last ttrb undefined or nonexistant");

  const data = lastTTRB.data();

  return {
    ...data,
    time: data.time.toDate(),
    announcedAt: (data.announcedAt as Timestamp).toDate(), // can ignore possible undefined because `where` filters for only ttrb in past
  };
}
