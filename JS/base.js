// ------------------------ INIT ------------------------
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const cursor = document.getElementById("animated-cursor");
  const world = document.getElementById("world-container");
  const walls = document.querySelectorAll(".collision-wall");
  const triggers = document.querySelectorAll(".collision-trigger");
  const music = document.getElementById("bg-music");
  const toggle = document.getElementById("toggle-music");

  // --- Cursor + Camera State ---
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let camX = 0, camY = 0;
  let camTargetX = 0, camTargetY = 0;

  // --- Touch State ---
  let touchstartX = 0, touchstartY = 0, touchMoved = false;
  let touchOnInteractive = false;

  // --- Config ---
  const cursorDelay = 0.1;
  const cameraSpeed = 10;
  const buffer = 10;
  let keys = {};

  // ------------------------ INPUT TRACKING ------------------------
  // Mouse
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Touch
  document.addEventListener("touchstart", (e) => {
    const target = e.target;
    touchOnInteractive = ["A", "BUTTON"].includes(target.tagName) || target.closest("a, button");
    const touch = e.touches[0];
    touchstartX = touch.clientX;
    touchstartY = touch.clientY;
    touchMoved = false;
  }, { passive: false });

  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (touchOnInteractive) return;
    const dx = Math.abs(touch.clientX - touchstartX);
    const dy = Math.abs(touch.clientY - touchstartY);
    if (dx > 10 || dy > 10) touchMoved = true;
    if (touchMoved) e.preventDefault();
    mouseX = touch.clientX;
    mouseY = touch.clientY;
  }, { passive: false });

  // Keyboard
  document.addEventListener("keydown", (e) => keys[e.key] = true);
  document.addEventListener("keyup", (e) => keys[e.key] = false);

  // ------------------------ GALLERY ------------------------
  const galleryManifests = {
    gallery1: [
      "Assets/Gallery/gallery1/1-DIS1.jpg",
      "Assets/Gallery/gallery1/2-DIS1.jpg",
      "Assets/Gallery/gallery1/3-DIS1.jpg",
      "Assets/Gallery/gallery1/4-DIS1.jpg",
      "Assets/Gallery/gallery1/5-DIS1.jpg",
    ],
  };

  let slideshowInterval = null;
  let currentSlide = 0;
  let galleryContainer = null;
  let activeTrigger = null;

  function isColliding(worldX, worldY, element) {
    const rect = element.getBoundingClientRect();
    const boxLeft = rect.left - camX;
    const boxTop = rect.top - camY;
    return (
      worldX + buffer > boxLeft &&
      worldX - buffer < boxLeft + rect.width &&
      worldY + buffer > boxTop &&
      worldY - buffer < boxTop + rect.height
    );
  }

  function closeGallery() {
    if (!galleryContainer) return;
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    galleryContainer.remove();
    galleryContainer = null;
  }

  function showGallery(galleryId) {
    const images = galleryManifests[galleryId];
    if (!images || galleryContainer) return;

    currentSlide = 0;
    galleryContainer = document.createElement("div");
    Object.assign(galleryContainer.style, {
      position: "fixed",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) scale(0)",
      width: "400px",
      height: "400px",
      backgroundColor: "rgba(200, 200, 200, 0.9)",
      border: "1px solid white",
      borderRadius: "4px",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      transition: "transform 0.2s ease"
    });

    const galleryImages = images.map((src) => {
      const img = document.createElement("img");
      Object.assign(img.style, {
        src,
        maxWidth: "100%",
        maxHeight: "100%",
        position: "absolute",
        display: "none"
      });
      img.src = src;
      galleryContainer.appendChild(img);
      return img;
    });

    galleryImages[0].style.display = "block";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "10px",
      right: "10px",
      fontSize: "24px",
      background: "transparent",
      color: "white",
      border: "none",
      cursor: "pointer",
      zIndex: 2100
    });
    closeBtn.onclick = closeGallery;

    galleryContainer.appendChild(closeBtn);
    document.body.appendChild(galleryContainer);
    requestAnimationFrame(() => galleryContainer.style.transform = "translate(-50%, -50%) scale(1)");

    function updateSlide() {
      galleryImages.forEach((img, idx) => {
        img.style.display = idx === currentSlide ? "block" : "none";
      });
    }

    slideshowInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % images.length;
      updateSlide();
    }, 1000);
  }

  // ------------------------ ANIMATION LOOP ------------------------
  function animate() {
  // Smooth cursor follow
  currentX += (mouseX - currentX) * cursorDelay;
  currentY += (mouseY - currentY) * cursorDelay;
  cursor.style.left = `${currentX}px`;
  cursor.style.top = `${currentY}px`;

  // Edge-based camera scrolling with easing
  const edgeThreshold = 100;
  const edgeSpeed = 15;
  const easeScroll = (distance) => edgeSpeed * Math.min(distance / edgeThreshold, 1) ** 2;

  if (currentX < edgeThreshold) camTargetX += easeScroll(edgeThreshold - currentX);
  else if (currentX > window.innerWidth - edgeThreshold) camTargetX -= easeScroll(currentX - (window.innerWidth - edgeThreshold));
  if (currentY < edgeThreshold) camTargetY += easeScroll(edgeThreshold - currentY);
  else if (currentY > window.innerHeight - edgeThreshold) camTargetY -= easeScroll(currentY - (window.innerHeight - edgeThreshold));

  // Keyboard camera controls
  if (keys["ArrowLeft"] || keys["a"]) camTargetX += cameraSpeed;
  if (keys["ArrowRight"] || keys["d"]) camTargetX -= cameraSpeed;
  if (keys["ArrowUp"] || keys["w"]) camTargetY += cameraSpeed;
  if (keys["ArrowDown"] || keys["s"]) camTargetY -= cameraSpeed;

  // Clamp camera to world bounds
  // Camera clamp buffer to prevent hard stops
const clampBuffer = 50; // tweak this number if needed

camTargetX = Math.max(-world.offsetWidth + window.innerWidth - clampBuffer, Math.min(0, camTargetX));
camTargetY = Math.max(-world.offsetHeight + window.innerHeight - clampBuffer, Math.min(0, camTargetY));

// Clamp cursor to viewport so it never leaves visible area
mouseX = Math.min(window.innerWidth, Math.max(0, mouseX));
mouseY = Math.min(window.innerHeight, Math.max(0, mouseY));

  camX += (camTargetX - camX) * 0.1;
  camY += (camTargetY - camY) * 0.1;

  world.style.transform = `translate(${camX}px, ${camY}px)`;

  // ✅ Update parallax layers (from index-layers.js)
  if (window.updateCamera) window.updateCamera(camX, camY);

  // Collision detection
  const worldX = currentX - camX;
  const worldY = currentY - camY;

  walls.forEach(box => {
    if (isColliding(worldX, currentY - camY, box)) return;
    if (isColliding(currentX - camX, worldY, box)) return;
  });

  triggers.forEach(trigger => {
    const hit = isColliding(worldX, worldY, trigger);
    trigger.style.backgroundColor = hit ? "rgba(0, 76, 255, 0.37)" : "rgba(255, 0, 0, 0.46)";

    if (hit && activeTrigger !== trigger) {
      activeTrigger = trigger;

      const galleryId = trigger.getAttribute("data-gallery");
      if (galleryId) showGallery(galleryId);

      const dialogueId = trigger.getAttribute("data-dialogue");
      if (dialogueId) {
        showDialogue(dialogueId); // This function will be in dialogue.js
}

      const url = trigger.getAttribute("data-url");
      if (url && !hasOpenedUrl) {
        hasOpenedUrl = true;
        window.open(url, "_self");
      }
    } else if (!hit && activeTrigger === trigger) {
      activeTrigger = null;
      closeGallery();
      hasOpenedUrl = false;
    }
  });

  requestAnimationFrame(animate);
}


  animate();

  // ------------------------ MUSIC ------------------------
  if (music) {
    music.addEventListener("loadedmetadata", () => {
      music.currentTime = Math.random() * music.duration;
    });

    toggle?.addEventListener("click", () => {
      if (music.paused) {
        music.play().then(() => toggle.textContent = "🔊").catch(console.warn);
      } else {
        music.pause();
        toggle.textContent = "🔇";
      }
    });

    const tryPlayMusicOnce = () => {
      if (music.paused) music.play().then(() => toggle.textContent = "🔊").catch(console.warn);
      document.removeEventListener("click", tryPlayMusicOnce);
      document.removeEventListener("keydown", tryPlayMusicOnce);
      document.removeEventListener("touchstart", tryPlayMusicOnce);
    };

    document.addEventListener("click", tryPlayMusicOnce);
    document.addEventListener("keydown", tryPlayMusicOnce);
    document.addEventListener("touchstart", tryPlayMusicOnce);
  }
});




