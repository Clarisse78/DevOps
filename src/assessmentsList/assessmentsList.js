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
import * as editAssessment from "./editAssessment.js";


const auth = getAuth();




// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Collections -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const usersQuery = collection(global.db, "user");

const subjectsQuery = collection(global.db, "module");

const usersModuleQuery = collection(global.db, "usermodule");

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
            let button = document.createElement('button');
            button.innerHTML = 'Edit';
            button.addEventListener('click', () => {
                editAssessment.buttonEditAssessment(docu.id);
            });

            //button.id = docu.id;

            let td5 = document.createElement('td');
            td5.appendChild(button);
            tr.append(td1, td2, td3, td5);
            assessments.appendChild(tr);
        });
    });
    console.log('showAllAssessments');
}

function showAssessmentStudent() {
    const userModuleQuer = query(usersModuleQuery, where("user_id", '==', userId));
    onSnapshot(userModuleQuer, (querySnapshot) => {
        querySnapshot.forEach((docu) => {
            const moduleQuery = query(assesmentRef, where("module_id", '==', docu.data().module_id));
            onSnapshot(moduleQuery, (docSnapshot) => {
                docSnapshot.forEach((docu2) => {
                    const data1 = docu2.data();
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    td1.innerHTML = data1.title;
                    let td2 = document.createElement('td');
                    td2.innerHTML = global.formateDate(data1.start_date);
                    let td3 = document.createElement('td');
                    td3.innerHTML = global.formateDate(data1.deadline_date);
                    let td4 = document.createElement('td');

                    //button.id = docu.id;
                    let button2 = document.createElement('button');
                    button2.addEventListener('click', () => {
                        viewAssessment.buttonViewAssessment(docu2.id);
                    });
                    button2.innerHTML = 'Details';
                    td4.appendChild(button2);
                    tr.append(td1, td2, td3, td4);
                    assessments.appendChild(tr);
                });
            });
        });
    });
}


// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- AUTHENTIFICATIONS -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const user = auth.currentUser;
let userId = "0";

onAuthStateChanged(auth, (user) => {
    //AuthChanges(user);
    if (user == null) {
        window.location.replace("index.html");
        return;
    }
    const subjectsQuery = query(usersQuery, where("id_user", '==', user.uid));
    onSnapshot(subjectsQuery, (querySnapshot) => {
        querySnapshot.forEach((docu) => {
            userId = docu.id;
            document.body.style.display = "block";
            if (!docu.data().role) {
                showAssessmentStudent();
            }
            else {
                showAllAssessments();
            }
        });
    }, (error) => {
        window.location.replace("index.html");
    });
});

