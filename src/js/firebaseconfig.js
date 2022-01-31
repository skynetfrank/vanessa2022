// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyARhLtEx8NFvmeWBupP6Fi95pr0X3igojw',
  authDomain: 'dental-project-def14.firebaseapp.com',
  projectId: 'dental-project-def14',
  storageBucket: 'dental-project-def14.appspot.com',
  messagingSenderId: '293629202563',
  appId: '1:293629202563:web:964c62559b87517dec8bb6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const cloudstorage = getStorage();
