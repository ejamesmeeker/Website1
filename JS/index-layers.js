// Define your layers FIRST
const layerData = [
  {
    src: "Assets/Images/world/Structure1.png",
    x: 300,
    y: 200,
    z: 1,
    parallax: 0.7, // parallax layer
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 300,
    y: 200,
    z: 1,
    parallax: 0.8, // parallax layer
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 300,
    y: 200,
    z: 1,
    parallax: 0.9, // parallax layer
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 300,
    y: 200,
    z: 1,
    parallax: 1, // parallax layer
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 300,
    y: 200,
    z: 1,
    parallax: 1.1, // parallax layer
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 100,
    y: 100,
    z: 1,
    parallax: .5,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 200,
    y: 100,
    z: 1,
    parallax: .6,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 300,
    y: 100,
    z: 1,
    parallax: .7,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 400,
    y: 100,
    z: 1,
    parallax: .8,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 500,
    y: 100,
    z: 1,
    parallax: .9,
  },
  {
    src: "Assets/Images/world/galleryMan3.png",
    x: 0,
    y: 0,
    z: 12,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const world = document.getElementById("world-container");

  layerData.forEach((layer) => {
    const img = document.createElement("img");
    img.src = layer.src;
    img.classList.add("layer");
    img.style.position = "absolute";
    img.style.zIndex = layer.z;
    img.style.pointerEvents = "none";
    img.style.userSelect = "none";

    // Store base position and parallax data
    img.dataset.baseX = layer.x;
    img.dataset.baseY = layer.y;
    img.dataset.parallax = layer.parallax !== undefined ? layer.parallax : false;

    world.appendChild(img);
  });

  // Parallax Update on Camera Move
  const updateParallax = (cameraX, cameraY) => {
  document.querySelectorAll(".layer").forEach((el) => {
    const p = el.dataset.parallax;
    if (p === "false") return;

    const factor = parseFloat(p);
    const baseX = parseFloat(el.dataset.baseX);
    const baseY = parseFloat(el.dataset.baseY);

    const x = baseX - cameraX * factor;
    const y = baseY - cameraY * factor;

    // Calculate dynamic scale based on camera movement amount
    const dx = cameraX * factor;
    const dy = cameraY * factor;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Scale formula - tweak divisor and multiplier for effect strength
    const scale = 1 - (dist / 2000); // shrinks with distance, min cap needed
if (scale < 0.1) scale = 1;    // clamp min scale


    el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    el.style.transformOrigin = "top left";
  });
};




  // Expose camera update globally
  window.updateCamera = (x, y) => {
    updateParallax(x, y);
    // Add other camera effects here if needed
  };
});


