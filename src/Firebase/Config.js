// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwK0KSATNGpMxm8GkPVYOo1HaCHdx60AY",
    authDomain: "project-dev-h.firebaseapp.com",
    projectId: "project-dev-h",
    storageBucket: "project-dev-h.appspot.com",
    messagingSenderId: "784200160287",
    appId: "1:784200160287:web:afbc18787656e75be5f12a",
    measurementId: "G-ZVDX867MXY"
};

// Initialize Firebase
export const appConfig = initializeApp(firebaseConfig);
export const firestoreConfig = getFirestore(appConfig);
export const authConfig = getAuth(appConfig);
export const storageConfig = getStorage(appConfig);
// eslint-disable-next-line
const analytics = getAnalytics(appConfig);
