// dialogue3.js

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
  "intro-message": [
    "ah... you hear that?",
    "relaxing isn't it?",
    "the angels are singing their song",
    `"we siiiiing to the cows"`,
    `"good night"`,
    `"good night"`,
    `"we siiiiiiing for the cows"`,
    `"first light"`,
    `"first light"`,
    "...",
    "...",
    "anyways,",
    "sing with them and they may show you the way",
    "Good luck out there."
  ]
};

function typeWriter(text) {
  isTyping = true;
  currentDialogue = text;
  charIndex = 0;
  dialogueBox.style.display = "block";
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
  dialogueBox.style.display = "none";
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

// External trigger
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
