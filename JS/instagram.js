document.addEventListener("DOMContentLoaded", () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isInstagram = ua.includes("Instagram");

  if (isInstagram) {
    // Create overlay container
    const warning = document.createElement("div");
    warning.id = "ig-warning";
    warning.innerHTML = `
      <div class="ig-popup">
        <p>
          ⚠️ This experience works best in Safari or Chrome.<br />
          You're currently using Instagram's in-app browser, which may block images and animations.
        </p>
        <button id="close-ig-warning">Open Anyway</button>
      </div>
    `;
    document.body.appendChild(warning);

    // Styling (inline so it’s self-contained)
    const style = document.createElement("style");
    style.textContent = `
      #ig-warning {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ig-popup {
        background: #222;
        color: white;
        max-width: 90%;
        padding: 2rem;
        border: 1px solid white;
        text-align: center;
        border-radius: 1rem;
        font-family: sans-serif;
      }

      .ig-popup button {
        margin-top: 1rem;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border: none;
        background: white;
        color: black;
        cursor: pointer;
        border-radius: 0.5rem;
      }
    `;
    document.head.appendChild(style);

    // Close button
    document.getElementById("close-ig-warning").addEventListener("click", () => {
      document.getElementById("ig-warning").remove();
    });
  }
});

