import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDckeMJ0vZLN7SXiDEu-M31QDZNuHkywHo",
  authDomain: "gtspot-295a7.firebaseapp.com",
  projectId: "gtspot-295a7",
  storageBucket: "gtspot-295a7.appspot.com",
  messagingSenderId: "943928926529",
  appId: "1:943928926529:web:17531c26eea4ad4cbf01c0",
  measurementId: "G-8BBBWD6B45",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { auth, db, firebaseConfig };
