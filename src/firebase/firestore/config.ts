import { getFirestore } from "firebase/firestore";
import { firebase_app } from "../config";

export const db = getFirestore(firebase_app);
