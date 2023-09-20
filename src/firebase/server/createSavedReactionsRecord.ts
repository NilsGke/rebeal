import { User } from "next-auth";
import admin from "../config";
import { savedReactionUserRecordConverter } from "@/app/types";

export default async function createSavedReactionRecord(uid: User["id"]) {
  admin
    .firestore()
    .doc(`savedReactions/${uid}`)
    .withConverter(savedReactionUserRecordConverter)
    .set({
      "👍": "",
      "😂": "",
      "😃": "",
      "😍": "",
      "😯": "",
    });
}
