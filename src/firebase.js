import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,

  authDomain: "shoppingapp-b5fb9.firebaseapp.com",

  projectId: "shoppingapp-b5fb9",

  storageBucket: "shoppingapp-b5fb9.appspot.com",

  messagingSenderId: "550791951343",

  appId: "1:550791951343:web:71387be34f5bed9863bc1a",

  measurementId: "G-Z4KVVPMDTH",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
