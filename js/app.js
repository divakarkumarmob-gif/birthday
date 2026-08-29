/**
 * 3D Birthday Celebration - Main App Controller (Sequential Story Flow)
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
  const stepBurstBalloons = document.getElementById('step-burst-balloons');
  const balloonCountText = document.getElementById('balloon-count-text');
  const stepBurnCandles = document.getElementById('step-burn-candles');
  const stepCutCake = document.getElementById('step-cut-cake');
  const stepOpenGift = document.getElementById('step-open-gift');
  const freePlayBottomBar = document.getElementById('free-play-bottom-bar');

  const displayNameText = document.getElementById('display-name-text');
  const displayAgeBadge = document.getElementById('display-age-badge');
  const celebrantTitle = document.getElementById('celebrant-title');
  const giftCustomWish = document.getElementById('gift-custom-wish');
  const bannerTitle = document.getElementById('banner-title');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const soundWave = document.getElementById('sound-wave');
  const themeBtn = document.getElementById('theme-btn');
  const themeMenu = document.getElementById('theme-menu');
  const customizeBtn = document.getElementById('customize-btn');
  const customizeModal = document.getElementById('customize-modal');
  const closeCustomizeModal = document.getElementById('close-customize-modal');
  const customizeForm = document.getElementById('customize-form');
  const inputName = document.getElementById('input-name');
  const inputAge = document.getElementById('input-age');
  const inputWish = document.getElementById('input-wish');
  const inputPhoto = document.getElementById('input-photo');
  const photoFilename = document.getElementById('photo-filename');
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

  // Feature buttons
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

  // Camera buttons
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
     STEP 1: INTRO CURTAIN OPEN ACTION
     ========================================================= */
  btnStartCelebration.addEventListener('click', () => {
    // Open royal curtains
    curtainContainer.classList.add('opened');
    currentStoryStep = 'balloons';

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
     STEP 2: BALLOONS POPPING TO REMOVE CLOTH
     ========================================================= */
  window.onTableBalloonPopped = (remaining) => {
    if (remaining > 0) {
      balloonCountText.textContent = `To remove cloth, burst all balloons on the table! 🎈 (${remaining} remaining)`;
    } else {
      balloonCountText.textContent = `✨ All balloons popped! Revealing the birthday cake...`;

      // 1-second pause, then zoom in & lift cloth
      setTimeout(() => {
        scene.liftAndRemoveCloth(() => {
          // Cloth removed -> Transition to Step 3 (Burn Candles)
          stepBurstBalloons.classList.add('hidden');
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
     STEP 5: OPEN GIFT BOX
     ========================================================= */
  stepOpenGift.addEventListener('click', () => {
    scene.openGift();
    stepOpenGift.classList.add('hidden');

    // Unlock full free-play dock
    guidedStoryBar.classList.add('hidden');
    freePlayBottomBar.classList.remove('hidden');
    currentStoryStep = 'free-play';
  });

  /* =========================================================
     URL PARAMETERS & SHARING
     ========================================================= */
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
  }

  function generateShareUrl() {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = `name=${encodeURIComponent(celebrantName)}&age=${encodeURIComponent(celebrantAge)}&wish=${encodeURIComponent(customWish)}&theme=${encodeURIComponent(activeTheme)}`;
    return url.toString();
  }

  /* =========================================================
     THEME SELECTOR
     ========================================================= */
  function applyTheme(themeName) {
    activeTheme = themeName;
    document.body.className = `theme-${themeName}`;
    scene.setTheme(themeName);

    document.querySelectorAll('.theme-option').forEach(opt => {
      if (opt.getAttribute('data-theme') === themeName) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('show');
  });

  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-theme');
      applyTheme(theme);
      themeMenu.classList.remove('show');
    });
  });

  document.addEventListener('click', () => {
    themeMenu.classList.remove('show');
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
     CAMERA VIEWS
     ========================================================= */
  Object.keys(camPills).forEach(key => {
    const btn = camPills[key];
    if (btn) {
      btn.addEventListener('click', () => {
        Object.values(camPills).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        scene.setCameraView(key);
      });
    }
  });

  /* =========================================================
     FEATURE TOGGLES
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
    scene.setCameraView('fireworks');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    camPills.fireworks.classList.add('active');
    scene.start3SecondFirecrackers();
  });

  btnPhotoBooth.addEventListener('click', () => {
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
  btnArcadeGame.addEventListener('click', () => startArcadeGame());

  function startArcadeGame() {
    arcadeScore = 0;
    arcadeCombo = 1;
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
    camPills.fireworks.classList.add('active');
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
    camPills.gift.classList.add('active');
    scene.openGift();
  });

  btnSpawnBalloons.addEventListener('click', () => {
    scene.createTableBalloons(5);
    if (window.confetti) window.confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
  });

  btnBlowCandles.addEventListener('click', () => {
    scene.setCameraView('cake');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    camPills.cake.classList.add('active');
    scene.start3SecondFirecrackers();
  });

  /* =========================================================
     MODAL CONTROLS & FORMS
     ========================================================= */
  customizeBtn.addEventListener('click', () => customizeModal.classList.add('show'));
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
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => scene.updateUserPhoto(img);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  closeGiftModal.addEventListener('click', () => giftModal.classList.remove('show'));
  btnGiftReplay.addEventListener('click', () => {
    giftModal.classList.remove('show');
    scene.start3SecondFirecrackers();
  });

  closeStarModal.addEventListener('click', () => starNoteModal.classList.remove('show'));
  btnCloseStarNote.addEventListener('click', () => starNoteModal.classList.remove('show'));

  shareBtn.addEventListener('click', () => {
    const shareUrl = generateShareUrl();
    shareLinkInput.value = shareUrl;
    copyFeedback.classList.remove('show');

    if (window.QRCode) {
      qrcodeContainer.innerHTML = '';
      qrcodeInstance = new QRCode(qrcodeContainer, {
        text: shareUrl,
        width: 170,
        height: 170,
        colorDark: "#1a103c",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    }
    shareModal.classList.add('show');
  });

  closeShareModal.addEventListener('click', () => shareModal.classList.remove('show'));

  btnCopyLink.addEventListener('click', () => {
    shareLinkInput.select();
    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
      copyFeedback.classList.add('show');
      setTimeout(() => copyFeedback.classList.remove('show'), 3000);
    });
  });

  [customizeModal, shareModal, giftModal, arcadeOverModal, photoBoothModal, starNoteModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }
  });

  parseUrlParams();
});
