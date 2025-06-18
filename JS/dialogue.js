// dialogue.js

const dialogueBox = document.getElementById("dialogue-box");
const dialogueText = document.getElementById("dialogue-text");
const clickPrompt = document.getElementById("click-prompt");

let isTyping = false;
let currentDialogue = "";
let charIndex = 0;
let onComplete = null;

function typeWriter(text, callback) {
  isTyping = true;
  currentDialogue = text;
  charIndex = 0;
  dialogueText.innerHTML = "";
  onComplete = callback;
  dialogueBox.classList.remove("hidden");

  requestAnimationFrame(typeNextChar);
}

function typeNextChar() {
  if (charIndex < currentDialogue.length) {
    dialogueText.innerHTML += currentDialogue.charAt(charIndex);
    charIndex++;
    setTimeout(() => requestAnimationFrame(typeNextChar), 30); // pace: 30ms per character
  } else {
    isTyping = false;
    clickPrompt.style.display = "block";
  }
}

function hideDialogue() {
  dialogueBox.classList.add("hidden");
  dialogueText.innerHTML = "";
  clickPrompt.style.display = "none";
}

// Listen for user click to continue
dialogueBox.addEventListener("click", () => {
  if (!isTyping && onComplete) {
    onComplete();
    hideDialogue();
  }
});

// Public API to trigger dialogue
function showDialogue(text, callback) {
  clickPrompt.style.display = "none";
  typeWriter(text, callback);
}

function showDialogueSequence(lines, finalCallback) {
  let index = 0;

  function next() {
    if (index < lines.length) {
      showDialogue(lines[index], next);
      index++;
    } else if (finalCallback) {
      finalCallback();
    }
  }

  next();
}


showDialogueSequence([
  "Hello there!",
  "Welcome to the farm.",
  "Feel free to explore around."
]);


