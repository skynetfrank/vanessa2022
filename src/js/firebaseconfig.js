// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC--CaicbucYg_GfiI_86NxZVNLfe3j0gg',
  authDomain: 'app-odonto-web.firebaseapp.com',
  projectId: 'app-odonto-web',
  storageBucket: 'app-odonto-web.appspot.com',
  messagingSenderId: '356247323668',
  appId: '1:356247323668:web:038da2ed53c1d91a1b1301',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const cloudstorage = getStorage();
