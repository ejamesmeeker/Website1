document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("animated-cursor");
  const world = document.getElementById("world-container");

  const walls = document.querySelectorAll(".collision-wall");
  const triggers = document.querySelectorAll(".collision-trigger");

  const music = document.getElementById("bg-music");
  const toggle = document.getElementById("toggle-music");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  let camX = 0;
  let camY = 0;
  let camTargetX = 0;
  let camTargetY = 0;

  const cursorDelay = 0.2;
  const cameraSpeed = 10; // pixels per frame when key is held
  const buffer = 10;

  let keys = {};

  // Track mouse for cursor movement
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Touch support
  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (touch) {
      mouseX = touch.clientX;
      mouseY = touch.clientY;
    }
  }, { passive: false });

  let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

document.addEventListener("touchstart", (e) => {
  const target = e.target;

  // Let taps on links and buttons pass through immediately
  if (
    target.tagName === "A" ||
    target.tagName === "BUTTON" ||
    target.closest("a") ||
    target.closest("button")
  ) {
    return;
  }

  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchMoved = false;
}, { passive: false });

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const dx = Math.abs(touch.clientX - touchStartX);
  const dy = Math.abs(touch.clientY - touchStartY);

  // If finger moved more than a small threshold, consider it a scroll
  if (dx > 10 || dy > 10) {
    touchMoved = true;
  }

  if (touchMoved) {
    // Prevent scrolling of page inside your world container (or always prevent if you want)
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener("touchend", (e) => {
  // If touch ended without significant movement, it’s a tap — allow default behavior
  // No need to prevent default here
});


  // Track key input for camera control
  document.addEventListener("keydown", (e) => keys[e.key] = true);
  document.addEventListener("keyup", (e) => keys[e.key] = false);

  // Gallery logic (same as before)
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
    galleryContainer.style.position = "fixed";
    galleryContainer.style.left = "50%";
    galleryContainer.style.top = "50%";
    galleryContainer.style.transform = "translate(-50%, -50%) scale(0)";
    galleryContainer.style.width = "400px";
    galleryContainer.style.height = "400px";
    galleryContainer.style.backgroundColor = "rgba(200, 200, 200, 0.9)";
    galleryContainer.style.border = "1px solid white";
    galleryContainer.style.borderRadius = "4px";
    galleryContainer.style.overflow = "hidden";
    galleryContainer.style.display = "flex";
    galleryContainer.style.justifyContent = "center";
    galleryContainer.style.alignItems = "center";
    galleryContainer.style.zIndex = "2000";
    galleryContainer.style.transition = "transform 0.2s ease";

    const galleryImages = images.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.style.position = "absolute";
      img.style.display = "none";
      galleryContainer.appendChild(img);
      return img;
    });

    galleryImages[0].style.display = "block";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.zIndex = "2100";
    closeBtn.onclick = closeGallery;
    galleryContainer.appendChild(closeBtn);

    document.body.appendChild(galleryContainer);

    requestAnimationFrame(() => {
      galleryContainer.style.transform = "translate(-50%, -50%) scale(1)";
    });

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

  function animate() {
  // Update smooth cursor
  currentX += (mouseX - currentX) * cursorDelay;
  currentY += (mouseY - currentY) * cursorDelay;

  cursor.style.left = `${currentX}px`;
  cursor.style.top = `${currentY}px`;

  // --- NEW: Edge scrolling based on cursor position ---
  const edgeThreshold = 100; // pixels from edge to start moving camera
  const edgeSpeed = 15;      // how fast camera moves when cursor near edge

  // Replace the constant speed scrolling with eased speed based on cursor distance to edge

const easeScroll = (distance) => {
  // You can adjust the easing curve here; this is a quadratic ease-in
  const maxSpeed = edgeSpeed;
  const maxDistance = edgeThreshold;
  const ratio = Math.min(distance / maxDistance, 1);
  return maxSpeed * ratio * ratio; // quadratic easing
};

// Left edge
if (currentX < edgeThreshold) {
  const dist = edgeThreshold - currentX;
  camTargetX += easeScroll(dist);
}

// Right edge
else if (currentX > window.innerWidth - edgeThreshold) {
  const dist = currentX - (window.innerWidth - edgeThreshold);
  camTargetX -= easeScroll(dist);
}

// Top edge
if (currentY < edgeThreshold) {
  const dist = edgeThreshold - currentY;
  camTargetY += easeScroll(dist);
}

// Bottom edge
else if (currentY > window.innerHeight - edgeThreshold) {
  const dist = currentY - (window.innerHeight - edgeThreshold);
  camTargetY -= easeScroll(dist);
}


  // --- Existing keyboard controls for camera ---
  if (keys["ArrowLeft"] || keys["a"]) camTargetX += cameraSpeed;
  if (keys["ArrowRight"] || keys["d"]) camTargetX -= cameraSpeed;
  if (keys["ArrowUp"] || keys["w"]) camTargetY += cameraSpeed;
  if (keys["ArrowDown"] || keys["s"]) camTargetY -= cameraSpeed;

  // Clamp camera to world bounds
  const worldBoundsX = world.offsetWidth - window.innerWidth;
  const worldBoundsY = world.offsetHeight - window.innerHeight;

  camTargetX = Math.max(-worldBoundsX, Math.min(0, camTargetX));
  camTargetY = Math.max(-worldBoundsY, Math.min(0, camTargetY));

  // Smoothly interpolate camera position
  camX += (camTargetX - camX) * 0.1;
  camY += (camTargetY - camY) * 0.1;

  // Update world position
  world.style.transform = `translate(${camX}px, ${camY}px)`;

  // World-relative cursor position
  const worldX = currentX - camX;
  const worldY = currentY - camY;

  // Wall collision
  let xBlocked = false;
  let yBlocked = false;

  walls.forEach((box) => {
    if (isColliding(worldX, currentY - camY, box)) xBlocked = true;
    if (isColliding(currentX - camX, worldY, box)) yBlocked = true;
  });

  // Trigger zones
  triggers.forEach((trigger) => {
    const hit = isColliding(worldX, worldY, trigger);
    trigger.style.backgroundColor = hit
      ? "rgba(0, 255, 0, 0.5)"
      : "rgba(0, 255, 0, 0.2)";

    if (hit) {
      if (activeTrigger !== trigger) {
        activeTrigger = trigger;
        const galleryId = trigger.getAttribute("data-gallery");
        if (galleryId) showGallery(galleryId);
      }
    } else if (activeTrigger === trigger) {
      activeTrigger = null;
      closeGallery();
    }
  });

  requestAnimationFrame(animate);
}


  animate();

  // Music setup
  if (music) {
    music.addEventListener("loadedmetadata", () => {
      music.currentTime = Math.random() * music.duration;
    });

    toggle?.addEventListener("click", () => {
      if (music.paused) {
        music.play();
        toggle.textContent = "🔊";
      } else {
        music.pause();
        toggle.textContent = "🔇";
      }
    });
  }
});




