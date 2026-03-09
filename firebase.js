// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnd9t5HQp67VwVnO784HXC-vKH7ImIEys",
  authDomain: "new-classroom-81fc7.firebaseapp.com",
  projectId: "new-classroom-81fc7",
  storageBucket: "new-classroom-81fc7.firebasestorage.app",
  messagingSenderId: "116246063803",
  appId: "1:116246063803:web:8ffc7f2401960cccf5d79e",
  measurementId: "G-RB51SJQC3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
