"use strict";
import sendNotification from "./notification.js";

const CHAT_SERVICE_ENDPOINT = "http://35.157.80.184:8080/";

(function () {
  const socket = io(CHAT_SERVICE_ENDPOINT);
  const userNameInput = document.getElementById("userName");
  const chatMessageInput = document.getElementById("message");
  const chatMessages = document.getElementById("chatMessages");

  let currentUser = generateUserName();
  userNameInput.value = currentUser;

  initEventListeners();

  function initEventListeners() {
    socket.on("message", data => {
      addMessage(data.user, data.message);

      if (isMessageFromCurrentUser(data.user)) return;

      sendNotification(data.message);
    });

    userNameInput.addEventListener("blur", event => {
      currentUser = event.target.value;
    });

    newMessageForm.addEventListener("submit", event => {
      event.preventDefault();

      const message = chatMessageInput.value;

      if (message === "") return;

      sendMessage(message);
      chatMessageInput.value = "";
    });
  }

  function sendMessage(message) {
    socket.emit("message", { message, user: currentUser });
  }

  function addMessage(userName, message) {
    const newMessageElement = document.createElement("div");
    const textParagraph = document.createElement("p");

    if (isMessageFromCurrentUser(userName) === false) {
      const userNameNode = document.createTextNode(`${userName}: `);
      textParagraph.append(userNameNode);
      newMessageElement.classList.add("other-user-message");
    }

    const msgNode = document.createTextNode(message);
    textParagraph.append(msgNode);
    newMessageElement.append(textParagraph);
    chatMessages.append(newMessageElement);
    newMessageElement.scrollIntoView();
  }

  function isMessageFromCurrentUser(username) {
    return username === currentUser;
  }

  function generateUserName() {
    return `Guest${Math.floor(Math.random() * 1000) + 1}`;
  }
})();
