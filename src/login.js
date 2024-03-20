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

import * as global from "./global.js";


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
        console.log("This user doesn't exists", errorCode)
    });
}

passwordResetform.addEventListener('submit', (e) => {
    e.preventDefault();
    forgotPassword();
});