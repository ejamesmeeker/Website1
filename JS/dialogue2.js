// dialogue.js

const dialogueBox = document.getElementById("dialogue-box2");
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
    "farmer, I have lied to you",
    "I did not want you to come this far",
    "there are things you cannot unsee",
    "things that might...",
    "cause harm to your wellbeing",
    "if you wish to know the truth...",
    "the angels will show you the way",
    "please,",
    "be careful.",
    "I LOVE YOU <3",
    "have a nice day."
  ],
  // Add more as needed...
};

function typeWriter(text) {
  isTyping = true;
  currentDialogue = text;
  charIndex = 0;
  dialogueBox.style.display = "block"; // ✅ show the box
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
  dialogueBox.style.display = "none"; // ✅ hide the box
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