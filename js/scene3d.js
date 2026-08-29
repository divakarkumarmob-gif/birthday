/**
 * 3D Birthday Celebration - Three.js Scene Engine (Enhanced Feature Suite)
 * Cake, Numeric Candles, Cake Slicing, Balloons, Gift Box, Fireworks, Disco Ball, Sparklers, Sky Lanterns, & Origami Stars
 */

class BirthdayScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    // Core Groups & Meshes
    this.cakeGroup = new THREE.Group();
    this.cakeSliceGroup = null;
    this.cakeKnife = null;
    this.isCakeSliced = false;
    this.candles = [];
    this.flames = [];
    this.candleLights = [];
    this.candlesBlown = false;
    this.currentAge = 24;

    this.balloons = [];
    this.giftGroup = new THREE.Group();
    this.giftLid = null;
    this.giftOpened = false;

    // Disco Ball
    this.discoBallGroup = null;
    this.discoSpotlights = [];
    this.isDiscoActive = false;

    // Sky Lanterns & Origami Stars
    this.lanterns = [];
    this.origamiStars = [];

    // Sparkler & Particles
    this.fireworks = [];
    this.confettiParticles = null;
    this.polaroidGroup = null;
    this.sparklerActive = false;
    this.sparklerParticles = [];

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Themes
    this.currentTheme = 'midnight-gold';
    this.themeColors = {
      'midnight-gold': {
        cakeBase: 0xfbf6e2,
        cakeTop: 0x3d1c06,
        frosting: 0xffd700,
        plate: 0x221a2e,
        plateTrim: 0xffd700,
        giftBox: 0x1f143d,
        giftRibbon: 0xffd700,
        balloons: [0xffd700, 0xffa500, 0xff4500, 0x9370db, 0xffffff, 0xd4af37],
        lightGlow: 0xffaa00
      },
      'rose-glamour': {
        cakeBase: 0xffe6ea,
        cakeTop: 0xff9bb2,
        frosting: 0xff4d79,
        plate: 0x2d1120,
        plateTrim: 0xff758c,
        giftBox: 0xff4d79,
        giftRibbon: 0xffffff,
        balloons: [0xff758c, 0xff7eb3, 0xffcad4, 0xffffff, 0xf72585, 0xb5179e],
        lightGlow: 0xff6b8b
      },
      'cyber-neon': {
        cakeBase: 0x162447,
        cakeTop: 0x1f4068,
        frosting: 0x00f2fe,
        plate: 0x0b1021,
        plateTrim: 0x00f2fe,
        giftBox: 0x0f3460,
        giftRibbon: 0x00f2fe,
        balloons: [0x00f2fe, 0x4facfe, 0x43e97b, 0xfa709a, 0xfee140, 0x7f00ff],
        lightGlow: 0x00d4ff
      },
      'cosmic-purple': {
        cakeBase: 0x301b52,
        cakeTop: 0x562382,
        frosting: 0xc471ed,
        plate: 0x180b2b,
        plateTrim: 0x21d4fd,
        giftBox: 0x6b11ff,
        giftRibbon: 0x21d4fd,
        balloons: [0xb721ff, 0x21d4fd, 0x8a2be2, 0xff007f, 0x9400d3, 0x00ffff],
        lightGlow: 0xb721ff
      },
      'pastel-rainbow': {
        cakeBase: 0xfff0f5,
        cakeTop: 0xe6e6fa,
        frosting: 0xfbc2eb,
        plate: 0x2a2438,
        plateTrim: 0xa6c1ee,
        giftBox: 0xfbc2eb,
        giftRibbon: 0xa6c1ee,
        balloons: [0xfbc2eb, 0xa6c1ee, 0xb5ead7, 0xffdac1, 0xff9aa2, 0xe2f0cb],
        lightGlow: 0xfbc2eb
      }
    };

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0c071e, 0.015);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 8, 22);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 45;
    this.controls.target.set(0, 2, 0);

    this.setupLighting();
    this.createFloor();
    this.createBirthdayCake();
    this.createSurpriseGift();
    this.createBalloons(24);
    this.createConfettiStorm();
    this.createPolaroidMemory();
    this.createDiscoBall();
    this.createOrigamiStars();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));

    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    this.dirLight.position.set(12, 20, 15);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.scene.add(this.dirLight);

    this.fillLight = new THREE.DirectionalLight(0x7b68ee, 0.8);
    this.fillLight.position.set(-15, 12, -10);
    this.scene.add(this.fillLight);

    this.cakeGlowLight = new THREE.PointLight(0xffd700, 1.8, 15);
    this.cakeGlowLight.position.set(0, 4.5, 0);
    this.scene.add(this.cakeGlowLight);
  }

  createFloor() {
    const stageGeo = new THREE.CylinderGeometry(14, 15, 0.4, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x140d28,
      roughness: 0.25,
      metalness: 0.6,
    });
    this.stage = new THREE.Mesh(stageGeo, stageMat);
    this.stage.position.y = -0.2;
    this.stage.receiveShadow = true;
    this.scene.add(this.stage);

    const ringGeo = new THREE.TorusGeometry(14.05, 0.08, 16, 100);
    this.stageRingMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const ring = new THREE.Mesh(ringGeo, this.stageRingMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.01;
    this.scene.add(ring);
  }

  /* =========================================================
     3D CAKE & NUMERIC AGE CANDLES
     ========================================================= */
  createBirthdayCake() {
    const theme = this.themeColors[this.currentTheme];

    this.standMat = new THREE.MeshStandardMaterial({
      color: theme.plate,
      metalness: 0.8,
      roughness: 0.2,
    });

    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.3, 48), this.standMat);
    basePlate.position.y = 0.15;
    basePlate.castShadow = true;
    this.cakeGroup.add(basePlate);

    const basePillar = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 0.8, 32), this.standMat);
    basePillar.position.y = 0.7;
    basePillar.castShadow = true;
    this.cakeGroup.add(basePillar);

    const cakePlate = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.2, 48), this.standMat);
    cakePlate.position.y = 1.2;
    cakePlate.castShadow = true;
    this.cakeGroup.add(cakePlate);

    // Cake Tier 1
    this.cakeBaseMat = new THREE.MeshStandardMaterial({
      color: theme.cakeBase,
      roughness: 0.45,
      metalness: 0.05
    });
    this.tier1 = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 1.4, 48), this.cakeBaseMat);
    this.tier1.position.y = 2.0;
    this.tier1.castShadow = true;
    this.cakeGroup.add(this.tier1);

    this.frostingMat = new THREE.MeshStandardMaterial({
      color: theme.frosting,
      roughness: 0.3,
      metalness: 0.1
    });

    // Frosting Beads
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), this.frostingMat);
      bead.position.set(Math.cos(angle) * 3.0, 1.35, Math.sin(angle) * 3.0);
      bead.castShadow = true;
      this.cakeGroup.add(bead);
    }

    // Sprinkles
    const sprinkleColors = [0xff4081, 0x00e676, 0xffea00, 0x00b0ff, 0xffffff];
    const sprinkleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8);
    for (let i = 0; i < 50; i++) {
      const spMat = new THREE.MeshStandardMaterial({ color: sprinkleColors[i % sprinkleColors.length], roughness: 0.3 });
      const sprinkle = new THREE.Mesh(sprinkleGeo, spMat);
      const angle = Math.random() * Math.PI * 2;
      sprinkle.position.set(Math.cos(angle) * 3.02, 1.5 + Math.random() * 1.0, Math.sin(angle) * 3.02);
      sprinkle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.cakeGroup.add(sprinkle);
    }

    // Cake Tier 2
    this.cakeTopMat = new THREE.MeshStandardMaterial({
      color: theme.cakeTop,
      roughness: 0.4,
      metalness: 0.1
    });
    this.tier2 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 1.2, 48), this.cakeTopMat);
    this.tier2.position.y = 3.3;
    this.tier2.castShadow = true;
    this.cakeGroup.add(this.tier2);

    // Drips
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const dripLength = 0.2 + (i % 2 === 0 ? 0.35 : 0.15);
      const drip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), this.frostingMat);
      drip.scale.set(1, dripLength / 0.14, 1);
      drip.position.set(Math.cos(angle) * 2.02, 3.8 - dripLength / 2, Math.sin(angle) * 2.02);
      this.cakeGroup.add(drip);
    }

    // Cream Toppers & Strawberries
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const cream = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 16), this.frostingMat);
      cream.position.set(Math.cos(angle) * 1.5, 4.05, Math.sin(angle) * 1.5);
      this.cakeGroup.add(cream);

      const berryMat = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.35 });
      const berry = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 16), berryMat);
      berry.position.set(Math.cos(angle + 0.3) * 1.45, 4.05, Math.sin(angle + 0.3) * 1.45);
      berry.rotation.x = Math.PI;
      this.cakeGroup.add(berry);
    }

    this.createCandles(this.currentAge);
    this.scene.add(this.cakeGroup);
  }

  // Create Candles (with Numeric Candles if age provided!)
  createCandles(age = 24) {
    this.candles.forEach(c => this.cakeGroup.remove(c));
    this.candles = [];
    this.flames = [];
    this.candleLights = [];

    const ageStr = String(age || '');

    // If age has digits, create 3D number candles!
    if (ageStr.length > 0 && ageStr.length <= 3 && !isNaN(parseInt(ageStr))) {
      const digitSpacing = 0.9;
      const startX = -((ageStr.length - 1) * digitSpacing) / 2;

      for (let i = 0; i < ageStr.length; i++) {
        const digitChar = ageStr[i];
        const numMesh = this.createDigitMesh(digitChar);
        numMesh.position.set(startX + i * digitSpacing, 4.0, 0);
        this.cakeGroup.add(numMesh);
        this.candles.push(numMesh);
      }
    } else {
      // Classic ring of pillar candles
      const positions = [{ x: 0, z: 0 }, { x: 0.7, z: 0.5 }, { x: -0.7, z: 0.5 }, { x: 0.7, z: -0.5 }, { x: -0.7, z: -0.5 }];
      positions.forEach(pos => {
        const holder = new THREE.Group();
        holder.position.set(pos.x, 3.9, pos.z);

        const waxMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.2 });
        const candleWax = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 24), waxMat);
        candleWax.position.y = 0.45;
        holder.add(candleWax);

        const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
        wick.position.y = 0.95;
        holder.add(wick);

        this.addFlameToCandle(holder, 1.0);
        this.cakeGroup.add(holder);
        this.candles.push(holder);
      });
    }
  }

  // 3D Number Digit sculpted mesh
  createDigitMesh(digit) {
    const digitGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x442200
    });

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12), mat);
    stick.position.y = 0.2;
    digitGroup.add(stick);

    const charGeo = new THREE.TorusGeometry(0.35, 0.09, 12, 24);
    const digitMesh = new THREE.Mesh(charGeo, mat);
    digitMesh.position.y = 0.75;
    digitGroup.add(digitMesh);

    // Number decoration crown
    const topper = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), mat);
    topper.position.y = 1.15;
    digitGroup.add(topper);

    this.addFlameToCandle(digitGroup, 1.25);
    return digitGroup;
  }

  addFlameToCandle(parentGroup, flameY) {
    const flameGeo = new THREE.ConeGeometry(0.09, 0.28, 16);
    flameGeo.translate(0, 0.14, 0);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.95 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = flameY;
    parentGroup.add(flame);

    const coreGeo = new THREE.ConeGeometry(0.04, 0.16, 12);
    coreGeo.translate(0, 0.08, 0);
    const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    core.position.y = flameY;
    parentGroup.add(core);

    const candleLight = new THREE.PointLight(0xff9900, 0.9, 4);
    candleLight.position.y = flameY + 0.15;
    parentGroup.add(candleLight);

    this.flames.push({ flame, core, initialScale: flame.scale.clone() });
    this.candleLights.push(candleLight);
  }

  // Update Age
  updateAge(newAge) {
    this.currentAge = newAge;
    this.createCandles(newAge);
  }

  // Blow out candles
  blowCandles() {
    if (this.candlesBlown) return false;
    this.candlesBlown = true;

    if (window.birthdayAudio) window.birthdayAudio.playCandleBlow();

    this.flames.forEach((item, idx) => {
      gsap.to(item.flame.scale, {
        x: 0, y: 0, z: 0, duration: 0.3, delay: idx * 0.05, ease: 'power2.in',
        onComplete: () => { item.flame.visible = false; item.core.visible = false; }
      });
    });

    this.candleLights.forEach((light, idx) => {
      gsap.to(light, { intensity: 0, duration: 0.3, delay: idx * 0.05 });
    });

    this.spawnCandleSmoke();
    setTimeout(() => this.triggerGrandCelebration(), 350);
    return true;
  }

  relightCandles() {
    this.candlesBlown = false;
    this.flames.forEach(item => {
      item.flame.visible = true;
      item.core.visible = true;
      gsap.to(item.flame.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'back.out(1.7)' });
    });
    this.candleLights.forEach(light => gsap.to(light, { intensity: 0.9, duration: 0.4 }));
  }

  spawnCandleSmoke() {
    const smokeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    this.candles.forEach(candle => {
      for (let i = 0; i < 6; i++) {
        const smokeMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 });
        const puff = new THREE.Mesh(smokeGeo, smokeMat);
        const candleWorldPos = new THREE.Vector3();
        candle.getWorldPosition(candleWorldPos);
        puff.position.set(
          candleWorldPos.x + (Math.random() - 0.5) * 0.1,
          candleWorldPos.y + 1.1,
          candleWorldPos.z + (Math.random() - 0.5) * 0.1
        );
        this.scene.add(puff);

        gsap.to(puff.position, {
          y: puff.position.y + 1.2 + Math.random() * 0.8,
          x: puff.position.x + (Math.random() - 0.5) * 0.6,
          duration: 1.5 + Math.random() * 0.5,
          ease: 'power1.out'
        });
        gsap.to(puff.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 1.5 });
        gsap.to(smokeMat, { opacity: 0, duration: 1.5, onComplete: () => this.scene.remove(puff) });
      }
    });
  }

  /* =========================================================
     3D CAKE SLICE INTERACTION
     ========================================================= */
  sliceCake() {
    if (this.isCakeSliced) {
      // Return slice
      if (this.cakeSliceGroup) {
        gsap.to(this.cakeSliceGroup.position, { x: 0, z: 0, duration: 0.8, ease: 'power2.inOut' });
        this.isCakeSliced = false;
      }
      return;
    }

    if (window.birthdayAudio) window.birthdayAudio.playSliceSound();

    // 1. Create Golden Knife
    if (!this.cakeKnife) {
      this.cakeKnife = new THREE.Group();
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 2.2), bladeMat);
      blade.position.set(0, 0.9, 0);
      this.cakeKnife.add(blade);

      const handleMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.5 });
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.0, 16), handleMat);
      handle.position.set(0, 2.3, 0);
      this.cakeKnife.add(handle);

      this.scene.add(this.cakeKnife);
    }

    this.cakeKnife.position.set(0, 7.5, 1.5);
    this.cakeKnife.visible = true;

    // Animate knife slice cut
    gsap.timeline()
      .to(this.cakeKnife.position, { y: 2.5, duration: 0.6, ease: 'power2.in' })
      .to(this.cakeKnife.position, { y: 6.5, x: 3.5, duration: 0.5, ease: 'power2.out', onComplete: () => {
        this.cakeKnife.visible = false;
      }})
      .add(() => {
        // Create Detached Cake Slice Wedge with interior sponge texture
        if (!this.cakeSliceGroup) {
          this.cakeSliceGroup = new THREE.Group();

          const sliceGeo = new THREE.CylinderGeometry(3.05, 3.05, 1.4, 16, 1, false, 0, Math.PI / 4);
          const spongeMat = new THREE.MeshStandardMaterial({ color: 0xffeedb, roughness: 0.8 });
          const sliceMesh = new THREE.Mesh(sliceGeo, spongeMat);
          sliceMesh.position.y = 2.0;
          this.cakeSliceGroup.add(sliceMesh);

          // Mini Golden Serving Plate for Slice
          const miniPlate = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.1, 0.1, 24), this.standMat);
          miniPlate.position.y = 1.25;
          this.cakeSliceGroup.add(miniPlate);

          this.scene.add(this.cakeSliceGroup);
        }

        // Slide slice outward on serving plate
        gsap.to(this.cakeSliceGroup.position, {
          x: 4.5,
          z: 3.0,
          duration: 1.2,
          ease: 'power2.out'
        });
        this.isCakeSliced = true;

        if (window.confetti) {
          window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        }
      });
  }

  /* =========================================================
     3D DISCO BALL PARTY MODE
     ========================================================= */
  createDiscoBall() {
    this.discoBallGroup = new THREE.Group();

    // Mirror Faceted Ball
    const ballGeo = new THREE.IcosahedronGeometry(1.6, 3);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.98,
      roughness: 0.05,
      flatShading: true
    });
    this.discoSphere = new THREE.Mesh(ballGeo, mirrorMat);
    this.discoSphere.castShadow = true;
    this.discoBallGroup.add(this.discoSphere);

    // Hanging Chain
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 15, 8), chainMat);
    chain.position.y = 8.5;
    this.discoBallGroup.add(chain);

    // Disco Spotlight beams
    const beamColors = [0xff007f, 0x00f2fe, 0xffd700, 0x7f00ff];
    for (let i = 0; i < 4; i++) {
      const spot = new THREE.SpotLight(beamColors[i], 0, 30, Math.PI / 6, 0.5, 1);
      spot.position.set(0, 0, 0);
      this.discoBallGroup.add(spot);
      this.discoSpotlights.push(spot);
    }

    this.discoBallGroup.position.set(0, 22, 0); // hidden above top
    this.scene.add(this.discoBallGroup);
  }

  toggleDiscoMode() {
    this.isDiscoActive = !this.isDiscoActive;
    const body = document.body;

    if (this.isDiscoActive) {
      body.classList.add('disco-active');
      // Lower Disco Ball into view
      gsap.to(this.discoBallGroup.position, { y: 11, duration: 1.5, ease: 'bounce.out' });
      this.discoSpotlights.forEach(spot => gsap.to(spot, { intensity: 4.5, duration: 1.0 }));
      if (window.birthdayAudio) window.birthdayAudio.toggleDiscoBeat(true);
    } else {
      body.classList.remove('disco-active');
      gsap.to(this.discoBallGroup.position, { y: 22, duration: 1.2, ease: 'power2.in' });
      this.discoSpotlights.forEach(spot => gsap.to(spot, { intensity: 0, duration: 0.5 }));
      if (window.birthdayAudio) window.birthdayAudio.toggleDiscoBeat(false);
    }
    return this.isDiscoActive;
  }

  /* =========================================================
     3D SKY WISH LANTERNS
     ========================================================= */
  releaseSkyLanterns(count = 12) {
    if (window.birthdayAudio) window.birthdayAudio.playLanternRelease();

    const lanternGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.1, 16);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffaa33, transparent: true, opacity: 0.85 });

    for (let i = 0; i < count; i++) {
      const lanternGroup = new THREE.Group();
      const mesh = new THREE.Mesh(lanternGeo, lanternMat);
      lanternGroup.add(mesh);

      const glowLight = new THREE.PointLight(0xff6600, 1.2, 5);
      lanternGroup.add(glowLight);

      const angle = Math.random() * Math.PI * 2;
      const dist = 6 + Math.random() * 10;
      lanternGroup.position.set(Math.cos(angle) * dist, 0.5 + Math.random() * 2, Math.sin(angle) * dist);

      this.scene.add(lanternGroup);

      // Float upwards into the night sky
      gsap.to(lanternGroup.position, {
        y: 28 + Math.random() * 15,
        x: lanternGroup.position.x + (Math.random() - 0.5) * 8,
        z: lanternGroup.position.z + (Math.random() - 0.5) * 8,
        duration: 8 + Math.random() * 4,
        ease: 'power1.in',
        onComplete: () => {
          this.scene.remove(lanternGroup);
        }
      });

      gsap.to(lanternGroup.rotation, {
        y: Math.random() * 4,
        z: (Math.random() - 0.5) * 0.3,
        duration: 8
      });
    }

    if (window.confetti) {
      window.confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
    }
  }

  /* =========================================================
     3D FLOATING ORIGAMI WISH STARS (GUESTBOOK)
     ========================================================= */
  createOrigamiStars() {
    const starGeo = new THREE.OctahedronGeometry(0.4, 0);
    const colors = [0xffd700, 0xff758c, 0x00f2fe, 0xb721ff, 0x43e97b];
    const wishes = [
      { author: "Best Friend 💖", msg: "May your year ahead be packed with endless laughter, adventures, and joy! Happy Birthday!" },
      { author: "Family ❤️", msg: "So proud of everything you are. May all your heartfelt wishes come true today and always!" },
      { author: "Alex & Sam ✨", msg: "To another year of epic memories and dreaming big! Cheers to you on your special day!" },
      { author: "Party Crew 🎉", msg: "Keep shining, dancing, and inspiring everyone around you! Have the best celebration ever!" },
      { author: "Secret Admirer 💌", msg: "Wishing you pure happiness, peace, success, and love in this wonderful new chapter!" }
    ];

    for (let i = 0; i < 5; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i],
        roughness: 0.3,
        metalness: 0.4,
        emissive: colors[i],
        emissiveIntensity: 0.25
      });
      const star = new THREE.Mesh(starGeo, mat);
      const angle = (i / 5) * Math.PI * 2;
      const radius = 4.2;

      star.position.set(Math.cos(angle) * radius, 3.2 + (i % 2) * 0.8, Math.sin(angle) * radius);
      star.userData = {
        type: 'origami-star',
        wishData: wishes[i],
        baseAngle: angle,
        radius: radius,
        speed: 0.3 + i * 0.05
      };

      this.scene.add(star);
      this.origamiStars.push(star);
    }
  }

  /* =========================================================
     3D SHINY METALLIC BALLOONS
     ========================================================= */
  createBalloons(count = 20) {
    this.balloons.forEach(b => this.scene.remove(b));
    this.balloons = [];

    const theme = this.themeColors[this.currentTheme];
    const colors = theme.balloons;
    const balloonGeo = new THREE.SphereGeometry(0.9, 32, 32);
    balloonGeo.scale(1, 1.25, 1);

    for (let i = 0; i < count; i++) {
      const col = colors[i % colors.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: col,
        roughness: 0.15,
        metalness: 0.25,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1
      });

      const balloonMesh = new THREE.Mesh(balloonGeo, mat);
      balloonMesh.castShadow = true;

      const knot = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 12), mat);
      knot.position.y = -1.15;
      knot.rotation.x = Math.PI;
      balloonMesh.add(knot);

      const stringPoints = [];
      const stringLen = 3.5 + Math.random() * 1.5;
      for (let j = 0; j <= 12; j++) {
        const t = j / 12;
        stringPoints.push(new THREE.Vector3(
          Math.sin(t * Math.PI * 2) * 0.1,
          -1.15 - t * stringLen,
          Math.cos(t * Math.PI * 2) * 0.1
        ));
      }
      const stringLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(stringPoints), new THREE.LineBasicMaterial({ color: 0xeeeeee, opacity: 0.6, transparent: true }));
      balloonMesh.add(stringLine);

      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.3);
      const distance = 4.5 + Math.random() * 5.5;
      const height = 4.0 + Math.random() * 7.5;

      balloonMesh.position.set(Math.cos(angle) * distance, height, Math.sin(angle) * distance);

      balloonMesh.userData = {
        type: 'balloon',
        basePos: balloonMesh.position.clone(),
        floatSpeed: 1.0 + Math.random() * 1.5,
        wobbleOffset: Math.random() * 10,
        color: col,
        points: col === 0xffd700 ? 50 : 10,
        isPopped: false
      };

      this.scene.add(balloonMesh);
      this.balloons.push(balloonMesh);
    }
  }

  popBalloon(balloonMesh) {
    if (!balloonMesh || balloonMesh.userData.isPopped) return 0;
    balloonMesh.userData.isPopped = true;

    if (window.birthdayAudio) window.birthdayAudio.playBalloonPop();

    const popPos = balloonMesh.position.clone();
    const balloonColor = balloonMesh.userData.color;
    const points = balloonMesh.userData.points || 10;

    const fragmentGeo = new THREE.PlaneGeometry(0.15, 0.15);
    const fragments = [];

    for (let i = 0; i < 35; i++) {
      const fragMat = new THREE.MeshBasicMaterial({ color: balloonColor, side: THREE.DoubleSide });
      const frag = new THREE.Mesh(fragmentGeo, fragMat);
      frag.position.copy(popPos);

      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(1.5 + Math.random() * 2.5);

      frag.userData = { vel: dir, rotVel: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10) };
      this.scene.add(frag);
      fragments.push(frag);
    }

    const startTime = performance.now();
    const animateFragments = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      if (elapsed > 1.0) {
        fragments.forEach(f => this.scene.remove(f));
        return;
      }
      fragments.forEach(f => {
        f.position.addScaledVector(f.userData.vel, 0.03);
        f.userData.vel.y -= 0.05;
        f.rotation.x += f.userData.rotVel.x * 0.02;
        f.rotation.y += f.userData.rotVel.y * 0.02;
        f.material.opacity = Math.max(0, 1 - elapsed);
      });
      requestAnimationFrame(animateFragments);
    };
    animateFragments();

    this.scene.remove(balloonMesh);
    const idx = this.balloons.indexOf(balloonMesh);
    if (idx !== -1) this.balloons.splice(idx, 1);

    if (window.confetti) {
      window.confetti({ particleCount: 25, spread: 60, origin: { y: 0.6 } });
    }

    return points;
  }

  /* =========================================================
     3D SURPRISE GIFT BOX
     ========================================================= */
  createSurpriseGift() {
    this.giftGroup = new THREE.Group();
    const theme = this.themeColors[this.currentTheme];

    this.giftBoxMat = new THREE.MeshStandardMaterial({ color: theme.giftBox, roughness: 0.3, metalness: 0.4 });
    const boxBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 2.0), this.giftBoxMat);
    boxBase.position.y = 0.9;
    boxBase.castShadow = true;
    boxBase.userData = { type: 'gift' };
    this.giftGroup.add(boxBase);

    this.giftRibbonMat = new THREE.MeshStandardMaterial({ color: theme.giftRibbon, roughness: 0.2, metalness: 0.8 });
    const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.82, 2.02), this.giftRibbonMat);
    ribbonV.position.y = 0.9;
    ribbonV.userData = { type: 'gift' };
    this.giftGroup.add(ribbonV);

    const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(2.02, 1.82, 0.35), this.giftRibbonMat);
    ribbonH.position.y = 0.9;
    ribbonH.userData = { type: 'gift' };
    this.giftGroup.add(ribbonH);

    this.giftLid = new THREE.Group();
    this.giftLid.position.set(0, 1.8, 0);

    const lidTop = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.35, 2.15), this.giftBoxMat);
    lidTop.position.y = 0.175;
    lidTop.castShadow = true;
    lidTop.userData = { type: 'gift' };
    this.giftLid.add(lidTop);

    const lidRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.37, 2.17), this.giftRibbonMat);
    lidRibbonV.position.y = 0.175;
    lidRibbonV.userData = { type: 'gift' };
    this.giftLid.add(lidRibbonV);

    const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), this.giftRibbonMat);
    bowKnot.position.y = 0.45;
    bowKnot.userData = { type: 'gift' };
    this.giftLid.add(bowKnot);

    for (let i = 0; i < 4; i++) {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.08, 12, 24), this.giftRibbonMat);
      loop.position.set(0, 0.5, 0);
      loop.rotation.y = (i * Math.PI) / 2;
      loop.rotation.x = Math.PI / 4;
      loop.userData = { type: 'gift' };
      this.giftLid.add(loop);
    }

    this.giftGroup.add(this.giftLid);
    this.giftGroup.position.set(5.0, 0, 3.5);
    this.giftGroup.rotation.y = -Math.PI / 6;
    this.scene.add(this.giftGroup);
  }

  openGift() {
    if (this.giftOpened) return;
    this.giftOpened = true;

    if (window.birthdayAudio) window.birthdayAudio.playGiftOpen();

    gsap.to(this.giftGroup.rotation, {
      z: 0.15, yoyo: true, repeat: 3, duration: 0.08,
      onComplete: () => {
        gsap.to(this.giftLid.position, { y: 4.5, x: 2.0, z: 2.0, duration: 0.8, ease: 'power2.out' });
        gsap.to(this.giftLid.rotation, { x: 1.5, z: -1.2, duration: 0.8 });
        this.spawnGiftStars();
        setTimeout(() => {
          const giftModal = document.getElementById('gift-modal');
          if (giftModal) giftModal.classList.add('show');
        }, 500);
      }
    });
  }

  spawnGiftStars() {
    const starGeo = new THREE.OctahedronGeometry(0.2, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });

    for (let i = 0; i < 30; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(this.giftGroup.position.x, this.giftGroup.position.y + 1.5, this.giftGroup.position.z);
      this.scene.add(star);

      gsap.to(star.position, {
        x: star.position.x + (Math.random() - 0.5) * 4,
        y: star.position.y + 2.5 + Math.random() * 3,
        z: star.position.z + (Math.random() - 0.5) * 4,
        duration: 1.2 + Math.random() * 0.5,
        ease: 'power2.out'
      });
      gsap.to(star.rotation, { x: Math.random() * 8, y: Math.random() * 8, duration: 1.5 });
      gsap.to(star.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 1.5, onComplete: () => this.scene.remove(star) });
    }
  }

  /* =========================================================
     3D FLOATING POLAROID
     ========================================================= */
  createPolaroidMemory() {
    this.polaroidGroup = new THREE.Group();
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.0, 0.06), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
    this.polaroidGroup.add(frameMesh);

    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = 512;
    photoCanvas.height = 512;
    const pctx = photoCanvas.getContext('2d');

    const gradient = pctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#ff9a9e');
    gradient.addColorStop(1, '#fecfef');
    pctx.fillStyle = gradient;
    pctx.fillRect(0, 0, 512, 512);

    pctx.fillStyle = '#ffffff';
    pctx.font = 'bold 50px Outfit, sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText('BEST WISHES', 256, 200);

    pctx.font = '110px serif';
    pctx.fillText('🎉✨🍰', 256, 320);

    this.photoTexture = new THREE.CanvasTexture(photoCanvas);
    const photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), new THREE.MeshBasicMaterial({ map: this.photoTexture }));
    photoPlane.position.set(0, 0.3, 0.04);
    this.polaroidGroup.add(photoPlane);

    this.polaroidGroup.position.set(-4.8, 3.8, 2.0);
    this.polaroidGroup.rotation.y = Math.PI / 5;
    this.polaroidGroup.rotation.z = -0.1;
    this.scene.add(this.polaroidGroup);
  }

  updateUserPhoto(imgElement) {
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = 512;
    photoCanvas.height = 512;
    const pctx = photoCanvas.getContext('2d');
    const minDim = Math.min(imgElement.width, imgElement.height);
    const sx = (imgElement.width - minDim) / 2;
    const sy = (imgElement.height - minDim) / 2;
    pctx.drawImage(imgElement, sx, sy, minDim, minDim, 0, 0, 512, 512);

    this.photoTexture.image = photoCanvas;
    this.photoTexture.needsUpdate = true;
  }

  /* =========================================================
     3D CONFETTI & FIREWORKS
     ========================================================= */
  createConfettiStorm() {
    const count = 350;
    const geo = new THREE.PlaneGeometry(0.18, 0.18);
    const colors = [0xffd700, 0xff758c, 0x00f2fe, 0x43e97b, 0xffffff, 0xba68c8, 0xff8c00];

    this.confettiList = [];
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        side: THREE.DoubleSide
      });
      const conf = new THREE.Mesh(geo, mat);
      conf.position.set((Math.random() - 0.5) * 35, Math.random() * 25, (Math.random() - 0.5) * 35);
      conf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      conf.userData = {
        fallSpeed: 0.02 + Math.random() * 0.04,
        rotSpeedX: (Math.random() - 0.5) * 0.05,
        rotSpeedY: (Math.random() - 0.5) * 0.05
      };
      this.scene.add(conf);
      this.confettiList.push(conf);
    }
  }

  launchFirework(x, z, color) {
    if (window.birthdayAudio) window.birthdayAudio.playFirework();

    const startX = x !== undefined ? x : (Math.random() - 0.5) * 20;
    const startZ = z !== undefined ? z : (Math.random() - 0.5) * 20;
    const targetY = 12 + Math.random() * 8;
    const chosenColor = color || this.themeColors[this.currentTheme].balloons[Math.floor(Math.random() * 5)];

    const rocket = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    rocket.position.set(startX, 0, startZ);
    this.scene.add(rocket);

    gsap.to(rocket.position, {
      y: targetY, duration: 0.75, ease: 'power2.out',
      onComplete: () => {
        this.scene.remove(rocket);
        this.explodeFirework(startX, targetY, startZ, chosenColor);
      }
    });
  }

  explodeFirework(x, y, z, color) {
    const particles = [];
    const geo = new THREE.SphereGeometry(0.08, 6, 6);

    for (let i = 0; i < 70; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 1 });
      const p = new THREE.Mesh(geo, mat);
      p.position.set(x, y, z);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 2.0 + Math.random() * 3.5;

      p.userData = {
        vel: new THREE.Vector3(speed * Math.sin(phi) * Math.cos(theta), speed * Math.sin(phi) * Math.sin(theta), speed * Math.cos(phi)),
        gravity: -0.04
      };
      this.scene.add(p);
      particles.push(p);
    }

    const startTime = performance.now();
    const updateFirework = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      if (elapsed > 1.4) {
        particles.forEach(p => this.scene.remove(p));
        return;
      }
      particles.forEach(p => {
        p.position.addScaledVector(p.userData.vel, 0.025);
        p.userData.vel.y += p.userData.gravity;
        p.material.opacity = Math.max(0, 1 - elapsed / 1.4);
      });
      requestAnimationFrame(updateFirework);
    };
    updateFirework();
  }

  triggerGrandCelebration() {
    if (window.confetti) {
      window.confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => {
        window.confetti({ particleCount: 150, angle: 60, spread: 80, origin: { x: 0 } });
        window.confetti({ particleCount: 150, angle: 120, spread: 80, origin: { x: 1 } });
      }, 400);
    }

    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.launchFirework(), i * 350);
    }

    const banner = document.getElementById('celebration-banner');
    if (banner) {
      banner.classList.add('active');
      setTimeout(() => banner.classList.remove('active'), 4000);
    }

    if (window.birthdayAudio) {
      window.birthdayAudio.playPartyHorn();
      if (!window.birthdayAudio.isPlayingMusic) {
        window.birthdayAudio.playBirthdaySong();
        const wave = document.getElementById('sound-wave');
        if (wave) wave.classList.add('playing');
      }
    }
  }

  /* =========================================================
     INTERACTIVE POINTER & RAYCASTING
     ========================================================= */
  onPointerMove(event) {
    if (!this.sparklerActive) return;

    // Sparkler Particle Fountain
    if (window.birthdayAudio && Math.random() < 0.2) window.birthdayAudio.playSparklerCrackle();

    const canvas = document.getElementById('sparkler-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      for (let i = 0; i < 6; i++) {
        const radius = Math.random() * 25;
        const angle = Math.random() * Math.PI * 2;
        ctx.fillStyle = Math.random() > 0.3 ? '#ffd700' : '#ffffff';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.fillRect(event.clientX + Math.cos(angle) * radius, event.clientY + Math.sin(angle) * radius, 3, 3);
      }
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      let hitObj = intersects[0].object;

      while (hitObj.parent && hitObj.parent !== this.scene) {
        if (hitObj.userData && (hitObj.userData.type === 'balloon' || hitObj.userData.type === 'gift' || hitObj.userData.type === 'origami-star')) {
          break;
        }
        hitObj = hitObj.parent;
      }

      if (hitObj.userData && hitObj.userData.type === 'balloon') {
        const points = this.popBalloon(hitObj);
        if (window.onArcadeBalloonPopped) window.onArcadeBalloonPopped(points);
      } else if (hitObj.userData && hitObj.userData.type === 'gift') {
        this.openGift();
      } else if (hitObj.userData && hitObj.userData.type === 'origami-star') {
        const wish = hitObj.userData.wishData;
        const starModal = document.getElementById('star-note-modal');
        if (starModal && wish) {
          document.getElementById('star-author').textContent = wish.author;
          document.getElementById('star-message').textContent = `"${wish.msg}"`;
          starModal.classList.add('show');
        }
      }
    }
  }

  setCameraView(viewName) {
    const duration = 1.2;
    if (viewName === 'orbit') {
      gsap.to(this.camera.position, { x: 0, y: 8, z: 22, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 0, y: 2, z: 0, duration, ease: 'power2.inOut' });
    } else if (viewName === 'cake') {
      gsap.to(this.camera.position, { x: 0, y: 4.8, z: 7.5, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 0, y: 3.5, z: 0, duration, ease: 'power2.inOut' });
    } else if (viewName === 'gift') {
      gsap.to(this.camera.position, { x: 7.5, y: 3.2, z: 6.5, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 5.0, y: 1.0, z: 3.5, duration, ease: 'power2.inOut' });
    } else if (viewName === 'fireworks') {
      gsap.to(this.camera.position, { x: 0, y: 14, z: 26, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 0, y: 12, z: 0, duration, ease: 'power2.inOut' });
      this.launchFirework();
      setTimeout(() => this.launchFirework(), 300);
      setTimeout(() => this.launchFirework(), 600);
    }
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    const theme = this.themeColors[themeName];
    if (!theme) return;

    if (this.cakeBaseMat) this.cakeBaseMat.color.setHex(theme.cakeBase);
    if (this.cakeTopMat) this.cakeTopMat.color.setHex(theme.cakeTop);
    if (this.frostingMat) this.frostingMat.color.setHex(theme.frosting);
    if (this.standMat) this.standMat.color.setHex(theme.plate);
    if (this.stageRingMat) this.stageRingMat.color.setHex(theme.plateTrim);

    if (this.giftBoxMat) this.giftBoxMat.color.setHex(theme.giftBox);
    if (this.giftRibbonMat) this.giftRibbonMat.color.setHex(theme.giftRibbon);
    if (this.cakeGlowLight) this.cakeGlowLight.color.setHex(theme.lightGlow);

    this.createBalloons(22);
  }

  /* =========================================================
     RENDER LOOP
     ========================================================= */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const time = this.clock.getElapsedTime();

    // 1. Cake & Slices Rotation
    if (this.cakeGroup) {
      this.cakeGroup.rotation.y = time * 0.08;
    }

    // 2. Candle Flames Flicker
    if (!this.candlesBlown) {
      this.flames.forEach((item, idx) => {
        const flicker = Math.sin(time * 15 + idx * 2.5) * 0.08 + Math.cos(time * 22 + idx) * 0.04;
        item.flame.scale.y = 1.0 + flicker;
        item.flame.scale.x = 1.0 - flicker * 0.5;
        item.flame.scale.z = 1.0 - flicker * 0.5;
      });
      this.candleLights.forEach((light, idx) => {
        light.intensity = 0.8 + Math.sin(time * 20 + idx) * 0.15;
      });
    }

    // 3. Disco Ball Rotation & Spotlights
    if (this.discoBallGroup && this.isDiscoActive) {
      this.discoSphere.rotation.y = time * 0.8;
      this.discoSpotlights.forEach((spot, idx) => {
        const a = time * 1.5 + (idx * Math.PI) / 2;
        spot.target.position.set(Math.cos(a) * 8, 0, Math.sin(a) * 8);
        this.scene.add(spot.target);
      });
    }

    // 4. Origami Stars Orbit
    this.origamiStars.forEach(star => {
      const u = star.userData;
      const angle = u.baseAngle + time * u.speed;
      star.position.x = Math.cos(angle) * u.radius;
      star.position.z = Math.sin(angle) * u.radius;
      star.rotation.x = time * 2;
      star.rotation.y = time * 2.5;
    });

    // 5. Balloon Wobble & Float
    this.balloons.forEach(b => {
      const u = b.userData;
      if (!u.isPopped) {
        b.position.y = u.basePos.y + Math.sin(time * u.floatSpeed + u.wobbleOffset) * 0.35;
        b.rotation.z = Math.sin(time * 1.5 + u.wobbleOffset) * 0.08;
      }
    });

    // 6. Confetti
    if (this.confettiList) {
      this.confettiList.forEach(c => {
        c.position.y -= c.userData.fallSpeed;
        c.position.x += Math.sin(time * 2 + c.position.y) * 0.015;
        c.rotation.x += c.userData.rotSpeedX;
        c.rotation.y += c.userData.rotSpeedY;
        if (c.position.y < 0) {
          c.position.y = 25;
          c.position.x = (Math.random() - 0.5) * 35;
          c.position.z = (Math.random() - 0.5) * 35;
        }
      });
    }

    // 7. Clear sparkler trail canvas smoothly
    if (this.sparklerActive) {
      const canvas = document.getElementById('sparkler-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const canvas = document.getElementById('sparkler-canvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }
}

window.BirthdayScene = BirthdayScene;
