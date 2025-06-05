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

  const cursorDelay = 0.2;
  const camDelay = 0.1;
  const buffer = 10;

  const galleryManifests = {
    gallery1: [
      "Assets/Gallery/gallery1/1-DIS1.jpg",
      "Assets/Gallery/gallery1/2-DIS1.jpg",
      "Assets/Gallery/gallery1/3-DIS1.jpg",
      "Assets/Gallery/gallery1/4-DIS1.jpg",
      "Assets/Gallery/gallery1/5-DIS1.jpg",
    ],
    // Add more galleries if needed
  };

  let slideshowInterval = null;
  let currentSlide = 0;
  let galleryContainer = null;
  let activeTrigger = null;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  if (touch) {
    mouseX = touch.clientX;
    mouseY = touch.clientY;
  }
}, { passive: false });

document.addEventListener("touchstart", (e) => {
  e.preventDefault();
}, { passive: false });


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

    galleryContainer.style.transform = "translate(-50%, -50%) scale(0)";
    setTimeout(() => {
      galleryContainer.remove();
      galleryContainer = null;
    }, 300);
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
    galleryContainer.style.transition = "transfo0rm 0.2s ease";

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
    closeBtn.textContent = "";
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
      galleryContainer.style.transform = "translate(-50%, -50%) scale(1         )";
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
    let targetX = currentX + (mouseX - currentX) * cursorDelay;
    let targetY = currentY + (mouseY - currentY) * cursorDelay;

    let worldX = targetX - camX;
    let worldY = targetY - camY;

    let xBlocked = false;
    let yBlocked = false;

    // Wall collision
    walls.forEach((box) => {
      if (isColliding(worldX, currentY - camY, box)) xBlocked = true;
      if (isColliding(currentX - camX, worldY, box)) yBlocked = true;
    });

    // Trigger zones
    let hitTriggerThisFrame = false;

    triggers.forEach((trigger) => {
      const hit = isColliding(worldX, worldY, trigger);
      trigger.style.backgroundColor = hit
        ? "rgba(0, 255, 0, 0.5)"
        : "rgba(0, 255, 0, 0.2)";

      if (hit) {
        hitTriggerThisFrame = true;
        if (activeTrigger !== trigger) {
          activeTrigger = trigger;
          const galleryId = trigger.getAttribute("data-gallery");
          if (galleryId) showGallery(galleryId);
        }
      } else {
        if (activeTrigger === trigger) {
          activeTrigger = null;
          closeGallery();
        }
      }
    });

    if (xBlocked && yBlocked) {
      // Do nothing
    } else if (xBlocked) {
      currentY = targetY;
    } else if (yBlocked) {
      currentX = targetX;
    } else {
      currentX = targetX;
      currentY = targetY;
    }

    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;

    const worldWidth = world.offsetWidth;
    const worldHeight = world.offsetHeight;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    let targetCamX = centerX - currentX;
    let targetCamY = centerY - currentY;

    targetCamX = Math.min(0, Math.max(targetCamX, window.innerWidth - worldWidth));
    targetCamY = Math.min(0, Math.max(targetCamY, window.innerHeight - worldHeight));

    if (Math.abs(targetCamX - camX) > 1) {
      camX += (targetCamX - camX) * camDelay;
    }
    if (Math.abs(targetCamY - camY) > 1) {
      camY += (targetCamY - camY) * camDelay;
    }

    const zoom = 1.0;
    world.style.transform = `translate(${camX}px, ${camY}px) scale(${zoom})`;

if (music) {
    music.addEventListener("loadedmetadata", () => {
      const duration = music.duration;
      const randomStart = Math.random() * duration;
      music.currentTime = randomStart;
    });
  }

  if (toggle && music) {
    toggle.addEventListener("click", () => {
      if (music.paused) {
        music.play();
        toggle.textContent = "🔊";
      } else {
        music.pause();
        toggle.textContent = "🔇";
      }
    });
  }

    requestAnimationFrame(animate);
  }

  animate();
});



