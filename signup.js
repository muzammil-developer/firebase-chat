import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";
import { auth, db } from "./firebase-config.js";

const signupForm = document.getElementById("signup-form");
const signupNameInput = document.getElementById("signup-name");
const signupEmailInput = document.getElementById("signup-email");
const signupPasswordInput = document.getElementById("signup-password");
const authError = document.getElementById("auth-error");

let isSigningUp = false;

function showError(message) {
  authError.textContent = message;
  authError.classList.remove("hidden");
}

onAuthStateChanged(auth, (user) => {
  if (user && !isSigningUp) {
    window.location.replace("./dashboard.html");
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.classList.add("hidden");

  const name = signupNameInput.value.trim();
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;

  if (!name || !email || !password) return;

  isSigningUp = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save registered user in Firebase Realtime Database
    await set(ref(db, `users/${user.uid}`), {
      uid: user.uid,
      name: name,
      email: email,
    });

    window.location.replace("./dashboard.html");
  } catch (error) {
    isSigningUp = false;
    showError(error.message);
  }
});
