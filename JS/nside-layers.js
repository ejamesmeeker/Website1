const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        150,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1.5, 7);
      

      const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;         // ✅ already in animate()
renderer.autoClearColor = false;    // ✅ prevents background wipe
renderer.setClearColor(0x000000, 0); // ✅ transparent black
document.body.appendChild(renderer.domElement);



      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const afterimageScene = new THREE.Scene();
const afterimageCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const fadeMaterial = new THREE.MeshBasicMaterial({
  color: 0xa19d32,
  transparent: true,
  opacity: 0.06 // Lower = longer trails
});
const fadePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  fadeMaterial
);
afterimageScene.add(fadePlane);

      
      

    scene.background = new THREE.Color(0x000);
    scene.fog = new THREE.Fog(0x222233, 10, 25);

const loader3 = new THREE.OBJLoader();

loader3.load('Assets/3d/form1.obj', (obj) => {
  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0xd12a2a,
        wireframe: true,
      });
    }
  });
  obj.position.set(0, 0, 0);
  scene.add(obj);
});

const loader4 = new THREE.OBJLoader();

loader3.load('Assets/3d/business.obj', (obj) => {
  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0xfff,
        wireframe: true,
      });
    }
  });
  obj.scale.set(2,2,2);
  obj.position.set(0, 0, 10);
  scene.add(obj);
});

const loader6 = new THREE.OBJLoader();

loader6.load('Assets/3d/tree.obj', (obj) => {
  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0x1c731a,
        wireframe: true,
      });
    }
  });
  obj.scale.set(30,50,30);
  obj.position.set(0, -50, 0);
  scene.add(obj);
});


      // Load texture for the room walls
      const loader = new THREE.TextureLoader();
      const roomTexture = loader.load(
        "Assets/Gallery/gallery1/5-DIS1.jpg"
      );

      const roomMaterial = new THREE.MeshBasicMaterial({
        map: roomTexture,
        side: THREE.BackSide,
      });

      const room = new THREE.Mesh(
        new THREE.BoxGeometry(5, 30, 5),
        roomMaterial
      );
      room.position.set(-5,-5,-5)
      scene.add(room);

      const loader5 = new THREE.TextureLoader();
      const roomTexture2 = loader.load(
        "Assets/Images/scene1/monet.jpg"
      );

      const roomMaterial2 = new THREE.MeshBasicMaterial({
        map: roomTexture2,
        side: THREE.BackSide,
      });

      const room2 = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 30),
        roomMaterial2
      );
      room2.position.set(-20,5,20)
      scene.add(room2);

      const mirroredRoom = room.clone();
mirroredRoom.scale.x *= -.1;
mirroredRoom.scale.y *= -.1; // Flip horizontally
mirroredRoom.position.x *= -1; // Mirror position
scene.add(mirroredRoom);


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

const beamGeometry = new THREE.ConeGeometry(6, 75, 64, 1, true);
const beamMaterial = new THREE.MeshBasicMaterial({
  color: 0x6ab7cc,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
  depthWrite: false,
});
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(15, -5, 10);
beam.rotation.x = Math.PI;
scene.add(beam);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 3000;
canvas.height = 520;

ctx.fillStyle = "#fff";
ctx.font = "150px serif";
ctx.fillText("DO NOT TRUST THE SPHERE", 60, 164);

const texture = new THREE.CanvasTexture(canvas);
const textMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 4),
  new THREE.MeshBasicMaterial({ map: texture, transparent: true })
);
textMesh.position.set(-10, 5, 0);
scene.add(textMesh);

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;

// Object that links to a new page
const geometry1 = new THREE.BoxGeometry(2, 2, 2);
const material1 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const linkBox = new THREE.Mesh(geometry1, material1);
linkBox.position.set(0, 100, 10);
linkBox.name = "linkBox";
scene.add(linkBox);

// Object that opens dialogue
const textureLoader = new THREE.TextureLoader();
const spikeTexture = textureLoader.load("Assets/textures/vein1.png");

const spikeyMaterial = new THREE.MeshStandardMaterial({
  color: 0xc0eb34,
  metalness: 0,
  roughness: 1,
  displacementMap: spikeTexture,
  displacementScale: 5,
  bumpMap: spikeTexture,
  bumpScale: 2,
  normalMap: spikeTexture,
});

const dialogSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 64, 64), // High detail!
  spikeyMaterial
);
dialogSphere.position.set(-15, 0.6, 15);
dialogSphere.name = "dialogSphere";
scene.add(dialogSphere);


function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    switch (object.name) {
      case "linkBox":
        window.location.href = "angels.html"; // change to your actual page
        break;
      case "dialogSphere":
        window.showDialogue("hello-farmer"); // 👈 this is what connects to dialogue2.js
        break;
    }
  }
}

// Create an invisible hit area for dialogSphere
// Invisible hitbox for dialogSphere
const dialogHitbox = new THREE.Mesh(
  new THREE.SphereGeometry(3, 8, 8),
  new THREE.MeshBasicMaterial({ visible: false })
);
dialogHitbox.position.copy(dialogSphere.position);
dialogHitbox.name = "dialogSphere";
scene.add(dialogHitbox);

// Invisible hitbox for linkBox
const linkHitbox = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ visible: false })
);
linkHitbox.position.copy(linkBox.position);
linkHitbox.name = "linkBox";
scene.add(linkHitbox);

// ✅ Add these right after
const interactables = [dialogHitbox, linkHitbox];

const visibleTargets = {
  dialogSphere: dialogSphere,
  linkBox: linkBox,
};




window.addEventListener("click", onClick);

linkBox.userData.originalMaterial = linkBox.material;
dialogSphere.userData.originalMaterial = dialogSphere.material;





    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
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
    size: 0.03,
    transparent: true,
    opacity: 0.6,
    vertexColors: true, // Enable per-particle color
    depthWrite: false,
  });
  

// Create particle cloud
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

// Color attribute: set once
const colors = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  colors[i * 3 + 0] = Math.random();
  colors[i * 3 + 1] = Math.random();
  colors[i * 3 + 2] = Math.random();
}
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));


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
  
  floatMesh.position.x = 1.5 + Math.sin(t * 0.2) * 20;
  floatMesh.position.z = 3 + Math.sin(t * 0.5) * 20;

  particleSystem.rotation.y = t * 0.02;
  particleSystem.rotation.x = Math.sin(t * 0.1) * 0.1;

  if (window.analyser && window.dataArray) {
    window.analyser.getByteFrequencyData(window.dataArray);
    let sum = 0;
    for (let i = 0; i < window.dataArray.length; i++) sum += window.dataArray[i];
    const average = sum / window.dataArray.length;
    const normalized = average / 255;
    particlesMaterial.size = 0.01 + normalized * 0.3;
  }

  controls.update();

  // Hover detection
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(interactables);

// Reset materials
[dialogSphere, linkBox].forEach((obj) => {
  obj.material = obj.userData.originalMaterial;
});
document.body.style.cursor = "default";

// Highlight if hovering
if (intersects.length > 0) {
  const targetName = intersects[0].object.name;
  const visibleObject = visibleTargets[targetName];

  if (visibleObject) {
    document.body.style.cursor = "pointer";
    visibleObject.material = new THREE.MeshStandardMaterial({
      color: 0xfff,
      emissive: 0xfff,
      metalness: 1,
      roughness: 0,
    });
  }
}



  // 🌀 Afterimage fade effect
  renderer.autoClear = false;
  renderer.render(afterimageScene, afterimageCamera); // transparent overlay
  renderer.render(scene, camera);
  renderer.autoClear = true;
}

      animate();


      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);


      });