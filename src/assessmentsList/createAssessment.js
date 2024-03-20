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

const assessmentRef = collection(global.db, 'assesment')


// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Elements -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

// Selects
const selectModule = document.getElementById('module-select');

// Forms
const formModule = document.querySelector('.add-assessment');

// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Functions -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

// *-------------------------------------------------------------------------------* //
// *-------- Update the select with the all the modules --------* //
// *-------------------------------------------------------------------------------* //

function updateSelectModule() {
    onSnapshot(subjectsQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            addModuleToSelect(doc.data(), doc.id);
        });
    }, (error) => {
        console.log("Error getting documents: ", error);
    });
}


// *-------------------------------------------------------------------------------* //
// *-------- Add one module to the select object --------* //
// *-------------------------------------------------------------------------------* //
function addModuleToSelect(data, key) {
    const option = document.createElement('option');
    option.value = data.name;
    option.text = data.name;
    option.id = key + "select";
    selectModule.appendChild(option);
}

// *-------------------------------------------------------------------------------* //
// *-------------------------- Create a new assessment ----------------------------* //
// *-------------------------------------------------------------------------------* //
formModule.addEventListener('submit', (e) => {
    e.preventDefault();
    let choice = selectModule.options[selectModule.selectedIndex].id;
    addDoc(assessmentRef, {
        module_id: choice.slice(0, -6),
        title: formModule.title.value,
        start_date: Timestamp.fromDate(new Date(formModule.start_date.value)),
        description: formModule.description.value,
        deadline_date: Timestamp.fromDate(new Date(formModule.deadline_date.value)),
    })
        .then(() => {
            console.log('Assessment added');
        })
        .catch((error) => {
            console.error('Error adding assessment:', error);
        });
    formModule.reset();
});



// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- AUTHENTIFICATIONS -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //


onAuthStateChanged(auth, (user) => {
    //AuthChanges(user);
    updateSelectModule();
});

const user = auth.currentUser;