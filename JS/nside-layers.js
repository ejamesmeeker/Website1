const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        150,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1.5, 7);

      const renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      

    scene.background = new THREE.Color(0x000);
    scene.fog = new THREE.Fog(0x222233, 10, 20);


      // Load texture for the room walls
      const loader = new THREE.TextureLoader();
      const roomTexture = loader.load(
        "https://threejs.org/examples/textures/brick_diffuse.jpg"
      );

      const roomMaterial = new THREE.MeshBasicMaterial({
        map: roomTexture,
        side: THREE.BackSide,
      });

      const room = new THREE.Mesh(
        new THREE.BoxGeometry(5, 30, 5),
        roomMaterial
      );
      scene.add(room);

      // Example artwork
      const artTexture = loader.load(
        "Assets/Images/Cow.png"
      );
      const art = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 6),
        new THREE.MeshBasicMaterial({ map: artTexture })
      );
      art.position.set(0, 1.5, -4.9);
      scene.add(art);

      // PLane 2
      const artTexture2 = loader.load(
        "Assets/Images/art/dis1.jpg"
      );
      const art2 = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 9),
        new THREE.MeshBasicMaterial({ map: artTexture2 })
      );
      art2.position.set(0, 2, -4.9);
      scene.add(art2);


    // Load texture from your image path
const loader2 = new THREE.TextureLoader();
const imageTexture = loader.load("Assets/Images/beer.jpg"); // Change path to your image

// Create a material with the texture
const floatMaterial = new THREE.MeshStandardMaterial({
  map: imageTexture,
  roughness: 1,
  metalness: 0.0,
});

    const floatMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), floatMaterial);
    floatMesh.position.set(1.5, 1.5, 0);
    scene.add(floatMesh);

    // Create a wireframe sphere around the floatMesh
const wireframeGeometry = new THREE.SphereGeometry(40, 32, 32); // slightly larger radius
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});
const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
wireframeSphere.position.copy(floatMesh.position); // match position
scene.add(wireframeSphere);



    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);


    let clock = new THREE.Clock();

    // Create geometry for particles
const particleCount = 800;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20; // spread across the room
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Material for particles
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03,
  transparent: true,
  opacity: 0.6,
  depthWrite: false, // lets particles glow through each other
});

// Create particle cloud
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

// Particle system already exists: `particleSystem` + `particlesMaterial`

// MUSIC ANALYSIS SETUP
// === MUSIC ANALYSIS SHARED SETUP ===
let analyser, dataArray;

function setupAudioAnalyser() {
  const audio = document.getElementById("bg-music");
  const context = window.audioContext;

  if (!audio || !context || analyser) return;

  try {
    analyser = context.createAnalyser();
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Only create source if it doesn't already exist
    if (!window.audioSource) {
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      window.audioSource = source;
    }
  } catch (e) {
    console.warn("Audio analyser setup failed:", e);
  }
}

// Wait until window.audioContext is ready (from your HTML interaction unlock)
window.addEventListener("load", () => {
  if (window.audioContext) {
    setupAudioAnalyser();
  } else {
    // Fallback in case user hasn't clicked yet
    const trySetup = () => {
      if (window.audioContext) {
        setupAudioAnalyser();
        document.removeEventListener("click", trySetup);
        document.removeEventListener("keydown", trySetup);
        document.removeEventListener("touchstart", trySetup);
      }
    };
    document.addEventListener("click", trySetup);
    document.addEventListener("keydown", trySetup);
    document.addEventListener("touchstart", trySetup);
  }
});



function animate() {
  requestAnimationFrame(animate);
  
  const t = clock.getElapsedTime();
  floatMesh.position.x = 1.5 + Math.sin(t * .2) * 20; // Float up and down
  floatMesh.position.z = 3 + Math.sin(t * .5) * 20;

  particleSystem.rotation.y = t * 0.02;
  particleSystem.rotation.x = Math.sin(t * 0.1) * 0.01;

  // Inside animate() loop, after your existing logic
if (analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const average = sum / dataArray.length;
    const normalized = average / 255;
    particlesMaterial.opacity = 0.1 + normalized * 1;
  }
  

  controls.update();
  renderer.render(scene, camera);
}
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });