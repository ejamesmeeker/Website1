document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("world-container");
  const cowCount = 50;
  const cows = [];

  for (let i = 0; i < cowCount; i++) {
    const cow = document.createElement("div");
    cow.classList.add("cow");

    const startX = 50 + Math.random() * 400; // spread starting positions
    const top = 50 + i * 30; // space them out vertically

    cow.style.left = `${startX}px`;
    cow.style.top = `${top}px`;

    container.appendChild(cow);

    cows.push({
      el: cow,
      x: startX,
      startX: startX,
      direction: Math.random() < 0.5 ? -1 : 1,
      speed: 1 + Math.random() * 1.5, // give each cow a slightly different speed
    });
  }

  function walk() {
    for (const cow of cows) {
      cow.x += cow.speed * cow.direction;

      if (cow.x >= cow.startX + 500 || cow.x <= cow.startX) {
        cow.direction *= -1;
        cow.el.style.transform = cow.direction === -1 ? "scaleX(-1)" : "scaleX(1)";
      }

      cow.el.style.left = `${cow.x}px`;
    }
  }

  setInterval(walk, 16); // ~60fps
});



