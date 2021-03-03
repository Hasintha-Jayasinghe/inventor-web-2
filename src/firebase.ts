import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyA9G8Tz2pPA4P3Bvxh3pXvYO_pHiZ4LJ5I',
  authDomain: 'stps-club-management.firebaseapp.com',
  projectId: 'stps-club-management',
  storageBucket: 'stps-club-management.appspot.com',
  messagingSenderId: '874346042595',
  appId: '1:874346042595:web:7f141e480640b8cc64e1d6',
  measurementId: 'G-Q2R2F51Y19',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };
