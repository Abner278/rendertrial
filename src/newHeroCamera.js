import * as THREE from 'three';

export function createNewHeroCamera(canvasElement) {
  if (!canvasElement) return null;

  // 1. Scene & Camera Setup
  const scene = new THREE.Scene();
  
  // Perspective Camera: Positioned with generous breathing room matching reference image framing
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  // 2. WebGL Renderer Setup (100% Isolated Transparent Canvas)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);
  renderer.setClearColor(0x000000, 0); // 100% Transparent Background
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  // 3. High-Resolution Stippled Leatherette Texture
  function createGripTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 16000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 1.4 + 0.4;
      const val = Math.floor(Math.random() * 190 + 30);
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  }

  // Engraved Lens Specification Texture
  function createLensSpecsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 232, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#F0F0FA';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    
    ctx.fillText('RENDERBERRY CINEMA OPTICS  F/1.2  50mm  NANO-AR II', 256, 45);
    ctx.fillText('MADE IN JAPAN  ø72mm', 256, 480);

    return new THREE.CanvasTexture(canvas);
  }

  const bumpMap = createGripTexture();
  const lensSpecsTex = createLensSpecsTexture();

  // 4. Photorealistic PBR Materials Library
  const matBody = new THREE.MeshStandardMaterial({
    color: 0x2E2F3A,       // Graphite slate metallic camera body
    metalness: 0.85,
    roughness: 0.26
  });

  const matBodyDark = new THREE.MeshStandardMaterial({
    color: 0x1E1F28,
    metalness: 0.80,
    roughness: 0.35
  });

  const matGrip = new THREE.MeshStandardMaterial({
    color: 0x242530,       // Textured handle grip & rear thumb rest
    metalness: 0.15,
    roughness: 0.65,
    bumpMap: bumpMap,
    bumpScale: 0.05
  });

  const matChrome = new THREE.MeshStandardMaterial({
    color: 0xF8F8FF,       // Polished silver chrome for controls
    metalness: 0.98,
    roughness: 0.06
  });

  const matSilverAccent = new THREE.MeshStandardMaterial({
    color: 0xD2D2E4,
    metalness: 0.92,
    roughness: 0.12
  });

  const matPurpleAccent = new THREE.MeshStandardMaterial({
    color: 0xB44CFF,       // RenderBerry Purple Accent Ring
    metalness: 0.9,
    roughness: 0.15,
    emissive: 0x6A10A0,
    emissiveIntensity: 0.45
  });

  const matLensBarrel = new THREE.MeshStandardMaterial({
    color: 0x262734,
    metalness: 0.88,
    roughness: 0.20
  });

  const matRibbedRing = new THREE.MeshStandardMaterial({
    color: 0x1A1B24,
    metalness: 0.45,
    roughness: 0.58
  });

  const matScreenGlass = new THREE.MeshPhysicalMaterial({
    color: 0x12131F,
    metalness: 0.92,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 1.0,
    emissive: 0x181A2A,
    emissiveIntensity: 0.15
  });

  const matRubberDark = new THREE.MeshStandardMaterial({
    color: 0x181922,
    metalness: 0.1,
    roughness: 0.82
  });

  const matPearlWhiteGlass = new THREE.MeshPhysicalMaterial({
    color: 0xF8F9FE,
    metalness: 0.90,
    roughness: 0.06,
    transmission: 0.15,
    opacity: 1,
    transparent: false,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    ior: 1.6,
    reflectivity: 1.0,
    emissive: 0xE2E4FA,
    emissiveIntensity: 0.95
  });

  const matChromeOpticalRing = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0.98,
    roughness: 0.05,
    emissive: 0xB0A0D0,
    emissiveIntensity: 0.65
  });

  const matSilverOpticalRing = new THREE.MeshStandardMaterial({
    color: 0xE8E8F5,
    metalness: 0.95,
    roughness: 0.10
  });

  const matSilverCoreDome = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    metalness: 0.92,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    reflectivity: 1.0,
    emissive: 0xF0F0FF,
    emissiveIntensity: 1.10
  });

  const matSilverApertureBlade = new THREE.MeshStandardMaterial({
    color: 0xD0D0E5,
    metalness: 0.92,
    roughness: 0.16
  });

  const matLensSpecs = new THREE.MeshStandardMaterial({
    map: lensSpecsTex,
    transparent: true,
    roughness: 0.3,
    metalness: 0.5
  });

  // 5. Build Photorealistic 3D Camera Assembly Groups
  const cameraGroup = new THREE.Group();

  const bodyGroup = new THREE.Group();        
  const topControlsGroup = new THREE.Group();  
  const rearControlsGroup = new THREE.Group(); 
  const lensGroup = new THREE.Group();         

  const lensFrontGlassGroup = new THREE.Group(); 
  const lensFrontRimGroup = new THREE.Group();   
  const lensFocusRingGroup = new THREE.Group();  
  const lensAccentRingGroup = new THREE.Group(); 
  const lensZoomRingGroup = new THREE.Group();   
  const lensBaseGroup = new THREE.Group();       

  lensGroup.position.set(0.1, -0.02, 0.42);

  // --- Main Camera Body Chassis ---
  const bodyGeo = new THREE.BoxGeometry(1.88, 1.24, 0.74);
  const bodyMesh = new THREE.Mesh(bodyGeo, matBody);
  bodyMesh.position.set(0, 0, 0);
  bodyGroup.add(bodyMesh);

  // Ergonomic Right Handle Grip
  const gripGeo = new THREE.BoxGeometry(0.54, 1.22, 0.44);
  const gripMesh = new THREE.Mesh(gripGeo, matGrip);
  gripMesh.position.set(-0.78, -0.01, 0.28);
  bodyGroup.add(gripMesh);

  // Lens Release Button (Front Body)
  const releaseBtnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
  const releaseBtnMesh = new THREE.Mesh(releaseBtnGeo, matChrome);
  releaseBtnMesh.rotation.x = Math.PI / 2;
  releaseBtnMesh.position.set(0.66, -0.15, 0.39);
  bodyGroup.add(releaseBtnMesh);

  // Stainless Steel Lens Mount & Purple Accent Ring
  const mountRingGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 48);
  const mountRingMesh = new THREE.Mesh(mountRingGeo, matPurpleAccent);
  mountRingMesh.rotation.x = Math.PI / 2;
  mountRingMesh.position.set(0.1, -0.02, 0.38);
  bodyGroup.add(mountRingMesh);

  // Bottom Baseplate & Tripod Socket
  const bottomPlateGeo = new THREE.BoxGeometry(1.85, 0.05, 0.70);
  const bottomPlateMesh = new THREE.Mesh(bottomPlateGeo, matSilverAccent);
  bottomPlateMesh.position.set(0, -0.63, 0);
  bodyGroup.add(bottomPlateMesh);

  const tripodSocketGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24);
  const tripodSocketMesh = new THREE.Mesh(tripodSocketGeo, matChrome);
  tripodSocketMesh.position.set(0.1, -0.65, 0);
  bodyGroup.add(tripodSocketMesh);

  cameraGroup.add(bodyGroup);

  // --- Top Controls & Viewfinder Group ---
  const topPlateGeo = new THREE.BoxGeometry(1.86, 0.14, 0.72);
  const topPlateMesh = new THREE.Mesh(topPlateGeo, matSilverAccent);
  topPlateMesh.position.set(0, 0.63, 0);
  topControlsGroup.add(topPlateMesh);

  const prismGeo = new THREE.CylinderGeometry(0.36, 0.54, 0.4, 4);
  const prismMesh = new THREE.Mesh(prismGeo, matBody);
  prismMesh.rotation.y = Math.PI / 4;
  prismMesh.position.set(0, 0.78, -0.02);
  topControlsGroup.add(prismMesh);

  const logoPlateGeo = new THREE.BoxGeometry(0.4, 0.11, 0.02);
  const logoPlateMesh = new THREE.Mesh(logoPlateGeo, matSilverAccent);
  logoPlateMesh.position.set(0, 0.78, 0.26);
  topControlsGroup.add(logoPlateMesh);

  const shoeGeo = new THREE.BoxGeometry(0.25, 0.06, 0.27);
  const shoeMesh = new THREE.Mesh(shoeGeo, matChrome);
  shoeMesh.position.set(0, 0.99, -0.02);
  topControlsGroup.add(shoeMesh);

  const dialGeo1 = new THREE.CylinderGeometry(0.19, 0.19, 0.14, 32);
  const dialMesh1 = new THREE.Mesh(dialGeo1, matChrome);
  dialMesh1.position.set(0.62, 0.70, -0.08);
  topControlsGroup.add(dialMesh1);

  const dialKnurlGeo = new THREE.CylinderGeometry(0.195, 0.195, 0.08, 32);
  const dialKnurlMesh = new THREE.Mesh(dialKnurlGeo, matRibbedRing);
  dialKnurlMesh.position.set(0.62, 0.70, -0.08);
  topControlsGroup.add(dialKnurlMesh);

  const dialGeo2 = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 32);
  const dialMesh2 = new THREE.Mesh(dialGeo2, matBodyDark);
  dialMesh2.position.set(0.62, 0.79, -0.08);
  topControlsGroup.add(dialMesh2);

  const dialGeo3 = new THREE.CylinderGeometry(0.17, 0.17, 0.12, 32);
  const dialMesh3 = new THREE.Mesh(dialGeo3, matChrome);
  dialMesh3.position.set(-0.62, 0.70, -0.08);
  topControlsGroup.add(dialMesh3);

  const shutterCollarGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 24);
  const shutterCollarMesh = new THREE.Mesh(shutterCollarGeo, matSilverAccent);
  shutterCollarMesh.position.set(-0.72, 0.68, 0.26);
  topControlsGroup.add(shutterCollarMesh);

  const shutterGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 24);
  const shutterMesh = new THREE.Mesh(shutterGeo, matChrome);
  shutterMesh.position.set(-0.72, 0.71, 0.26);
  topControlsGroup.add(shutterMesh);

  cameraGroup.add(topControlsGroup);

  // --- Rear Controls & LCD Group ---
  const lcdBezelGeo = new THREE.BoxGeometry(1.22, 0.84, 0.05);
  const lcdBezelMesh = new THREE.Mesh(lcdBezelGeo, matSilverAccent);
  lcdBezelMesh.position.set(0.12, -0.06, -0.38);
  rearControlsGroup.add(lcdBezelMesh);

  const lcdScreenGeo = new THREE.BoxGeometry(1.16, 0.78, 0.02);
  const lcdScreenMesh = new THREE.Mesh(lcdScreenGeo, matScreenGlass);
  lcdScreenMesh.position.set(0.12, -0.06, -0.40);
  rearControlsGroup.add(lcdScreenMesh);

  const evfFrameGeo = new THREE.BoxGeometry(0.44, 0.30, 0.12);
  const evfFrameMesh = new THREE.Mesh(evfFrameGeo, matBodyDark);
  evfFrameMesh.position.set(0, 0.76, -0.38);
  rearControlsGroup.add(evfFrameMesh);

  const evfEyecupGeo = new THREE.TorusGeometry(0.15, 0.03, 16, 32);
  const evfEyecupMesh = new THREE.Mesh(evfEyecupGeo, matRubberDark);
  evfEyecupMesh.position.set(0, 0.76, -0.44);
  rearControlsGroup.add(evfEyecupMesh);

  const thumbRestGeo = new THREE.BoxGeometry(0.38, 0.52, 0.06);
  const thumbRestMesh = new THREE.Mesh(thumbRestGeo, matGrip);
  thumbRestMesh.position.set(-0.76, 0.24, -0.38);
  rearControlsGroup.add(thumbRestMesh);

  const dpadGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32);
  const dpadMesh = new THREE.Mesh(dpadGeo, matBodyDark);
  dpadMesh.rotation.x = Math.PI / 2;
  dpadMesh.position.set(0.72, -0.15, -0.39);
  rearControlsGroup.add(dpadMesh);

  const dpadOkGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
  const dpadOkMesh = new THREE.Mesh(dpadOkGeo, matChrome);
  dpadOkMesh.rotation.x = Math.PI / 2;
  dpadOkMesh.position.set(0.72, -0.15, -0.40);
  rearControlsGroup.add(dpadOkMesh);

  cameraGroup.add(rearControlsGroup);

  // --- Lens Base Group ---
  const b0Geo = new THREE.CylinderGeometry(0.52, 0.53, 0.12, 48);
  const b0Mesh = new THREE.Mesh(b0Geo, matChrome);
  b0Mesh.rotation.x = Math.PI / 2;
  b0Mesh.position.z = 0.06;
  lensBaseGroup.add(b0Mesh);

  const b1Geo = new THREE.CylinderGeometry(0.51, 0.52, 0.32, 48);
  const b1Mesh = new THREE.Mesh(b1Geo, matLensBarrel);
  b1Mesh.rotation.x = Math.PI / 2;
  b1Mesh.position.z = 0.24;
  lensBaseGroup.add(b1Mesh);

  lensGroup.add(lensBaseGroup);

  // --- Lens Zoom Ring Group ---
  const b2Geo = new THREE.CylinderGeometry(0.525, 0.525, 0.45, 48);
  const b2Mesh = new THREE.Mesh(b2Geo, matRibbedRing);
  b2Mesh.rotation.x = Math.PI / 2;
  b2Mesh.position.z = 0.62;
  lensZoomRingGroup.add(b2Mesh);

  lensGroup.add(lensZoomRingGroup);

  // --- Lens Accent & Scale Ring Group ---
  const b3SilverGeo = new THREE.CylinderGeometry(0.53, 0.53, 0.05, 48);
  const b3SilverMesh = new THREE.Mesh(b3SilverGeo, matSilverAccent);
  b3SilverMesh.rotation.x = Math.PI / 2;
  b3SilverMesh.position.z = 0.86;
  lensAccentRingGroup.add(b3SilverMesh);

  const b3Geo = new THREE.CylinderGeometry(0.535, 0.535, 0.05, 48);
  const b3Mesh = new THREE.Mesh(b3Geo, matPurpleAccent);
  b3Mesh.rotation.x = Math.PI / 2;
  b3Mesh.position.z = 0.91;
  lensAccentRingGroup.add(b3Mesh);

  lensGroup.add(lensAccentRingGroup);

  // --- Lens Focus Ring Group ---
  const b4Geo = new THREE.CylinderGeometry(0.54, 0.54, 0.48, 48);
  const b4Mesh = new THREE.Mesh(b4Geo, matRibbedRing);
  b4Mesh.rotation.x = Math.PI / 2;
  b4Mesh.position.z = 1.18;
  lensFocusRingGroup.add(b4Mesh);

  lensGroup.add(lensFocusRingGroup);

  // --- Lens Front Rim Group ---
  const b5Geo = new THREE.CylinderGeometry(0.58, 0.55, 0.35, 48);
  const b5Mesh = new THREE.Mesh(b5Geo, matLensBarrel);
  b5Mesh.rotation.x = Math.PI / 2;
  b5Mesh.position.z = 1.58;
  lensFrontRimGroup.add(b5Mesh);

  const frontBevelGeo = new THREE.TorusGeometry(0.56, 0.02, 16, 48);
  const frontBevelMesh = new THREE.Mesh(frontBevelGeo, matChrome);
  frontBevelMesh.position.z = 1.74;
  lensFrontRimGroup.add(frontBevelMesh);

  const textRingGeo = new THREE.RingGeometry(0.44, 0.55, 48);
  const textRingMesh = new THREE.Mesh(textRingGeo, matLensSpecs);
  textRingMesh.position.z = 1.73;
  lensFrontRimGroup.add(textRingMesh);

  lensGroup.add(lensFrontRimGroup);

  // --- Lens Front Glass Group & Bright Inner Optical Core Light ---
  const innerGlassGeo = new THREE.CircleGeometry(0.44, 64);
  const innerGlassMesh = new THREE.Mesh(innerGlassGeo, matPearlWhiteGlass);
  innerGlassMesh.position.z = 1.72;
  lensFrontGlassGroup.add(innerGlassMesh);

  const silverRing1Geo = new THREE.TorusGeometry(0.38, 0.012, 16, 64);
  const silverRing1Mesh = new THREE.Mesh(silverRing1Geo, matChromeOpticalRing);
  silverRing1Mesh.position.z = 1.725;
  lensFrontGlassGroup.add(silverRing1Mesh);

  const silverRing2Geo = new THREE.TorusGeometry(0.28, 0.010, 16, 64);
  const silverRing2Mesh = new THREE.Mesh(silverRing2Geo, matSilverOpticalRing);
  silverRing2Mesh.position.z = 1.728;
  lensFrontGlassGroup.add(silverRing2Mesh);

  const silverRing3Geo = new THREE.TorusGeometry(0.18, 0.008, 16, 64);
  const silverRing3Mesh = new THREE.Mesh(silverRing3Geo, matChromeOpticalRing);
  silverRing3Mesh.position.z = 1.730;
  lensFrontGlassGroup.add(silverRing3Mesh);

  const silverCoreGeo = new THREE.SphereGeometry(0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const silverCoreMesh = new THREE.Mesh(silverCoreGeo, matSilverCoreDome);
  silverCoreMesh.rotation.x = -Math.PI / 2;
  silverCoreMesh.position.z = 1.732;
  lensFrontGlassGroup.add(silverCoreMesh);

  const apGroup = new THREE.Group();
  apGroup.position.z = 1.715;

  const numBlades = 8;
  for (let i = 0; i < numBlades; i++) {
    const bladeGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0.08, 0.0, 0,
      0.28, 0.08, 0,
      0.32, -0.10, 0
    ]);
    bladeGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    bladeGeo.computeVertexNormals();

    const bladeMesh = new THREE.Mesh(bladeGeo, matSilverApertureBlade);
    bladeMesh.rotation.z = (i * Math.PI * 2) / numBlades;
    apGroup.add(bladeMesh);
  }
  lensFrontGlassGroup.add(apGroup);

  lensGroup.add(lensFrontGlassGroup);

  const frontLensLight = new THREE.PointLight(0xFFFFFF, 7.5, 6);
  frontLensLight.position.set(0.1, -0.02, 2.2);
  cameraGroup.add(frontLensLight);

  const innerPurpleRingGlow = new THREE.PointLight(0xB44CFF, 7.0, 4);
  innerPurpleRingGlow.position.set(0.1, 0, 1.8);
  cameraGroup.add(innerPurpleRingGlow);

  cameraGroup.add(lensGroup);

  // STARTING VIEW (FRONT STARTING ANGLE):
  const defaultRotY = -0.35;
  const defaultRotX = 0.04;

  cameraGroup.rotation.y = defaultRotY;
  cameraGroup.rotation.x = defaultRotX;
  cameraGroup.position.set(0.35, -0.05, 0); // Main Camera anchored 100% in Hero section on the RIGHT
  scene.add(cameraGroup);

  // 6. THREE-POINT CINEMATIC PRODUCT LIGHTING
  const ambLight = new THREE.AmbientLight(0x403B52, 2.2);
  scene.add(ambLight);

  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 4.5);
  keyLight.position.set(-4, 5, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xD6CBE6, 2.8);
  fillLight.position.set(4, -2, 4);
  scene.add(fillLight);

  const rearStudioLight = new THREE.DirectionalLight(0xC8D4F0, 3.2);
  rearStudioLight.position.set(0, 3, -6);
  scene.add(rearStudioLight);

  const purpleRimLight = new THREE.PointLight(0xB44CFF, 8.5, 14);
  purpleRimLight.position.set(3.5, 2.5, -2.5);
  scene.add(purpleRimLight);

  const silverRimLight = new THREE.PointLight(0xA0C8FF, 5.5, 12);
  silverRimLight.position.set(-3.5, 3.5, -2.5);
  scene.add(silverRimLight);

  // 7. STRICT CLICK & DRAG ONLY INTERACTION
  let targetRotY = defaultRotY;
  let targetRotX = defaultRotX;
  
  let isDragging = false;
  let previousX = 0;
  let previousY = 0;

  canvasElement.style.cursor = 'grab';

  function onPointerDown(e) {
    isDragging = true;
    previousX = e.touches ? e.touches[0].clientX : e.clientX;
    previousY = e.touches ? e.touches[0].clientY : e.clientY;
    canvasElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX - previousX;
    const deltaY = currentY - previousY;

    targetRotY += deltaX * 0.008;
    targetRotX = Math.max(-Math.PI * 0.15, Math.min(Math.PI * 0.15, targetRotX + deltaY * 0.002));

    previousX = currentX;
    previousY = currentY;
  }

  function onPointerUp() {
    isDragging = false;
    canvasElement.style.cursor = 'grab';
  }

  canvasElement.addEventListener('mousedown', onPointerDown, { passive: true });
  canvasElement.addEventListener('touchstart', onPointerDown, { passive: true });

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  window.addEventListener('mouseup', onPointerUp, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // Responsive Framing & Scaling
  function resize() {
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    if (width === 0 || height === 0) return;

    camera.aspect = width / height;

    if (window.innerWidth < 768) {
      camera.fov = 34;
      camera.position.z = 6.8;
      cameraGroup.position.set(0, -0.1, 0);
      cameraGroup.scale.setScalar(0.78);
    } else if (window.innerWidth < 1024) {
      camera.fov = 30;
      camera.position.z = 6.4;
      cameraGroup.position.set(0.15, -0.05, 0);
      cameraGroup.scale.setScalar(0.88);
    } else {
      camera.fov = 28;
      camera.position.z = 6.4;
      cameraGroup.position.set(0.35, -0.05, 0); // Main Camera anchored 100% on the RIGHT
      cameraGroup.scale.setScalar(1.0);
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  window.addEventListener('resize', resize);
  resize();

  let animationFrameId;

  // SCROLL PROGRESSION: Front Lens Barrel detaches forward along optical axis in Hero
  let targetExplode = 0.0;
  let currentExplode = 0.0;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Smooth Lerped Drag Rotation
    cameraGroup.rotation.y += (targetRotY - cameraGroup.rotation.y) * 0.1;
    cameraGroup.rotation.x += (targetRotX - cameraGroup.rotation.x) * 0.1;

    // Smooth Lerped Optical Split Progression
    currentExplode += (targetExplode - currentExplode) * 0.10;
    if (Math.abs(targetExplode - currentExplode) < 0.0003) {
      currentExplode = targetExplode;
    }

    // Clearly detaches front optical lens barrel forward & out of camera mount on scroll down, re-attaches on scroll UP
    lensGroup.position.z = 0.42 + currentExplode * 1.35;
    lensGroup.position.x = 0.10 + currentExplode * 0.25;
    lensGroup.position.y = -0.02 - currentExplode * 0.20;

    renderer.render(scene, camera);
  }

  animate();

  return {
    setExplodeProgress(val) {
      if (typeof val === 'number') {
        targetExplode = Math.min(1.0, Math.max(0.0, val));
      }
    },
    destroy() {
      cancelAnimationFrame(animationFrameId);
      canvasElement.removeEventListener('mousedown', onPointerDown);
      canvasElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    }
  };
}

// ----------------------------------------------------
// DETACHED FULL FRONT LENS BARREL HALF IN WHO WE ARE (WITH BRIGHT SPECULAR REFLECTION LIGHT SPOT)
// ----------------------------------------------------
export function createWhoWeAre3DLensPiece(canvasElement) {
  if (!canvasElement) return null;

  const scene = new THREE.Scene();
  // Exact camera framing so full lens fits 100% cleanly without getting cut off
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 6.6);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  // Radial Specular Glow Texture for Lens Glass Reflection Spot (MATCHING IMAGE 2 EXACTLY!)
  function createLensGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 240);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.2, 'rgba(235, 220, 255, 0.95)');
    grad.addColorStop(0.45, 'rgba(180, 110, 255, 0.65)');
    grad.addColorStop(0.75, 'rgba(70, 25, 120, 0.25)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }

  // High-Res Engraved Text Specs Texture
  function createLensSpecsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 232, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#F0F0FA';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    
    ctx.fillText('RENDERBERRY CINEMA OPTICS  F/1.2  50mm  NANO-AR II', 256, 45);
    ctx.fillText('MADE IN JAPAN  ø72mm', 256, 480);

    return new THREE.CanvasTexture(canvas);
  }

  const lensGlowTex = createLensGlowTexture();
  const lensSpecsTex = createLensSpecsTexture();

  // Exact Photorealistic Lens Materials Matching Hero Camera
  const matPearlWhiteGlass = new THREE.MeshPhysicalMaterial({
    color: 0xF8F9FE,
    metalness: 0.90,
    roughness: 0.05,
    transmission: 0.15,
    opacity: 1,
    transparent: false,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    ior: 1.6,
    reflectivity: 1.0,
    emissive: 0xF2E6FF,
    emissiveIntensity: 0.95
  });

  const matChromeOpticalRing = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0.98,
    roughness: 0.04,
    emissive: 0xB0A0D0,
    emissiveIntensity: 0.65
  });

  const matSilverOpticalRing = new THREE.MeshStandardMaterial({
    color: 0xE8E8F5,
    metalness: 0.95,
    roughness: 0.08
  });

  const matSilverCoreDome = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    metalness: 0.95,
    roughness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    reflectivity: 1.0,
    emissive: 0xFFFFFF,
    emissiveIntensity: 1.20
  });

  const matSilverApertureBlade = new THREE.MeshStandardMaterial({
    color: 0xD0D0E5,
    metalness: 0.92,
    roughness: 0.16
  });

  const matPurpleAccent = new THREE.MeshStandardMaterial({
    color: 0xB44CFF,
    metalness: 0.9,
    roughness: 0.15,
    emissive: 0x8A10E0,
    emissiveIntensity: 0.65
  });

  const matLensBarrel = new THREE.MeshStandardMaterial({
    color: 0x262734,
    metalness: 0.88,
    roughness: 0.20
  });

  const matRibbedRing = new THREE.MeshStandardMaterial({
    color: 0x1A1B24,
    metalness: 0.45,
    roughness: 0.58
  });

  const matChrome = new THREE.MeshStandardMaterial({
    color: 0xF8F8FF,
    metalness: 0.98,
    roughness: 0.06
  });

  const matSilverAccent = new THREE.MeshStandardMaterial({
    color: 0xD2D2E4,
    metalness: 0.92,
    roughness: 0.12
  });

  const matLensSpecs = new THREE.MeshStandardMaterial({
    map: lensSpecsTex,
    transparent: true,
    roughness: 0.3,
    metalness: 0.5
  });

  // COMPLETE FRONT LENS BARREL HALF GROUP
  const fullLensHalfGroup = new THREE.Group();

  // 1. Lens Base Collar & Mount Ring
  const b0Geo = new THREE.CylinderGeometry(0.52, 0.53, 0.12, 48);
  const b0Mesh = new THREE.Mesh(b0Geo, matChrome);
  b0Mesh.rotation.x = Math.PI / 2;
  b0Mesh.position.z = -0.75;
  fullLensHalfGroup.add(b0Mesh);

  const b1Geo = new THREE.CylinderGeometry(0.51, 0.52, 0.32, 48);
  const b1Mesh = new THREE.Mesh(b1Geo, matLensBarrel);
  b1Mesh.rotation.x = Math.PI / 2;
  b1Mesh.position.z = -0.55;
  fullLensHalfGroup.add(b1Mesh);

  // 2. Lens Zoom Ring
  const b2Geo = new THREE.CylinderGeometry(0.525, 0.525, 0.45, 48);
  const b2Mesh = new THREE.Mesh(b2Geo, matRibbedRing);
  b2Mesh.rotation.x = Math.PI / 2;
  b2Mesh.position.z = -0.18;
  fullLensHalfGroup.add(b2Mesh);

  // 3. Lens Accent & Purple Scale Ring
  const b3SilverGeo = new THREE.CylinderGeometry(0.53, 0.53, 0.05, 48);
  const b3SilverMesh = new THREE.Mesh(b3SilverGeo, matSilverAccent);
  b3SilverMesh.rotation.x = Math.PI / 2;
  b3SilverMesh.position.z = 0.06;
  fullLensHalfGroup.add(b3SilverMesh);

  const b3Geo = new THREE.CylinderGeometry(0.535, 0.535, 0.05, 48);
  const b3Mesh = new THREE.Mesh(b3Geo, matPurpleAccent);
  b3Mesh.rotation.x = Math.PI / 2;
  b3Mesh.position.z = 0.11;
  fullLensHalfGroup.add(b3Mesh);

  // 4. Lens Focus Ring
  const b4Geo = new THREE.CylinderGeometry(0.54, 0.54, 0.48, 48);
  const b4Mesh = new THREE.Mesh(b4Geo, matRibbedRing);
  b4Mesh.rotation.x = Math.PI / 2;
  b4Mesh.position.z = 0.38;
  fullLensHalfGroup.add(b4Mesh);

  // 5. Lens Front Rim Barrel & Engraved Specs Text
  const b5Geo = new THREE.CylinderGeometry(0.58, 0.55, 0.35, 48);
  const b5Mesh = new THREE.Mesh(b5Geo, matLensBarrel);
  b5Mesh.rotation.x = Math.PI / 2;
  b5Mesh.position.z = 0.78;
  fullLensHalfGroup.add(b5Mesh);

  const frontBevelGeo = new THREE.TorusGeometry(0.56, 0.02, 16, 48);
  const frontBevelMesh = new THREE.Mesh(frontBevelGeo, matChrome);
  frontBevelMesh.position.z = 0.94;
  fullLensHalfGroup.add(frontBevelMesh);

  const textRingGeo = new THREE.RingGeometry(0.44, 0.55, 48);
  const textRingMesh = new THREE.Mesh(textRingGeo, matLensSpecs);
  textRingMesh.position.z = 0.93;
  fullLensHalfGroup.add(textRingMesh);

  // 6. Front Optical Glass Dome & Inner Circle Specular Core Light
  const innerGlassGeo = new THREE.CircleGeometry(0.44, 64);
  const innerGlassMesh = new THREE.Mesh(innerGlassGeo, matPearlWhiteGlass);
  innerGlassMesh.position.z = 0.92;
  fullLensHalfGroup.add(innerGlassMesh);

  const silverRing1Geo = new THREE.TorusGeometry(0.38, 0.012, 16, 64);
  const silverRing1Mesh = new THREE.Mesh(silverRing1Geo, matChromeOpticalRing);
  silverRing1Mesh.position.z = 0.925;
  fullLensHalfGroup.add(silverRing1Mesh);

  const silverRing2Geo = new THREE.TorusGeometry(0.28, 0.010, 16, 64);
  const silverRing2Mesh = new THREE.Mesh(silverRing2Geo, matSilverOpticalRing);
  silverRing2Mesh.position.z = 0.928;
  fullLensHalfGroup.add(silverRing2Mesh);

  const silverCoreGeo = new THREE.SphereGeometry(0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const silverCoreMesh = new THREE.Mesh(silverCoreGeo, matSilverCoreDome);
  silverCoreMesh.rotation.x = -Math.PI / 2;
  silverCoreMesh.position.z = 0.935;
  fullLensHalfGroup.add(silverCoreMesh);

  // ADDITIVE OPTICAL GLOW FLARE DISK (MATCHES IMAGE 2 SPECULAR LIGHT SPOT EXACTLY!)
  const opticalGlowGeo = new THREE.PlaneGeometry(0.78, 0.78);
  const opticalGlowMat = new THREE.MeshBasicMaterial({
    map: lensGlowTex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const opticalGlowMesh = new THREE.Mesh(opticalGlowGeo, opticalGlowMat);
  opticalGlowMesh.position.z = 0.938;
  fullLensHalfGroup.add(opticalGlowMesh);

  const apGroup = new THREE.Group();
  apGroup.position.z = 0.915;
  const numBlades = 8;
  for (let i = 0; i < numBlades; i++) {
    const bladeGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0.08, 0.0, 0,
      0.28, 0.08, 0,
      0.32, -0.10, 0
    ]);
    bladeGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    bladeGeo.computeVertexNormals();

    const bladeMesh = new THREE.Mesh(bladeGeo, matSilverApertureBlade);
    bladeMesh.rotation.z = (i * Math.PI * 2) / numBlades;
    apGroup.add(bladeMesh);
  }
  fullLensHalfGroup.add(apGroup);

  // DIRECT OPTICAL AXIS POINT LIGHT (Casts bright glowing white specular circle spot!)
  const frontGlassDirectLight = new THREE.PointLight(0xFFFFFF, 12.0, 8);
  frontGlassDirectLight.position.set(0, 0, 2.4);
  fullLensHalfGroup.add(frontGlassDirectLight);

  // Studio 3D Perspective Framing matching exact Hero lens scale & angle
  const defaultRotY = -0.38;
  const defaultRotX = 0.12;

  fullLensHalfGroup.rotation.y = defaultRotY;
  fullLensHalfGroup.rotation.x = defaultRotX;
  scene.add(fullLensHalfGroup);

  // Studio Lighting
  const ambLight = new THREE.AmbientLight(0x403B52, 2.5);
  scene.add(ambLight);

  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 5.0);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);

  const purpleRimLight = new THREE.PointLight(0xB44CFF, 9.5, 14);
  purpleRimLight.position.set(3, 2, 3);
  scene.add(purpleRimLight);

  const innerPurpleRingGlow = new THREE.PointLight(0xB44CFF, 7.0, 4);
  innerPurpleRingGlow.position.set(0.1, 0, 1.8);
  scene.add(innerPurpleRingGlow);

  // Subtle Interactive Drag & Float
  let targetRotY = defaultRotY;
  let targetRotX = defaultRotX;
  let isDragging = false;
  let previousX = 0;
  let previousY = 0;

  function onPointerDown(e) {
    isDragging = true;
    previousX = e.touches ? e.touches[0].clientX : e.clientX;
    previousY = e.touches ? e.touches[0].clientY : e.clientY;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    targetRotY += (currentX - previousX) * 0.008;
    targetRotX += (currentY - previousY) * 0.004;
    previousX = currentX;
    previousY = currentY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  canvasElement.addEventListener('mousedown', onPointerDown, { passive: true });
  canvasElement.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('mouseup', onPointerUp, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  function resize() {
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  window.addEventListener('resize', resize);
  resize();

  let animationFrameId;
  let time = 0;
  let targetProgress = 0.0;
  let currentProgress = 0.0;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    time += 0.015;

    // Smooth lerped scroll progress (0.0 = offscreen top, 1.0 = fixed in Who We Are)
    currentProgress += (targetProgress - currentProgress) * 0.10;
    if (Math.abs(targetProgress - currentProgress) < 0.0003) {
      currentProgress = targetProgress;
    }

    // Smooth entry transition into Who We Are section framing, reverse on scroll UP
    const entryY = (1.0 - currentProgress) * 2.2;
    const entryScale = 0.75 + currentProgress * 0.25;

    fullLensHalfGroup.position.y = entryY + Math.sin(time) * 0.04;
    fullLensHalfGroup.position.x = 0.0;
    fullLensHalfGroup.scale.setScalar(entryScale);

    fullLensHalfGroup.rotation.y += (targetRotY - fullLensHalfGroup.rotation.y) * 0.08;
    fullLensHalfGroup.rotation.x += (targetRotX - fullLensHalfGroup.rotation.x) * 0.08;

    renderer.render(scene, camera);
  }

  animate();

  return {
    setScrollProgress(val) {
      if (typeof val === 'number') {
        targetProgress = Math.min(1.0, Math.max(0.0, val));
      }
    },
    destroy() {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    }
  };
}
