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

const formEditAssessment = document.querySelector('.edit-assessment');

const selectModule = document.getElementById('module-select-edit');

// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Functions -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

export function buttonEditAssessment(assessmentId) {
    window.editAssessment.showModal();
    const docRef = doc(global.db, "assesment", assessmentId);
    document.querySelector(".button-submit-edit").id = assessmentId + "edit";
    getDoc(docRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();

            // Show the good option in the select (with the data.module_id)
            const option = document.getElementById(data.module_id + "select");
            option.selected = true;

            const date1 = new Date(data.start_date * 1000);
            date1.setDate(date1.getDate() + 1);
            date1.setFullYear(date1.getFullYear() - 1969);
            const formattedDate = date1.toISOString().split('T')[0];

            const date2 = new Date(data.deadline_date * 1000);
            date2.setDate(date2.getDate() + 1);
            date2.setFullYear(date2.getFullYear() - 1969);
            const formattedDate2 = date2.toISOString().split('T')[0];

            formEditAssessment.start_date.value = formattedDate;
            formEditAssessment.deadline_date.value = formattedDate2;
            formEditAssessment.description.value = data.description;
            formEditAssessment.title.value = data.title;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}

formEditAssessment.addEventListener('submit', (e) => {
    e.preventDefault();
    let choice = selectModule.selectedIndex;
    if (choice == -1) {
        return;
    }
    let assessment_id = selectModule.options[choice].id.slice(0, -6);
    const assessmentRef = doc(global.db, "assesment", document.querySelector(".button-submit-edit").id.slice(0, -4));

    updateDoc(assessmentRef, {
        title: formEditAssessment.title.value,
        deadline_date: Timestamp.fromDate(new Date(formEditAssessment.deadline_date.value)),
        start_date: Timestamp.fromDate(new Date(formEditAssessment.start_date.value)),
        description: formEditAssessment.description.value,
        module_id: selectModule.options[choice].id.slice(0, -6)
    });
    /*document.getElementById(subject_id).childNodes[0].innerHTML = form_EditSubject.name.value;
    document.getElementById(subject_id + "label").value = form_EditSubject.name.value;
    document.getElementById(subject_id + "label").text = form_EditSubject.name.value;
    document.getElementById(subject_id + "edit").text = form_EditSubject.name.value;
    document.getElementById(subject_id + "edit").value = form_EditSubject.name.value;*/
    window.editAssessment.close();
});





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
            updateSelectModule();
        });
    }, (error) => {
    });
});

const user = auth.currentUser;