/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import '../styles/globals.css';
import 'reseter.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  if (!user) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
