import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxGHh-YxvgknA78UWRK8QuFWvTuu-B-hU",
  authDomain: "extension-602bb.firebaseapp.com",
  projectId: "extension-602bb",
  storageBucket: "extension-602bb.appspot.com",
  messagingSenderId: "840711850112",
  appId: "1:840711850112:web:ed8c8c4dac8e1fb45ffe65",
  measurementId: "G-LPMKQVE66N",
  databaseURL: "https://extension-602bb-default-rtdb.firebaseio.com/"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const errorRef = ref(db, 'error');
export const ruleMetaDataRef = ref(db, 'ruleMetaData');

const storeData = (ref, data) => {
  if(process.env.NODE_ENV === 'development') {
    return;
  }
  try {
    push(ref, data);
  } catch (error) {}
}

export const storeError = (error) => storeData(errorRef, error);
export const storeRuleMetaData = (ruleMetaData) => storeData(ruleMetaDataRef, ruleMetaData);
