import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const dbTarget = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  console.log("Adding one doc to dbTarget news...");
  try {
    await addDoc(collection(dbTarget, "news"), { headline: "test2" });
    console.log("Write success!");
  } catch (e) {
    console.error("Write failed:", e);
  }
  process.exit(0);
}
test().catch(console.error);
