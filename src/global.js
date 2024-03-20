import { initializeApp } from 'firebase/app';

import {
    getFirestore, where,
    collection, query,
    getDocs
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2lNJKsuZXi532qWjf6UP8-s5g3atcsxM",
    authDomain: "devopscalendar-7d2ec.firebaseapp.com",
    projectId: "devopscalendar-7d2ec",
    storageBucket: "devopscalendar-7d2ec.appspot.com",
    messagingSenderId: "391098280377",
    appId: "1:391098280377:web:d39b85577b64821dbd6e68",
    measurementId: "G-WL4Y1LNWLM"
};

// init firebase app
initializeApp(firebaseConfig)

// init services
export const db = getFirestore()

function addLeadingZero(number) {
    return number < 10 ? "0" + number : number;
}

export function formateDate(date) {
    const dateF = date.toDate();
    const year = addLeadingZero(dateF.getFullYear());
    const month = addLeadingZero(dateF.getMonth() + 1);
    const day = addLeadingZero(dateF.getDate());
    return `${day}/${month}/${year}`;
}