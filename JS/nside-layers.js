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
        new THREE.BoxGeometry(10, 3, 10),
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

    const floatMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff });
    const floatMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), floatMaterial);
    floatMesh.position.set(1.5, 1.5, 0);
    scene.add(floatMesh);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);


    let clock = new THREE.Clock();

    // Create geometry for particles
const particleCount = 500;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20; // spread across the room
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Material for particles
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.01,
  transparent: true,
  opacity: 0.6,
  depthWrite: false, // lets particles glow through each other
});

// Create particle cloud
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);


function animate() {
  requestAnimationFrame(animate);
  
  const t = clock.getElapsedTime();
  floatMesh.position.y = 1.5 + Math.sin(t * 2) * 0.2; // Float up and down

  particleSystem.rotation.y = t * 0.02;
  particleSystem.rotation.x = Math.sin(t * 0.1) * 0.01;

  controls.update();
  renderer.render(scene, camera);
}
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });