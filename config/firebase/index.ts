import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAxtNXVYaWP4yPNBRuRYae5455svd1_nU4",
    authDomain: "searchco-test.firebaseapp.com",
    projectId: "searchco-test",
    storageBucket: "searchco-test.appspot.com",
    messagingSenderId: "999005298437",
    appId: "1:999005298437:web:9bf6f20bda11b16647e16c"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app);

export { db, auth, storage }