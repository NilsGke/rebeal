import admin from "@/firebase/config";
import serverAuth from "@/helpers/serverComponentAuth";
import Block from "../Block";
import { settingsConverter } from "@/app/types";
import SettingToggle from "../SettingToggle";
import DeleteMemoriesButton from "./DeleteMemoriesButton";
import getLastTTRB from "@/firebase/server/getLastTTRB";
import { Timestamp } from "firebase-admin/firestore";

const Page = async () => {
  const session = await serverAuth();

  const firestore = admin.firestore();

  const lastTTRB = await getLastTTRB();

  const userDoc = firestore.doc(`users/${session.user.id}`);

  const [settings, reBealsCount] = await Promise.all([
    firestore
      .doc(`settings/${session.user.id}`)
      .withConverter(settingsConverter)
      .get()
      .then((snapshot) => snapshot.data()),
    firestore
      .collection("rebeals")
      .where("user", "==", userDoc)
      .where("postedAt", "<", Timestamp.fromDate(lastTTRB.announcedAt))
      .count()
      .get()
      .then((q) => q.data().count),
  ]);

  if (settings === undefined) throw Error("could not get settings");

  return (
    <div>
      <main className="p-3 flex flex-col flex-nowrap gap-1 ">
        <Block title="On / Off">
          <label className="flex justify-between">
            Save Settings:{" "}
            <SettingToggle settings={settings} propertyName="saveMemories" />
          </label>
        </Block>

        <Block title="Danger Zone" className="flex justify-center items-center">
          <DeleteMemoriesButton reBealsCount={reBealsCount} />
        </Block>
      </main>
    </div>
  );
};

export default Page;
