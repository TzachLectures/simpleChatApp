const sendBtn = document.getElementById("sendBtn");
const messageElement = document.getElementById("text-field");
const userNameInput = document.getElementById("username");
const chatDiv = document.getElementById("chat");
userNameInput.value = sessionStorage.getItem("username");
sendBtn.disabled = true;

try {
  const socket = io("http://localhost:8181");
  socket.on("message recived", (message) => {
    printMessage(message);
  });
  socket.on("recoverHistory", (history) => {
    history.forEach(printMessage);
  });

  messageElement.addEventListener("input", () => {
    if (messageElement.value.trim() !== "") {
      sendBtn.disabled = false;
    } else {
      sendBtn.disabled = true;
    }
  });

  sendBtn.addEventListener("click", () => {
    try {
      socket.emit("message sent", {
        content: messageElement.value,
        username: userNameInput.value,
        time: new Date(),
      });
    } catch (err) {
      console.log("error during sending the message", err);
    }
    sendBtn.disabled = true;
    messageElement.value = "";
    messageElement.focus();
  });
} catch (err) {
  console.log("error during connection", err);
}

function printMessage(msg) {
  //MESSAGE CONTAINER
  const newDiv = document.createElement("div");
  newDiv.classList.add("message");
  if (msg.username === userNameInput.value) {
    newDiv.classList.add("msgOut");
  } else {
    newDiv.classList.add("msgIn");
  }

  //CONTENT
  const p = document.createElement("p");
  p.innerText = msg.content;

  //USERNAME
  const div1 = document.createElement("div");
  div1.innerText = msg.username;
  div1.className = "msgHeader";
  //TIME
  const div2 = document.createElement("div");
  const currentTimeSent = new Date(msg.time).toLocaleTimeString();
  div2.innerText = currentTimeSent;
  div2.className = "msgTime";

  newDiv.appendChild(div1);
  newDiv.appendChild(p);
  newDiv.appendChild(div2);

  chatDiv.appendChild(newDiv);
}

userNameInput.addEventListener("input", () => {
  sessionStorage.setItem("username", userNameInput.value);
});
