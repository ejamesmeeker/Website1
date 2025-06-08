document.addEventListener("DOMContentLoaded", () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isInstagram = ua.includes("Instagram");

  if (isInstagram) {
    alert("⚠️ For the best experience, please open this page in Safari or Chrome.");
  }
});
