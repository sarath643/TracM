import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCxlI1Z3MymrEVU0SGJSRqYd2BRMVjhQOk',
  authDomain: 'tracum-701b4.firebaseapp.com',
  projectId: 'tracum-701b4',
  storageBucket: 'tracum-701b4.appspot.com',
  messagingSenderId: '433076325194',
  appId: '1:433076325194:web:e7f0504fe64f0538148fb3',
  measurementId: 'G-T42RN768V0',
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
