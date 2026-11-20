import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBw_7HoXTldpuklRG57V-rWeWrYdgXDlf4",
  authDomain: "chat-76079.firebaseapp.com",
  databaseURL: "https://chat-76079-default-rtdb.firebaseio.com",
  projectId: "chat-76079",
  storageBucket: "chat-76079.firebasestorage.app",
  messagingSenderId: "936920133638",
  appId: "1:936920133638:web:5a3ee57dace104ca7fd387"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
