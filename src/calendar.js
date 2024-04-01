
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

import {
    getStorage,
    ref,
    uploadBytes,
} from "firebase/storage";


import * as global from "./global.js";


const auth = getAuth();




// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Collections -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

const subjectsQuery = collection(global.db, "module");

const submissionRef = collection(global.db, 'submission')

const assessmentRef = collection(global.db, 'assesment');
const usersModuleQuery = collection(global.db, "usermodule");

// Selects
const selectModule = document.getElementById('module-select');

// Forms
const formModule = document.querySelector('.add-assessment');

// Storage
const storage = getStorage();

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

const selectModuleEdit = document.getElementById('module-select-edit');


// *-------------------------------------------------------------------------------* //
// *-------- Add one module to the select object --------* //
// *-------------------------------------------------------------------------------* //
function addModuleToSelect(data, key) {
    const option = document.createElement('option');
    option.value = data.name;
    option.text = data.name;
    option.id = key + "select";
    const option2 = document.createElement('option');
    option2.value = data.name;
    option2.text = data.name;
    option2.id = key + "selectE";
    selectModule.appendChild(option);
    selectModuleEdit.appendChild(option2);
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
            window.addAssessment.close();
        })
        .catch((error) => {
            console.error('Error adding assessment:', error);
        });
    formModule.reset();
});




// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- Calendar -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //

var ns6 = document.getElementById && !document.all;
var ie4 = document.all;

var Selected_Month;
var Selected_Year;
var Current_Date = new Date();
var Current_Month = Current_Date.getMonth();

var Days_in_Month = new Array(
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
);
var Month_Label = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
);

var Current_Year = Current_Date.getYear();
if (Current_Year < 1000) Current_Year += 1900;

var Today = Current_Date.getDate();

function Header(Year, Month) {
    if (Month == 1) {
        Days_in_Month[1] =
            Year % 400 == 0 || (Year % 4 == 0 && Year % 100 != 0) ? 29 : 28;
    }
    var Header_String = Month_Label[Month] + " " + Year;
    return Header_String;
}

let role = false;

let userId = '';

var dates = [];
var idAssessment = [];
let counterDate = 0;
function setDates() {
    return new Promise((resolve, reject) => {
        const assQuery = query(assessmentRef, orderBy('deadline_date'));
        if (!role) {
            const userModuleQuer = query(usersModuleQuery, where("user_id", '==', userId));
            onSnapshot(userModuleQuer, (querySnapshot1) => {
                let size = querySnapshot1.size;
                if (size == 0) {
                    resolve();
                }
                let count = 0;
                querySnapshot1.forEach((docu) => {
                    let module_id = docu.data().module_id;
                    const assesmentQuery = query(assessmentRef, where('module_id', '==', module_id));

                    onSnapshot(assesmentQuery, (querySnapshot2) => {
                        let size3 = querySnapshot2.size;
                        if (size3 == 0) {
                            resolve();
                        }
                        const docs = querySnapshot2.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                        docs.sort((a, b) => a.deadline_date.toDate() - b.deadline_date.toDate());
                        docs.forEach((doc) => {
                            dates.push(doc.deadline_date.toDate());
                            idAssessment.push(doc.id);
                            if (++counterDate == size3 && size == count) resolve();
                        });
                    });
                    count++;
                });
            });
            return;
        }
        onSnapshot(assQuery, (querySnapshot) => {
            let size = querySnapshot.size;
            if (size == 0) {
                resolve();
            }
            let count = 0;
            querySnapshot.forEach((doc) => {
                dates.push(doc.data().deadline_date.toDate());
                idAssessment.push(doc.id);
                if (++counterDate === size) resolve();
            });
        }, (error) => {
            console.log("Error getting documents: ", error);
        });
    });
}



function isDayAssignement(Year, Month, Day, i) {
    for (; i < counterDate; i++)
        if (dates[i].getFullYear() == Year && dates[i].getMonth() == Month && dates[i].getDate() == Day) {
            return i;
        }
    return -1;
}

export function showAssessmentClick(key) {
    viewAssessmentAdmin(key);
}

