window.addEventListener('DOMContentLoaded', () => {
  const fadeOverlay = document.getElementById('fade-overlay');

  // Start with fade overlay visible, then fade out to reveal page
  requestAnimationFrame(() => {
    fadeOverlay.classList.add('hidden');
  });

  // Fade out on link click, then navigate
  document.querySelectorAll('.links-box a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      fadeOverlay.classList.remove('hidden'); // fade overlay back in

      setTimeout(() => {
        window.location.href = link.href;
      }, 600); // same duration as CSS transition
    });
  });
});
