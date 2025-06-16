const canvas = document.getElementById('noise-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function generateNoise() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const buffer32 = new Uint32Array(imageData.data.buffer);
  const len = buffer32.length;

  for (let i = 0; i < len; i++) {
    const gray = Math.random() * 255;
    buffer32[i] =
      (255 << 24) | // alpha
      (gray << 16) | // red
      (gray << 8) |  // green
      gray;          // blue
  }

  ctx.putImageData(imageData, 0, 0);
}

function loop() {
  generateNoise();
  requestAnimationFrame(loop);
}

loop();
