import admin from "@/firebase/config";
import {
  DocumentReference as AdminDocumentReference,
  Timestamp as AdminTimestamp,
} from "firebase-admin/firestore";
import {
  DocumentReference as ClientDocumentReference,
  Timestamp as ClientTimestamp,
} from "firebase/firestore";

export type ReBeal = {
  id: string;
  user: AdminDocumentReference | ClientDocumentReference;
  images: {
    environment: string;
    selfie: string;
  };
  postedAt: AdminTimestamp | ClientTimestamp;
  late?: boolean;
};

export const rebealConverter = {
  toFirestore: (data: ReBeal) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    ({ ...snap.data(), id: snap.id } as ReBeal),
};
