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
  user: DocumentReference<User>;
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

// #region reaction
export type SavedReactionUserRecord = {
  "👍": string;
  "😃": string;
  "😯": string;
  "😍": string;
  "😂": string;
};
export const reactionEmojis = ["👍", "😃", "😯", "😍", "😂", "⚡"] as const;

export const stringIsReactionEmoji = (
  string: string
): string is (typeof reactionEmojis)[number] =>
  reactionEmojis.includes(string as (typeof reactionEmojis)[number]);

export const savedReactionUserRecordConverter: FirestoreDataConverter<SavedReactionUserRecord> =
  {
    toFirestore: (data: SavedReactionUserRecord) => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot<SavedReactionUserRecord>) =>
      snapshot.data(),
  };

export type Reaction = {
  id: string;
  user: DocumentReference<User>;
  image: string;
  type: "👍" | "😃" | "😯" | "😍" | "😂" | "⚡";
};

export type SavedReaction = Omit<Reaction, "type"> & {
  type: "⚡";
};

export const reactionConverter: FirestoreDataConverter<Reaction> = {
  toFirestore: (data: Reaction) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<Reaction>) => ({
    ...snapshot.data(),
    id: snapshot.id,
  }),
};

export const savedReactionConverter: FirestoreDataConverter<SavedReaction> = {
  toFirestore: (data: SavedReaction) => ({ ...data, id: undefined }),
  fromFirestore: (snapshot: QueryDocumentSnapshot<SavedReaction>) => ({
    ...snapshot.data(),
    id: snapshot.id,
  }),
};
// #endregion
