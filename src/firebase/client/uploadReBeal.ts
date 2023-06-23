import {
  UploadResult,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import firebase_app from "../client";

const uploadImages = async (
  images: {
    environment: File;
    selfie: File;
  },
  userId: string
) => {
  const storage = getStorage(firebase_app);
  const path = new Date().toLocaleDateString("DE-de").replaceAll(".", "_");
  const environmentRef = ref(
    storage,
    `users/${userId}/rebeals/${path}_environment.webp`
  );
  const selfieRef = ref(storage, `users/${userId}/rebeals/${path}_selfie.webp`);

  const handleRes = async (snapshot: UploadResult) =>
    getDownloadURL(snapshot.ref);

  return await Promise.all([
    uploadBytes(environmentRef, images.environment).then(handleRes),
    uploadBytes(selfieRef, images.selfie).then(handleRes),
  ]);
};

export default uploadImages;
