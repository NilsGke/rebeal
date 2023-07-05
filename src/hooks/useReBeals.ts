"use client";

import firebase_app from "@/firebase/client";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type ReBeal = {
  id: string;
  user: DocumentReference;
  images: {
    environment: string;
    selfie: string;
  };
  postedAt: number;
  late?: boolean;
};

// const firestore = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase_app);

const useReBeals = (userId: string, friendIds: string[]) => {
  const [reBeals, setRebeals] = useState<ReBeal[]>([]);
  const [newReBeals, setNewReBeals] = useState<ReBeal[]>([]);
  const newAvalible = newReBeals.length > 0;

  console.log({ rebeals: reBeals, newReBeals, newAvalible });

  const showNewReBeals = () => {
    setNewReBeals((prevNew) => {
      setRebeals((prev) => {
        const reBeals = [...prev, ...prevNew];
        return reBeals.filter(
          (rebeal, index) =>
            reBeals.findIndex((r) => r.id === rebeal.id) === index
        );
      });
      return [];
    });
  };

  const firstRender = useRef(true);

  useEffect(() => {
    if (friendIds.length === 0) return;
    const rebealQuery = query(
      collection(firestore, "rebeals"),
      where(
        "user",
        "in",
        friendIds.map((id) => doc(firestore, "users", id))
      )
    );

    const docToReBeal = (doc: QueryDocumentSnapshot<DocumentData>): ReBeal => ({
      ...(doc.data() as Omit<ReBeal, "id">),
      id: doc.id,
    });

    const unsub = onSnapshot(rebealQuery, (snapshot) => {
      setRebeals((prevReBeals) => {
        let reBeals = prevReBeals.slice();
        setNewReBeals((prevNewReBeals) => {
          const newReBeals = prevNewReBeals.slice();
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added")
              if (firstRender.current) {
                reBeals.push(docToReBeal(change.doc));
                firstRender.current = false;
              } else newReBeals.push(docToReBeal(change.doc));

            if (change.type === "modified")
              reBeals = reBeals
                .slice()
                .map((r) =>
                  r.id !== change.doc.id ? r : (change.doc.data() as ReBeal)
                );

            if (change.type === "removed")
              reBeals.splice(
                reBeals.findIndex((r) => r.id === change.doc.id),
                1
              );
          });

          return newReBeals;
        });

        return reBeals;
      });
    });
    console.log("listening");

    return () => {
      console.log("not listening");

      unsub();
    };
  }, [friendIds]);

  return { reBeals, newAvalible, showNewReBeals };
};

export default useReBeals;
