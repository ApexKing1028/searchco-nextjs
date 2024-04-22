import { getFirestore } from 'firebase/firestore'
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Test
const firebaseConfig = {
    apiKey: "AIzaSyANVBuqqpNQIM4M1taNQq-BnhtJkYQIC-w",
    authDomain: "test-ed15a.firebaseapp.com",
    projectId: "test-ed15a",
    storageBucket: "test-ed15a.appspot.com",
    messagingSenderId: "616534612582",
    appId: "1:616534612582:web:fa69f41755b08c54d52ba7",
    measurementId: "G-TR0R7XNKWS"
};

// Production
// const firebaseConfig = {
//     apiKey: "AIzaSyBBXBD7W6VbFxjgqRQpDhIwantBXZ4t7RU",
//     authDomain: "searchco-f3a90.firebaseapp.com",
//     projectId: "searchco-f3a90",
//     storageBucket: "searchco-f3a90.appspot.com",
//     messagingSenderId: "1058061296182",
//     appId: "1:1058061296182:web:0dc0286edfbd6cd34a2e97",
//     measurementId: "G-REBFB9QEJP"
// };

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }