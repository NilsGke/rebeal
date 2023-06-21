import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

export const uploadFile = (file: File, path: string) =>
  new Promise<string>(async (resolve, reject) => {
    const storageRef = ref(storage, path);

    console.log("\x1b[32mfile:\x1b[0m", file);
    console.log((await file.arrayBuffer()).byteLength);

    uploadBytes(storageRef, file).then(() =>
      getDownloadURL(ref(storage, path)).then(resolve)
    );
  });
