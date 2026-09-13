(function () {
  const wrap = document.getElementById('dance-canvas-wrap');
  const canvas = document.getElementById('dance-canvas');
  if (!wrap || !canvas || typeof THREE === 'undefined') return;

  let scene, camera, renderer, figure, isDancing = false;
  let clock = new THREE.Clock();
  let limbs = {};

  function init() {
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f4f2);

    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.2);
    camera.lookAt(0, 1.0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // soft light
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.55);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    // simple low-poly humanoid
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.65,
      metalness: 0.05
    });
    const matLight = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      roughness: 0.7
    });

    figure = new THREE.Group();

    // torso
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.3);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.y = 1.15;
    figure.add(torso);

    // head
    const headGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const head = new THREE.Mesh(headGeo, matLight);
    head.position.y = 1.75;
    figure.add(head);

    // hips
    const hipsGeo = new THREE.BoxGeometry(0.5, 0.22, 0.28);
    const hips = new THREE.Mesh(hipsGeo, mat);
    hips.position.y = 0.72;
    figure.add(hips);

    // arms
    function makeLimb(w, h, d, colorMat) {
      const g = new THREE.BoxGeometry(w, h, d);
      return new THREE.Mesh(g, colorMat || mat);
    }

    const leftUpper = makeLimb(0.14, 0.42, 0.14);
    leftUpper.position.set(-0.42, 1.25, 0);
    figure.add(leftUpper);
    limbs.leftUpper = leftUpper;

    const leftLower = makeLimb(0.12, 0.38, 0.12);
    leftLower.position.set(-0.42, 0.85, 0);
    figure.add(leftLower);
    limbs.leftLower = leftLower;

    const rightUpper = makeLimb(0.14, 0.42, 0.14);
    rightUpper.position.set(0.42, 1.25, 0);
    figure.add(rightUpper);
    limbs.rightUpper = rightUpper;

    const rightLower = makeLimb(0.12, 0.38, 0.12);
    rightLower.position.set(0.42, 0.85, 0);
    figure.add(rightLower);
    limbs.rightLower = rightLower;

    // legs
    const leftThigh = makeLimb(0.18, 0.45, 0.18);
    leftThigh.position.set(-0.18, 0.42, 0);
    figure.add(leftThigh);
    limbs.leftThigh = leftThigh;

    const leftCalf = makeLimb(0.15, 0.4, 0.15);
    leftCalf.position.set(-0.18, 0.05, 0);
    figure.add(leftCalf);
    limbs.leftCalf = leftCalf;

    const rightThigh = makeLimb(0.18, 0.45, 0.18);
    rightThigh.position.set(0.18, 0.42, 0);
    figure.add(rightThigh);
    limbs.rightThigh = rightThigh;

    const rightCalf = makeLimb(0.15, 0.4, 0.15);
    rightCalf.position.set(0.18, 0.05, 0);
    figure.add(rightCalf);
    limbs.rightCalf = rightCalf;

    // floor shadow plane
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xe8e8e6, transparent: true, opacity: 0.6 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    scene.add(figure);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!renderer) return;

    const t = clock.getElapsedTime();

    if (isDancing && figure) {
      // body bounce
      figure.position.y = Math.abs(Math.sin(t * 6)) * 0.08;
      figure.rotation.y = Math.sin(t * 2.2) * 0.15;

      // arms
      limbs.leftUpper.rotation.z = Math.sin(t * 7) * 0.9 - 0.3;
      limbs.rightUpper.rotation.z = -Math.sin(t * 7 + 0.4) * 0.9 + 0.3;
      limbs.leftLower.rotation.z = Math.sin(t * 7) * 0.4;
      limbs.rightLower.rotation.z = -Math.sin(t * 7 + 0.4) * 0.4;

      // legs
      limbs.leftThigh.rotation.x = Math.sin(t * 6) * 0.55;
      limbs.rightThigh.rotation.x = Math.sin(t * 6 + Math.PI) * 0.55;
      limbs.leftCalf.rotation.x = Math.max(0, Math.sin(t * 6 + 0.5) * 0.4);
      limbs.rightCalf.rotation.x = Math.max(0, Math.sin(t * 6 + Math.PI + 0.5) * 0.4);
    } else if (figure) {
      // idle subtle sway
      figure.position.y = Math.sin(t * 1.5) * 0.015;
      figure.rotation.y = Math.sin(t * 0.8) * 0.05;
      limbs.leftUpper.rotation.z = -0.15;
      limbs.rightUpper.rotation.z = 0.15;
      limbs.leftThigh.rotation.x = 0;
      limbs.rightThigh.rotation.x = 0;
    }

    renderer.render(scene, camera);
  }

  function resize() {
    if (!renderer || !camera) return;
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', resize);

  // public API
  window.FroblokDance = {
    start() {
      if (!scene) {
        init();
        animate();
      }
      isDancing = true;
    },
    stop() {
      isDancing = false;
    },
    toggle() {
      if (!scene) {
        init();
        animate();
      }
      isDancing = !isDancing;
      return isDancing;
    },
    isActive() {
      return isDancing;
    }
  };
})();
