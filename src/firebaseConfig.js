import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDoiYCDzVebmE4AQD0Qoh9u0xUn9c3x318",
  authDomain: "tire-shop-scheduler.firebaseapp.com",
  projectId: "tire-shop-scheduler",
  storageBucket: "tire-shop-scheduler.appspot.com",
  messagingSenderId: "836676202098",
  appId: "1:836676202098:web:cfce584fd8edebb42d1ceb",
  measurementId: "G-ZRSHNLST1S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
