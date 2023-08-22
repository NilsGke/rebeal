import { PartialBy } from "@/helpers/tshelpers";
import {
  DocumentReference,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  Timestamp,
} from "firebase-admin/firestore";
import { User } from "next-auth";

export type ReBeal = {
  id: string;
  user: DocumentReference;
  images: {
    environment: string;
    selfie: string;
  };
  postedAt: Timestamp;
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
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    ({
      ...snap.data(),
      id: snap.id,
    } as User),
};

export type Comment = {
  content: string;
  user: DocumentReference;
  postedAt: Timestamp;
  id: string;
};

export const commentConverter = {
  toFirestore: (data: PartialBy<Comment, "id">) => {
    delete data.id;
    ({ ...data, id: undefined });
  },
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    ({
      ...snap.data(),
      id: snap.id,
    } as Comment),
};

export type TTRB = {
  announced: boolean;
  announcedAt?: Timestamp;
  time: Timestamp;
};

export const TTRBConverter: FirestoreDataConverter<TTRB> = {
  toFirestore: (data: TTRB) => data,
  fromFirestore: (data: QueryDocumentSnapshot<TTRB>) => data.data(),
};
