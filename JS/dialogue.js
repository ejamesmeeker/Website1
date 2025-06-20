// dialogue.js

const dialogueBox = document.getElementById("dialogue-box");
const dialogueText = document.getElementById("dialogue-text");
const clickPrompt = document.getElementById("click-prompt");

let isTyping = false;
let charIndex = 0;
let currentDialogue = "";
let lines = [];
let lineIndex = 0;

// Dialogue data
const dialogueData = {
  "hello-farmer": [
    "Hello farmer!",
    "Welcome to your farm.",
    "Feel free to.....",
    "Touch nothing. Or touch everything....",
    "The cows are dreaming",
    "maybe one day they they will dream of open skies",
    "if not today, then tomorrow",
    "Please do not wake them",
    "anyways,",
    "we're performing maintenance on some of the gates.",
    "come back when they're open please.",
    "the monet exhibition is currently installed",
    "feel free to...",
    "take a look around.",
    "entrance is to your right,",
    "try knocking on the door.",
    "have a nice day."
  ],
  // Add more as needed...
};

function typeWriter(text) {
  isTyping = true;
  currentDialogue = text;
  charIndex = 0;
  dialogueText.innerHTML = "";
  clickPrompt.style.display = "none";
  dialogueBox.classList.remove("hidden");

  requestAnimationFrame(typeNextChar);
}

function typeNextChar() {
  if (charIndex < currentDialogue.length) {
    dialogueText.innerHTML += currentDialogue.charAt(charIndex);
    charIndex++;
    setTimeout(() => requestAnimationFrame(typeNextChar), 30);
  } else {
    isTyping = false;
    clickPrompt.style.display = "block";
  }
}

function advanceDialogue() {
  if (isTyping) return;

  lineIndex++;
  if (lineIndex < lines.length) {
    typeWriter(lines[lineIndex]);
  } else {
    hideDialogue();
  }
}

function hideDialogue() {
  dialogueBox.classList.add("hidden");
  dialogueText.innerHTML = "";
  clickPrompt.style.display = "none";
  lines = [];
  lineIndex = 0;
}

// Click to continue
document.addEventListener("click", () => {
  if (dialogueBox.classList.contains("hidden")) return;
  advanceDialogue();
});


// External call to trigger dialogue
window.showDialogue = (id) => {
  const found = dialogueData[id];
  if (!found) {
    console.warn(`No dialogue found for id: ${id}`);
    return;
  }

  lines = found;
  lineIndex = 0;
  typeWriter(lines[lineIndex]);
};




