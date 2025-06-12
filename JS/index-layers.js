// Define your layers FIRST
const layerData = [
  {
    src: "Assets/Images/world/Structure1.png",
    x: 0,
    y: 200,
    z: 2,
    parallax: 0.7, // parallax layer
    transformType: "rotate",
    intensity: .2
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 0,
    y: 200,
    z: 2,
    parallax: 0.8, // parallax layer
    transformType: "skew",
    intensity: .2
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 0,
    y: 200,
    z: 2,
    parallax: 0.9, // parallax layer
    transformType: "skew",
    intensity: .2
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 0,
    y: 200,
    z: 2,
    parallax: 1, // parallax layer
    transformType: "translate-scale",
    intensity: .8
  },
  {
    src: "Assets/Images/world/Structure1.png",
    x: 0,
    y: 200,
    z: 2,
    parallax: 1.1, // parallax layer
    transformType: "skew",
    intensity: -.8,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 100,
    y: 100,
    z: 3,
    parallax: .5,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 200,
    y: 100,
    z: 3,
    parallax: .6,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 300,
    y: 100,
    z: 3,
    parallax: .7,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 400,
    y: 100,
    z: 3,
    parallax: .8,
  },
  {
    src: "Assets/Images/world/electric.png",
    x: 500,
    y: 100,
    z: 3,
    parallax: .9,
  },
  {
    src: "",
    x: 0,
    y: 0,
    z: 1,
    parallax: .1,
    transformType: "rotate",
    intensity: .9
  },
  {
    src: "Assets/Images/world/tube.png",
    x: 200,
    y: 150,
    z: 1,
    parallax: .3,
    transformType: "skew"
  },
  {
    src: "Assets/Images/world/tube.png",
    x: 300,
    y: 100,
    z: 1,
    parallax: .5,
    transformType: "translate-scale"
  },
  {
    src: "Assets/Images/world/tube.png",
    x: 400,
    y: 150,
    z: 1,
    parallax: .7,
  },
  {
    src: "Assets/Images/world/tube.png",
    x: 0,
    y: 200,
    z: 1,
    parallax: .9,
  },
  {
    src: "Assets/Images/world/galleryMan3.png",
    x: 0,
    y: 0,
    z: 12,
  },
  {
    src: "Assets/Images/world/goat1.png",
    x: 300,
    y: 300,
    z: 15,
    parallax: .7,
  },
  {
    src: "Assets/Images/world/goat2.png",
    x: 300,
    y: 300,
    z: 10,
    parallax: .5,
  },
  {
    src: "Assets/Images/world/goat3.png",
    x: 300,
    y: 300,
    z: 12,
    parallax: .2,
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
    if (layer.intensity !== undefined) {
  img.dataset.intensity = layer.intensity;
}
if (layer.reverse) {
  img.dataset.reverse = "true";
}



    // Store base position and parallax data
    img.dataset.baseX = layer.x;
    img.dataset.baseY = layer.y;
    img.dataset.parallax = layer.parallax !== undefined ? layer.parallax : false;
    img.dataset.transformType = layer.transformType || "translate"; // NEW

    world.appendChild(img);
  });

  const updateParallax = (cameraX, cameraY) => {
  document.querySelectorAll(".layer").forEach((el) => {
    const p = el.dataset.parallax;
    if (p === "false") return;

    const factor = parseFloat(p);
    const baseX = parseFloat(el.dataset.baseX);
    const baseY = parseFloat(el.dataset.baseY);
    const transformType = el.dataset.transformType || "translate";
    const intensity = parseFloat(el.dataset.intensity) || 1;

    const isReversed = el.dataset.reverse === "true";

const dx = cameraX * factor * (isReversed ? -1 : 1);
const dy = cameraY * factor * (isReversed ? -1 : 1);

    const x = baseX - dx;
    const y = baseY - dy;

    let transform = "";

    switch (transformType) {
      case "translate":
        transform = `translate(${x}px, ${y}px)`;
        break;

      case "translate-scale": {
        let scale = 1 - (Math.sqrt(dx * dx + dy * dy) / (2000 / intensity));
        if (scale < 0.1) scale = 1;
        transform = `translate(${x}px, ${y}px) scale(${scale})`;
        break;
      }

      case "rotate": {
        const angle = dx * 0.1 * intensity;
        transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
        break;
      }

      case "scale": {
        const scale = 1 + dy * 0.001 * intensity;
        transform = `translate(${x}px, ${y}px) scale(${scale})`;
        break;
      }

      case "skew": {
        const skewX = dx * 0.05 * intensity;
        const skewY = dy * 0.05 * intensity;
        transform = `translate(${x}px, ${y}px) skew(${skewX}deg, ${skewY}deg)`;
        break;
      }

      default:
        transform = `translate(${x}px, ${y}px)`;
        break;
    }

    el.style.transform = transform;
    el.style.transformOrigin = "top left";
  });
};


  // Expose camera update globally
  window.updateCamera = (x, y) => {
    updateParallax(x, y);
    // Add other camera effects here if needed
  };
});



