// Define your layers FIRST
const layerData = [
  {
    src: "Assets/Images/scene1/beach.png",
    x: -200,
    y: 100,
    z: 1,
    parallax: .9,
    reverse: true,
    transformType: "scale",
    intensity: 10,
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