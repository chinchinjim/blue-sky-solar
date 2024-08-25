import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
// // TODO: Add SDKs for Firebase products that you want to use    
// // https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC88VLN1gxHyi2E73yLl2c58kkVDLfDvpI",
    authDomain: "testproject-1038c.firebaseapp.com",
    projectId: "testproject-1038c",
    storageBucket: "testproject-1038c.appspot.com",
    messagingSenderId: "188994478508",
    appId: "1:188994478508:web:b1b553367ed0eb1fc85a09"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const functions = getFunctions(firebase);

const stripe = Stripe("pk_test_51PYCFlI21Ij6EeLCHATlv2rGlB6MU9fBSZAbf25JTpOMCAji3jCj9qv23vVInllVB4J264haQVpVf16Er3BL6S3s003NqeB3Sc");

const button = document.getElementById("click")
const stripeCheckout = httpsCallable(functions, 'create_checkout')


button.addEventListener('click', () => {
    stripeCheckout()
        .then(response => {
            const 
        })
})