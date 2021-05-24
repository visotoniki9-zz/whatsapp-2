/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import '../styles/globals.css';
import 'reseter.css';
import { useEffect, useReducer } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  // Creates or updates user in db
  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
      },
      { merge: true });
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
