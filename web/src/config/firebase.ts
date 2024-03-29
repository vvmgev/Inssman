import { strFromU8, strToU8, zlibSync, unzlibSync } from "fflate";
import { initializeApp } from "firebase/app";
import { getDocs, initializeFirestore, deleteDoc } from "firebase/firestore";
import { getBlob, getStorage, ref as refStorage, uploadBytes, deleteObject } from "firebase/storage";
import { getDatabase, ref, push, get } from "firebase/database";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";

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
export const firestoreApp = initializeFirestore(app, { experimentalForceLongPolling: true });
export const firestoreDB = getFirestore();
const recordedSessionsCollectionRef = collection(firestoreDB, "recordedSessions");

// get(ruleMetaDataRef)
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       // Data exists in the snapshot
//       const data = snapshot.val();
//       console.log(data);
//     } else {
//       // Data doesn't exist
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error("Error getting data:", error);
//   });

export const compressEvents = (events: any): string => {
  return strFromU8(zlibSync(strToU8(JSON.stringify(events))), true);
};

export const decompressEvents = (compressedEvents: string) => {
  return JSON.parse(strFromU8(unzlibSync(strToU8(compressedEvents, true))));
};

export const uploadFile = async (file: File, filePath: string): Promise<string | null> => {
  const storage = getStorage(app);
  const storageRef = refStorage(storage, filePath);

  const path = await uploadBytes(storageRef, file)
    .then((snapshot) => {
      return snapshot.ref.fullPath;
    })
    .catch((err) => {
      return null;
    });

  return path;
};

export const createFile = async (name: string, type: string, data: string, filePath: string) => {
  const newFile = new File([data], name, {
    type: type,
    lastModified: Date.now(),
  });

  const uploadedFilePath = await uploadFile(newFile, filePath);
  return uploadedFilePath;
};

export const getFile = async (filePath: string) => {
  const storage = getStorage(app);
  const storageRef = refStorage(storage, filePath);

  const blob = await getBlob(storageRef)
    .then((blob) => {
      return blob;
    })
    .catch((err) => {
      return null;
    });

  const data = new Blob([blob as Blob]).text();
  return data;
};

export const storeRecordedSession = async (session: any) => {
  const { events, ...data } = session;
  try {
    const sessionRef = await addDoc(recordedSessionsCollectionRef, data);
    const createFileResult = await createFile(
      sessionRef.id,
      "application/octet-stream",
      compressEvents(events),
      `sessions/${sessionRef.id}`
    );
    return { docID: sessionRef.id };
  } catch (error) {
    return { error: true, message: error };
  }
};

export const getRecordedSessions = async () => {
  const querySnapshot = await getDocs(collection(firestoreDB, "recordedSessions"));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), docID: doc.id }));
};

export const removeRecordedSession = async (id: string) => {
  deleteDoc(doc(recordedSessionsCollectionRef, id));
};

export const removeRecordedSessionFile = async (id: string) => {
  const storage = getStorage(app);
  const recordedSessionRef = refStorage(storage, `sessions/${id}`);
  deleteObject(recordedSessionRef);
};

export const getRecordedSessionByID = async (id: string) => {
  try {
    const sessionRef = doc(recordedSessionsCollectionRef, id);
    const sessionSnapshot = await getDoc(sessionRef);

    if (sessionSnapshot.exists()) {
      const data = sessionSnapshot.data();
      const events = await getFile(`sessions/${id}`);

      return {
        ...data,
        events: decompressEvents(events),
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