function Make_Calendar(Year, Month) {
    return new Promise((resolve, reject) => {
        var First_Date = new Date(Year, Month, 1);
        var Heading = Header(Year, Month);
        var First_Day = First_Date.getDay() + 1;
        if (
            (Days_in_Month[Month] == 31 && First_Day >= 6) ||
            (Days_in_Month[Month] == 30 && First_Day == 7)
        ) {
            var Rows = 6;
        } else if (Days_in_Month[Month] == 28 && First_Day == 1) {
            var Rows = 4;
        } else {
            var Rows = 5;
        }

        var HTML_String =
            '<table><tr><td valign="top"><table BORDER=4 CELLSPACING=1 cellpadding=2 FRAME="box" BGCOLOR="C0C0C0" BORDERCOLORLIGHT="808080" style="width: 350px;display: block;">';

        HTML_String +=
            '<tr><th colspan=7 BGCOLOR="FFFFFF" BORDERCOLOR="000000">' +
            Heading +
            "</font></th></tr>";

        HTML_String +=
            '<tr><th ALIGN="CENTER" BGCOLOR="FFFFFF" BORDERCOLOR="000000">Sun</th><th ALIGN="CENTER" BGCOLOR="FFFFFF" BORDERCOLOR="000000">Mon</th><th ALIGN="CENTER" BGCOLOR="FFFFFF" BORDERCOLOR="000000">Tue</th><th ALIGN="CENTER" BGCOLOR="FFFFFF" BORDERCOLOR="000000">Wed</th>';

        HTML_String +=
            '<th ALIGN="CENTER" BGCOLOR="FFFFFF" BORDERCOLOR="000000">Thu</th><th ALIGN="CENTER" BGCOLOR="FFFFFF" BORDERCOLOR="000000">Fri</th><th ALIGN="CENTER" BGCOLOR="FFFFFF" BORDERCOLOR="000000">Sat</th></tr>';

        var Day_Counter = 1;
        var Loop_Counter = 1;
        let counterI = 0;
        let counterTemp = -1;
        for (var j = 1; j <= Rows; j++) {
            HTML_String += '<tr ALIGN="left" VALIGN="top">';
            for (var i = 1; i < 8; i++) {
                if (
                    Loop_Counter >= First_Day &&
                    Day_Counter <= Days_in_Month[Month]
                ) {
                    counterTemp = isDayAssignement(Year, Month, Day_Counter, counterI);
                    if (counterTemp != -1) {
                        counterI = counterTemp;
                        if (
                            Day_Counter == Today &&
                            Year == Current_Year &&
                            Month == Current_Month
                        ) {
                            HTML_String +=
                                '<td id="' + idAssessment[counterI] + 'cal" BGCOLOR="#888" BORDERCOLOR="000000" style="cursor:pointer;text-align:center;vertical-align:middle"><strong><font color="red">' +
                                Day_Counter +
                                "</font></strong></td>";
                        }
                        else {
                            HTML_String +=
                                '<td id="' + idAssessment[counterI] + 'cal" BGCOLOR="#888" BORDERCOLOR="000000" style="cursor:pointer;text-align:center;vertical-align:middle">' +
                                Day_Counter +
                                "</td>";
                        }
                    }
                    else if (
                        Day_Counter == Today &&
                        Year == Current_Year &&
                        Month == Current_Month
                    ) {
                        HTML_String +=
                            '<td BGCOLOR="FFFFFF" BORDERCOLOR="000000" style="text-align:center;vertical-align:middle"><strong><font color="red">' +
                            Day_Counter +
                            "</font></strong></td>";
                    }
                    else {
                        HTML_String +=
                            '<td BGCOLOR="FFFFFF" BORDERCOLOR="000000" style="text-align:center;vertical-align:middle">' +
                            Day_Counter +
                            "</td>";
                    }
                    Day_Counter++;
                } else {
                    HTML_String += '<td BORDERCOLOR="C0C0C0"> </td>';
                }
                Loop_Counter++;
            }
            HTML_String += "</tr>";
        }
        HTML_String += "</table></td></tr></table>";
        let cross_el = ns6
            ? document.getElementById("Calendar")
            : document.all.Calendar;
        cross_el.innerHTML = HTML_String;
        resolve();
    });

}

function Check_Nums() {
    if (event.keyCode < 48 || event.keyCode > 57) {
        return false;
    }
}

