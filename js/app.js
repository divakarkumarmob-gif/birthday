/**
 * 3D Birthday Celebration - Romantic Girlfriend Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  const scene = new BirthdayScene('canvas-container');

  // App State - Romantic Defaults
  let celebrantName = 'My Love';
  let celebrantAge = '';
  let customWish = 'Happy Birthday to the most amazing, gorgeous, and loving girl in the whole world! Thank you for bringing endless joy, warmth, and magic into my life. Every single day with you is my favorite day. May all your sweetest dreams come true today and forever!';
  let activeTheme = 'rose-glamour';

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
  const quickPetalsBtn = document.getElementById('quick-petals-btn');

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

  // Romantic Modals & Buttons
  const polaroidsModal = document.getElementById('polaroids-modal');
  const closePolaroidsModal = document.getElementById('close-polaroids-modal');
  const btnMemoryGallery = document.getElementById('btn-memory-gallery');
  const btnOpenCustomizerFromPolaroids = document.getElementById('btn-open-customizer-from-polaroids');
  const btnLoveLetter = document.getElementById('btn-love-letter');

  // Feature buttons (inside drawer)
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
     FALLING ROSE PETALS 2D CANVAS OVERLAY
     ========================================================= */
  const petalsCanvas = document.getElementById('rose-petals-canvas');
  let petalsEnabled = true;
  let petalsList = [];

  function initPetals() {
    if (!petalsCanvas) return;
    petalsCanvas.width = window.innerWidth;
    petalsCanvas.height = window.innerHeight;
    petalsList = [];

    const petalColors = ['#ff0a54', '#ff4d6d', '#ff758c', '#ffb3c1', '#c9184a'];
    for (let i = 0; i < 45; i++) {
      petalsList.push({
        x: Math.random() * petalsCanvas.width,
        y: Math.random() * petalsCanvas.height,
        size: 14 + Math.random() * 16,
        speedY: 1.2 + Math.random() * 2.0,
        speedX: Math.random() * 1.5 - 0.75,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        color: petalColors[i % petalColors.length],
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.02
      });
    }
  }

  function drawPetals() {
    if (!petalsCanvas || !petalsEnabled) return;
    const ctx = petalsCanvas.getContext('2d');
    ctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

    for (let i = 0; i < petalsList.length; i++) {
      const p = petalsList[i];
      p.y += p.speedY;
      p.swayAngle += p.swaySpeed;
      p.x += Math.sin(p.swayAngle) * 1.2 + p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > petalsCanvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * petalsCanvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(255, 117, 140, 0.4)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size * 0.85, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(drawPetals);
  }

  initPetals();
  requestAnimationFrame(drawPetals);

  window.addEventListener('resize', () => {
    if (petalsCanvas) {
      petalsCanvas.width = window.innerWidth;
      petalsCanvas.height = window.innerHeight;
    }
  });

  if (quickPetalsBtn) {
    quickPetalsBtn.addEventListener('click', () => {
      petalsEnabled = !petalsEnabled;
      if (petalsCanvas) {
        if (petalsEnabled) {
          petalsCanvas.classList.remove('disabled');
          quickPetalsBtn.classList.add('active');
          requestAnimationFrame(drawPetals);
        } else {
          petalsCanvas.classList.add('disabled');
          quickPetalsBtn.classList.remove('active');
        }
      }
    });
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

  // Romantic Intermediate Chat Elements
  const romanticChatScreen = document.getElementById('romantic-chat-screen');
  const chatFloatingHearts = document.getElementById('chat-floating-hearts');
  const chatLiveStatus = document.getElementById('chat-live-status');
  const chatStepCounter = document.getElementById('chat-step-counter');
  const btnSkipChat = document.getElementById('btn-skip-chat');
  const chatMessagesScroll = document.getElementById('chat-messages-scroll');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');
  const chatQuickReplies = document.getElementById('chat-quick-replies');
  const chatUserInput = document.getElementById('chat-user-input');
  const chatEmojiHeartBtn = document.getElementById('chat-emoji-heart-btn');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatFooterActions = document.getElementById('chat-footer-actions');
  const btnGoToOrder = document.getElementById('btn-go-to-order');
  const btnEnter3DWorld = document.getElementById('btn-enter-3d-world');

  // 5 Romantic Questions from Boyfriend to Girlfriend
  const romanticQuestions = [
    {
      question: "Hey prettiest girl... 💕 Do you know who is the luckiest guy in the entire universe today? (Hint: The one typing this for you ❤️)",
      suggestions: ["You are! 🥰", "My handsome boy ❤️", "Aww so sweet! 💕"]
    },
    {
      question: "What is the one thing that made you smile the most this past year? 🥰",
      suggestions: ["Being with you! ❤️", "All our cute calls 📱", "Your sweet surprises 🎁"]
    },
    {
      question: "If you could make one magical birthday wish right this second, what would it be? ✨",
      suggestions: ["To stay by your side forever 💕", "Lots of happiness & love 🌸", "A big tight hug right now! 🫂"]
    },
    {
      question: "What is your absolute favorite memory of us together so far? 💕",
      suggestions: ["Every moment with you 🥰", "Our late night talks 🌙", "Our first date 🌹"]
    },
    {
      question: "Are you ready to step into your grand 3D birthday surprise wonderland now, my princess? 👑🎂",
      suggestions: ["Yes, take me there! ✨", "Can't wait! 🎉", "Let's celebrate! 💖"]
    }
  ];

  let currentQuestionIndex = 0;
  let isTypingQuestion = false;

  /* =========================================================
     FLOATING HEARTS GENERATOR FOR CHAT SCREEN
     ========================================================= */
  function initFloatingChatHearts() {
    if (!chatFloatingHearts) return;
    chatFloatingHearts.innerHTML = '';
    const heartEmojis = ['💖', '💕', '💗', '💓', '✨', '🌹'];
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart-item';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = `${Math.random() * 95}%`;
      heart.style.animationDuration = `${5 + Math.random() * 6}s`;
      heart.style.animationDelay = `${Math.random() * 5}s`;
      heart.style.fontSize = `${1.2 + Math.random() * 1.2}rem`;
      chatFloatingHearts.appendChild(heart);
    }
  }

  /* =========================================================
     STEP 1: INTRO CURTAIN OPEN -> STEP 2: ROMANTIC LIVE CHAT
     ========================================================= */
  btnStartCelebration.addEventListener('click', () => {
    // Open royal curtains
    curtainContainer.classList.add('opened');
    
    // Play sound & initial confetti
    if (window.birthdayAudio) {
      window.birthdayAudio.init();
      window.birthdayAudio.playGiftOpen();
    }
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 } });
    }

    // Reveal Romantic Intermediate Chat Screen
    if (romanticChatScreen) {
      setTimeout(() => {
        romanticChatScreen.classList.remove('hidden');
        initFloatingChatHearts();
        startRomanticChatJourney();
      }, 400);
    } else {
      transitionFromChatTo3D();
    }
  });

  /* =========================================================
     STEP 2 CONTROLLER: LIVE CHAT TYPEWRITER JOURNEY
     ========================================================= */
  function startRomanticChatJourney() {
    currentQuestionIndex = 0;
    // Clear previous messages except typing indicator
    if (chatMessagesScroll) {
      const rows = chatMessagesScroll.querySelectorAll('.chat-msg-row');
      rows.forEach(r => r.remove());
    }
    if (chatFooterActions) chatFooterActions.classList.add('hidden');
    
    // Start typing Question 1 after a gentle delay
    setTimeout(() => {
      typeNextQuestion();
    }, 600);
  }

  function typeNextQuestion() {
    if (currentQuestionIndex >= romanticQuestions.length) {
      finishChatJourney();
      return;
    }

    isTypingQuestion = true;
    const qData = romanticQuestions[currentQuestionIndex];
    if (chatStepCounter) chatStepCounter.textContent = currentQuestionIndex + 1;
    if (chatLiveStatus) chatLiveStatus.textContent = "Typing with love...";

    // Disable input while boyfriend is typing
    if (chatUserInput) {
      chatUserInput.disabled = true;
      chatUserInput.value = '';
      chatUserInput.placeholder = "Boyfriend is typing a question...";
    }
    if (chatSendBtn) chatSendBtn.disabled = true;
    if (chatQuickReplies) chatQuickReplies.innerHTML = '';

    // Show 3-dot typing indicator
    if (chatTypingIndicator) {
      chatTypingIndicator.classList.remove('hidden');
      chatMessagesScroll.appendChild(chatTypingIndicator);
      scrollChatToBottom();
    }

    // Simulate typing delay before stream starts
    setTimeout(() => {
      if (chatTypingIndicator) chatTypingIndicator.classList.add('hidden');

      // Create boyfriend message bubble container
      const msgRow = document.createElement('div');
      msgRow.className = 'chat-msg-row boyfriend-row';

      const avatar = document.createElement('div');
      avatar.className = 'chat-bubble-avatar';
      avatar.textContent = '👦';

      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble boyfriend-bubble';

      const textSpan = document.createElement('span');
      textSpan.className = 'chat-bubble-text';

      const cursor = document.createElement('span');
      cursor.className = 'chat-live-cursor';

      bubble.appendChild(textSpan);
      bubble.appendChild(cursor);
      msgRow.appendChild(avatar);
      msgRow.appendChild(bubble);

      chatMessagesScroll.appendChild(msgRow);
      scrollChatToBottom();

      // Stream text letter-by-letter / word-by-word
      const textToType = qData.question;
      let charIdx = 0;

      const typeInterval = setInterval(() => {
        if (charIdx < textToType.length) {
          textSpan.textContent += textToType[charIdx];
          charIdx++;
          scrollChatToBottom();
        } else {
          clearInterval(typeInterval);
          cursor.remove();
          
          // Add timestamp
          const timeSpan = document.createElement('div');
          timeSpan.className = 'chat-bubble-time';
          const now = new Date();
          timeSpan.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
          bubble.appendChild(timeSpan);

          isTypingQuestion = false;
          if (chatLiveStatus) chatLiveStatus.textContent = "Online • Waiting for your reply 💕";

          // Enable user input & populate suggestions
          enableUserReplyInput(qData.suggestions);
        }
      }, 32);

    }, 850);
  }

  function enableUserReplyInput(suggestions = []) {
    if (chatUserInput) {
      chatUserInput.disabled = false;
      chatUserInput.placeholder = "Please enter your reply...";
      chatUserInput.focus();
    }

    // Populate quick response pills
    if (chatQuickReplies) {
      chatQuickReplies.innerHTML = '';
      suggestions.forEach(text => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'quick-reply-pill';
        pill.innerHTML = `<span>${text}</span>`;
        pill.addEventListener('click', () => {
          sendGirlfriendReply(text);
        });
        chatQuickReplies.appendChild(pill);
      });
    }

    if (chatSendBtn) chatSendBtn.disabled = !chatUserInput.value.trim();
  }

  // Chat History Modal & Corner Button Elements
  const floatingChatHistoryBtn = document.getElementById('floating-chat-history-btn');
  const btnDrawerChatHistory = document.getElementById('btn-drawer-chat-history');
  const chatHistoryModal = document.getElementById('chat-history-modal');
  const closeChatHistoryModal = document.getElementById('close-chat-history-modal');
  const chatHistoryContent = document.getElementById('chat-history-content');
  const chatHistoryBadgeCount = document.getElementById('chat-history-badge-count');
  const btnCopyChatHistory = document.getElementById('btn-copy-chat-history');
  const btnClearChatHistory = document.getElementById('btn-clear-chat-history');
  const historyCopyFeedback = document.getElementById('history-copy-feedback');

  function getSavedChatHistory() {
    try {
      const data = localStorage.getItem('birthday_chat_history');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveChatMessageToHistory(entry) {
    try {
      const history = getSavedChatHistory();
      history.push(entry);
      localStorage.setItem('birthday_chat_history', JSON.stringify(history));
      updateChatHistoryBadge();
    } catch (e) {
      console.warn('Could not save chat history to localStorage', e);
    }
  }

  function updateChatHistoryBadge() {
    const history = getSavedChatHistory();
    if (chatHistoryBadgeCount) {
      if (history.length > 0) {
        chatHistoryBadgeCount.textContent = history.length;
        chatHistoryBadgeCount.classList.remove('hidden');
      } else {
        chatHistoryBadgeCount.classList.add('hidden');
      }
    }
  }

  function openChatHistoryModalView() {
    renderChatHistoryUI();
    if (chatHistoryModal) {
      chatHistoryModal.classList.add('show');
    }
  }

  function renderChatHistoryUI() {
    if (!chatHistoryContent) return;
    const history = getSavedChatHistory();

    if (history.length === 0) {
      chatHistoryContent.innerHTML = `
        <div class="chat-history-empty">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">💌</div>
          <div><strong>No chat answers recorded yet!</strong></div>
          <div style="font-size: 0.85rem; margin-top: 4px; opacity: 0.8;">Once she answers the sweet questions during the birthday chat, her responses will be automatically saved here for you! 💕</div>
        </div>
      `;
      return;
    }

    let html = '';
    history.forEach((item, idx) => {
      html += `
        <div class="chat-history-item">
          <div class="history-q-box">
            <span class="history-q-icon">👦</span>
            <div><strong>Q${idx + 1}:</strong> ${item.question || ''}</div>
          </div>
          <div class="history-a-box">
            <span class="history-a-icon">👸</span>
            <div><strong>Her Answer:</strong> "${item.reply || ''}"</div>
          </div>
          <div class="history-timestamp">
            <i class="fa-regular fa-clock"></i> ${item.time || ''} ${item.date ? '• ' + item.date : ''}
          </div>
        </div>
      `;
    });

    chatHistoryContent.innerHTML = html;
  }

  if (floatingChatHistoryBtn) {
    floatingChatHistoryBtn.addEventListener('click', openChatHistoryModalView);
  }

  if (btnDrawerChatHistory) {
    btnDrawerChatHistory.addEventListener('click', () => {
      closeMenuDrawer();
      openChatHistoryModalView();
    });
  }

  if (closeChatHistoryModal) {
    closeChatHistoryModal.addEventListener('click', () => {
      chatHistoryModal.classList.remove('show');
    });
  }

  if (btnCopyChatHistory) {
    btnCopyChatHistory.addEventListener('click', () => {
      const history = getSavedChatHistory();
      if (history.length === 0) {
        alert("No answers to copy yet! 💕");
        return;
      }
      let copyText = `💖 HER SWEET BIRTHDAY CHAT ANSWERS 💖\n`;
      copyText += `Celebrant: ${celebrantName}\n\n`;
      history.forEach((item, idx) => {
        copyText += `Question ${idx + 1}: ${item.question}\n`;
        copyText += `Her Reply: "${item.reply}" (${item.time || ''})\n\n`;
      });

      try {
        navigator.clipboard.writeText(copyText).then(() => {
          if (historyCopyFeedback) {
            historyCopyFeedback.classList.add('show');
            setTimeout(() => historyCopyFeedback.classList.remove('show'), 3000);
          }
        }).catch(() => {
          alert("Answers copied!\n\n" + copyText);
        });
      } catch(err) {
        alert("Answers copied!\n\n" + copyText);
      }
    });
  }

  if (btnClearChatHistory) {
    btnClearChatHistory.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear saved chat history?")) {
        try {
          localStorage.removeItem('birthday_chat_history');
          updateChatHistoryBadge();
          renderChatHistoryUI();
        } catch(e) {}
      }
    });
  }

  updateChatHistoryBadge();

  function syncAnswerToTelegram(data) {
    // 1. Send to local Telegram bot API server
    try {
      fetch('http://localhost:5000/api/notify_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    } catch(e) {}

    // 2. Also check if custom telegram token/chat id is configured in browser
    try {
      const tgToken = localStorage.getItem('birthday_tg_bot_token');
      const tgChatId = localStorage.getItem('birthday_tg_chat_id');
      if (tgToken && tgChatId) {
        const text = `💌 *NEW GIRLFRIEND CHAT REPLY!* 👸💖\n\n*From:* ${data.celebrant}\n*Q${data.questionNumber}:* ${data.question}\n*Her Answer:* "${data.reply}"\n*Time:* ${data.time}`;
        fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: text,
            parse_mode: 'Markdown'
          })
        }).catch(() => {});
      }
    } catch(e) {}
  }

  function sendGirlfriendReply(replyText) {
    const text = replyText || (chatUserInput ? chatUserInput.value.trim() : '');
    if (!text || isTypingQuestion) return;

    const currentQData = romanticQuestions[currentQuestionIndex];

    // Reset input state immediately
    if (chatUserInput) {
      chatUserInput.value = '';
      chatUserInput.disabled = true;
      chatUserInput.placeholder = "Sending love... 💕";
    }
    if (chatSendBtn) chatSendBtn.disabled = true;
    if (chatQuickReplies) chatQuickReplies.innerHTML = '';

    // Create girlfriend message bubble
    const msgRow = document.createElement('div');
    msgRow.className = 'chat-msg-row girlfriend-row';

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble girlfriend-bubble';

    const textSpan = document.createElement('span');
    textSpan.className = 'chat-bubble-text';
    textSpan.textContent = text;

    const timeSpan = document.createElement('div');
    timeSpan.className = 'chat-bubble-time';
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    timeSpan.textContent = timeStr;

    bubble.appendChild(textSpan);
    bubble.appendChild(timeSpan);

    const avatar = document.createElement('div');
    avatar.className = 'chat-bubble-avatar';
    avatar.textContent = '👸';

    msgRow.appendChild(bubble);
    msgRow.appendChild(avatar);

    chatMessagesScroll.appendChild(msgRow);
    scrollChatToBottom();

    // Save answer into persistent local storage for boyfriend to view anytime
    const answerData = {
      index: currentQuestionIndex + 1,
      questionNumber: currentQuestionIndex + 1,
      question: currentQData ? currentQData.question : `Question ${currentQuestionIndex + 1}`,
      reply: text,
      celebrant: celebrantName || 'Girlfriend',
      time: timeStr,
      date: now.toLocaleDateString()
    };
    saveChatMessageToHistory(answerData);

    // Sync in real-time to Telegram Bot API
    syncAnswerToTelegram(answerData);

    // Play sweet chime safely
    try {
      if (window.birthdayAudio) {
        window.birthdayAudio.init();
        if (typeof window.birthdayAudio.playChimeTone === 'function' && window.birthdayAudio.ctx) {
          window.birthdayAudio.playChimeTone(659.25, window.birthdayAudio.ctx.currentTime, 0.35, 0.3);
        }
      }
    } catch(err) {
      console.log('Audio notice:', err);
    }

    // Mini confetti on reply
    if (window.confetti) {
      window.confetti({ particleCount: 25, spread: 55, origin: { y: 0.7 } });
    }

    // Move to next question smoothly
    currentQuestionIndex++;
    if (currentQuestionIndex < romanticQuestions.length) {
      setTimeout(() => {
        typeNextQuestion();
      }, 700);
    } else {
      setTimeout(() => {
        finishChatJourney();
      }, 900);
    }
  }

  function finishChatJourney() {
    if (chatLiveStatus) chatLiveStatus.textContent = "So in love with you! 💖";
    if (chatUserInput) {
      chatUserInput.disabled = true;
      chatUserInput.placeholder = "All 5 questions answered with love! 💕";
    }
    if (chatSendBtn) chatSendBtn.disabled = true;
    if (chatQuickReplies) chatQuickReplies.innerHTML = '';

    // Show sweet concluding boyfriend message
    const msgRow = document.createElement('div');
    msgRow.className = 'chat-msg-row boyfriend-row';

    const avatar = document.createElement('div');
    avatar.className = 'chat-bubble-avatar';
    avatar.textContent = '👦';

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble boyfriend-bubble';
    bubble.innerHTML = `
      <div style="font-size: 1.05rem; font-weight: 700; color: #ffccd5; margin-bottom: 4px;">Aww, you have my whole heart! 💖</div>
      <div>Happy Birthday to the love of my life! Every second with you is a blessing. All your sweet answers are saved in our Chat History! Now let's enter your grand 3D birthday surprise wonderland! 🎉🎂✨</div>
      <div class="chat-bubble-time">${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</div>
    `;

    msgRow.appendChild(avatar);
    msgRow.appendChild(bubble);
    chatMessagesScroll.appendChild(msgRow);
    scrollChatToBottom();

    // Big celebration fanfare
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 90, origin: { y: 0.55 } });
    }
    try {
      if (window.birthdayAudio) {
        window.birthdayAudio.init();
        if (typeof window.birthdayAudio.playGiftOpen === 'function') {
          window.birthdayAudio.playGiftOpen();
        }
      }
    } catch(err) {}

    // Reveal Action Buttons: "Go to Order" and "Enter 3D Birthday World"
    if (chatFooterActions) {
      chatFooterActions.classList.remove('hidden');
    }
  }

  function scrollChatToBottom() {
    if (chatMessagesScroll) {
      chatMessagesScroll.scrollTop = chatMessagesScroll.scrollHeight;
    }
  }

  // Input events
  if (chatUserInput) {
    chatUserInput.addEventListener('input', () => {
      if (chatSendBtn) {
        chatSendBtn.disabled = !chatUserInput.value.trim();
      }
    });

    chatUserInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendGirlfriendReply();
      }
    });
  }

  if (chatEmojiHeartBtn) {
    chatEmojiHeartBtn.addEventListener('click', () => {
      if (chatUserInput && !chatUserInput.disabled) {
        chatUserInput.value += '💖';
        chatUserInput.focus();
        if (chatSendBtn) chatSendBtn.disabled = false;
      }
    });
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => sendGirlfriendReply());
  }

  // "Go to Order" Full Screen Page Elements
  const orderHubFullscreenPage = document.getElementById('order-hub-fullscreen-page');
  const btnOrderBackToStory = document.getElementById('btn-order-back-to-story');
  const btnOrderFooterBack = document.getElementById('btn-order-footer-back');
  const btnOrderNavEnter3D = document.getElementById('btn-order-nav-enter-3d');
  const btnOrderFooter3D = document.getElementById('btn-order-footer-3d');
  const btnDrawerOrderHub = document.getElementById('btn-drawer-order-hub');
  const orderFilterPills = document.querySelectorAll('.order-filter-pill');

  function openFullScreenOrderHub() {
    if (romanticChatScreen) romanticChatScreen.classList.add('hidden');
    if (orderHubFullscreenPage) {
      orderHubFullscreenPage.classList.remove('hidden');
      orderHubFullscreenPage.scrollTop = 0;
      if (window.birthdayAudio) {
        try { window.birthdayAudio.playGiftOpen(); } catch(e) {}
      }
      if (window.confetti) {
        window.confetti({ particleCount: 35, spread: 65, origin: { y: 0.6 } });
      }
    }
  }

  function closeFullScreenOrderHub() {
    if (orderHubFullscreenPage) orderHubFullscreenPage.classList.add('hidden');
    if (romanticChatScreen) romanticChatScreen.classList.remove('hidden');
  }

  if (btnGoToOrder) {
    btnGoToOrder.addEventListener('click', openFullScreenOrderHub);
  }

  if (btnDrawerOrderHub) {
    btnDrawerOrderHub.addEventListener('click', () => {
      closeMenuDrawer();
      openFullScreenOrderHub();
    });
  }

  if (btnOrderBackToStory) {
    btnOrderBackToStory.addEventListener('click', closeFullScreenOrderHub);
  }

  if (btnOrderFooterBack) {
    btnOrderFooterBack.addEventListener('click', closeFullScreenOrderHub);
  }

  if (btnOrderNavEnter3D) {
    btnOrderNavEnter3D.addEventListener('click', () => {
      if (orderHubFullscreenPage) orderHubFullscreenPage.classList.add('hidden');
      transitionFromChatTo3D();
    });
  }

  if (btnOrderFooter3D) {
    btnOrderFooter3D.addEventListener('click', () => {
      if (orderHubFullscreenPage) orderHubFullscreenPage.classList.add('hidden');
      transitionFromChatTo3D();
    });
  }

  // Filter Pills for Store Apps (Zomato, Swiggy, Blinkit, Amazon, etc.)
  if (orderFilterPills) {
    orderFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        orderFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filterKey = pill.getAttribute('data-filter');
        const sections = document.querySelectorAll('.store-app-section');

        sections.forEach(sec => {
          const storeKey = sec.getAttribute('data-store');
          if (filterKey === 'all' || filterKey === storeKey) {
            sec.style.display = 'flex';
          } else {
            sec.style.display = 'none';
          }
        });
      });
    });
  }

  // "Enter 3D Birthday World" and "Skip to 3D" buttons
  function transitionFromChatTo3D() {
    if (romanticChatScreen) {
      romanticChatScreen.style.opacity = '0';
      romanticChatScreen.style.transform = 'scale(0.95)';
      setTimeout(() => {
        romanticChatScreen.classList.add('hidden');
        romanticChatScreen.style.opacity = '';
        romanticChatScreen.style.transform = '';
      }, 500);
    }

    currentStoryStep = 'balloons';

    // Smoothly animate 3D camera to grand celebration angle
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

    // Play music & fireworks
    if (window.birthdayAudio) {
      window.birthdayAudio.init();
      window.birthdayAudio.playGiftOpen();
    }
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } });
    }
  }

  if (btnEnter3DWorld) {
    btnEnter3DWorld.addEventListener('click', transitionFromChatTo3D);
  }

  if (btnSkipChat) {
    btnSkipChat.addEventListener('click', transitionFromChatTo3D);
  }

  /* =========================================================
     STEP 3: TO REVEAL CAKE - BURST BALLOONS AROUND CAKE
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
  // Clear any stale local cache from previous sessions
  try {
    localStorage.removeItem('birthday_custom_photo');
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

    // Check shared photo in URL hash/param only
    let sharedPhoto = params.get('photo') || null;
    currentPhotoDataUrl = sharedPhoto;
    if (inputPhotoUrl && sharedPhoto && sharedPhoto.startsWith('http')) {
      inputPhotoUrl.value = sharedPhoto;
    }

    if (sharedPhoto) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (scene) scene.updateUserPhoto(img);
      };
      img.src = sharedPhoto;
    } else {
      if (scene && scene.clearUserPhoto) {
        scene.clearUserPhoto();
      }
    }

    updateCelebrantInfo();
    applyTheme(activeTheme);
  }

  function updateCelebrantInfo() {
    const isCustom = celebrantName && celebrantName !== 'Birthday Star';
    if (isCustom) {
      displayNameText.textContent = celebrantName;
      celebrantTitle.textContent = `Happy Birthday ${celebrantName}!`;
      bannerTitle.textContent = `${celebrantName.toUpperCase()}`;
      document.title = `✨ Happy Birthday ${celebrantName}! 🎉`;
    } else {
      displayNameText.textContent = 'Happy Birthday';
      celebrantTitle.textContent = 'Happy Birthday!';
      bannerTitle.textContent = 'HAPPY BIRTHDAY';
      document.title = '✨ Happy Birthday Celebration! 🎉';
    }

    if (celebrantAge && parseInt(celebrantAge) > 0) {
      displayAgeBadge.textContent = celebrantAge;
      displayAgeBadge.style.display = 'inline-block';
    } else {
      displayAgeBadge.style.display = 'none';
    }

    giftCustomWish.textContent = `"${customWish}"`;

    // Real-time update to 3D Stand Board, Numeric Candles & Photo Frame
    if (scene && scene.updateCelebrantInfo3D) {
      scene.updateCelebrantInfo3D(celebrantName, celebrantAge);
    }
  }

  function generateShareUrl(includePhoto = true) {
    const url = new URL(window.location.href);
    url.search = '';
    const params = new URLSearchParams();
    params.set('name', celebrantName || 'Birthday Star');
    if (celebrantAge) params.set('age', celebrantAge);
    params.set('wish', customWish || 'Happy Birthday!');
    params.set('theme', activeTheme || 'midnight-gold');
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
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      const isPlaying = (window.birthdayAudio && window.birthdayAudio.toggleMusic) ? window.birthdayAudio.toggleMusic() : false;
      if (soundWave) {
        if (isPlaying) {
          soundWave.classList.add('playing');
        } else {
          soundWave.classList.remove('playing');
        }
      }
    });
  }

  /* =========================================================
     CAMERA VIEWS (DRAWER)
     ========================================================= */
  Object.keys(camPills).forEach(key => {
    const btn = camPills[key];
    if (btn) {
      btn.addEventListener('click', () => {
        Object.values(camPills).forEach(b => { if (b) b.classList.remove('active'); });
        btn.classList.add('active');
        if (scene && scene.setCameraView) scene.setCameraView(key);
        closeMenuDrawer();
      });
    }
  });

  /* =========================================================
     FEATURE TOGGLES (DRAWER)
     ========================================================= */
  const btnDiscoMode = document.getElementById('btn-disco-mode');
  if (btnDiscoMode) {
    btnDiscoMode.addEventListener('click', () => {
      const isActive = (scene && scene.toggleDiscoMode) ? scene.toggleDiscoMode() : false;
      btnDiscoMode.classList.toggle('active', isActive);
    });
  }

  if (btnSparklerWand) {
    btnSparklerWand.addEventListener('click', () => {
      if (scene) {
        scene.sparklerActive = !scene.sparklerActive;
        btnSparklerWand.classList.toggle('active', scene.sparklerActive);
        document.body.classList.toggle('sparkler-active', scene.sparklerActive);
      }
    });
  }

  if (btnSkyLanterns) {
    btnSkyLanterns.addEventListener('click', () => {
      closeMenuDrawer();
      if (scene) {
        scene.setCameraView('fireworks');
        Object.values(camPills).forEach(b => { if (b) b.classList.remove('active'); });
        if (camPills.fireworks) camPills.fireworks.classList.add('active');
        scene.start3SecondFirecrackers();
      }
    });
  }

  if (btnPhotoBooth) {
    btnPhotoBooth.addEventListener('click', () => {
      closeMenuDrawer();
      generatePostcard();
    });
  }

  function generatePostcard() {
    if (!scene || !scene.renderer) return;
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
    const ageTag = (celebrantAge && parseInt(celebrantAge) > 0) ? ` • Age ${celebrantAge}` : '';
    ctx.fillText(`Celebrated with Love • ${celebrantName}${ageTag}`, 600, 835);

    const dataUrl = postCanvas.toDataURL('image/png');
    if (postcardPreviewImg) postcardPreviewImg.src = dataUrl;
    if (btnDownloadPostcard) btnDownloadPostcard.href = dataUrl;
    if (photoBoothModal) photoBoothModal.classList.add('show');
  }

  if (closePhotoModal && photoBoothModal) {
    closePhotoModal.addEventListener('click', () => photoBoothModal.classList.remove('show'));
  }

  // Arcade Game
  if (btnArcadeGame) {
    btnArcadeGame.addEventListener('click', () => {
      closeMenuDrawer();
      startArcadeGame();
    });
  }

  function startArcadeGame() {
    let arcadeScore = 0;
    let arcadeCombo = 1;
    let arcadeTimeLeft = 30;

    if (arcadeScoreVal) arcadeScoreVal.textContent = '0000';
    if (arcadeComboVal) arcadeComboVal.textContent = 'x1';
    if (arcadeTimerVal) arcadeTimerVal.textContent = '30s';
    if (arcadeTimerFill) arcadeTimerFill.style.width = '100%';

    if (arcadeHud) arcadeHud.classList.add('active');

    const timerInt = setInterval(() => {
      arcadeTimeLeft--;
      if (arcadeTimerVal) arcadeTimerVal.textContent = `${arcadeTimeLeft}s`;
      if (arcadeTimerFill) arcadeTimerFill.style.width = `${(arcadeTimeLeft / 30) * 100}%`;

      if (arcadeTimeLeft <= 0) {
        clearInterval(timerInt);
        if (arcadeHud) arcadeHud.classList.remove('active');
        if (finalScoreVal) finalScoreVal.textContent = String(arcadeScore);
        if (finalRankBadge) finalRankBadge.textContent = arcadeScore > 800 ? "🎉 CELEBRATION MASTER 🎉" : "⭐ PARTY PRO ⭐";
        if (window.birthdayAudio) window.birthdayAudio.playGameOverFanfare();
        if (arcadeOverModal) arcadeOverModal.classList.add('show');
      }
    }, 1000);

    if (btnQuitArcade) {
      btnQuitArcade.onclick = () => {
        clearInterval(timerInt);
        if (arcadeHud) arcadeHud.classList.remove('active');
      };
    }
  }

  if (btnReplayArcade && arcadeOverModal) {
    btnReplayArcade.addEventListener('click', () => {
      arcadeOverModal.classList.remove('show');
      startArcadeGame();
    });
  }

  if (btnCloseArcadeModal && arcadeOverModal) {
    btnCloseArcadeModal.addEventListener('click', () => arcadeOverModal.classList.remove('show'));
  }

  /* =========================================================
     FREE PLAY BUTTONS
     ========================================================= */
  if (btnLaunchFireworks) {
    btnLaunchFireworks.addEventListener('click', () => {
      if (scene) {
        scene.setCameraView('fireworks');
        Object.values(camPills).forEach(b => { if (b) b.classList.remove('active'); });
        if (camPills.fireworks) camPills.fireworks.classList.add('active');
        scene.start3SecondFirecrackers();
      }
    });
  }

  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.addEventListener('click', () => {
      if (camPills.fireworks && camPills.fireworks.classList.contains('active')) {
        if (scene) scene.start3SecondFirecrackers();
      }
    });
  }

  if (btnOpenGift) {
    btnOpenGift.addEventListener('click', () => {
      if (scene) {
        scene.setCameraView('gift');
        Object.values(camPills).forEach(b => { if (b) b.classList.remove('active'); });
        if (camPills.gift) camPills.gift.classList.add('active');
        scene.openGift();
      }
    });
  }

  if (btnSpawnBalloons) {
    btnSpawnBalloons.addEventListener('click', () => {
      if (scene) scene.createTableBalloons(5);
      if (window.confetti) window.confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
    });
  }

  if (btnBlowCandles) {
    btnBlowCandles.addEventListener('click', () => {
      if (scene) {
        scene.setCameraView('cake');
        Object.values(camPills).forEach(b => { if (b) b.classList.remove('active'); });
        if (camPills.cake) camPills.cake.classList.add('active');
        scene.start3SecondFirecrackers();
      }
    });
  }

  /* =========================================================
     MODAL CONTROLS & FORMS
     ========================================================= */
  if (customizeBtn && customizeModal) {
    customizeBtn.addEventListener('click', () => {
      closeMenuDrawer();
      customizeModal.classList.add('show');
    });
  }
  if (closeCustomizeModal && customizeModal) {
    closeCustomizeModal.addEventListener('click', () => customizeModal.classList.remove('show'));
  }

  if (customizeForm) {
    customizeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      celebrantName = inputName ? (inputName.value.trim() || 'Birthday Star') : 'Birthday Star';
      celebrantAge = inputAge ? (inputAge.value.trim() || '') : '';
      customWish = inputWish ? (inputWish.value.trim() || 'Happy Birthday!') : 'Happy Birthday!';

      updateCelebrantInfo();
      if (customizeModal) customizeModal.classList.remove('show');
      if (scene) scene.start3SecondFirecrackers();
    });
  }

  if (inputPhoto) {
    inputPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (photoFilename) photoFilename.textContent = file.name;
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
            if (scene) scene.updateUserPhoto(img);

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
  }

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

  /* =========================================================
     LOVE LETTER & POLAROID MODALS
     ========================================================= */
  if (btnLoveLetter) {
    btnLoveLetter.addEventListener('click', () => {
      closeMenuDrawer();
      giftModal.classList.add('show');
    });
  }

  if (btnMemoryGallery) {
    btnMemoryGallery.addEventListener('click', () => {
      closeMenuDrawer();
      polaroidsModal.classList.add('show');
    });
  }

  if (closePolaroidsModal) {
    closePolaroidsModal.addEventListener('click', () => {
      polaroidsModal.classList.remove('show');
    });
  }

  if (btnOpenCustomizerFromPolaroids) {
    btnOpenCustomizerFromPolaroids.addEventListener('click', () => {
      polaroidsModal.classList.remove('show');
      customizeModal.classList.add('show');
    });
  }

  closeGiftModal.addEventListener('click', () => giftModal.classList.remove('show'));
  btnGiftReplay.addEventListener('click', () => {
    giftModal.classList.remove('show');
    scene.start3SecondFirecrackers();
  });

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
          colorDark: "#380c25",
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

  /* =========================================================
     DUAL BOOK ALBUMS: MEMORIES & SAFARNAMA HANDLERS
     ========================================================= */
  const bookCardMemories = document.getElementById('book-card-memories');
  const bookCardSafarnama = document.getElementById('book-card-safarnama');
  const modalBookMemories = document.getElementById('modal-book-memories');
  const modalBookSafarnama = document.getElementById('modal-book-safarnama');
  const closeModalMemories = document.getElementById('close-modal-memories');
  const closeModalSafarnama = document.getElementById('close-modal-safarnama');
  const btnOpenCustomizerFromAlbum = document.getElementById('btn-open-customizer-from-album');
  const btnSafarnamaToChat = document.getElementById('btn-safarnama-to-chat');

  if (bookCardMemories) {
    bookCardMemories.addEventListener('click', () => {
      if (modalBookMemories) modalBookMemories.classList.add('show');
      if (window.birthdayAudio) {
        try { window.birthdayAudio.playGiftOpen(); } catch(e) {}
      }
    });
  }

  if (closeModalMemories) {
    closeModalMemories.addEventListener('click', () => {
      if (modalBookMemories) modalBookMemories.classList.remove('show');
    });
  }

  if (btnOpenCustomizerFromAlbum) {
    btnOpenCustomizerFromAlbum.addEventListener('click', () => {
      if (modalBookMemories) modalBookMemories.classList.remove('show');
      if (customizeModal) customizeModal.classList.add('show');
    });
  }

  if (bookCardSafarnama) {
    bookCardSafarnama.addEventListener('click', () => {
      if (modalBookSafarnama) modalBookSafarnama.classList.add('show');
      if (window.birthdayAudio) {
        try { window.birthdayAudio.playGiftOpen(); } catch(e) {}
      }
    });
  }

  if (closeModalSafarnama) {
    closeModalSafarnama.addEventListener('click', () => {
      if (modalBookSafarnama) modalBookSafarnama.classList.remove('show');
    });
  }

  if (btnSafarnamaToChat) {
    btnSafarnamaToChat.addEventListener('click', () => {
      if (modalBookSafarnama) modalBookSafarnama.classList.remove('show');
      const chatCard = document.querySelector('.chat-card-window');
      if (chatCard) {
        chatCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* =========================================================
     STEP 0: MASTER INDEX & NEON LOGIN & 3D DECK CREATOR LOGIC
     ========================================================= */
  const portalLandingScreen = document.getElementById('portal-landing-screen');
  const btnPortalOpenLogin = document.getElementById('btn-portal-open-login');
  const btnPortalViewDemo = document.getElementById('btn-portal-view-demo');
  const portalLoginModal = document.getElementById('portal-login-modal');
  const closeLoginModal = document.getElementById('close-login-modal');
  const portalLoginForm = document.getElementById('portal-login-form');
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const btnToggleLoginPwd = document.getElementById('btn-toggle-login-pwd');
  const btnLoginHelp = document.getElementById('btn-login-help');

  const portalCreatorDashboard = document.getElementById('portal-creator-dashboard');
  const loggedUserName = document.getElementById('logged-user-name');
  const deckCardGf = document.getElementById('deck-card-gf');
  const deckCardBf = document.getElementById('deck-card-bf');
  const creatorSurpriseForm = document.getElementById('creator-surprise-form');
  const creatorFormHeading = document.getElementById('creator-form-heading');
  const creatorFormSubheading = document.getElementById('creator-form-subheading');
  const creatorInputName = document.getElementById('creator-input-name');
  const creatorInputNickname = document.getElementById('creator-input-nickname');
  const creatorInputAge = document.getElementById('creator-input-age');
  const creatorInputTheme = document.getElementById('creator-input-theme');
  const creatorInputWish = document.getElementById('creator-input-wish');
  const creatorInputPhoto = document.getElementById('creator-input-photo');
  const creatorPhotoStatus = document.getElementById('creator-photo-status');
  const creatorInputPhotoUrl = document.getElementById('creator-input-photo-url');
  const generatedLinkBox = document.getElementById('generated-link-box');
  const finalSurpriseLinkInput = document.getElementById('final-surprise-link-input');
  const btnCopyFinalLink = document.getElementById('btn-copy-final-link');
  const finalCopyFeedback = document.getElementById('final-copy-feedback');
  const btnLaunchPreview = document.getElementById('btn-launch-preview');
  const btnLogoutPortal = document.getElementById('btn-logout-portal');

  let selectedCreatorMode = 'gf';

  // 1. Landing Screen CTAs
  if (btnPortalOpenLogin) {
    btnPortalOpenLogin.addEventListener('click', () => {
      if (portalLoginModal) portalLoginModal.classList.add('show');
      if (loginUsername) loginUsername.focus();
    });
  }

  if (closeLoginModal) {
    closeLoginModal.addEventListener('click', () => {
      if (portalLoginModal) portalLoginModal.classList.remove('show');
    });
  }

  if (btnPortalViewDemo) {
    btnPortalViewDemo.addEventListener('click', () => {
      if (portalLandingScreen) portalLandingScreen.classList.add('hidden');
      if (portalCreatorDashboard) portalCreatorDashboard.classList.add('hidden');
      if (window.birthdayAudio) {
        try { window.birthdayAudio.playFanfare(); } catch(e) {}
      }
    });
  }

  // 2. Toggle Login Password Visibility
  if (btnToggleLoginPwd && loginPassword) {
    btnToggleLoginPwd.addEventListener('click', () => {
      const isPwd = loginPassword.type === 'password';
      loginPassword.type = isPwd ? 'text' : 'password';
      btnToggleLoginPwd.innerHTML = isPwd ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
  }

  // 3. Help Button
  if (btnLoginHelp) {
    btnLoginHelp.addEventListener('click', () => {
      alert("💡 PORTAL & PASSWORD HELP:\n\n• Aapka username & password aapke browser & Telegram bot me secure save hota hai.\n• NOTE: Agar password bhool gaye to access recover nahi hoga, isliye apna password hamesha yaad rakhein!\n• Har baar isi password se authenticate karke aap apni surprise settings edit ya generate kar sakte hain. 💕");
    });
  }

  // 4. Login Form Submission & Authentication
  if (portalLoginForm) {
    portalLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const uName = (loginUsername ? loginUsername.value.trim() : '') || 'Boyfriend';
      const pwd = loginPassword ? loginPassword.value : '';

      if (!uName || !pwd) {
        alert("Please enter both username and password!");
        return;
      }

      // Check / Save Credentials in localStorage
      let usersDB = {};
      try {
        const saved = localStorage.getItem('birthday_portal_users');
        if (saved) usersDB = JSON.parse(saved);
      } catch(err) {
        usersDB = {};
      }

      const userKey = uName.toLowerCase();
      if (usersDB[userKey]) {
        // Authenticate existing user
        if (usersDB[userKey] !== pwd) {
          alert("❌ Galat Password! Agar password bhool gaye to access nahi milega! Please enter correct password.");
          return;
        }
      } else {
        // Register new user
        usersDB[userKey] = pwd;
        try {
          localStorage.setItem('birthday_portal_users', JSON.stringify(usersDB));
        } catch(err) {}
      }

      // Set session
      try {
        localStorage.setItem('birthday_portal_session', uName);
      } catch(err) {}

      if (loggedUserName) loggedUserName.textContent = uName;
      if (portalLoginModal) portalLoginModal.classList.remove('show');
      if (portalLandingScreen) portalLandingScreen.classList.add('hidden');
      if (portalCreatorDashboard) portalCreatorDashboard.classList.remove('hidden');

      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
      if (window.birthdayAudio) {
        try { window.birthdayAudio.playFanfare(); } catch(e) {}
      }
    });
  }

  // 5. 3D Overlapping Deck Mode Switcher (For GF vs For BF)
  function setDeckMode(mode) {
    selectedCreatorMode = mode;
    if (mode === 'gf') {
      if (deckCardGf) {
        deckCardGf.classList.remove('stacked-behind');
        deckCardGf.classList.add('active-focus');
        const st = deckCardGf.querySelector('.deck-active-status');
        if (st) st.innerHTML = '<i class="fa-solid fa-circle-check"></i> SELECTED (FRONT)';
      }
      if (deckCardBf) {
        deckCardBf.classList.remove('active-focus');
        deckCardBf.classList.add('stacked-behind');
        const st = deckCardBf.querySelector('.deck-active-status');
        if (st) st.innerHTML = '<i class="fa-solid fa-hand-pointer"></i> Click to Select';
      }

      // Update Form labels for Girlfriend
      if (creatorFormHeading) creatorFormHeading.textContent = "💖 Fill Her Surprise Details";
      if (creatorFormSubheading) creatorFormSubheading.textContent = "Personalize her name, romantic wish, and upload photo:";
      if (creatorInputName) creatorInputName.placeholder = "e.g. Ananya / Priya / Jaan";
      if (creatorInputNickname) creatorInputNickname.placeholder = "e.g. My Princess / Angel / Queen";
      if (creatorInputWish) creatorInputWish.value = "Happy Birthday to the most amazing, gorgeous, and loving girl in the whole world! Thank you for bringing endless joy, warmth, and magic into my life. Every single day with you is my favorite day. May all your sweetest dreams come true today and forever! 💖✨";
    } else {
      if (deckCardBf) {
        deckCardBf.classList.remove('stacked-behind');
        deckCardBf.classList.add('active-focus');
        const st = deckCardBf.querySelector('.deck-active-status');
        if (st) st.innerHTML = '<i class="fa-solid fa-circle-check"></i> SELECTED (FRONT)';
      }
      if (deckCardGf) {
        deckCardGf.classList.remove('active-focus');
        deckCardGf.classList.add('stacked-behind');
        const st = deckCardGf.querySelector('.deck-active-status');
        if (st) st.innerHTML = '<i class="fa-solid fa-hand-pointer"></i> Click to Select';
      }

      // Update Form labels for Boyfriend
      if (creatorFormHeading) creatorFormHeading.textContent = "👦 Fill His Surprise Details";
      if (creatorFormSubheading) creatorFormSubheading.textContent = "Personalize his name, sweet wish, and upload photo:";
      if (creatorInputName) creatorInputName.placeholder = "e.g. Rahul / Aryan / Kabir";
      if (creatorInputNickname) creatorInputNickname.placeholder = "e.g. My Handsome King / Rockstar / Hero";
      if (creatorInputWish) creatorInputWish.value = "Happy Birthday to the most loving, wonderful, and caring boyfriend in the world! Thank you for always protecting me, making me laugh, and being my biggest support. I love you to infinity and beyond! 🤴🔥";
    }

    if (window.birthdayAudio) {
      try { window.birthdayAudio.playPop(); } catch(e) {}
    }
  }

  if (deckCardGf) {
    deckCardGf.addEventListener('click', () => setDeckMode('gf'));
  }

  if (deckCardBf) {
    deckCardBf.addEventListener('click', () => setDeckMode('bf'));
  }

  // 6. Photo Upload in Creator Dashboard
  if (creatorInputPhoto) {
    creatorInputPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (creatorPhotoStatus) {
          creatorPhotoStatus.textContent = '⏳ Uploading & Hosting Photo...';
          creatorPhotoStatus.style.color = '#ffd700';
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const compressed = compressImage(img);
            currentPhotoDataUrl = compressed;
            try { localStorage.setItem('birthday_custom_photo', compressed); } catch(err) {}
            if (scene) scene.updateUserPhoto(img);

            // Upload to cloud CDN
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
                if (creatorInputPhotoUrl) creatorInputPhotoUrl.value = data.image.url;
                if (creatorPhotoStatus) {
                  creatorPhotoStatus.textContent = '✅ Photo Cloud Hosted & Ready to Share!';
                  creatorPhotoStatus.style.color = '#00ff88';
                }
              } else {
                if (creatorPhotoStatus) {
                  creatorPhotoStatus.textContent = '✅ Photo Ready!';
                  creatorPhotoStatus.style.color = '#00ff88';
                }
              }
            })
            .catch(() => {
              if (creatorPhotoStatus) {
                creatorPhotoStatus.textContent = '✅ Photo Ready!';
                creatorPhotoStatus.style.color = '#00ff88';
              }
            });
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (creatorInputPhotoUrl) {
    creatorInputPhotoUrl.addEventListener('input', () => {
      const url = creatorInputPhotoUrl.value.trim();
      if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'))) {
        currentPhotoDataUrl = url;
        if (creatorPhotoStatus) {
          creatorPhotoStatus.textContent = '✅ Image URL Loaded!';
          creatorPhotoStatus.style.color = '#00ff88';
        }
      }
    });
  }

  // 7. Generate Surprise Link Form Submission
  if (creatorSurpriseForm) {
    creatorSurpriseForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = (creatorInputName ? creatorInputName.value.trim() : '') || 'My Love';
      const nickVal = (creatorInputNickname ? creatorInputNickname.value.trim() : '') || '';
      const ageVal = (creatorInputAge ? creatorInputAge.value.trim() : '') || '';
      const themeVal = (creatorInputTheme ? creatorInputTheme.value : '') || 'rose-glamour';
      const wishVal = (creatorInputWish ? creatorInputWish.value.trim() : '') || 'Happy Birthday!';

      // Update active app state
      celebrantName = nameVal;
      celebrantAge = ageVal;
      customWish = wishVal;
      activeTheme = themeVal;
      updateCelebrantInfo();
      applyTheme(themeVal);

      // Construct Shareable URL
      const currentUrl = new URL(window.location.href);
      currentUrl.search = '';
      currentUrl.hash = '';

      const params = new URLSearchParams();
      params.set('surprise', '1');
      params.set('mode', selectedCreatorMode);
      params.set('name', nameVal);
      if (nickVal) params.set('nickname', nickVal);
      if (ageVal) params.set('age', ageVal);
      params.set('theme', themeVal);
      params.set('wish', wishVal);
      if (currentPhotoDataUrl) params.set('photo', currentPhotoDataUrl);

      const generatedLink = `${currentUrl.origin}${currentUrl.pathname}?${params.toString()}`;

      if (finalSurpriseLinkInput) finalSurpriseLinkInput.value = generatedLink;
      if (generatedLinkBox) {
        generatedLinkBox.classList.remove('hidden');
        generatedLinkBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      }
      if (window.birthdayAudio) {
        try { window.birthdayAudio.playFanfare(); } catch(e) {}
      }
    });
  }

  // 8. Copy Final Link Button
  if (btnCopyFinalLink && finalSurpriseLinkInput) {
    btnCopyFinalLink.addEventListener('click', () => {
      finalSurpriseLinkInput.select();
      finalSurpriseLinkInput.setSelectionRange(0, 99999);
      try {
        navigator.clipboard.writeText(finalSurpriseLinkInput.value).then(() => {
          if (finalCopyFeedback) {
            finalCopyFeedback.classList.add('show');
            setTimeout(() => finalCopyFeedback.classList.remove('show'), 3500);
          }
        }).catch(() => {
          document.execCommand('copy');
          if (finalCopyFeedback) {
            finalCopyFeedback.classList.add('show');
            setTimeout(() => finalCopyFeedback.classList.remove('show'), 3500);
          }
        });
      } catch(err) {
        document.execCommand('copy');
        if (finalCopyFeedback) {
          finalCopyFeedback.classList.add('show');
          setTimeout(() => finalCopyFeedback.classList.remove('show'), 3500);
        }
      }
    });
  }

  // 9. Launch & Preview Surprise Now
  if (btnLaunchPreview) {
    btnLaunchPreview.addEventListener('click', () => {
      if (portalLandingScreen) portalLandingScreen.classList.add('hidden');
      if (portalCreatorDashboard) portalCreatorDashboard.classList.add('hidden');
      if (curtainContainer) curtainContainer.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 10. Logout from Creator Dashboard
  if (btnLogoutPortal) {
    btnLogoutPortal.addEventListener('click', () => {
      try {
        localStorage.removeItem('birthday_portal_session');
      } catch(e) {}
      if (portalCreatorDashboard) portalCreatorDashboard.classList.add('hidden');
      if (portalLandingScreen) portalLandingScreen.classList.remove('hidden');
      if (generatedLinkBox) generatedLinkBox.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================
     ADMIN ENVIRONMENT (ENV) & TELEGRAM BOT CONTROLLER
     ========================================================= */
  const btnPortalTopleftEnv = document.getElementById('btn-portal-topleft-env');
  const btnPortalOpenSandbox = document.getElementById('btn-portal-open-sandbox');
  const adminEnvModal = document.getElementById('admin-env-modal');
  const closeAdminEnvModal = document.getElementById('close-admin-env-modal');
  const adminEnvForm = document.getElementById('admin-env-form');
  const envBotTokenInput = document.getElementById('env-bot-token');
  const btnToggleEnvToken = document.getElementById('btn-toggle-env-token');
  const envChatIdInput = document.getElementById('env-chat-id');
  const envWebUrlInput = document.getElementById('env-web-url');
  const btnEnvSave = document.getElementById('btn-env-save');
  const btnEnvTestPing = document.getElementById('btn-env-test-ping');
  const envFeedbackToast = document.getElementById('env-feedback-toast');
  const envFeedbackMsg = document.getElementById('env-feedback-msg');
  const envBotStatusBadge = document.getElementById('env-bot-status-badge');
  const envStatusText = document.getElementById('env-status-text');

  // Toggle Mask / Unmask Password for Token
  if (btnToggleEnvToken && envBotTokenInput) {
    btnToggleEnvToken.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (envBotTokenInput.type === 'password') {
        envBotTokenInput.type = 'text';
        btnToggleEnvToken.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        btnToggleEnvToken.title = 'Mask Token (••••••)';
      } else {
        envBotTokenInput.type = 'password';
        btnToggleEnvToken.innerHTML = '<i class="fa-solid fa-eye"></i>';
        btnToggleEnvToken.title = 'Show Token';
      }
    });
  }

  function openAdminEnvModal() {
    if (adminEnvModal) adminEnvModal.classList.add('show');
    if (envFeedbackToast) envFeedbackToast.classList.add('hidden');
    loadEnvConfig();
  }

  function closeAdminEnvModalView() {
    if (adminEnvModal) adminEnvModal.classList.remove('show');
  }

  // Real Telegram API Verification (Live getMe call)
  async function verifyTelegramBotLive(token) {
    if (!token) return { ok: false, error: 'No token provided' };
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await response.json();
      if (data && data.ok && data.result) {
        return {
          ok: true,
          username: data.result.username || '',
          first_name: data.result.first_name || '',
          id: data.result.id || ''
        };
      } else {
        return {
          ok: false,
          error: (data && data.description) ? data.description : 'Invalid Telegram Bot Token'
        };
      }
    } catch(err) {
      return {
        ok: false,
        error: 'Network Error: Could not connect to api.telegram.org. Please check internet connection.'
      };
    }
  }

  // Real Telegram Message Sender
  async function sendTelegramMessageLive(token, chatId, text) {
    if (!token || !chatId) return { ok: false, error: 'Missing token or chat_id' };
    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      });
      const data = await response.json();
      if (data && data.ok) {
        return { ok: true, result: data.result };
      } else {
        return { ok: false, error: data.description || 'Could not deliver message' };
      }
    } catch(err) {
      return { ok: false, error: err.message || 'Network error sending message' };
    }
  }

  function updateEnvStatusBadge(isConnected, customText = '') {
    if (!envBotStatusBadge || !envStatusText) return;
    if (isConnected) {
      envBotStatusBadge.className = 'env-bot-status-pill connected';
      envStatusText.textContent = customText || 'Real Bot Connected & Verified ✅';
    } else {
      envBotStatusBadge.className = 'env-bot-status-pill disconnected';
      envStatusText.textContent = customText || 'Bot Token Not Set ⚠️';
    }
  }

  function showEnvFeedback(msg, isError = false) {
    if (!envFeedbackToast || !envFeedbackMsg) return;
    envFeedbackToast.className = isError ? 'env-feedback-toast error' : 'env-feedback-toast';
    const icon = envFeedbackToast.querySelector('i');
    if (icon) {
      icon.className = isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
    }
    envFeedbackMsg.textContent = msg;
    envFeedbackToast.classList.remove('hidden');
  }

  function loadEnvConfig() {
    // 1. Load from localStorage
    let savedToken = '';
    let savedChatId = '';
    let savedWebUrl = window.location.origin + window.location.pathname;

    try {
      savedToken = localStorage.getItem('birthday_tg_bot_token') || '';
      savedChatId = localStorage.getItem('birthday_tg_chat_id') || '';
      savedWebUrl = localStorage.getItem('birthday_web_url') || savedWebUrl;
    } catch(e) {}

    if (envBotTokenInput && savedToken) {
      envBotTokenInput.value = savedToken;
      envBotTokenInput.type = 'password';
      if (btnToggleEnvToken) btnToggleEnvToken.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
    if (envChatIdInput && savedChatId) envChatIdInput.value = savedChatId;
    if (envWebUrlInput) envWebUrlInput.value = savedWebUrl;

    if (savedToken) {
      updateEnvStatusBadge(true, 'Verifying Saved Bot...');
      verifyTelegramBotLive(savedToken).then(res => {
        if (res.ok) {
          updateEnvStatusBadge(true, `🟢 Connected: @${res.username}`);
        } else {
          updateEnvStatusBadge(false, `⚠️ ${res.error}`);
        }
      });
    }

    // 2. Fetch from Python Bot API server if running
    fetch('http://localhost:5000/api/get_env')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.bot_token && envBotTokenInput && !envBotTokenInput.value) {
            envBotTokenInput.value = data.bot_token;
            envBotTokenInput.type = 'password';
          }
          if (data.owner_chat_id && envChatIdInput && !envChatIdInput.value) {
            envChatIdInput.value = data.owner_chat_id;
          }
          if (data.web_app_url && envWebUrlInput && !envWebUrlInput.value) {
            envWebUrlInput.value = data.web_app_url;
          }
          if (data.bot_token) {
            verifyTelegramBotLive(data.bot_token).then(res => {
              if (res.ok) {
                updateEnvStatusBadge(true, `🟢 Connected: @${res.username}`);
              }
            });
          }
        }
      })
      .catch(() => {});
  }

  if (btnPortalTopleftEnv) {
    btnPortalTopleftEnv.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openAdminEnvModal();
    });
  }

  if (btnPortalOpenSandbox) {
    btnPortalOpenSandbox.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openAdminEnvModal();
    });
  }

  if (closeAdminEnvModal) {
    closeAdminEnvModal.addEventListener('click', (e) => {
      e.preventDefault();
      closeAdminEnvModalView();
    });
  }

  // Handle Save & Connect Action (REAL Telegram API Verification + Local/Backend Storage)
  async function handleAdminEnvSave(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const token = envBotTokenInput ? envBotTokenInput.value.trim() : '';
    const chatId = envChatIdInput ? envChatIdInput.value.trim() : '';
    const webUrl = envWebUrlInput ? envWebUrlInput.value.trim() : '';

    if (!token) {
      showEnvFeedback('⚠️ Please enter a Telegram Bot Token from @BotFather!', true);
      if (envBotTokenInput) envBotTokenInput.focus();
      return;
    }

    // Set UI loading state
    const originalSaveBtnText = btnEnvSave ? btnEnvSave.innerHTML : '';
    if (btnEnvSave) {
      btnEnvSave.disabled = true;
      btnEnvSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying on Telegram...';
    }
    updateEnvStatusBadge(true, 'Verifying with Telegram API...');

    // 1. REAL Live Telegram API verification
    const verifyRes = await verifyTelegramBotLive(token);

    if (btnEnvSave) {
      btnEnvSave.disabled = false;
      btnEnvSave.innerHTML = originalSaveBtnText || '<i class="fa-solid fa-floppy-disk"></i> Save & Connect Bot 💾';
    }

    if (!verifyRes.ok) {
      // Real Telegram failure response
      updateEnvStatusBadge(false, '❌ Connection Failed');
      showEnvFeedback(`❌ Telegram Error: ${verifyRes.error}. Please check your token!`, true);
      return;
    }

    // Real verified bot found!
    const botUser = verifyRes.username;
    const botName = verifyRes.first_name;
    const botId = verifyRes.id;

    // 2. Save settings to localStorage
    try {
      localStorage.setItem('birthday_tg_bot_token', token);
      if (chatId) localStorage.setItem('birthday_tg_chat_id', chatId);
      if (webUrl) localStorage.setItem('birthday_web_url', webUrl);
    } catch(err) {}

    // 3. Sync to Python backend server (if active)
    fetch('http://localhost:5000/api/save_env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bot_token: token,
        owner_chat_id: chatId,
        web_app_url: webUrl
      })
    }).catch(() => {});

    // 4. If Chat ID is provided, send real Telegram confirmation message
    if (chatId) {
      sendTelegramMessageLive(
        token,
        chatId,
        `🎉 <b>Real Telegram Bot Connected!</b>\n\n` +
        `🤖 <b>Bot:</b> @${botUser} (${botName})\n` +
        `🆔 <b>Bot ID:</b> <code>${botId}</code>\n` +
        `🌐 <b>Web App:</b> ${webUrl || window.location.origin}\n\n` +
        `✨ Birthday Surprise App is now synced live with your Telegram chat!`
      );
    }

    // 5. Update Status & Feedback
    updateEnvStatusBadge(true, `🟢 Real Bot: @${botUser} (ID: ${botId})`);
    showEnvFeedback(`✅ REAL Bot Verified! Connected to @${botUser} (${botName}). Saved successfully.`, false);

    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
  }

  if (btnEnvSave) {
    btnEnvSave.addEventListener('click', handleAdminEnvSave);
  }

  if (adminEnvForm) {
    adminEnvForm.addEventListener('submit', handleAdminEnvSave);
  }

  // Real Test Ping Action
  if (btnEnvTestPing) {
    btnEnvTestPing.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const token = envBotTokenInput ? envBotTokenInput.value.trim() : '';
      const chatId = envChatIdInput ? envChatIdInput.value.trim() : '';

      if (!token) {
        showEnvFeedback('⚠️ Enter a Telegram Bot Token first to test ping!', true);
        if (envBotTokenInput) envBotTokenInput.focus();
        return;
      }

      const originalText = btnEnvTestPing.innerHTML;
      btnEnvTestPing.disabled = true;
      btnEnvTestPing.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing Real API...';

      // 1. Live getMe call
      const verifyRes = await verifyTelegramBotLive(token);

      if (!verifyRes.ok) {
        btnEnvTestPing.disabled = false;
        btnEnvTestPing.innerHTML = originalText;
        updateEnvStatusBadge(false, '❌ Real Ping Failed');
        showEnvFeedback(`❌ Telegram API Error: ${verifyRes.error}`, true);
        return;
      }

      const botUser = verifyRes.username;
      const botName = verifyRes.first_name;

      // 2. If Chat ID provided, send real live test ping
      if (chatId) {
        const sendRes = await sendTelegramMessageLive(
          token,
          chatId,
          `⚡ <b>Real Connection Ping Test</b>\n\n` +
          `🤖 <b>Bot:</b> @${botUser}\n` +
          `📡 <b>Status:</b> Live & Connected!\n` +
          `⏰ <b>Timestamp:</b> ${new Date().toLocaleTimeString()}\n\n` +
          `Your web app is receiving and dispatching live alerts correctly! 🎉`
        );

        btnEnvTestPing.disabled = false;
        btnEnvTestPing.innerHTML = originalText;

        if (sendRes.ok) {
          updateEnvStatusBadge(true, `🟢 Connected: @${botUser}`);
          showEnvFeedback(`🚀 Real Ping Sent to Chat ID ${chatId}! Connected to @${botUser}. Check Telegram!`, false);
          if (window.confetti) window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        } else {
          updateEnvStatusBadge(true, `🟢 Bot Valid: @${botUser}`);
          showEnvFeedback(`⚠️ Bot @${botUser} is REAL & VALID, but couldn't send message to Chat ID ${chatId}: ${sendRes.error} (Ensure you clicked /start on @${botUser})`, true);
        }
      } else {
        btnEnvTestPing.disabled = false;
        btnEnvTestPing.innerHTML = originalText;
        updateEnvStatusBadge(true, `🟢 Real Bot: @${botUser}`);
        showEnvFeedback(`✅ REAL Bot Verified: @${botUser} (${botName}). Provide a Chat ID to test direct message delivery!`, false);
        if (window.confetti) window.confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      }
    });
  }

  // Modal backdrop click handlers
  [customizeModal, shareModal, giftModal, arcadeOverModal, photoBoothModal, polaroidsModal, chatHistoryModal, modalBookMemories, modalBookSafarnama, portalLoginModal, adminEnvModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    }
  });

  // Check URL parameters and session state on load
  function checkInitialPortalState() {
    const params = new URLSearchParams(window.location.search || window.location.hash.replace(/^#/, '?'));
    const isDirectSurpriseLink = params.has('surprise') || params.has('name') || params.has('preview') || params.has('demo');

    if (isDirectSurpriseLink) {
      // Recipient is opening their surprise link directly -> Bypass portal
      if (portalLandingScreen) portalLandingScreen.classList.add('hidden');
      if (portalCreatorDashboard) portalCreatorDashboard.classList.add('hidden');
    } else {
      // Direct visit to root URL -> Show Landing Screen or Dashboard if logged in
      let savedSession = null;
      try { savedSession = localStorage.getItem('birthday_portal_session'); } catch(e) {}

      if (savedSession) {
        if (loggedUserName) loggedUserName.textContent = savedSession;
        if (portalLandingScreen) portalLandingScreen.classList.add('hidden');
        if (portalCreatorDashboard) portalCreatorDashboard.classList.remove('hidden');
      } else {
        if (portalLandingScreen) portalLandingScreen.classList.remove('hidden');
        if (portalCreatorDashboard) portalCreatorDashboard.classList.add('hidden');
      }
    }
  }

  parseUrlParams();
  checkInitialPortalState();
});


