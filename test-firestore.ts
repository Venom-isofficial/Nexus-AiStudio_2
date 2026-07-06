import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  console.log("Fetching news...");
  try {
    const newsRef = collection(db, "news");
    const newsSnapshot = await getDocs(query(newsRef, limit(10)));
    console.log("News count:", newsSnapshot.size);
    newsSnapshot.forEach((doc) => {
      console.log("News Doc:", doc.id, " => ", doc.data());
    });
  } catch (e) {
    console.error(e);
  }

  console.log("Fetching stock_sentiment...");
  try {
    const stockRef = collection(db, "stock_sentiment");
    const stockSnapshot = await getDocs(query(stockRef, limit(10)));
    console.log("Stock count:", stockSnapshot.size);
    stockSnapshot.forEach((doc) => {
      console.log("Stock Doc:", doc.id, " => ", doc.data());
    });
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}

test().catch(console.error);
