import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { FirestoreAdapter, initFirestore } from "@next-auth/firebase-adapter";
import { AuthOptions } from "next-auth";
import { cert } from "firebase-admin/app";
import getTags from "@/helpers/generateTags";
import { defaultSettings, settingsConverter } from "@/app/types";

const firestore = initFirestore({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
  }),
});

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID || "",
      clientSecret: process.env.DISCORD_SECRET || "",
    }),
  ],
  adapter: FirestoreAdapter(firestore),
  secret: process.env.JWT_SECRET,
  callbacks: {
    jwt: async ({ token, user, account, profile, trigger }) => {
      if (user) {
        token.uid = user.id;
      }
      if (trigger === "signUp" && user.name) {
        const tags = getTags(user.name.toLowerCase());

        firestore.doc(`users/${user.id}`).set(
          {
            tags,
          },
          {
            merge: true,
          }
        );

        firestore.doc(`savedReactions/${user.id}`).set({
          "👍": "",
          "😃": "",
          "😯": "",
          "😍": "",
          "😂": "",
        });

        firestore
          .doc(`settings/${user.id}`)
          .withConverter(settingsConverter)
          .set(defaultSettings);
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.uid as string; // TEMPORARY
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
