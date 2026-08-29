/**
 * 3D Birthday Celebration - Main App Controller (Sequential Story Flow + Clean Top Bar)
 * Celebrant: Shubham Sharnam (Age 22)
 */

document.addEventListener('DOMContentLoaded', () => {
  const scene = new BirthdayScene('canvas-container');

  // App State - Default to Shubham Sharnam, Age 22
  let celebrantName = 'Shubham Sharnam';
  let celebrantAge = '22';
  let customWish = 'May your 22nd year be filled with infinite success, joy, unforgettable moments, and all your dreams coming true! Happy Birthday Shubham Sharnam!';
  let activeTheme = 'midnight-gold';

  // Story Flow Steps: 'intro' -> 'balloons' -> 'burn-candles' -> 'cut-cake' -> 'open-gift' -> 'free-play'
  let currentStoryStep = 'intro';

  // DOM Elements
  const curtainContainer = document.getElementById('curtain-container');
  const btnStartCelebration = document.getElementById('btn-start-celebration');
  const guidedStoryBar = document.getElementById('guided-story-bar');
  const mainScreenQuestCard = document.getElementById('main-screen-quest-card');
  const questTitleText = document.getElementById('quest-title-text');
  const questDescText = document.getElementById('quest-desc-text');
  const questBalloonCount = document.getElementById('quest-balloon-count');
  const stepBurnCandles = document.getElementById('step-burn-candles');
  const stepCutCake = document.getElementById('step-cut-cake');
  const stepOpenGift = document.getElementById('step-open-gift');
  const tapGiftCard = document.getElementById('tap-gift-card');
  const freePlayBottomBar = document.getElementById('free-play-bottom-bar');

  // Top Nav & Menu Drawer
  const mainMenuBtn = document.getElementById('main-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const menuDrawer = document.getElementById('menu-drawer');
  const menuDrawerBackdrop = document.getElementById('menu-drawer-backdrop');

  const displayNameText = document.getElementById('display-name-text');
  const displayAgeBadge = document.getElementById('display-age-badge');
  const celebrantTitle = document.getElementById('celebrant-title');
  const giftCustomWish = document.getElementById('gift-custom-wish');
  const bannerTitle = document.getElementById('banner-title');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const soundWave = document.getElementById('sound-wave');

  const customizeBtn = document.getElementById('customize-btn');
  const customizeModal = document.getElementById('customize-modal');
  const closeCustomizeModal = document.getElementById('close-customize-modal');
  const customizeForm = document.getElementById('customize-form');
  const inputName = document.getElementById('input-name');
  const inputAge = document.getElementById('input-age');
  const inputWish = document.getElementById('input-wish');
  const inputPhoto = document.getElementById('input-photo');
  const photoFilename = document.getElementById('photo-filename');
  const inputPhotoUrl = document.getElementById('input-photo-url');
  const photoUploadStatus = document.getElementById('photo-upload-status');

  const shareBtn = document.getElementById('share-btn');
  const shareModal = document.getElementById('share-modal');
  const closeShareModal = document.getElementById('close-share-modal');
  const shareLinkInput = document.getElementById('share-link-input');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const copyFeedback = document.getElementById('copy-feedback');
  const qrcodeContainer = document.getElementById('qrcode-container');
  let qrcodeInstance = null;

  const giftModal = document.getElementById('gift-modal');
  const closeGiftModal = document.getElementById('close-gift-modal');
  const btnGiftReplay = document.getElementById('btn-gift-replay-fireworks');
  const starNoteModal = document.getElementById('star-note-modal');
  const closeStarModal = document.getElementById('close-star-modal');
  const btnCloseStarNote = document.getElementById('btn-close-star-note');

  // Feature buttons (inside drawer)
  const btnDiscoMode = document.getElementById('btn-disco-mode');
  const btnSparklerWand = document.getElementById('btn-sparkler-wand');
  const btnArcadeGame = document.getElementById('btn-arcade-game');
  const btnSkyLanterns = document.getElementById('btn-sky-lanterns');
  const btnPhotoBooth = document.getElementById('btn-photo-booth');

  // Free play bottom buttons
  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const btnLaunchFireworks = document.getElementById('btn-launch-fireworks');
  const btnOpenGift = document.getElementById('btn-open-gift');
  const btnSpawnBalloons = document.getElementById('btn-spawn-balloons');

  // Arcade elements
  const arcadeHud = document.getElementById('arcade-hud');
  const arcadeScoreVal = document.getElementById('arcade-score');
  const arcadeTimerVal = document.getElementById('arcade-timer');
  const arcadeComboVal = document.getElementById('arcade-combo');
  const arcadeTimerFill = document.getElementById('arcade-timer-fill');
  const btnQuitArcade = document.getElementById('btn-quit-arcade');
  const arcadeOverModal = document.getElementById('arcade-over-modal');
  const finalScoreVal = document.getElementById('final-score-val');
  const finalRankBadge = document.getElementById('final-rank-badge');
  const btnReplayArcade = document.getElementById('btn-replay-arcade');
  const btnCloseArcadeModal = document.getElementById('btn-close-arcade-modal');

  // Photo Booth Modal
  const photoBoothModal = document.getElementById('photo-booth-modal');
  const closePhotoModal = document.getElementById('close-photo-modal');
  const postcardPreviewImg = document.getElementById('postcard-preview-img');
  const btnDownloadPostcard = document.getElementById('btn-download-postcard');

  // Camera buttons (inside drawer)
  const camPills = {
    orbit: document.getElementById('cam-orbit'),
    cake: document.getElementById('cam-cake'),
    gift: document.getElementById('cam-gift'),
    fireworks: document.getElementById('cam-fireworks'),
  };

  // Sparkler Canvas Init
  const sparklerCanvas = document.getElementById('sparkler-canvas');
  if (sparklerCanvas) {
    sparklerCanvas.width = window.innerWidth;
    sparklerCanvas.height = window.innerHeight;
  }

  /* =========================================================
     MENU DRAWER CONTROLS (3-LINE HAMBURGER)
     ========================================================= */
  function openMenuDrawer() {
    menuDrawer.classList.add('open');
    menuDrawerBackdrop.classList.add('show');
  }

  function closeMenuDrawer() {
    menuDrawer.classList.remove('open');
    menuDrawerBackdrop.classList.remove('show');
  }

  mainMenuBtn.addEventListener('click', openMenuDrawer);
  closeMenuBtn.addEventListener('click', closeMenuDrawer);
  menuDrawerBackdrop.addEventListener('click', closeMenuDrawer);

  /* =========================================================
     STEP 1: INTRO CURTAIN OPEN ACTION
     ========================================================= */
  btnStartCelebration.addEventListener('click', () => {
    // Open royal curtains
    curtainContainer.classList.add('opened');
    currentStoryStep = 'balloons';

    // Smoothly animate camera to exact angle: (x: -3.52, y: 10.82, z: 31.82), target: (x: 0.00, y: 2.50, z: 0.00)
    const grandCam = scene.getCelebrationCameraCoords();
    gsap.to(scene.camera.position, {
      x: grandCam.pos.x,
      y: grandCam.pos.y,
      z: grandCam.pos.z,
      duration: 1.6,
      ease: 'power2.out'
    });
    gsap.to(scene.controls.target, {
      x: grandCam.target.x,
      y: grandCam.target.y,
      z: grandCam.target.z,
      duration: 1.6,
      ease: 'power2.out'
    });

    // Play chime sound
    if (window.birthdayAudio) {
      window.birthdayAudio.init();
      window.birthdayAudio.playGiftOpen();
    }

    // Confetti burst on reveal
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } });
    }
  });

  /* =========================================================
     STEP 2: TO REVEAL CAKE - BURST BALLOONS AROUND CAKE
     ========================================================= */
  window.onTableBalloonPopped = (remaining) => {
    if (questBalloonCount) questBalloonCount.textContent = remaining;
    if (questDescText && remaining > 0) {
      questDescText.textContent = `around the cake to reveal the surprise`;
    }

    // Update progress dots (gray out popped ones)
    for (let i = 0; i < 5; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (dot) {
        if (i < 5 - remaining) {
          dot.classList.remove('active');
        } else {
          dot.classList.add('active');
        }
      }
    }

    if (remaining === 0) {
      if (questTitleText) questTitleText.textContent = `✨ ALL BALLOONS BURST! ✨`;
      if (questDescText) questDescText.textContent = `Revealing the Birthday Cake... 🎂`;

      // 1-second pause, then zoom in & lift cloth
      setTimeout(() => {
        scene.liftAndRemoveCloth(() => {
          // Cloth removed -> Hide main screen quest card and show Burn Candles button
          if (mainScreenQuestCard) mainScreenQuestCard.classList.add('hidden');
          stepBurnCandles.classList.remove('hidden');
          currentStoryStep = 'burn-candles';
        });
      }, 1000);
    }
  };

  /* =========================================================
     STEP 3: BURN CANDLES ("BURN CANDLE")
     ========================================================= */
  stepBurnCandles.addEventListener('click', () => {
    scene.lightCandles();

    // Transition to Step 4 (Cut the Cake)
    stepBurnCandles.classList.add('hidden');
    stepCutCake.classList.remove('hidden');
    currentStoryStep = 'cut-cake';
  });

  /* =========================================================
     STEP 4: CUT THE CAKE -> 3S FIREWORKS + SONG
     ========================================================= */
  stepCutCake.addEventListener('click', () => {
    stepCutCake.classList.add('hidden');

    scene.cutCakeAndCelebrate(() => {
      // After 3-second fireworks finish -> Transition to Step 5 (Open Gift)
      stepOpenGift.classList.remove('hidden');
      currentStoryStep = 'open-gift';
    });
  });

  /* =========================================================
     STEP 5: BRING GIFT FORWARD & TAP TO OPEN
     ========================================================= */
  stepOpenGift.addEventListener('click', () => {
    stepOpenGift.classList.add('hidden');

    // Fly gift box smoothly to front center
    scene.presentGiftBoxToCenter(() => {
      // Show "Tap Box to Open" notification
      if (tapGiftCard) tapGiftCard.classList.remove('hidden');
    });

    // Unlock full free-play dock
    guidedStoryBar.classList.add('hidden');
    freePlayBottomBar.classList.remove('hidden');
    currentStoryStep = 'free-play';
  });

  // Clicking the floating "Tap Box to Open" badge
  if (tapGiftCard) {
    tapGiftCard.addEventListener('click', () => {
      scene.openGift();
      tapGiftCard.classList.add('hidden');
    });
  }

  /* =========================================================
     URL PARAMETERS & SHARING (PHOTO + NAME + AGE + THEME)
     ========================================================= */
  let currentPhotoDataUrl = null;
  try {
    currentPhotoDataUrl = localStorage.getItem('birthday_custom_photo') || null;
  } catch(e) {}

  function compressImage(img, maxWidth = 200, maxHeight = 260, quality = 0.52) {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  }

  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search || window.location.hash.replace(/^#/, '?'));
    if (params.has('name')) {
      celebrantName = params.get('name');
      inputName.value = celebrantName;
    }
    if (params.has('age')) {
      celebrantAge = params.get('age');
      inputAge.value = celebrantAge;
    }
    if (params.has('wish')) {
      customWish = params.get('wish');
      inputWish.value = customWish;
    }
    if (params.has('theme')) {
      activeTheme = params.get('theme');
    }

    // Check shared photo in URL hash or localStorage
    let sharedPhoto = params.get('photo');
    if (sharedPhoto) {
      currentPhotoDataUrl = sharedPhoto;
      try {
        localStorage.setItem('birthday_custom_photo', sharedPhoto);
      } catch(e) {}
    } else {
      try {
        sharedPhoto = localStorage.getItem('birthday_custom_photo');
      } catch(e) {}
    }

    if (sharedPhoto) {
      currentPhotoDataUrl = sharedPhoto;
      const img = new Image();
      img.onload = () => {
        if (scene) scene.updateUserPhoto(img);
      };
      img.src = sharedPhoto;
    }

    updateCelebrantInfo();
    applyTheme(activeTheme);
  }

  function updateCelebrantInfo() {
    displayNameText.textContent = celebrantName;
    celebrantTitle.textContent = `Happy Birthday ${celebrantName}!`;
    bannerTitle.textContent = `${celebrantName.toUpperCase()}`;

    if (celebrantAge && parseInt(celebrantAge) > 0) {
      displayAgeBadge.textContent = celebrantAge;
      displayAgeBadge.style.display = 'inline-block';
    } else {
      displayAgeBadge.style.display = 'none';
    }

    giftCustomWish.textContent = `"${customWish}"`;
    document.title = `✨ Happy Birthday ${celebrantName}! 🎉`;

    // Real-time update to 3D Stand Board, Numeric Candles & Photo Frame
    if (scene && scene.updateCelebrantInfo3D) {
      scene.updateCelebrantInfo3D(celebrantName, celebrantAge);
    }
  }

  function generateShareUrl(includePhoto = true) {
    const url = new URL(window.location.href);
    url.search = '';
    const params = new URLSearchParams();
    params.set('name', celebrantName || 'Shubham Sharnam');
    params.set('age', celebrantAge || '22');
    params.set('wish', customWish || 'Happy Birthday!');
    params.set('theme', activeTheme || 'royal-gold');
    if (includePhoto && currentPhotoDataUrl) {
      params.set('photo', currentPhotoDataUrl);
    }
    url.hash = params.toString();
    return url.toString();
  }

  /* =========================================================
     THEME SELECTOR
     ========================================================= */
  function applyTheme(themeName) {
    activeTheme = themeName;
    document.body.className = `theme-${themeName}`;
    scene.setTheme(themeName);

    document.querySelectorAll('.drawer-theme-pill').forEach(opt => {
      if (opt.getAttribute('data-theme') === themeName) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  document.querySelectorAll('.drawer-theme-pill').forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-theme');
      applyTheme(theme);
    });
  });

  /* =========================================================
     AUDIO CONTROLS
     ========================================================= */
  musicToggleBtn.addEventListener('click', () => {
    const isPlaying = window.birthdayAudio.toggleMusic();
    if (isPlaying) {
      soundWave.classList.add('playing');
    } else {
      soundWave.classList.remove('playing');
    }
  });

  /* =========================================================
     CAMERA VIEWS (DRAWER)
     ========================================================= */
  Object.keys(camPills).forEach(key => {
    const btn = camPills[key];
    if (btn) {
      btn.addEventListener('click', () => {
        Object.values(camPills).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        scene.setCameraView(key);
        closeMenuDrawer();
      });
    }
  });

  /* =========================================================
     FEATURE TOGGLES (DRAWER)
     ========================================================= */
  btnDiscoMode.addEventListener('click', () => {
    const isActive = scene.toggleDiscoMode();
    btnDiscoMode.classList.toggle('active', isActive);
  });

  btnSparklerWand.addEventListener('click', () => {
    scene.sparklerActive = !scene.sparklerActive;
    btnSparklerWand.classList.toggle('active', scene.sparklerActive);
    document.body.classList.toggle('sparkler-active', scene.sparklerActive);
  });

  btnSkyLanterns.addEventListener('click', () => {
    closeMenuDrawer();
    scene.setCameraView('fireworks');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    if (camPills.fireworks) camPills.fireworks.classList.add('active');
    scene.start3SecondFirecrackers();
  });

  btnPhotoBooth.addEventListener('click', () => {
    closeMenuDrawer();
    generatePostcard();
  });

  function generatePostcard() {
    const canvas = scene.renderer.domElement;
    const postCanvas = document.createElement('canvas');
    postCanvas.width = 1200;
    postCanvas.height = 900;
    const ctx = postCanvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 900);
    bgGrad.addColorStop(0, '#1a103c');
    bgGrad.addColorStop(0.5, '#0c071e');
    bgGrad.addColorStop(1, '#05020c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 900);

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 840);

    ctx.drawImage(canvas, 60, 60, 1080, 620);

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1080, 620);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`✨ HAPPY BIRTHDAY ${celebrantName.toUpperCase()}! ✨`, 600, 735);

    ctx.fillStyle = '#f0f0ff';
    ctx.font = 'italic 22px Playfair Display, serif';
    ctx.fillText(`"${customWish}"`, 600, 785);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '18px Outfit, sans-serif';
    ctx.fillText(`Celebrated with Love • Shubham Sharnam • Age ${celebrantAge}`, 600, 835);

    const dataUrl = postCanvas.toDataURL('image/png');
    postcardPreviewImg.src = dataUrl;
    btnDownloadPostcard.href = dataUrl;
    photoBoothModal.classList.add('show');
  }

  closePhotoModal.addEventListener('click', () => photoBoothModal.classList.remove('show'));

  // Arcade Game
  btnArcadeGame.addEventListener('click', () => {
    closeMenuDrawer();
    startArcadeGame();
  });

  function startArcadeGame() {
    let arcadeScore = 0;
    let arcadeCombo = 1;
    let arcadeTimeLeft = 30;

    arcadeScoreVal.textContent = '0000';
    arcadeComboVal.textContent = 'x1';
    arcadeTimerVal.textContent = '30s';
    arcadeTimerFill.style.width = '100%';

    arcadeHud.classList.add('active');

    const timerInt = setInterval(() => {
      arcadeTimeLeft--;
      arcadeTimerVal.textContent = `${arcadeTimeLeft}s`;
      arcadeTimerFill.style.width = `${(arcadeTimeLeft / 30) * 100}%`;

      if (arcadeTimeLeft <= 0) {
        clearInterval(timerInt);
        arcadeHud.classList.remove('active');
        finalScoreVal.textContent = String(arcadeScore);
        finalRankBadge.textContent = arcadeScore > 800 ? "🎉 CELEBRATION MASTER 🎉" : "⭐ PARTY PRO ⭐";
        if (window.birthdayAudio) window.birthdayAudio.playGameOverFanfare();
        arcadeOverModal.classList.add('show');
      }
    }, 1000);

    btnQuitArcade.onclick = () => {
      clearInterval(timerInt);
      arcadeHud.classList.remove('active');
    };
  }

  btnReplayArcade.addEventListener('click', () => {
    arcadeOverModal.classList.remove('show');
    startArcadeGame();
  });

  btnCloseArcadeModal.addEventListener('click', () => arcadeOverModal.classList.remove('show'));

  /* =========================================================
     FREE PLAY BUTTONS
     ========================================================= */
  btnLaunchFireworks.addEventListener('click', () => {
    scene.setCameraView('fireworks');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    if (camPills.fireworks) camPills.fireworks.classList.add('active');
    scene.start3SecondFirecrackers();
  });

  document.getElementById('canvas-container').addEventListener('click', () => {
    if (camPills.fireworks && camPills.fireworks.classList.contains('active')) {
      scene.start3SecondFirecrackers();
    }
  });

  btnOpenGift.addEventListener('click', () => {
    scene.setCameraView('gift');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    if (camPills.gift) camPills.gift.classList.add('active');
    scene.openGift();
  });

  btnSpawnBalloons.addEventListener('click', () => {
    scene.createTableBalloons(5);
    if (window.confetti) window.confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
  });

  btnBlowCandles.addEventListener('click', () => {
    scene.setCameraView('cake');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    if (camPills.cake) camPills.cake.classList.add('active');
    scene.start3SecondFirecrackers();
  });

  /* =========================================================
     MODAL CONTROLS & FORMS
     ========================================================= */
  customizeBtn.addEventListener('click', () => {
    closeMenuDrawer();
    customizeModal.classList.add('show');
  });
  closeCustomizeModal.addEventListener('click', () => customizeModal.classList.remove('show'));

  customizeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    celebrantName = inputName.value.trim() || 'Shubham Sharnam';
    celebrantAge = inputAge.value.trim() || '22';
    customWish = inputWish.value.trim() || 'Happy Birthday!';

    updateCelebrantInfo();
    customizeModal.classList.remove('show');
    scene.start3SecondFirecrackers();
  });

  inputPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      photoFilename.textContent = file.name;
      if (photoUploadStatus) {
        photoUploadStatus.textContent = '⏳ Preparing photo for cloud sharing...';
        photoUploadStatus.className = 'photo-upload-status show';
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const compressed = compressImage(img);
          currentPhotoDataUrl = compressed;
          try {
            localStorage.setItem('birthday_custom_photo', compressed);
          } catch(err) {}
          scene.updateUserPhoto(img);

          // Upload to free image CDN for permanent, short, cross-device shareable URL
          const formData = new FormData();
          formData.append('image', file);
          fetch('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
            method: 'POST',
            body: formData
          })
          .then(res => res.json())
          .then(data => {
            if (data && data.image && data.image.url) {
              currentPhotoDataUrl = data.image.url;
              if (inputPhotoUrl) inputPhotoUrl.value = data.image.url;
              if (photoUploadStatus) {
                photoUploadStatus.textContent = '✅ Photo cloud-hosted! Link is ready to share anywhere.';
                photoUploadStatus.className = 'photo-upload-status show success';
              }
              try { localStorage.setItem('birthday_custom_photo', data.image.url); } catch(e) {}
            } else {
              if (photoUploadStatus) {
                photoUploadStatus.textContent = '✅ Photo ready for sharing.';
                photoUploadStatus.className = 'photo-upload-status show success';
              }
            }
          })
          .catch(() => {
            if (photoUploadStatus) {
              photoUploadStatus.textContent = '✅ Photo ready for sharing.';
              photoUploadStatus.className = 'photo-upload-status show success';
            }
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  if (inputPhotoUrl) {
    inputPhotoUrl.addEventListener('input', () => {
      const url = inputPhotoUrl.value.trim();
      if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'))) {
        currentPhotoDataUrl = url;
        try { localStorage.setItem('birthday_custom_photo', url); } catch(e) {}
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (scene) scene.updateUserPhoto(img);
          if (photoUploadStatus) {
            photoUploadStatus.textContent = '✅ Photo loaded successfully from URL!';
            photoUploadStatus.className = 'photo-upload-status show success';
          }
        };
        img.onerror = () => {
          if (photoUploadStatus) {
            photoUploadStatus.textContent = '⚠️ Check image URL (must be direct image link)';
            photoUploadStatus.className = 'photo-upload-status show error';
          }
        };
        img.src = url;
      }
    });
  }

  closeGiftModal.addEventListener('click', () => giftModal.classList.remove('show'));
  btnGiftReplay.addEventListener('click', () => {
    giftModal.classList.remove('show');
    scene.start3SecondFirecrackers();
  });

  closeStarModal.addEventListener('click', () => starNoteModal.classList.remove('show'));
  btnCloseStarNote.addEventListener('click', () => starNoteModal.classList.remove('show'));

  shareBtn.addEventListener('click', () => {
    closeMenuDrawer();
    const shareUrl = generateShareUrl(true); // Includes Photo in Link!
    const qrUrl = generateShareUrl(false); // Clean URL for QR Code
    shareLinkInput.value = shareUrl;
    copyFeedback.classList.remove('show');

    if (window.QRCode && qrcodeContainer) {
      try {
        qrcodeContainer.innerHTML = '';
        qrcodeInstance = new QRCode(qrcodeContainer, {
          text: qrUrl,
          width: 170,
          height: 170,
          colorDark: "#1a103c",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch(qrErr) {
        console.warn('QR Code generation notice:', qrErr);
      }
    }
    shareModal.classList.add('show');
  });

  closeShareModal.addEventListener('click', () => shareModal.classList.remove('show'));

  btnCopyLink.addEventListener('click', () => {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999);
    try {
      navigator.clipboard.writeText(shareLinkInput.value).then(() => {
        copyFeedback.classList.add('show');
        setTimeout(() => copyFeedback.classList.remove('show'), 3000);
      }).catch(() => {
        document.execCommand('copy');
        copyFeedback.classList.add('show');
        setTimeout(() => copyFeedback.classList.remove('show'), 3000);
      });
    } catch(err) {
      document.execCommand('copy');
      copyFeedback.classList.add('show');
      setTimeout(() => copyFeedback.classList.remove('show'), 3000);
    }
  });

  /* =========================================================
     LIVE CAMERA TELEMETRY INSPECTOR HUD LOGIC
     ========================================================= */
  const btnToggleCamInspector = document.getElementById('btn-toggle-cam-inspector');
  const cameraTelemetryHud = document.getElementById('camera-telemetry-hud');
  const closeHudBtn = document.getElementById('close-hud-btn');
  const metricCamDist = document.getElementById('metric-cam-dist');
  const metricCamPitch = document.getElementById('metric-cam-pitch');
  const metricCamYaw = document.getElementById('metric-cam-yaw');
  const metricCamPos = document.getElementById('metric-cam-pos');
  const metricCamTarget = document.getElementById('metric-cam-target');
  const camDistanceSlider = document.getElementById('cam-distance-slider');
  const sliderDistVal = document.getElementById('slider-dist-val');
  const btnCopyCamCoords = document.getElementById('btn-copy-cam-coords');
  const copyCamText = document.getElementById('copy-cam-text');

  let currentTelemetry = null;

  if (btnToggleCamInspector) {
    btnToggleCamInspector.addEventListener('click', () => {
      cameraTelemetryHud.classList.toggle('show');
      closeMenuDrawer();
    });
  }

  if (closeHudBtn) {
    closeHudBtn.addEventListener('click', () => {
      cameraTelemetryHud.classList.remove('show');
    });
  }

  window.onCameraTelemetryUpdate = (data) => {
    currentTelemetry = data;
    if (!cameraTelemetryHud.classList.contains('show')) return;

    metricCamDist.textContent = `${data.distance.toFixed(1)} u`;
    metricCamPitch.textContent = `${data.pitch.toFixed(1)}°`;
    metricCamYaw.textContent = `${data.yaw.toFixed(1)}°`;

    metricCamPos.textContent = `X: ${data.pos.x.toFixed(1)}, Y: ${data.pos.y.toFixed(1)}, Z: ${data.pos.z.toFixed(1)}`;
    metricCamTarget.textContent = `X: ${data.target.x.toFixed(1)}, Y: ${data.target.y.toFixed(1)}, Z: ${data.target.z.toFixed(1)}`;

    if (document.activeElement !== camDistanceSlider) {
      camDistanceSlider.value = data.distance;
      sliderDistVal.textContent = `${data.distance.toFixed(1)} u`;
    }
  };

  if (camDistanceSlider) {
    camDistanceSlider.addEventListener('input', (e) => {
      const dist = parseFloat(e.target.value);
      sliderDistVal.textContent = `${dist.toFixed(1)} u`;
      scene.setCameraDistance(dist);
    });
  }

  if (btnCopyCamCoords) {
    btnCopyCamCoords.addEventListener('click', () => {
      if (!currentTelemetry) return;
      const t = currentTelemetry;
      const textToCopy = `camera: { x: ${t.pos.x.toFixed(2)}, y: ${t.pos.y.toFixed(2)}, z: ${t.pos.z.toFixed(2)} }, target: { x: ${t.target.x.toFixed(2)}, y: ${t.target.y.toFixed(2)}, z: ${t.target.z.toFixed(2)} }, distance: ${t.distance.toFixed(1)}, pitch: ${t.pitch.toFixed(1)}°, yaw: ${t.yaw.toFixed(1)}°`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyCamText.textContent = "✅ Copied to Clipboard!";
        setTimeout(() => {
          copyCamText.textContent = "Copy Angle & Distance";
        }, 2500);
      });
    });
  }

  [customizeModal, shareModal, giftModal, arcadeOverModal, photoBoothModal, starNoteModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }
  });

  parseUrlParams();
});
