import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, writeBatch } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);

const dbDefault = getFirestore(app);
const dbTarget = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function copyCollection(collectionName: string) {
  console.log(`Copying collection: ${collectionName}...`);
  const snapshot = await getDocs(collection(dbDefault, collectionName));
  console.log(`Found ${snapshot.size} documents in ${collectionName}`);
  
  let batch = writeBatch(dbTarget);
  let count = 0;
  let batchCount = 0;

  for (const document of snapshot.docs) {
    batch.set(doc(dbTarget, collectionName, document.id), document.data());
    count++;
    batchCount++;
    
    if (batchCount === 400) {
      await batch.commit();
      console.log(`Committed ${count} documents...`);
      batch = writeBatch(dbTarget);
      batchCount = 0;
    }
  }
  
  if (batchCount > 0) {
    await batch.commit();
    console.log(`Committed ${count} documents...`);
  }
  
  console.log(`Successfully copied ${count} documents for ${collectionName}.`);
}

async function run() {
  try {
    await copyCollection("news");
    await copyCollection("stock_sentiment");
    console.log("Done!");
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

run();
