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

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });