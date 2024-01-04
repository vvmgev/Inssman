import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxGHh-YxvgknA78UWRK8QuFWvTuu-B-hU",
  authDomain: "extension-602bb.firebaseapp.com",
  projectId: "extension-602bb",
  storageBucket: "extension-602bb.appspot.com",
  messagingSenderId: "840711850112",
  appId: "1:840711850112:web:ed8c8c4dac8e1fb45ffe65",
  measurementId: "G-LPMKQVE66N",
  databaseURL: "https://extension-602bb-default-rtdb.firebaseio.com/",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const firestoreDB = getFirestore(app);
export const errorRef = ref(db, "error");
export const ruleMetaDataRef = ref(db, "ruleMetaData");
export const trackingRef = ref(db, "tracking");

export const storeRecordedSession = async (session) => {
  try {
    session.events = JSON.stringify(session.events);
    const doc = await addDoc(collection(firestoreDB, "recordedSession"), session);
    return doc.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getRecordedSessionByID = async (id: string) => {
  try {
    const docRef = doc(firestoreDB, "recordedSession", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.log("Error getting", error);
  }
};

const storeData = (ref, data) => {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  try {
    push(ref, data);
  } catch (error) {}
};

export const storeError = (error) => storeData(errorRef, error);
export const storeRuleMetaData = (ruleMetaData) => storeData(ruleMetaDataRef, ruleMetaData);
export const storeTracking = (trackingData) => storeData(trackingRef, trackingData);
