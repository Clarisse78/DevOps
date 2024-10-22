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



const auth = getAuth();




// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Collections -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const subjectsQuery = collection(global.db, "module");

const submissionRef = collection(global.db, 'submission')

const assesmentRef = collection(global.db, 'assesment')
const usersQuery = collection(global.db, "user");


// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Elements -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const buttonAddAssessment = document.getElementById('add-assessments');

const detailsDivAssessment = document.querySelector('.details-assessment');



// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Functions -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //



function datesDiff(a, b) {
    a = a.getTime();
    b = (b || new Date()).getTime();
    var c = a > b ? a : b,
        d = a > b ? b : a;
    return Math.abs(Math.ceil((c - d) / 86400000));
}

export function buttonViewAssessment(key) {
    window.viewAssessment.showModal();
    detailsDivAssessment.innerHTML = '';
    const docRef = doc(global.db, 'assesment', key);
    const docSnap = getDoc(docRef);
    let a = document.createElement('a');
    a.innerHTML = "Open Date";
    let a2 = document.createElement('a');
    a2.innerHTML = "Due Date";
    let box = document.createElement('box');
    let box2 = document.createElement('box');
    let div = document.createElement('div');
    let div2 = document.createElement('div');


    let rowAssessment = document.querySelector(".row-viewAssessment");
    rowAssessment.innerHTML = '';
    let divSubStatus = document.createElement('div');
    let divGradingStatus = document.createElement('div');
    let divTime = document.createElement('div');
    let lastModified = document.createElement('div');

    let a1 = document.createElement('a');
    let a3 = document.createElement('a');

    let a4 = document.createElement('a');
    let a5 = document.createElement('a');
    let a6 = document.createElement('a');
    let a7 = document.createElement('a');

    let a8 = document.createElement('a');
    let a9 = document.createElement('a');
    docSnap.then((docu) => {
        if (docu.exists()) {
            const data = docu.data();



            box.innerHTML = global.formateDate(data.start_date);

            box2.innerHTML = global.formateDate(data.deadline_date);
            a1.innerText = "Submission Status";
            a3.innerText = "No submissions have been made yet";


            a4.innerText = "Grading Status";
            a5.innerText = "Not Graded";




            a6.innerText = "Time Remaining";
            let today = new Date();
            if (today > data.deadline_date.toDate()) {
                a7.innerText = "Deadline Passed";
            }
            else {
                a7.innerText = datesDiff(today, data.deadline_date.toDate()) + " days remaining";
            }
            divTime.append(a6, a7);

            a8.innerText = "Last Modified";
            a9.innerText = "-" // To modify when student linked to assessment


            //Docu.id query for submission for assessment_id and user_id
            const submissionQuery = query(submissionRef, where('assesment_id', '==', docu.id), where('user_id', '==', userId));
            onSnapshot(submissionQuery, (querySnapshot) => {
                querySnapshot.forEach((docu2) => {
                    let data2 = docu2.data();

                    if (data2.file_path != String.empty) {
                        a3.innerText = "Submission has been made";
                        a9.innerText = global.formateDate(data2.submission_date);
                    }
                    if (data2.grade != null) {
                        a5.innerText = data2.grade;
                    }// To modify when student linked to assessment
                });
            });
            divSubStatus.append(a1, a3);

            divGradingStatus.append(a4, a5);
            lastModified.append(a8, a9);
        }
    });



    div.append(a, box);
    div2.append(a2, box2);

    rowAssessment.append(divSubStatus, divGradingStatus, divTime, lastModified);

    detailsDivAssessment.append(div, div2);
}

// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- AUTHENTIFICATIONS -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

let userId = "null";

onAuthStateChanged(auth, (user) => {
    const subjectsQuery = query(usersQuery, where("id_user", '==', user.uid));
    onSnapshot(subjectsQuery, (querySnapshot) => {
        querySnapshot.forEach((docu) => {
            userId = docu.id;
        });
    }, (error) => {
    });
});

const user = auth.currentUser;