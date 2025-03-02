
import { getFirestore,
    //  doc, getDoc, setDoc, updateDoc, collection, query, getDocs, where, deleteDoc
     } from 'firebase/firestore';
import { app } from '@/lib/firebase';
// import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
// import { storage } from './firebase';

export const db = getFirestore(app);