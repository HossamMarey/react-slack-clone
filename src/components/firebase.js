// import firebase from "firebase/app";
import firebase from "firebase";

import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCLrRAfhGnQfHpvA8P2B-OwmIVhnRrCCOU",
  authDomain: "react-slack-clone-171c7.firebaseapp.com",
  databaseURL: "https://react-slack-clone-171c7.firebaseio.com",
  projectId: "react-slack-clone-171c7",
  storageBucket: "react-slack-clone-171c7.appspot.com",
  messagingSenderId: "531197063561",
  appId: "1:531197063561:web:4ae60dcb0cce1ee4de3158",
  measurementId: "G-3X5YET7KCJ",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
