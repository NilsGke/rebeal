import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { storage } from "./config";

export const uploadBase64 = (path: string, data: string) =>
  new Promise<string>(async (resolve, reject) => {
    const storageRef = ref(storage, path);

    // 'file' comes from the Blob or File API
    uploadString(storageRef, data).then(async (snapshot) => {
      console.log("Uploaded a blob or file!");
      const url = await getDownloadURL(ref(storage, path));
      resolve(url);
    });
  });
