import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  initializeFirestore,
  where,
  query,
  getDocs,
  documentId,
} from "firebase/firestore";
import { strFromU8, strToU8, zlibSync, unzlibSync } from "fflate";
import { getBlob, getStorage, ref as refStorage, uploadBytes, deleteObject } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import XMLHttpRequest from "xhr-shim";
import firebaseConfig from "./firebaseConfig";
global["XMLHttpRequest"] = XMLHttpRequest;

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const errorRef = ref(db, "error");
export const ruleMetaDataRef = ref(db, "ruleMetaData");
export const trackingRef = ref(db, "tracking");
export const sessionErrorRef = ref(db, "sessionError");
// Firestore
export const firestoreApp = initializeFirestore(app, { experimentalForceLongPolling: true });
export const firestoreDB = getFirestore();
const recordedSessionsCollectionRef = collection(firestoreDB, "recordedSessions");

export const compressEvents = (events: any): string => {
  return strFromU8(zlibSync(strToU8(JSON.stringify(events))), true);
};

export const decompressEvents = (compressedEvents: string) => {
  return JSON.parse(strFromU8(unzlibSync(strToU8(compressedEvents, true))));
};

export const uploadFile = async (file: File, filePath: string): Promise<any> => {
  const storage = getStorage(app);
  const storageRef = refStorage(storage, filePath);
  try {
    const uploadResult = await uploadBytes(storageRef, file);
    return uploadResult.ref.fullPath;
  } catch (error) {
    storeSessionError(JSON.stringify(error));
    return error;
  }
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
  try {
    const storage = getStorage(app);
    const storageRef = refStorage(storage, filePath);
    const blob = await getBlob(storageRef);
    const data = new Blob([blob]).text();
    return data;
  } catch (error) {
    storeSessionError(JSON.stringify(error));
    return Promise.reject(new Error("notFound"));
  }
};

export const storeRecordedSession = async (session: any) => {
  const { events, ...data } = session;
  try {
    const { id } = await addDoc(recordedSessionsCollectionRef, data);
    const createFileResult = await createFile(id, "application/octet-stream", compressEvents(events), `sessions/${id}`);
    return { docID: id };
  } catch (error) {
    storeSessionError(JSON.stringify(error));
    return Promise.reject(error);
  }
};

export const getRecordedSessionByDocIDs = async (ids: string[]) => {
  try {
    const q = query(recordedSessionsCollectionRef, where(documentId(), "in", ids));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data()) || [];
  } catch (error: any) {
    storeSessionError(JSON.stringify(error));
  }
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
      throw new Error("notFound");
    }
  } catch (error: any) {
    storeSessionError(JSON.stringify(error));
    return { error: true, message: error.message };
  }
};

export const removeRecordedSession = async (id) => {
  try {
    const recordedSessionMetaDataRef = doc(recordedSessionsCollectionRef, id);
    deleteDoc(recordedSessionMetaDataRef);
    const storage = getStorage(app);
    const recordedSessionRef = refStorage(storage, `sessions/${id}`);
    deleteObject(recordedSessionRef);
  } catch (error) {
    storeSessionError(JSON.stringify(error));
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
export const storeSessionError = (sessionError: any) => storeData(sessionErrorRef, sessionError);
