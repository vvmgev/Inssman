import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
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
export const errorRef = ref(db, "error");
export const ruleMetaDataRef = ref(db, "ruleMetaData");
export const trackingRef = ref(db, "tracking");
// Firestore
export const firestoreDB = getFirestore(app);
const recordedSessionsCollectionRef = collection(firestoreDB, "recordedSessions");

export const storeRecordedSession = async (session: any) => {
  const { events, ...data } = session;
  try {
    const newSessionRef = await addDoc(recordedSessionsCollectionRef, { data });
    const eventsCollectionRef = collection(newSessionRef, "events");
    events.forEach(async (event: any) => {
      await addDoc(eventsCollectionRef, { event: JSON.stringify(event) });
    });
    return { docID: newSessionRef.id };
  } catch (error) {
    return { error: true, message: error };
  }
};

export const getRecordedSessionByID = async (id: string) => {
  try {
    const sessionRef = doc(recordedSessionsCollectionRef, id);
    const sessionSnapshot = await getDoc(sessionRef);

    if (sessionSnapshot.exists()) {
      const { data } = sessionSnapshot.data();
      const eventsCollectionRef = collection(sessionRef, "events");
      const eventsSnapshot = await getDocs(eventsCollectionRef);
      const events: any = [];
      eventsSnapshot.forEach((eventDoc: any) => {
        events.push(JSON.parse(eventDoc.data().event));
      });

      return {
        ...data,
        events,
      };
    } else {
      return Promise.reject(new Error("notFound"));
    }
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};

const storeData = (ref: any, data: any) => {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  try {
    push(ref, data);
  } catch (error) {}
};

export const storeError = (error: any) => storeData(errorRef, error);
export const storeRuleMetaData = (ruleMetaData: any) => storeData(ruleMetaDataRef, ruleMetaData);
export const storeTracking = (trackingData: any) => storeData(trackingRef, trackingData);
