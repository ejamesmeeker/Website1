function hideFadeOverlay() {
  const fadeOverlay = document.getElementById('fade-overlay');
  if (fadeOverlay) {
    requestAnimationFrame(() => {
      fadeOverlay.classList.add('hidden');
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  hideFadeOverlay();

  document.querySelectorAll('.links-box a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const fadeOverlay = document.getElementById('fade-overlay');
      fadeOverlay.classList.remove('hidden');

      setTimeout(() => {
        window.location.href = link.href;
      }, 600); // Match your CSS transition duration
    });
  });
});

// Handle mobile back-forward cache restoration
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    hideFadeOverlay();
  }
});

