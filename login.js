import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const loginForm = document.getElementById("login-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const authError = document.getElementById("auth-error");

function showError(message) {
  authError.textContent = message;
  authError.classList.remove("hidden");
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("./dashboard.html");
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.classList.add("hidden");

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  if (!email || !password) return;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("./dashboard.html");
  } catch (error) {
    showError(error.message);
  }
});
