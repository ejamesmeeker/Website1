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
  {
    src: "Assets/Images/scene1/beach.png",
    x: -200,
    y: 150,
    z: 1,
    parallax: .9,
    reverse: true,
    transformType: "scale",
    intensity: 13,
  },
  {
    src: "Assets/Images/scene1/beach.png",
    x: -200,
    y: 200,
    z: 1,
    parallax: .9,
    reverse: true,
    transformType: "scale",
    intensity: 17,
  },
  {
    src: "Assets/Images/scene1/outside.png",
    x: 300,
    y: 50,
    z: 10,
    parallax: .1,
    reverse: true,
    transformType: "",
    intensity: 0,
    link: "monet.html"
  },
  {
    src: "Assets/Images/scene1/platform.png",
    x: 500,
    y: 20,
    z: 9,
    parallax: .1,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/monolith.png",
    x: -100,
    y: 250,
    z: 15,
    parallax: .9,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/statue.png",
    x: 800,
    y: 450,
    z: 15,
    width: 100,
    parallax: .3,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/statue.png",
    x: 900,
    y: 450,
    z: 15,
    width: 100,
    parallax: .3,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/statue.png",
    x: 700,
    y: 500,
    z: 15,
    width: 100,
    parallax: .3,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/statue.png",
    x: 800,
    y: 550,
    z: 15,
    width: 100,
    parallax: .3,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/statue.png",
    x: 900,
    y: 600,
    z: 15,
    width: 100,
    parallax: .3,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/statue.png",
    x: 1000,
    y: 600,
    z: 15,
    width: 100,
    parallax: .3,
    reverse: true,
    transformType: "",
    intensity: 0,
  },
  {
    src: "Assets/Images/scene1/statue.png",
    x: 700,
    y: 400,
    z: 15,
    width: 100,
    parallax: .3,
    reverse: true,
    transformType: "",
    intensity: 0,
    link: "scene1-push.html"
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const world = document.getElementById("world-container");

  layerData.forEach((layer) => {
    // Create the image
    const img = document.createElement("img");
    img.src = layer.src;
    img.classList.add("layer");
    img.style.position = "absolute";
    img.style.zIndex = layer.z;
    img.style.userSelect = "none";
    img.style.pointerEvents = layer.link ? "auto" : "none";
    

    // Store parallax and transform data
    if (layer.intensity !== undefined) img.dataset.intensity = layer.intensity;
    if (layer.reverse) img.dataset.reverse = "true";
    img.dataset.baseX = layer.x;
    img.dataset.baseY = layer.y;
    img.dataset.parallax = layer.parallax !== undefined ? layer.parallax : false;
    img.dataset.transformType = layer.transformType || "translate";

    if (layer.width) img.style.width = typeof layer.width === "number" ? `${layer.width}px` : layer.width;
if (layer.height) img.style.height = typeof layer.height === "number" ? `${layer.height}px` : layer.height;


    // If the layer has a link, wrap it in an <a>
    if (layer.link) {
      const link = document.createElement("a");
      link.href = layer.link;
      link.target = "_self";
      link.style.position = "absolute";
      link.style.display = "inline-block";
      link.style.zIndex = layer.z;

// Match image dimensions if defined
if (layer.width) link.style.width = typeof layer.width === "number" ? `${layer.width}px` : layer.width;
if (layer.height) link.style.height = typeof layer.height === "number" ? `${layer.height}px` : layer.height;

      link.appendChild(img);
      link.classList.add("layer-link");

      // Optional hover effect
      link.addEventListener("mouseenter", () => link.classList.add("hovered"));
      link.addEventListener("mouseleave", () => link.classList.remove("hovered"));

      world.appendChild(link);
    } else {
      world.appendChild(img);
    }
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

      // If it's wrapped in a link, apply transform to the parent
      if (el.parentElement.tagName === "A") {
        el.parentElement.style.transform = transform;
        el.parentElement.style.transformOrigin = "top left";
      }
    });
  };

  // Global camera update
  window.updateCamera = (x, y) => {
    updateParallax(x, y);
  };
});
