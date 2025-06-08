// layers.js

document.addEventListener("DOMContentLoaded", () => {
  const world = document.getElementById("world-container");

  const layerData = [
    {
      src: "Assets/Images/world/structure1.png",
      x: 300,
      y: 200,
      z: 11,
    },
  ];

  layerData.forEach((layer) => {
    const img = document.createElement("img");
    img.src = layer.src;
    img.style.position = "absolute";
    img.style.left = `${layer.x}px`;
    img.style.top = `${layer.y}px`;
    img.style.zIndex = layer.z;
    img.style.pointerEvents = "none";
    img.style.userSelect = "none";
    world.appendChild(img);
  });
});
