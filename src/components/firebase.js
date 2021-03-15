import firebase from "firebase";

const firebaseConfig = {
  
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
