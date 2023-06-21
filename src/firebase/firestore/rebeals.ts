import { db } from "./config";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { uploadFile } from "../storage/uploadFile";

export const postRebeal = (data: {
  postedAt: number;
  mainImage: File;
  selfie: File;
  userId: string;
}) =>
  new Promise<string>(async (resolve, reject) => {
    const docRef = doc(collection(db, "rebeals"));

    const mainProm = uploadFile(
      data.mainImage,
      `users/${data.userId}/rebeals/${docRef.id}/mainImage.webp`
    );
    const selfieProm = uploadFile(
      data.selfie,
      `users/${data.userId}/rebeals/${docRef.id}/selfie.webp`
    );

    const [mainUrl, selfieUrl] = await Promise.all([mainProm, selfieProm]);

    console.log(mainUrl, selfieUrl);

    setDoc(docRef, {
      postedAt: data.postedAt,
      mainImage: mainUrl,
      selfie: selfieUrl,
      userId: doc(db, "users", data.userId),
    }).then(() => resolve(docRef.id));
  });
