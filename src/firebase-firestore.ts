import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, getDocFromServer, FirestoreError } from 'firebase/firestore';
import { app } from './firebase-config';
import firebaseConfig from '../firebase-applet-config.json';

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export { 
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, getDocFromServer 
};
export type { FirestoreError };
