import { getStorage } from "firebase/storage";
import { firebase_app } from "../config";

export const storage = getStorage(firebase_app);
