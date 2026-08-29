/**
 * 3D Birthday Celebration - Three.js Scene Engine (Story Guided Mode)
 * Shubham Sharnam (Age 22) - Curtains, Garlands, 3-Pair Golden/Green/Blue Balloons, Covered Cake, & Slicing
 */

class BirthdayScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    // Scene Groups
    this.cakeGroup = new THREE.Group();
    this.cakeSliceGroup = null;
    this.cakeKnife = null;
    this.isCakeSliced = false;
    this.candles = [];
    this.flames = [];
    this.candleLights = [];
    this.candlesLit = false;
    this.currentAge = 22;

    // Table & Cloth Cover
    this.tableGroup = new THREE.Group();
    this.clothCover = null;
    this.isClothRemoved = false;

    // Decorative Arches
    this.decorGroup = new THREE.Group();
    this.garlandLights = [];

    // Interactive Balloons
    this.tableBalloons = [];
    this.generalBalloons = [];
    this.tableBalloonsRemaining = 5;

    // Gift & Extras
    this.giftGroup = new THREE.Group();
    this.giftLid = null;
    this.giftOpened = false;
    this.discoBallGroup = null;
    this.discoSpotlights = [];
    this.isDiscoActive = false;

    this.fireworks = [];
    this.confettiList = [];
    this.sparklerActive = false;

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Color theme
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
        balloons: [0xffd700, 0x00e676, 0x00b0ff, 0xffd700, 0x00e676, 0x00b0ff],
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
    this.scene.fog = new THREE.FogExp2(0x0c071e, 0.012);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 7.5, 21);

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
    this.controls.minDistance = 5;
    this.controls.maxDistance = 45;
    this.controls.target.set(0, 2.5, 0);

    this.setupLighting();
    this.createFloorAndStage();
    this.createBackgroundDecor();
    this.createPartyTable();
    this.createBirthdayCake();
    this.createClothCover();
    this.createTableBalloons(5);
    this.createSurpriseGift();
    this.createDiscoBall();
    this.createConfettiStorm();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));

    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaed, 1.5);
    this.dirLight.position.set(12, 22, 15);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.scene.add(this.dirLight);

    this.fillLight = new THREE.DirectionalLight(0x7b68ee, 0.9);
    this.fillLight.position.set(-15, 14, -10);
    this.scene.add(this.fillLight);

    this.cakeGlowLight = new THREE.PointLight(0xffd700, 1.8, 16);
    this.cakeGlowLight.position.set(0, 4.5, 0);
    this.scene.add(this.cakeGlowLight);
  }

  createFloorAndStage() {
    // Large polished party hall floor
    const stageGeo = new THREE.CylinderGeometry(15, 16, 0.4, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x120a24,
      roughness: 0.2,
      metalness: 0.7,
    });
    this.stage = new THREE.Mesh(stageGeo, stageMat);
    this.stage.position.y = -0.2;
    this.stage.receiveShadow = true;
    this.scene.add(this.stage);

    // Glowing stage ring
    const ringGeo = new THREE.TorusGeometry(15.05, 0.08, 16, 100);
    this.stageRingMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const ring = new THREE.Mesh(ringGeo, this.stageRingMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.01;
    this.scene.add(ring);
  }

  /* =========================================================
     BACKGROUND ARCH: SEMI-CIRCLE TEXT, GHALAR GARLAND & 3-PAIR BALLOONS
     ========================================================= */
  createBackgroundDecor() {
    this.decorGroup = new THREE.Group();

    // 1. Semi-Circular 3D "HAPPY BIRTHDAY" Arch Banner
    const bannerText = "HAPPY  BIRTHDAY  SHUBHAM";
    const letters = bannerText.split('');
    const totalLetters = letters.length;
    const archRadius = 10.5;
    const archCenterY = 5.8;
    const startAngle = Math.PI * 0.85;
    const endAngle = Math.PI * 0.15;

    const blockGeo = new THREE.BoxGeometry(0.55, 0.65, 0.15);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x332200
    });

    letters.forEach((char, i) => {
      if (char === ' ') return;
      const t = i / (totalLetters - 1);
      const angle = startAngle + t * (endAngle - startAngle);
      const x = Math.cos(angle) * archRadius;
      const y = archCenterY + Math.sin(angle) * 3.5;
      const z = -4.5;

      const letterMesh = new THREE.Mesh(blockGeo, blockMat);
      letterMesh.position.set(x, y, z);
      letterMesh.rotation.z = angle - Math.PI / 2;
      this.decorGroup.add(letterMesh);
    });

    // 2. Decorative Ghalar / Bunting Garland Arch with Hanging Fairy Lights
    const flagGeo = new THREE.ConeGeometry(0.28, 0.5, 3);
    const flagColors = [0xff0055, 0xffd700, 0x00f2fe, 0x00e676, 0xb721ff, 0xff8c00];

    for (let i = 0; i < 28; i++) {
      const t = i / 27;
      const angle = startAngle + t * (endAngle - startAngle);
      const x = Math.cos(angle) * (archRadius - 0.5);
      const y = archCenterY + Math.sin(angle) * 3.2 - 0.4;
      const z = -4.8;

      const flagMat = new THREE.MeshStandardMaterial({
        color: flagColors[i % flagColors.length],
        roughness: 0.3
      });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(x, y, z);
      flag.rotation.x = Math.PI; // point down
      this.decorGroup.add(flag);

      // Hanging glowing fairy light orb
      if (i % 2 === 0) {
        const lightOrb = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshBasicMaterial({ color: flagColors[i % flagColors.length] })
        );
        lightOrb.position.set(x, y - 0.45, z + 0.1);
        this.decorGroup.add(lightOrb);
      }
    }

    // 3. Top Left & Top Right: 3 Pairs of Balloons (Golden, Green, Blue)
    const sideBalloonColors = [0xffd700, 0x00e676, 0x0088ff]; // Golden, Green, Blue
    const leftBase = { x: -8.5, y: 7.5, z: -3.5 };
    const rightBase = { x: 8.5, y: 7.5, z: -3.5 };

    const balloonGeo = new THREE.SphereGeometry(0.85, 32, 32);
    balloonGeo.scale(1, 1.25, 1);

    // Build 3 pairs on Left and 3 pairs on Right
    [leftBase, rightBase].forEach((base, sideIdx) => {
      const dir = sideIdx === 0 ? 1 : -1;

      sideBalloonColors.forEach((col, pairIdx) => {
        const mat = new THREE.MeshPhysicalMaterial({
          color: col,
          metalness: 0.4,
          roughness: 0.12,
          clearcoat: 0.95,
          clearcoatRoughness: 0.1
        });

        // Two balloons per pair
        for (let b = 0; b < 2; b++) {
          const balloonMesh = new THREE.Mesh(balloonGeo, mat);
          const offsetX = (pairIdx * 0.8 * dir) + (b === 0 ? -0.3 : 0.3);
          const offsetY = (pairIdx * 1.1) + (b === 0 ? 0.3 : -0.3);

          balloonMesh.position.set(base.x + offsetX, base.y + offsetY, base.z + b * 0.4);

          // Knot & Hanging string
          const knot = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 12), mat);
          knot.position.y = -1.1;
          knot.rotation.x = Math.PI;
          balloonMesh.add(knot);

          const stringPoints = [new THREE.Vector3(0, -1.1, 0), new THREE.Vector3(0.05, -3.5, 0)];
          const stringLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(stringPoints),
            new THREE.LineBasicMaterial({ color: 0xcccccc, opacity: 0.6, transparent: true })
          );
          balloonMesh.add(stringLine);

          balloonMesh.userData = {
            basePos: balloonMesh.position.clone(),
            floatSpeed: 1.2 + Math.random() * 0.5,
            wobbleOffset: Math.random() * 5
          };

          this.decorGroup.add(balloonMesh);
          this.generalBalloons.push(balloonMesh);
        }
      });
    });

    this.scene.add(this.decorGroup);
  }

  /* =========================================================
     PARTY TABLE
     ========================================================= */
  createPartyTable() {
    this.tableGroup = new THREE.Group();

    // Table Top (Round / Oval banquet table)
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0x2b1810,
      roughness: 0.4,
      metalness: 0.2
    });
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.25, 48), tableTopMat);
    tableTop.position.y = 1.0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.tableGroup.add(tableTop);

    // Decorative Gold Table Cloth Trim
    const runnerMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.3,
      metalness: 0.7
    });
    const runner = new THREE.Mesh(new THREE.CylinderGeometry(4.62, 4.62, 0.08, 48), runnerMat);
    runner.position.y = 1.1;
    this.tableGroup.add(runner);

    // 4 Carved Table Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.12, 1.0, 16);
    const legPositions = [
      { x: 2.8, z: 2.8 },
      { x: -2.8, z: 2.8 },
      { x: 2.8, z: -2.8 },
      { x: -2.8, z: -2.8 }
    ];
    legPositions.forEach(p => {
      const leg = new THREE.Mesh(legGeo, tableTopMat);
      leg.position.set(p.x, 0.5, p.z);
      leg.castShadow = true;
      this.tableGroup.add(leg);
    });

    this.scene.add(this.tableGroup);
  }

  /* =========================================================
     3D BIRTHDAY CAKE & NUMERIC "22" CANDLES
     ========================================================= */
  createBirthdayCake() {
    const theme = this.themeColors[this.currentTheme];

    this.standMat = new THREE.MeshStandardMaterial({
      color: theme.plate,
      metalness: 0.85,
      roughness: 0.18
    });

    // Plate & Pedestal on Table
    const cakePlate = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.18, 48), this.standMat);
    cakePlate.position.y = 1.2;
    cakePlate.castShadow = true;
    this.cakeGroup.add(cakePlate);

    // Cake Tier 1 (Bottom)
    this.cakeBaseMat = new THREE.MeshStandardMaterial({
      color: theme.cakeBase,
      roughness: 0.45,
      metalness: 0.05
    });
    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 1.3, 48), this.cakeBaseMat);
    tier1.position.y = 1.95;
    tier1.castShadow = true;
    this.cakeGroup.add(tier1);

    this.frostingMat = new THREE.MeshStandardMaterial({
      color: theme.frosting,
      roughness: 0.3,
      metalness: 0.15
    });

    // Frosting Beads
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), this.frostingMat);
      bead.position.set(Math.cos(angle) * 2.8, 1.35, Math.sin(angle) * 2.8);
      this.cakeGroup.add(bead);
    }

    // Cake Tier 2 (Top)
    this.cakeTopMat = new THREE.MeshStandardMaterial({
      color: theme.cakeTop,
      roughness: 0.4,
      metalness: 0.1
    });
    const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1.1, 48), this.cakeTopMat);
    tier2.position.y = 3.15;
    tier2.castShadow = true;
    this.cakeGroup.add(tier2);

    // Drips
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const dripLength = 0.2 + (i % 2 === 0 ? 0.3 : 0.15);
      const drip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), this.frostingMat);
      drip.scale.set(1, dripLength / 0.12, 1);
      drip.position.set(Math.cos(angle) * 1.82, 3.65 - dripLength / 2, Math.sin(angle) * 1.82);
      this.cakeGroup.add(drip);
    }

    // Strawberries
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const berry = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, 0.32, 16),
        new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.35 })
      );
      berry.position.set(Math.cos(angle) * 1.35, 3.8, Math.sin(angle) * 1.35);
      berry.rotation.x = Math.PI;
      this.cakeGroup.add(berry);
    }

    // Numeric Candles "22"
    this.createNumericCandles(22);
    this.scene.add(this.cakeGroup);
  }

  createNumericCandles(age = 22) {
    this.candles = [];
    this.flames = [];
    this.candleLights = [];

    const ageStr = String(age);
    const spacing = 0.85;
    const startX = -((ageStr.length - 1) * spacing) / 2;

    for (let i = 0; i < ageStr.length; i++) {
      const digitGroup = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.85,
        roughness: 0.18,
        emissive: 0x332200
      });

      // Candle Stick
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12), mat);
      stick.position.y = 0.18;
      digitGroup.add(stick);

      // Torus ring for number '2'
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.08, 12, 24), mat);
      ring.position.y = 0.7;
      digitGroup.add(ring);

      const topper = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), mat);
      topper.position.y = 1.08;
      digitGroup.add(topper);

      // Wick
      const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
      wick.position.y = 1.2;
      digitGroup.add(wick);

      // Large Glowing Outer Flame (Yellow-Orange)
      const flameGeo = new THREE.ConeGeometry(0.24, 0.65, 20);
      flameGeo.translate(0, 0.32, 0); // pivot at base
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: 0.95
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 1.25;
      flame.visible = false;
      digitGroup.add(flame);

      // Inner White-Hot Core Flame
      const coreGeo = new THREE.ConeGeometry(0.12, 0.42, 16);
      coreGeo.translate(0, 0.21, 0);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 1.25;
      core.visible = false;
      digitGroup.add(core);

      // Luminous Glow Halo around Flame
      const haloGeo = new THREE.SphereGeometry(0.38, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.y = 1.55;
      halo.visible = false;
      digitGroup.add(halo);

      // Dynamic Candle Point Light (High intensity golden glow)
      const candleLight = new THREE.PointLight(0xffaa00, 0, 8);
      candleLight.position.y = 1.55;
      digitGroup.add(candleLight);

      digitGroup.position.set(startX + i * spacing, 3.75, 0);
      this.cakeGroup.add(digitGroup);

      this.candles.push(digitGroup);
      this.flames.push({ flame, core, halo });
      this.candleLights.push(candleLight);
    }
  }

  /* =========================================================
     SATIN CLOTH DRAPE COVER ON CAKE
     ========================================================= */
  createClothCover() {
    // Royal Burgundy / Red Silk Satin Dome Drape
    const clothGeo = new THREE.CylinderGeometry(0.5, 3.4, 3.2, 48, 1, true);
    const clothMat = new THREE.MeshStandardMaterial({
      color: 0x800020, // Burgundy Satin
      roughness: 0.35,
      metalness: 0.4,
      side: THREE.DoubleSide
    });
    this.clothCover = new THREE.Mesh(clothGeo, clothMat);
    this.clothCover.position.set(0, 2.8, 0);
    this.clothCover.castShadow = true;

    // Gold Top Knob / Ribbon Knot on Cloth
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), knobMat);
    knob.position.y = 1.7;
    this.clothCover.add(knob);

    // Gold Fringe Rim around bottom of Cloth
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(3.42, 0.08, 16, 48), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -1.55;
    this.clothCover.add(rim);

    this.scene.add(this.clothCover);
  }

  // Lift and Dissolve the Cloth Cover
  liftAndRemoveCloth(onCompleteCallback) {
    if (this.isClothRemoved || !this.clothCover) return;
    this.isClothRemoved = true;

    if (window.birthdayAudio) window.birthdayAudio.playGiftOpen();

    // Zoom Camera into the Cake Table
    gsap.to(this.camera.position, {
      x: 0,
      y: 5.0,
      z: 9.0,
      duration: 1.6,
      ease: 'power2.inOut'
    });
    gsap.to(this.controls.target, {
      x: 0,
      y: 2.8,
      z: 0,
      duration: 1.6,
      ease: 'power2.inOut'
    });

    // Lift cloth upwards and fade away
    gsap.to(this.clothCover.position, {
      y: 9.0,
      duration: 1.8,
      ease: 'power2.out'
    });
    gsap.to(this.clothCover.rotation, {
      y: Math.PI * 0.7,
      duration: 1.8
    });
    gsap.to(this.clothCover.material, {
      opacity: 0,
      transparent: true,
      duration: 1.8,
      onComplete: () => {
        this.scene.remove(this.clothCover);
        if (onCompleteCallback) onCompleteCallback();
      }
    });

    // Confetti splash
    if (window.confetti) {
      window.confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    }
  }

  /* =========================================================
     TABLE BALLOONS (5 Interactive Balloons on Table)
     ========================================================= */
  createTableBalloons(count = 5) {
    this.tableBalloons = [];
    this.tableBalloonsRemaining = count;

    const balloonColors = [0xffd700, 0x00e676, 0x0088ff, 0xff0055, 0xb721ff];
    const balloonGeo = new THREE.SphereGeometry(0.85, 32, 32);
    balloonGeo.scale(1, 1.25, 1);

    for (let i = 0; i < count; i++) {
      const col = balloonColors[i % balloonColors.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: col,
        metalness: 0.35,
        roughness: 0.12,
        clearcoat: 0.95
      });

      const balloonMesh = new THREE.Mesh(balloonGeo, mat);
      balloonMesh.castShadow = true;

      // Knot & String
      const knot = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 12), mat);
      knot.position.y = -1.1;
      knot.rotation.x = Math.PI;
      balloonMesh.add(knot);

      const stringPoints = [new THREE.Vector3(0, -1.1, 0), new THREE.Vector3(0.04, -2.8, 0)];
      const stringLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(stringPoints),
        new THREE.LineBasicMaterial({ color: 0xdddddd, opacity: 0.6, transparent: true })
      );
      balloonMesh.add(stringLine);

      // Placement circling closely around the cake table
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.6 + (i % 2) * 0.4;
      const height = 3.2 + (i % 2) * 0.8;

      balloonMesh.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);

      balloonMesh.userData = {
        type: 'table-balloon',
        basePos: balloonMesh.position.clone(),
        floatSpeed: 1.4 + Math.random() * 0.4,
        wobbleOffset: Math.random() * 5,
        color: col,
        isPopped: false
      };

      this.scene.add(balloonMesh);
      this.tableBalloons.push(balloonMesh);
    }
  }

  popTableBalloon(balloonMesh) {
    if (!balloonMesh || balloonMesh.userData.isPopped) return;
    balloonMesh.userData.isPopped = true;

    if (window.birthdayAudio) window.birthdayAudio.playBalloonPop();

    const popPos = balloonMesh.position.clone();
    const balloonColor = balloonMesh.userData.color;

    // Fragment Burst
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
        f.material.opacity = Math.max(0, 1 - elapsed);
      });
      requestAnimationFrame(animateFragments);
    };
    animateFragments();

    this.scene.remove(balloonMesh);
    this.tableBalloonsRemaining = Math.max(0, this.tableBalloonsRemaining - 1);

    if (window.confetti) {
      window.confetti({ particleCount: 30, spread: 60, origin: { y: 0.65 } });
    }

    if (window.onTableBalloonPopped) {
      window.onTableBalloonPopped(this.tableBalloonsRemaining);
    }
  }

  /* =========================================================
     LIGHT CANDLES ("BURN CANDLE")
     ========================================================= */
  lightCandles() {
    this.candlesLit = true;
    if (window.birthdayAudio) window.birthdayAudio.playSparklerCrackle();

    this.flames.forEach((item, idx) => {
      item.flame.visible = true;
      item.core.visible = true;
      if (item.halo) item.halo.visible = true;

      item.flame.scale.set(1, 1, 1);
      item.core.scale.set(1, 1, 1);
      if (item.halo) item.halo.scale.set(1, 1, 1);

      // Spawn 15 golden ignition sparks around each candle flame
      const sparkGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      for (let s = 0; s < 12; s++) {
        const spark = new THREE.Mesh(sparkGeo, sparkMat);
        const candleWorldPos = new THREE.Vector3();
        this.candles[idx].getWorldPosition(candleWorldPos);
        spark.position.set(
          candleWorldPos.x + (Math.random() - 0.5) * 0.2,
          candleWorldPos.y + 1.4 + Math.random() * 0.2,
          candleWorldPos.z + (Math.random() - 0.5) * 0.2
        );
        this.scene.add(spark);

        gsap.to(spark.position, {
          x: spark.position.x + (Math.random() - 0.5) * 0.8,
          y: spark.position.y + 0.6 + Math.random() * 0.5,
          z: spark.position.z + (Math.random() - 0.5) * 0.8,
          duration: 0.6 + Math.random() * 0.4,
          ease: 'power1.out',
          onComplete: () => this.scene.remove(spark)
        });
      }
    });

    this.candleLights.forEach(light => {
      gsap.to(light, { intensity: 2.5, duration: 0.4 });
    });

    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 75, origin: { y: 0.55 } });
    }
  }

  /* =========================================================
     CUT THE CAKE & 3-SECOND MULTI-COLOR FIREWORKS + SONG
     ========================================================= */
  cutCakeAndCelebrate(onFinishedFireworks) {
    if (this.isCakeSliced) return;
    this.isCakeSliced = true;

    if (window.birthdayAudio) {
      window.birthdayAudio.playSliceSound();
    }

    // 1. Golden Chef Knife Cut Animation
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

    gsap.timeline()
      .to(this.cakeKnife.position, { y: 2.3, duration: 0.6, ease: 'power2.in' })
      .to(this.cakeKnife.position, { y: 6.5, x: 3.5, duration: 0.5, ease: 'power2.out', onComplete: () => {
        this.cakeKnife.visible = false;
      }})
      .add(() => {
        // Create Detached Cake Slice Wedge with interior sponge
        if (!this.cakeSliceGroup) {
          this.cakeSliceGroup = new THREE.Group();
          const sliceGeo = new THREE.CylinderGeometry(2.85, 2.85, 1.3, 16, 1, false, 0, Math.PI / 4);
          const spongeMat = new THREE.MeshStandardMaterial({ color: 0xffeedb, roughness: 0.8 });
          const sliceMesh = new THREE.Mesh(sliceGeo, spongeMat);
          sliceMesh.position.y = 1.95;
          this.cakeSliceGroup.add(sliceMesh);

          const miniPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, 0.1, 24), this.standMat);
          miniPlate.position.y = 1.25;
          this.cakeSliceGroup.add(miniPlate);

          this.scene.add(this.cakeSliceGroup);
        }

        // Slide slice forward onto plate
        gsap.to(this.cakeSliceGroup.position, {
          x: 4.2,
          z: 2.8,
          duration: 1.2,
          ease: 'power2.out'
        });

        // 2. Zoom Camera Out to Wide Panoramic View
        gsap.to(this.camera.position, {
          x: 0,
          y: 8.5,
          z: 22,
          duration: 1.6,
          ease: 'power2.inOut'
        });
        gsap.to(this.controls.target, {
          x: 0,
          y: 3.0,
          z: 0,
          duration: 1.6,
          ease: 'power2.inOut'
        });

        // 3. Start Happy Birthday Song
        if (window.birthdayAudio && !window.birthdayAudio.isPlayingMusic) {
          window.birthdayAudio.playBirthdaySong();
          const wave = document.getElementById('sound-wave');
          if (wave) wave.classList.add('playing');
        }

        // 4. Start 3-Second Multi-Color Firecracker Barrage (Red, Blue, Gold, Emerald, Magenta)
        this.start3SecondFirecrackers();

        // 5. Celebration Banner
        const banner = document.getElementById('celebration-banner');
        if (banner) {
          banner.classList.add('active');
          setTimeout(() => banner.classList.remove('active'), 4000);
        }

        // Callback after 3 seconds for next step (Open Gift)
        setTimeout(() => {
          if (onFinishedFireworks) onFinishedFireworks();
        }, 3200);
      });
  }

  /* =========================================================
     3-SECOND MULTI-COLORED FIRECRACKER BARRAGE
     ========================================================= */
  start3SecondFirecrackers() {
    const durationMs = 3000;
    const intervalMs = 160;
    const endTime = Date.now() + durationMs;

    // Explicitly Red, Blue, Gold, Green, Magenta
    const fireworkColors = [0xff0044, 0x0088ff, 0xffd700, 0x00e676, 0xb721ff, 0xff8c00, 0x00f2fe];

    const barrageInterval = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(barrageInterval);
        return;
      }

      const posX = (Math.random() - 0.5) * 24;
      const posZ = (Math.random() - 0.5) * 24;
      const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      this.launchFirework(posX, posZ, color);

      if (window.confetti && Math.random() < 0.4) {
        window.confetti({
          particleCount: 35,
          spread: 80,
          origin: { x: Math.random() * 0.8 + 0.1, y: 0.5 }
        });
      }
    }, intervalMs);

    this.launchFirework(-6, -4, 0xff0044); // Red
    this.launchFirework(6, -4, 0x0088ff);  // Blue
    this.launchFirework(0, 5, 0xffd700);   // Gold
  }

  launchFirework(x, z, color) {
    if (window.birthdayAudio) window.birthdayAudio.playFirework();

    const startX = x !== undefined ? x : (Math.random() - 0.5) * 20;
    const startZ = z !== undefined ? z : (Math.random() - 0.5) * 20;
    const targetY = 12 + Math.random() * 8;
    const chosenColor = color || 0xffd700;

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
    this.giftGroup.position.set(5.5, 0, 3.5);
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

        // Launch celebratory fireworks in background
        this.start3SecondFirecrackers();

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
     3D DISCO BALL
     ========================================================= */
  createDiscoBall() {
    this.discoBallGroup = new THREE.Group();
    const ballGeo = new THREE.IcosahedronGeometry(1.6, 4);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.08,
      flatShading: true,
      emissive: 0x222222
    });
    this.discoSphere = new THREE.Mesh(ballGeo, mirrorMat);
    this.discoSphere.castShadow = true;
    this.discoBallGroup.add(this.discoSphere);

    const chainMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 20, 8), chainMat);
    chain.position.y = 10;
    this.discoBallGroup.add(chain);

    this.discoGlow = new THREE.PointLight(0xffffff, 0, 18);
    this.discoBallGroup.add(this.discoGlow);

    const beamColors = [0xff007f, 0x00f2fe, 0xffd700, 0xb721ff];
    this.discoSpotlights = [];
    for (let i = 0; i < 4; i++) {
      const spot = new THREE.SpotLight(beamColors[i], 0, 35, Math.PI / 5, 0.3, 1.2);
      spot.position.set(0, 0, 0);
      this.discoBallGroup.add(spot);
      this.scene.add(spot.target);
      this.discoSpotlights.push(spot);
    }

    const facetGeo = new THREE.SphereGeometry(0.12, 6, 6);
    this.discoFacetDots = new THREE.Group();
    this.facetPoints = [];

    for (let i = 0; i < 70; i++) {
      const dotColor = beamColors[i % beamColors.length];
      const dotMat = new THREE.MeshBasicMaterial({ color: dotColor, transparent: true, opacity: 0 });
      const dotMesh = new THREE.Mesh(facetGeo, dotMat);
      
      const phi = Math.acos(-1 + (2 * i) / 70);
      const theta = Math.sqrt(70 * Math.PI) * phi;
      const radius = 7 + Math.random() * 8;

      dotMesh.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        Math.random() * 12 - 1,
        radius * Math.sin(phi) * Math.sin(theta)
      );

      this.discoFacetDots.add(dotMesh);
      this.facetPoints.push({ mesh: dotMesh, mat: dotMat });
    }
    this.scene.add(this.discoFacetDots);

    this.discoBallGroup.position.set(0, 28, 0);
    this.scene.add(this.discoBallGroup);
  }

  toggleDiscoMode() {
    this.isDiscoActive = !this.isDiscoActive;
    const body = document.body;

    if (this.isDiscoActive) {
      body.classList.add('disco-active');
      gsap.to(this.discoBallGroup.position, { y: 7.2, duration: 1.8, ease: 'bounce.out' });
      gsap.to(this.discoGlow, { intensity: 3.5, duration: 1.2 });
      this.discoSpotlights.forEach(spot => gsap.to(spot, { intensity: 5.0, duration: 1.2 }));
      this.facetPoints.forEach(p => gsap.to(p.mat, { opacity: 0.85, duration: 1.0 }));

      if (window.birthdayAudio) window.birthdayAudio.toggleDiscoBeat(true);
      gsap.to(this.camera.position, { y: 9, z: 24, duration: 1.5, ease: 'power2.out' });
      gsap.to(this.controls.target, { y: 4, duration: 1.5 });
    } else {
      body.classList.remove('disco-active');
      gsap.to(this.discoBallGroup.position, { y: 28, duration: 1.4, ease: 'power2.in' });
      gsap.to(this.discoGlow, { intensity: 0, duration: 0.6 });
      this.discoSpotlights.forEach(spot => gsap.to(spot, { intensity: 0, duration: 0.6 }));
      this.facetPoints.forEach(p => gsap.to(p.mat, { opacity: 0, duration: 0.6 }));

      if (window.birthdayAudio) window.birthdayAudio.toggleDiscoBeat(false);
      gsap.to(this.camera.position, { y: 7.5, z: 21, duration: 1.2 });
      gsap.to(this.controls.target, { y: 2.5, duration: 1.2 });
    }
    return this.isDiscoActive;
  }

  /* =========================================================
     3D CONFETTI
     ========================================================= */
  createConfettiStorm() {
    const count = 300;
    const geo = new THREE.PlaneGeometry(0.18, 0.18);
    const colors = [0xffd700, 0x00e676, 0x0088ff, 0xff0055, 0xffffff, 0xb721ff];

    this.confettiList = [];
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], side: THREE.DoubleSide });
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

  /* =========================================================
     RAYCASTING & INTERACTION
     ========================================================= */
  onPointerMove(event) {
    if (!this.sparklerActive) return;

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
        if (hitObj.userData && (hitObj.userData.type === 'table-balloon' || hitObj.userData.type === 'gift')) {
          break;
        }
        hitObj = hitObj.parent;
      }

      if (hitObj.userData && hitObj.userData.type === 'table-balloon') {
        this.popTableBalloon(hitObj);
      } else if (hitObj.userData && hitObj.userData.type === 'gift') {
        this.openGift();
      }
    }
  }

  setCameraView(viewName) {
    const duration = 1.2;
    if (viewName === 'orbit') {
      gsap.to(this.camera.position, { x: 0, y: 7.5, z: 21, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 0, y: 2.5, z: 0, duration, ease: 'power2.inOut' });
    } else if (viewName === 'cake') {
      gsap.to(this.camera.position, { x: 0, y: 4.8, z: 7.5, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 0, y: 3.2, z: 0, duration, ease: 'power2.inOut' });
    } else if (viewName === 'gift') {
      gsap.to(this.camera.position, { x: 7.5, y: 3.2, z: 6.5, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 5.5, y: 1.0, z: 3.5, duration, ease: 'power2.inOut' });
    } else if (viewName === 'fireworks') {
      gsap.to(this.camera.position, { x: 0, y: 14, z: 26, duration, ease: 'power2.inOut' });
      gsap.to(this.controls.target, { x: 0, y: 12, z: 0, duration, ease: 'power2.inOut' });
      this.start3SecondFirecrackers();
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
  }

  /* =========================================================
     RENDER LOOP
     ========================================================= */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const time = this.clock.getElapsedTime();

    // 1. Cake & Slices Gentle Rotation
    if (this.cakeGroup) {
      this.cakeGroup.rotation.y = time * 0.08;
    }

    // 2. Candle Flames Flicker (When Lit)
    if (this.candlesLit) {
      this.flames.forEach((item, idx) => {
        const flicker = Math.sin(time * 16 + idx * 3.0) * 0.12 + Math.cos(time * 24 + idx) * 0.06;
        item.flame.scale.set(1.0 - flicker * 0.4, 1.0 + flicker, 1.0 - flicker * 0.4);
        item.core.scale.set(1.0 - flicker * 0.3, 1.0 + flicker * 0.8, 1.0 - flicker * 0.3);
        if (item.halo) item.halo.scale.set(1.0 + flicker * 0.35, 1.0 + flicker * 0.35, 1.0 + flicker * 0.35);
      });
      this.candleLights.forEach((light, idx) => {
        light.intensity = 2.4 + Math.sin(time * 18 + idx) * 0.6;
      });
    }

    // 3. Disco Ball & Spotlights
    if (this.discoBallGroup && this.isDiscoActive) {
      this.discoSphere.rotation.y = time * 1.2;
      if (this.discoFacetDots) {
        this.discoFacetDots.rotation.y = time * 0.4;
        this.discoFacetDots.rotation.x = Math.sin(time * 0.3) * 0.1;
      }
      this.discoSpotlights.forEach((spot, idx) => {
        const a = time * 2.0 + (idx * Math.PI) / 2;
        spot.target.position.set(Math.cos(a) * 9, 0.5, Math.sin(a) * 9);
      });
    }

    // 4. Background side balloons wobble
    this.generalBalloons.forEach(b => {
      const u = b.userData;
      b.position.y = u.basePos.y + Math.sin(time * u.floatSpeed + u.wobbleOffset) * 0.25;
      b.rotation.z = Math.sin(time * 1.5 + u.wobbleOffset) * 0.05;
    });

    // 5. Table Balloons Float
    this.tableBalloons.forEach(b => {
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

    // 7. Clear sparkler trail canvas
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
