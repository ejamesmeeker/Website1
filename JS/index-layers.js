// layers.js

document.addEventListener("DOMContentLoaded", () => {
  const world = document.getElementById("world-container");

   const layerData = [
    {
      src: "Assets/Images/world/Structure1.png",
      x: 300,
      y: 200,
      z: 11,
    },
    {
      src: "Assets/Images/world/above.jpg",
      x: 2000,
      y: 200,
      z: 1,
    },
    {
      src: "Assets/Images/world/galleryMan3.png",
      x: 0,
      y: 0,
      z: 12,
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
