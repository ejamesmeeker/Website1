const container = document.getElementById('swarm-container');
const numCharacters = 20;
const characters = [];
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const baseRadius = 150;
const driftRadius = 10;

for (let i = 0; i < numCharacters; i++) {
  const img = document.createElement('img');
  img.src = 'Assets/gif/humanSprite.gif'; // your gif path
  img.classList.add('character');
  img.style.visibility = 'hidden'; // hide until "start"

  container.appendChild(img);

  const delay = Math.random() * 1000; // 0–500ms delay

  setTimeout(() => {
    img.style.visibility = 'visible'; // "starts" the gif playback
  }, delay);

  characters.push({
    el: img,
    angle: (Math.PI * 2 / numCharacters) * i,
    speed: 0.002 + Math.random() * 0.003,
    driftOffset: Math.random() * 1000,
  });
}


function animate(time) {
  characters.forEach((char) => {
    char.angle += char.speed;

    const drift = Math.sin(time * 0.001 + char.driftOffset) * driftRadius;
    const radius = baseRadius + drift;

    const x = centerX + radius * Math.cos(char.angle) - 100;
    const y = centerY + radius * Math.sin(char.angle) - 100;

    char.el.style.transform = `translate(${x}px, ${y}px)`;
    createTrail(x, y);
  });

  requestAnimationFrame(animate);
}

function createTrail(x, y) {
  const trail = document.createElement('img');
  trail.src = 'Assets/gif/humanSprite.gif'; // same gif
  trail.classList.add('trail');
  trail.style.left = `${x}px`;
  trail.style.top = `${y}px`;
  container.appendChild(trail);

  setTimeout(() => {
    container.removeChild(trail);
  }, 300); // fades out and disappears after 300ms
}


requestAnimationFrame(animate);
