import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyC1i0ak6k0d9aFQr3dDyVRl5wdQ9hvWiZU',
  authDomain: 'whatsapp-2-b4e01.firebaseapp.com',
  projectId: 'whatsapp-2-b4e01',
  storageBucket: 'whatsapp-2-b4e01.appspot.com',
  messagingSenderId: '727320716717',
  appId: '1:727320716717:web:acf3ca914d9546eb58ed24',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

// const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
