document.addEventListener("DOMContentLoaded", () => {
  const bgLayer = document.getElementById("bg-blend-layer");
  let bgX = 0;

  function animateBackground() {
    bgX -= 0.5;
    bgLayer.style.backgroundPosition = `${bgX}px 0`;
    requestAnimationFrame(animateBackground);
  }

  animateBackground();
});
