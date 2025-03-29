import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjgJP2VKCnpPWWsB-jPgmwmwbXecK08Q0",
  authDomain: "beupyq.firebaseapp.com",
  projectId: "beupyq",
  storageBucket: "beupyq.firebasestorage.app",
  messagingSenderId: "108487799051",
  appId: "1:108487799051:web:2607436919d1e6ab81720e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check if we're on login, signup or forgot-password page
const authPages = ['login.html', 'signup.html', 'forgot-password.html'];
const currentPage = window.location.pathname.split('/').pop();

if (!authPages.includes(currentPage)) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'login.html';
    }
  });
}

// If we're on login page and already authenticated, redirect to index
if (authPages.includes(currentPage)) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = 'index.html';
    }
  });
}