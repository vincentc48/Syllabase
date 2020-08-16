import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAtYkL0to7GNlYxEaYXVpelVu1HmvfyS08",
  authDomain: "teachercommunication-34d15.firebaseapp.com",
  databaseURL: "https://teachercommunication-34d15.firebaseio.com",
  projectId: "teachercommunication-34d15",
  storageBucket: "teachercommunication-34d15.appspot.com",
  messagingSenderId: "953371149714",
  appId: "1:953371149714:web:983c2729c2d27ac9e7ed4b",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const pAuth = firebase.auth();
const pFirestore = firebase.firestore();
const pStorage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const ff = firebase.firestore.FieldValue;

export { pAuth, pFirestore, pStorage, timestamp, ff };