function On_Year() {
    var Year = document.when.year.value;
    if (Year.length == 4) {
        Selected_Month = document.when.month.selectedIndex;
        Selected_Year = Year;
        Make_All_Calendar(Selected_Year, Selected_Month);
    }
}

function On_Month() {
    var Year = document.when.year.value;
    if (Year.length == 4) {
        Selected_Month = document.when.month.selectedIndex;
        Selected_Year = Year;
        Make_All_Calendar(Selected_Year, Selected_Month);
    } else {
        alert("Please enter a valid year.");
        document.when.year.focus();
    }
}


function datesDiff(a, b) {
    a = a.getTime();
    b = (b || new Date()).getTime();
    var c = a > b ? a : b,
        d = a > b ? b : a;
    return Math.abs(Math.ceil((c - d) / 86400000));
}


const detailsDivAssessment = document.querySelector('.details-assessment');

function viewAssessmentStudent(key) {
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
                        if (data2.submission_date != null) {
                            a9.innerText = global.formateDate(data2.submission_date);
                        }
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


function viewAssessmentAdmin(key) {
    window.viewAssessment.showModal();
    detailsDivAssessment.innerHTML = '';
    const docRef = doc(global.db, 'assesment', key);
    const docSnap = getDoc(docRef);
    let a = document.createElement('a');
    a.innerHTML = "Open Date: ";
    let a2 = document.createElement('a');
    a2.innerHTML = "Due Date: ";
    let a3 = document.createElement('a');
    a3.innerHTML = "Title: ";
    let a4 = document.createElement('a');
    a4.innerHTML = "Description: ";
    let box = document.createElement('box');
    let box2 = document.createElement('box');
    let div = document.createElement('div');
    let div2 = document.createElement('div');
    let box3 = document.createElement('box');
    let box4 = document.createElement('box');
    let div3 = document.createElement('div');
    let div4 = document.createElement('div');

    let divTime = document.createElement('div');
    let a6 = document.createElement('a');
    let a7 = document.createElement('a');

    docSnap.then((docu) => {
        if (docu.exists()) {
            const data = docu.data();
            box.innerHTML = global.formateDate(data.start_date);
            box2.innerHTML = global.formateDate(data.deadline_date);
            box3.innerHTML = data.title;
            box4.innerHTML = data.description;
            a6.innerText = "Time Remaining: ";
            let today = new Date();
            if (today > data.deadline_date.toDate()) {
                a7.innerText = "Deadline Passed";
            }
            else {
                a7.innerText = datesDiff(today, data.deadline_date.toDate()) + " days remaining";
            }
            divTime.append(a6, a7);
        }
    });
    div.append(a, box);
    div2.append(a2, box2);
    div3.append(a3, box3);
    div4.append(a4, box4);

    detailsDivAssessment.append(div, div2, div3, div4, divTime);
}

const showAssessments = document.getElementById('showAssessments');
function showAssessment(key) {
    onSnapshot(doc(assessmentRef, key), (docu) => {

        if (docu.exists()) {
            let ddata = docu.data();
            let div = document.createElement('div');
            div.classList.add('assessment');
            div.id = docu.id + "Ass";
            if (document.getElementById(div.id) == null) {
                let divoui = document.createElement("div");
                let h1 = document.createElement('h1');
                let h2 = document.createElement('h2');
                let h22 = document.createElement('h2');
                let h3 = document.createElement('h3');
                let date = ddata.deadline_date.toDate();
                let dateDay = date.toLocaleDateString('en-GB', {
                    day: 'numeric'
                })

                let dateMonth = date.toLocaleDateString('en-GB', {
                    month: 'numeric'
                })
                let dateYear = date.toLocaleDateString('en-GB', {
                    year: 'numeric'
                })
                h1.innerText = date.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                })
                h2.innerText = "Due: " + date.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                let divv = document.createElement('div');
                let button = document.createElement('button');
                if (role) {
                    button.innerHTML = 'Edit';
                    button.addEventListener('click', () => {
                        buttonEditAssessment(docu.id);
                    });
                } else {
                    button.innerHTML = 'Submit';
                    button.addEventListener('click', () => {
                        viewAssessmentStudent(docu.id);
                        document.querySelector(".submit-assessment").id = key + "submit";
                    });
                }
                h22.innerText = ddata.title;
                if (!role) {
                    const submissionQuery = query(submissionRef, where('assesment_id', '==', docu.id), where('user_id', '==', userId));
                    onSnapshot(submissionQuery, (querySnapshot) => {
                        querySnapshot.forEach((docu3) => {
                            let data2 = docu3.data();

                            if (data2.file_path != String.empty) {
                                h3.innerText = "Submitted";
                            }
                        });
                    });
                    h3.innerText = "Not Submitted";
                    if (date > new Date()) {
                        document.getElementById("submit-button").innerHTML = `<button>Submit</button>`;
                    }
                    else {
                        document.getElementById("submit-button").innerHTML = ``;
                    }
                }
                else {
                    h3.innerText = Today > dateDay && dateMonth <= (Current_Month + 1) && dateYear <= Current_Year ? "Closed" : "Open";
                }
                onSnapshot(doc(subjectsQuery, ddata.module_id), (docu2) => {
                    h1.innerText += " - " + docu2.data().name;
                });
                button.classList.add('button-ass');
                divv.append(h3, button);
                divv.classList.add('div-button');
                divoui.append(h1, h22, h2);
                div.append(divoui, divv);
                showAssessments.append(div);
            }
        }

    }, (error) => {
        console.log("Error getting document:", error);
    });
}

function Make_All_Calendar(Year, Month) {
    return new Promise((resolve, reject) => {
        Make_Calendar(Year, Month).then(() => {
            showAssessments.innerHTML = '';
            for (let counterI = 0; counterI < counterDate; counterI++) {
                let docYear = document.getElementById(idAssessment[counterI] + 'cal');
                if (docYear != null) {
                    docYear.addEventListener('click', () => {
                        showAssessmentClick(idAssessment[counterI]);
                    });
                    showAssessment(idAssessment[counterI]);
                    while (counterI + 1 < counterDate && dates[counterI].getDay() == dates[counterI + 1].getDay()
                        && dates[counterI].getMonth() == dates[counterI + 1].getMonth() && dates[counterI].getFullYear() == dates[counterI + 1].getFullYear()) {
                        counterI++;
                        docYear.addEventListener('click', () => {
                            showAssessmentClick(idAssessment[counterI]);
                        });
                        showAssessment(idAssessment[counterI]);
                    }
                };
            }
            resolve();
        });
    });
}

function Defaults() {
    return new Promise((resolve, reject) => {
        if (!ie4 && !ns6) return;
        var Mid_Screen = Math.round(document.body.clientWidth / 2);
        document.when.month.selectedIndex = Current_Month;
        document.when.year.value = Current_Year;
        Selected_Month = Current_Month;
        Selected_Year = Current_Year;
        setDates().then(() => {
            Make_All_Calendar(Current_Year, Current_Month).then(() => { resolve(); });
        });
    });
}

function Skip(Direction) {
    if (Direction == "+") {
        if (Selected_Month == 11) {
            Selected_Month = 0;
            Selected_Year++;
        } else {
            Selected_Month++;
        }
    } else {
        if (Selected_Month == 0) {
            Selected_Month = 11;
            Selected_Year--;
        } else {
            Selected_Month--;
        }
    }
    Make_All_Calendar(Selected_Year, Selected_Month);
    document.when.month.selectedIndex = Selected_Month;
    document.when.year.value = Selected_Year;
}

const buttonSkip = document.getElementById('buttonSkip');
const buttonSkip2 = document.getElementById('buttonSkip2');
buttonSkip.addEventListener('click', () => {
    Skip('+');
});
buttonSkip2.addEventListener('click', () => {
    Skip('-');
});

const selectMonth = document.getElementById('selectMonth');
selectMonth.addEventListener('change', () => {
    On_Month();
});

const returnText = document.getElementById('returnText');
returnText.addEventListener('change', () => {
    console.log('onKeyPress');
    On_Year();
});

if (ie4 || ns6) {
    for (var j = 0; j < Month_Label.length; j++) {
        let option = document.createElement("option");
        option.value = "j";
        option.innerText = Month_Label[j];

        selectMonth.append(option);
    }
}
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //


const formEditAssessment = document.querySelector('.edit-assessment');

function buttonEditAssessment(assessmentId) {
    window.editAssessment.showModal();
    const docRef = doc(global.db, "assesment", assessmentId);
    document.querySelector(".button-submit-edit").id = assessmentId + "edit";
    getDoc(docRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();

            // Show the good option in the select (with the data.module_id)
            const option = document.getElementById(data.module_id + "selectE");
            option.selected = true;

            const date1 = new Date(data.start_date * 1000);
            date1.setDate(date1.getDate());
            date1.setHours(10, 42, 0, 0); // Set time to 00:01:00.000
            if (date1.getMonth() <= 1) {
                date1.setDate(date1.getDate() + 1);
            }
            date1.setFullYear(date1.getFullYear() - 1969);
            const formattedDate = date1.toISOString().split('T')[0];

            const date2 = new Date(data.deadline_date * 1000);
            date2.setDate(date2.getDate());
            date2.setHours(10, 42, 0, 0); // Set time to 00:01:00.000
            if (date2.getMonth() <= 1) {
                date2.setDate(date2.getDate() + 1);
            }
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

function sortByFirstArray(arr1, arr2) {
    var index = Array.from(Array(arr1.length).keys());
    index.sort(function (a, b) {
        return arr1[a] < arr1[b] ? -1 : (arr1[a] > arr1[b] ? 1 : 0);
    });
    return [index.map(i => arr1[i]), index.map(i => arr2[i])];
}

formEditAssessment.addEventListener('submit', (e) => {
    e.preventDefault();
    let choice = selectModuleEdit.selectedIndex;
    if (choice == -1) {
        return;
    }
    let docId = document.querySelector(".button-submit-edit").id.slice(0, -4);
    const assessmentRef = doc(global.db, "assesment", docId);
    updateDoc(assessmentRef, {
        title: formEditAssessment.title.value,
        deadline_date: Timestamp.fromDate(new Date(formEditAssessment.deadline_date.value)),
        start_date: Timestamp.fromDate(new Date(formEditAssessment.start_date.value)),
        description: formEditAssessment.description.value,
        module_id: selectModuleEdit.options[choice].id.slice(0, -7)
    }).then(() => {
        window.location.reload();
    });
});


const submitAssessment = document.querySelector(".submit-assessment")
const fileInput = document.getElementById('file-upload');
submitAssessment.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérez tous les fichiers du champ de formulaire
    const files = fileInput.files;

    // Obtenez le nom de la matière sélectionnée
    const assessmentI = document.querySelector(".submit-assessment").id;
    console.log("je suis la !");
    const name = submitAssessment.name.value;

    addDoc(submissionRef, {
        submission_date: serverTimestamp(),
        assesment_id: assessmentI.slice(0, -6),
        user_id: userId,
        file_path: `user_files / ${userId} /${assessmentI}/`
    })
        .then(() => {
            console.log('Submission added');
            submitAssessment.reset();
        })
        .catch((error) => {
            console.error('Error adding subject:', error);
        });
    // Uploadez chaque fichier
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Créez une référence à l'emplacement de stockage
        const storageRef = ref(storage, `user_files /${userId}/${assessmentI.slice(0, -6)}/${file.name} `);

        // Uploadez le fichier
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Fichier uploadé avec succès !');
        });
    }
    window.viewAssessment.close();
});




// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
// *----------------------- AUTHENTIFICATIONS -------------------------------* //
// *-------------------------------------------------------------------------------* //
// *-------------------------------------------------------------------------------* //
const usersQuery = collection(global.db, "user");

function mainFunction(docu) {
    return new Promise((resolve, reject) => {
        userId = docu.id;
        document.body.style.display = "block";
        if (docu.data().role) {
            role = true;
            let button = document.createElement('button');
            button.id = "add-assessments";
            button.innerHTML = "Create a new assessment";
            button.addEventListener('click', () => {
                window.addAssessment.showModal();
            });
            document.getElementById("create-assessment").appendChild(button);
        }
        else {
            role = false;
        }
        resolve();
    });
}

onAuthStateChanged(auth, (user) => {
    const subjectsQuery = query(usersQuery, where("id_user", '==', user.uid));
    onSnapshot(subjectsQuery, (querySnapshot) => {
        querySnapshot.forEach((docu) => {
            mainFunction(docu).then(() => {
                Defaults().then(() => {
                    updateSelectModule();
                    document.body.style.display = "block";
                });
            });
        });
    }, (error) => {
    });
});

const user = auth.currentUser;