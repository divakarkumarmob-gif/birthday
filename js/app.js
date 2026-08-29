/**
 * 3D Birthday Celebration - Main App Controller (Full Suite)
 * Arcade Game, Photo Booth, QR Generator, Disco Mode, Sparklers, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  const scene = new BirthdayScene('canvas-container');

  // App State
  let celebrantName = 'Alex';
  let celebrantAge = '24';
  let customWish = 'May your day be filled with infinite joy, laughter, wonderful surprises, and all your biggest dreams coming true! Happy Birthday!';
  let activeTheme = 'midnight-gold';
  let micStream = null;
  let micAnalyser = null;
  let isListeningMic = false;

  // Arcade Game State
  let isArcadeRunning = false;
  let arcadeScore = 0;
  let arcadeCombo = 1;
  let arcadeTimeLeft = 30;
  let arcadeTimerInterval = null;
  let arcadeBalloonInterval = null;

  // DOM Elements
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
  const micMeterContainer = document.getElementById('mic-meter-container');
  const micMeterFill = document.getElementById('mic-meter-fill');
  const closeMicBtn = document.getElementById('close-mic-btn');

  // Bottom action buttons
  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const btnLaunchFireworks = document.getElementById('btn-launch-fireworks');
  const btnOpenGift = document.getElementById('btn-open-gift');
  const btnSpawnBalloons = document.getElementById('btn-spawn-balloons');

  // Feature buttons
  const btnDiscoMode = document.getElementById('btn-disco-mode');
  const btnSparklerWand = document.getElementById('btn-sparkler-wand');
  const btnArcadeGame = document.getElementById('btn-arcade-game');
  const btnSliceCake = document.getElementById('btn-slice-cake');
  const btnSkyLanterns = document.getElementById('btn-sky-lanterns');
  const btnPhotoBooth = document.getElementById('btn-photo-booth');

  // Arcade HUD
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

  // Star Note Modal
  const starNoteModal = document.getElementById('star-note-modal');
  const closeStarModal = document.getElementById('close-star-modal');
  const btnCloseStarNote = document.getElementById('btn-close-star-note');

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
    bannerTitle.textContent = `HAPPY BIRTHDAY ${celebrantName.toUpperCase()}!`;

    if (celebrantAge && parseInt(celebrantAge) > 0) {
      displayAgeBadge.textContent = celebrantAge;
      displayAgeBadge.style.display = 'inline-block';
      scene.updateAge(parseInt(celebrantAge));
    } else {
      displayAgeBadge.style.display = 'none';
      scene.updateAge(0);
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
  // 1. Disco Mode
  btnDiscoMode.addEventListener('click', () => {
    const isActive = scene.toggleDiscoMode();
    btnDiscoMode.classList.toggle('active', isActive);
  });

  // 2. Sparkler Wand
  btnSparklerWand.addEventListener('click', () => {
    scene.sparklerActive = !scene.sparklerActive;
    btnSparklerWand.classList.toggle('active', scene.sparklerActive);
    document.body.classList.toggle('sparkler-active', scene.sparklerActive);
  });

  // 3. Slice Cake
  btnSliceCake.addEventListener('click', () => {
    scene.setCameraView('cake');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    camPills.cake.classList.add('active');
    scene.sliceCake();
  });

  // 4. Sky Lanterns
  btnSkyLanterns.addEventListener('click', () => {
    scene.setCameraView('fireworks');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    camPills.fireworks.classList.add('active');
    scene.releaseSkyLanterns(14);
  });

  // 5. 3D Photo Booth Postcard Generator
  btnPhotoBooth.addEventListener('click', () => {
    generatePostcard();
  });

  function generatePostcard() {
    const canvas = scene.renderer.domElement;
    const postCanvas = document.createElement('canvas');
    postCanvas.width = 1200;
    postCanvas.height = 900;
    const ctx = postCanvas.getContext('2d');

    // Draw luxury background frame
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 900);
    bgGrad.addColorStop(0, '#1a103c');
    bgGrad.addColorStop(0.5, '#0c071e');
    bgGrad.addColorStop(1, '#05020c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 900);

    // Gold border trim
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 840);

    // Inner 3D snapshot
    ctx.drawImage(canvas, 60, 60, 1080, 620);

    // Snapshot border
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1080, 620);

    // Celebrant Title
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`✨ HAPPY BIRTHDAY ${celebrantName.toUpperCase()}! ✨`, 600, 735);

    // Heartfelt wish subtitle
    ctx.fillStyle = '#f0f0ff';
    ctx.font = 'italic 22px Playfair Display, serif';
    ctx.fillText(`"${customWish}"`, 600, 785);

    // Date & Signature
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '18px Outfit, sans-serif';
    ctx.fillText(`Celebrated with Love • 3D Birthday Experience`, 600, 835);

    const dataUrl = postCanvas.toDataURL('image/png');
    postcardPreviewImg.src = dataUrl;
    btnDownloadPostcard.href = dataUrl;
    photoBoothModal.classList.add('show');
  }

  closePhotoModal.addEventListener('click', () => photoBoothModal.classList.remove('show'));

  // 6. Balloon Pop Arcade Mini-Game
  btnArcadeGame.addEventListener('click', () => {
    startArcadeGame();
  });

  function startArcadeGame() {
    isArcadeRunning = true;
    arcadeScore = 0;
    arcadeCombo = 1;
    arcadeTimeLeft = 30;

    arcadeScoreVal.textContent = '0000';
    arcadeComboVal.textContent = 'x1';
    arcadeTimerVal.textContent = '30s';
    arcadeTimerFill.style.width = '100%';

    arcadeHud.classList.add('active');
    scene.createBalloons(30);

    // Timer countdown
    if (arcadeTimerInterval) clearInterval(arcadeTimerInterval);
    arcadeTimerInterval = setInterval(() => {
      arcadeTimeLeft--;
      arcadeTimerVal.textContent = `${arcadeTimeLeft}s`;
      arcadeTimerFill.style.width = `${(arcadeTimeLeft / 30) * 100}%`;

      if (arcadeTimeLeft <= 0) {
        endArcadeGame();
      }
    }, 1000);

    // Continual balloon replenishment
    if (arcadeBalloonInterval) clearInterval(arcadeBalloonInterval);
    arcadeBalloonInterval = setInterval(() => {
      if (scene.balloons.length < 15) {
        scene.createBalloons(20);
      }
    }, 3000);
  }

  function endArcadeGame() {
    isArcadeRunning = false;
    clearInterval(arcadeTimerInterval);
    clearInterval(arcadeBalloonInterval);
    arcadeHud.classList.remove('active');

    finalScoreVal.textContent = String(arcadeScore);

    // Rank evaluation
    let rank = "🎈 BALLOON ROOKIE";
    if (arcadeScore > 1500) rank = "👑 ULTIMATE CELEBRATION MASTER 👑";
    else if (arcadeScore > 900) rank = "🎉 PARTY LEGEND 🎉";
    else if (arcadeScore > 400) rank = "⭐ POPPING PRO ⭐";
    finalRankBadge.textContent = rank;

    if (window.birthdayAudio) window.birthdayAudio.playGameOverFanfare();
    if (window.confetti) window.confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });

    arcadeOverModal.classList.add('show');
  }

  btnQuitArcade.addEventListener('click', () => {
    isArcadeRunning = false;
    clearInterval(arcadeTimerInterval);
    clearInterval(arcadeBalloonInterval);
    arcadeHud.classList.remove('active');
  });

  btnReplayArcade.addEventListener('click', () => {
    arcadeOverModal.classList.remove('show');
    startArcadeGame();
  });

  btnCloseArcadeModal.addEventListener('click', () => {
    arcadeOverModal.classList.remove('show');
  });

  // Global callback from scene3d balloon pops
  window.onArcadeBalloonPopped = (points) => {
    if (!isArcadeRunning) return;
    arcadeScore += points * arcadeCombo;
    arcadeCombo = Math.min(10, arcadeCombo + 1);

    arcadeScoreVal.textContent = String(arcadeScore).padStart(4, '0');
    arcadeComboVal.textContent = `x${arcadeCombo}`;

    if (window.birthdayAudio) window.birthdayAudio.playComboBonus(arcadeCombo);
  };

  /* =========================================================
     BLOW CANDLES & MICROPHONE BLOW DETECTION
     ========================================================= */
  btnBlowCandles.addEventListener('click', () => {
    if (!scene.candlesBlown) {
      scene.setCameraView('cake');
      Object.values(camPills).forEach(b => b.classList.remove('active'));
      camPills.cake.classList.add('active');

      startMicBlowDetection();
      setTimeout(() => scene.blowCandles(), 1000);
    } else {
      scene.relightCandles();
      btnBlowCandles.querySelector('strong').textContent = 'Blow Candles';
    }
  });

  async function startMicBlowDetection() {
    if (isListeningMic) return;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      micAnalyser = audioCtx.createAnalyser();
      micAnalyser.fftSize = 256;
      source.connect(micAnalyser);

      isListeningMic = true;
      micMeterContainer.classList.add('show');

      const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
      let blowCounter = 0;

      const checkBlow = () => {
        if (!isListeningMic || scene.candlesBlown) {
          stopMic();
          return;
        }

        micAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < 30; i++) sum += dataArray[i];
        const avg = sum / 30;
        const percent = Math.min(100, (avg / 120) * 100);
        micMeterFill.style.width = `${percent}%`;

        if (avg > 75) {
          blowCounter++;
          if (blowCounter > 4) {
            scene.blowCandles();
            stopMic();
            return;
          }
        } else {
          blowCounter = Math.max(0, blowCounter - 1);
        }
        requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err) {
      console.log('Mic permission not granted or supported.', err);
    }
  }

  function stopMic() {
    isListeningMic = false;
    micMeterContainer.classList.remove('show');
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
  }

  closeMicBtn.addEventListener('click', stopMic);

  /* =========================================================
     FIREWORKS & BALLOONS & GIFT
     ========================================================= */
  btnLaunchFireworks.addEventListener('click', () => {
    scene.setCameraView('fireworks');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    camPills.fireworks.classList.add('active');

    for (let i = 0; i < 5; i++) {
      setTimeout(() => scene.launchFirework(), i * 280);
    }
  });

  btnOpenGift.addEventListener('click', () => {
    scene.setCameraView('gift');
    Object.values(camPills).forEach(b => b.classList.remove('active'));
    camPills.gift.classList.add('active');
    scene.openGift();
  });

  btnSpawnBalloons.addEventListener('click', () => {
    scene.createBalloons(24);
    if (window.confetti) window.confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
  });

  /* =========================================================
     MODAL CONTROLS & FORMS
     ========================================================= */
  customizeBtn.addEventListener('click', () => customizeModal.classList.add('show'));
  closeCustomizeModal.addEventListener('click', () => customizeModal.classList.remove('show'));

  customizeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    celebrantName = inputName.value.trim() || 'Alex';
    celebrantAge = inputAge.value.trim();
    customWish = inputWish.value.trim() || 'Happy Birthday!';

    updateCelebrantInfo();
    customizeModal.classList.remove('show');
    scene.triggerGrandCelebration();
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
    scene.triggerGrandCelebration();
  });

  // Star Note Modal (Guestbook)
  closeStarModal.addEventListener('click', () => starNoteModal.classList.remove('show'));
  btnCloseStarNote.addEventListener('click', () => starNoteModal.classList.remove('show'));

  // Share & QR Modal
  shareBtn.addEventListener('click', () => {
    const shareUrl = generateShareUrl();
    shareLinkInput.value = shareUrl;
    copyFeedback.classList.remove('show');

    // Generate QR Code
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
