import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, child, get, Timestamp, updateDoc
} from 'firebase/firestore';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    deleteUser,
    onAuthStateChanged,
    signOut, sendPasswordResetEmail
} from "firebase/auth";


import * as global from "../global.js";
import * as viewAssessment from "./viewAssessment.js";


const auth = getAuth();




// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Collections -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const subjectsQuery = collection(global.db, "module");

const submissionRef = collection(global.db, 'submission')

const assesmentRef = collection(global.db, 'assesment')


// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Elements -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const assessments = document.getElementById('assessments-details');



// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Functions -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //



function showAllAssessments() {
    onSnapshot(assesmentRef, (querySnapshot) => {
        querySnapshot.forEach((docu) => {
            const data = docu.data();
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            td1.innerHTML = data.title;
            let td2 = document.createElement('td');
            td2.innerHTML = global.formateDate(data.start_date);
            let td3 = document.createElement('td');
            td3.innerHTML = global.formateDate(data.deadline_date);
            let td4 = document.createElement('td');
            let button = document.createElement('button');
            button.innerHTML = 'Edit';
            button.addEventListener('click', () => {
                viewAssessment.buttonViewAssessment(docu.id)
            });

            //button.id = docu.id;
            let button2 = document.createElement('button');
            button2.addEventListener('click', () => {
                viewAssessment.buttonViewAssessment(docu.id)
            });
            let td5 = document.createElement('td');
            button2.innerHTML = 'Details';
            td5.appendChild(button);
            td4.appendChild(button2);
            tr.append(td1, td2, td3, td4, td5);
            assessments.appendChild(tr);
        });
    });
    console.log('showAllAssessments');
}


// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- AUTHENTIFICATIONS -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //


onAuthStateChanged(auth, (user) => {
    //AuthChanges(user);
    showAllAssessments();
});

const user = auth.currentUser;