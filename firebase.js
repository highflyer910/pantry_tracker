// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn6HTLaMaztwdiBU8aytKuQ9s_CQWaDRg",
  authDomain: "pantry-tracker-89d3b.firebaseapp.com",
  projectId: "pantry-tracker-89d3b",
  storageBucket: "pantry-tracker-89d3b.appspot.com",
  messagingSenderId: "368154710907",
  appId: "1:368154710907:web:0c2d0c8ac83791f4c7a3de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };