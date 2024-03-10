import { initializeApp } from 'firebase/app';
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



const auth = getAuth();

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value;
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user logged in: ', cred.user)
            loginForm.reset()
            window.location.href = 'index.html';
            console.log('user logged in: ', cred.user.email)
        })
        .catch((err) => {
            console.log(err.message)
        })
})


const passwordResetform = document.querySelector('.resetPassword');

let forgotPassword = () => {
    sendPasswordResetEmail(auth, passwordResetform.email.value).then(() => {
        alert('Password reset email sent!');
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode)
    });
}

passwordResetform.addEventListener('submit', (e) => {
    e.preventDefault();
    forgotPassword();
});