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
const db = getFirestore()

const auth = getAuth();




// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Collections -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const subjectsQuery = collection(db, "module");

const submissionRef = collection(db, 'submission')



// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Elements -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

// Select
const selectModule = document.getElementById('module-select');
const selectMonth = document.getElementById('month-select');

// Div to append the assessments details
const studentAssessments = document.getElementById('student-assessments');

// Buttons
let buttonSeeAssessments = document.getElementById('see-assessments');


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
// *------------- Formating the date timestramp -----------* //
// *-------------------------------------------------------------------------------* //

function addLeadingZero(number) {
    return number < 10 ? "0" + number : number;
}

function formateDate(date) {
    const dateF = date.toDate();
    const year = addLeadingZero(dateF.getFullYear());
    const month = addLeadingZero(dateF.getMonth() + 1);
    const day = addLeadingZero(dateF.getDate());
    return `${day}/${month}/${year}`;
}


// *-------------------------------------------------------------------------------* //
// *------------- Show the student assessments -----------* //
// *-------------------------------------------------------------------------------* //

function updateStudentAssessements() {
    // Delete the previous assessments
    studentAssessments.innerHTML = "";

    // Get the selected module
    let key = selectModule.options[selectModule.selectedIndex].id;
    let assessmentsQuery = collection(db, 'assesment')

    if (key != "all-module") {
        const assessmentsRef = collection(db, 'assesment')
        assessmentsQuery = query(assessmentsRef, where('module_id', '==', key.slice(0, -6)));
    }

    // Get the assessments
    onSnapshot(assessmentsQuery, (querySnapshot) => {
        querySnapshot.forEach((docu) => {

            // Get the submissions in the assessment
            const submissionQuery = query(submissionRef, where('assesment_id', '==', docu.id));
            if (submissionQuery == null) {
                console.log("No submissions for this assessment!");
                return;
            }

            // Create the list of the assessments
            let grade = document.createElement('td');
            let status = document.createElement('td');
            let dueDate = document.createElement('td');
            let user = document.createElement('td');
            let submissionDate = document.createElement('td');

            // Fill the list with the assessments details
            grade.innerHTML = "-";
            status.innerHTML = "Not Graded";

            let deadline_date = docu.data().deadline_date;
            let selectedMonth = selectMonth.options[selectMonth.selectedIndex].value;

            if (selectedMonth == "all" || (deadline_date.toDate().getMonth() + 1 == selectedMonth)) {
                dueDate.innerHTML = formateDate(deadline_date);

                // Get the submissions
                onSnapshot(submissionQuery, (querySnapshot) => {
                    querySnapshot.forEach((docu2) => {

                        let data = docu2.data();

                        // Fill the list with the assessments details
                        submissionDate.innerHTML = formateDate(data.submission_date);
                        grade.innerHTML = data.grade;
                        status.innerHTML = "Graded";

                        // Get the user
                        const userE = doc(db, 'user', data.user_id)

                        getDoc(userE).then((docSnapshot) => {
                            if (docSnapshot.exists()) {
                                let data = docSnapshot.data();
                                user.innerHTML = data.full_name;
                            } else {
                                console.log("This user doesn't exists!");
                            }
                        }).catch((error) => {
                            console.error("Error getting this user:", error);
                        });
                    });
                }, (error) => {
                    console.log("Error getting documents: ", error);
                });

                // Append the assessment to the table
                let tr = document.createElement('tr');
                tr.append(user, submissionDate, dueDate, grade, status);
                studentAssessments.append(tr);
            }
        });
    }, (error) => {
        console.log("Error getting documents: ", error);
    });
    studentAssessments.append();
}



// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Event Listener -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

// *-------------------------------------------------------------------------------* //
// *-------- Button for see the assessments --------* //
// *-------------------------------------------------------------------------------* //
buttonSeeAssessments.addEventListener('click', updateStudentAssessements);




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