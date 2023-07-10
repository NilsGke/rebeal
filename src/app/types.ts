import { PartialBy } from "@/helpers/tshelpers";
import {
  DocumentReference as AdminDocumentReference,
  Timestamp as AdminTimestamp,
  QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
  FirestoreDataConverter,
} from "firebase-admin/firestore";
import { User } from "next-auth";

export type ReBeal = {
  id: string;
  user: AdminDocumentReference;
  images: {
    environment: string;
    selfie: string;
  };
  postedAt: AdminTimestamp;
  late?: boolean;
};

export const rebealConverter = {
  toFirestore: (data: ReBeal) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    ({ ...snap.data(), id: snap.id } as ReBeal),
};

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (data: User) => {
    const user: Omit<User, "id"> = {
      email: data.email,
      image: data.image,
      name: data.name,
    };
    return user;
  },
  fromFirestore: (snap: AdminQueryDocumentSnapshot) =>
    ({
      ...snap.data(),
      id: snap.id,
    } as User),
};

export type Comment = {
  content: string;
  user: AdminDocumentReference;
  postedAt: AdminTimestamp;
  id: string;
};

export const commentConverter = {
  toFirestore: (data: PartialBy<Comment, "id">) => {
    delete data.id;
    ({ ...data, id: undefined });
  },
  fromFirestore: (snap: AdminQueryDocumentSnapshot) =>
    ({
      ...snap.data(),
      id: snap.id,
    } as Comment),
};
