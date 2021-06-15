import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyBGQcNyU2LJ7h71KzOgbrupOJmJSeNwrDI",
    authDomain: "whatsapp-2-1cc60.firebaseapp.com",
    projectId: "whatsapp-2-1cc60",
    storageBucket: "whatsapp-2-1cc60.appspot.com",
    messagingSenderId: "93972692035",
    appId: "1:93972692035:web:f12bb546d4f7ad916b28f6",
    measurementId: "G-H1B1LLV0RJ"
  };

  const app = !firebase.apps.length ?  
  firebase.initializeApp(firebaseConfig) : 
  firebase.app();

  const db = app.firestore();
  const auth = app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { db, auth, provider };