import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import {
  ref,
  push,
  set,
  onValue,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";
import { auth, db } from "./firebase-config.js";

const dashboardContainer = document.getElementById("dashboard-container");
const currentUserNameEl = document.getElementById("current-user-name");
const logoutBtn = document.getElementById("logout-btn");
const usersListEl = document.getElementById("users-list");

const noChatSelectedEl = document.getElementById("no-chat-selected");
const chatWindowEl = document.getElementById("chat-window");
const chatHeaderEl = document.getElementById("chat-header");
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

let currentUser = null;
let selectedUser = null;
let unsubscribeUsers = null;
let unsubscribeMessages = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("./login.html");
    return;
  }

  currentUser = user;
  currentUserNameEl.textContent = user.email;
  dashboardContainer.classList.remove("hidden");
  loadRegisteredUsers();
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
});

function loadRegisteredUsers() {
  if (unsubscribeUsers) {
    unsubscribeUsers();
  }

  const usersRef = ref(db, "users");
  
  unsubscribeUsers = onValue(usersRef, (snapshot) => {
    usersListEl.innerHTML = "";
    const usersData = snapshot.val();

    if (!usersData) {
      usersListEl.innerHTML = '<div class="empty-users">No registered users</div>';
      return;
    }

    if (usersData[currentUser.uid]?.name) {
      currentUserNameEl.textContent = usersData[currentUser.uid].name;
    }

    const otherUsers = Object.values(usersData).filter(
      (u) => u.uid !== currentUser.uid
    );

    if (otherUsers.length === 0) {
      usersListEl.innerHTML =
        '<div class="empty-users">No other registered users</div>';
      return;
    }

    otherUsers.forEach((user) => {
      const userItem = document.createElement("div");
      userItem.className = "user-item";
      if (selectedUser && selectedUser.uid === user.uid) {
        userItem.classList.add("active");
      }

      const nameEl = document.createElement("div");
      nameEl.className = "user-item-name";
      nameEl.textContent = user.name;

      const emailEl = document.createElement("div");
      emailEl.className = "user-item-email";
      emailEl.textContent = user.email;

      userItem.appendChild(nameEl);
      userItem.appendChild(emailEl);

      userItem.addEventListener("click", () => selectUser(user, userItem));
      usersListEl.appendChild(userItem);
    });
  });
}

function selectUser(user, clickedElement) {
  selectedUser = user;

  document.querySelectorAll(".user-item").forEach((el) => {
    el.classList.remove("active");
  });
  clickedElement.classList.add("active");

  noChatSelectedEl.classList.add("hidden");
  chatWindowEl.classList.remove("hidden");
  chatHeaderEl.textContent = user.name;
  chatBox.innerHTML = "";

  if (unsubscribeMessages) {
    unsubscribeMessages();
  }

  const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
  const messagesRef = ref(db, `conversations/${chatId}/messages`);

  unsubscribeMessages = onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messageEl = document.createElement("div");
    messageEl.className =
      data.senderId === currentUser.uid ? "message sent" : "message received";
    messageEl.textContent = data.text;

    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser || !selectedUser) return;

  const text = messageInput.value.trim();
  if (!text) return;

  const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
  const messagesRef = ref(db, `conversations/${chatId}/messages`);

  try {
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      text: text,
      timestamp: Date.now(),
    });

    messageInput.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
  }
});
