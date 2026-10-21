// ===================================================================
// 100% CUSTOMIZABLE LOVE WEBSITE - CORE LOGIC & INTERACTIONS
// 3 GIFTS FLOW: Passcode -> 3 Gifts Hub (Tulips, Letter, Playlist)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentScreen: 'screen-passcode',
    pin: '',
    correctPins: ['2210', '1022', '22'],
    isMusicPlaying: false,
    likedSong: false,
    openedGifts: new Set(),
    redeemedCoupons: new Set(),
    
    // Default Customizable Data
    partnerName: 'My Love',
    senderName: 'Forever Yours',
    secretCode: '2210',
    reunionDate: '22nd October',
    letterText: `Looking back, the time we stopped talking felt like a chapter that was missing its colors. The world kept turning, but it was so quiet without your laugh, your voice, and your presence.\n\nAnd then came October 22nd.\n\nA single text notification lit up my phone. Just a few simple words, yet it felt like our entire universe restarted in an instant. That one text brought us back together and opened the door to the most beautiful year of my life.\n\nToday marks our one-year reunion anniversary since that day. Over the past 365 days, you've made me smile on my hardest days, made me feel safe, and reminded me what true love really feels like.\n\nThank you for being you, for answering that text, and for giving us this second chance. No matter what happens or where life takes us, my heart will always choose you.\n\nAlways & forever,`,
    chatTextThem: "Hey... I know it's been a while, but I couldn't stop thinking about you.",
    chatTextMe: "I missed you so much. I'm so glad you texted."
  };

  // Load custom data from localStorage if exists
  loadCustomData();

  // Initialize Canvas Hearts & Petals
  initParticleCanvas();

  // Setup Event Listeners
  setupKeypad();
  setupGiftHub();
  setupTulipInteractions();
  setupMusicPlayer();
  setupModals();
  setupCustomizer();
  setupGlobalControls();

  // =================================================================
  // 1. PIN & PASSCODE SCREEN LOGIC
  // =================================================================
  function setupKeypad() {
    const keys = document.querySelectorAll('.key-btn');
    const dots = document.querySelectorAll('.pin-dot');
    const toast = document.getElementById('keypad-toast');

    keys.forEach(key => {
      key.addEventListener('click', () => {
        const val = key.getAttribute('data-val');

        if (val === 'back') {
          // Backspace
          if (state.pin.length > 0) {
            state.pin = state.pin.slice(0, -1);
            window.romanticAudio?.playKeyClick(450);
            updatePinDots();
          }
        } else if (val === 'hint') {
          // Show Hint
          window.romanticAudio?.playPop();
          showToast(`💡 Hint: The special date everything started again — ${state.secretCode} (or 2210) 💌`);
        } else if (val !== null) {
          // Number key
          if (state.pin.length < 4) {
            state.pin += val;
            window.romanticAudio?.playKeyClick(550 + state.pin.length * 60);
            updatePinDots();

            if (state.pin.length === 4) {
              verifyPin();
            }
          }
        }
      });
    });

    // Support physical keyboard typing
    window.addEventListener('keydown', (e) => {
      if (state.currentScreen !== 'screen-passcode') return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

      if (e.key >= '0' && e.key <= '9') {
        if (state.pin.length < 4) {
          state.pin += e.key;
          window.romanticAudio?.playKeyClick(550 + state.pin.length * 60);
          updatePinDots();
          if (state.pin.length === 4) {
            verifyPin();
          }
        }
      } else if (e.key === 'Backspace') {
        if (state.pin.length > 0) {
          state.pin = state.pin.slice(0, -1);
          window.romanticAudio?.playKeyClick(450);
          updatePinDots();
        }
      }
    });

    function updatePinDots() {
      dots.forEach((dot, index) => {
        if (index < state.pin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
          dot.classList.remove('error');
        }
      });
    }

    function verifyPin() {
      const isCorrect = state.pin === state.secretCode || state.correctPins.includes(state.pin);

      if (isCorrect) {
        showToast('✨ Unlocked with Love! Opening your surprises... 💖');
        window.romanticAudio?.playSuccessChime();
        triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);

        // Auto start background soothing lofi music
        setTimeout(() => {
          if (!state.isMusicPlaying) {
            window.romanticAudio?.startMusic();
            state.isMusicPlaying = true;
            updateMusicUI();
          }
        }, 500);

        // Directly transition to the 3 Gifts Screen!
        setTimeout(() => {
          goToScreen('screen-gifts');
        }, 900);
      } else {
        window.romanticAudio?.playErrorBeep();
        dots.forEach(dot => dot.classList.add('error'));
        showToast(`Try the date a simple text changed everything: ${state.secretCode} 💕`);

        setTimeout(() => {
          state.pin = '';
          updatePinDots();
        }, 800);
      }
    }

    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.style.opacity = '1';
    }
  }

  // =================================================================
  // 2. SCREEN TRANSITIONS & NAVIGATION
  // =================================================================
  function goToScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      state.currentScreen = screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update Navigation Bar
      const navBackBtn = document.getElementById('nav-back-gifts-btn');
      if (navBackBtn) {
        if (screenId === 'screen-passcode' || screenId === 'screen-gifts') {
          navBackBtn.style.display = 'none';
        } else {
          navBackBtn.style.display = 'inline-flex';
        }
      }
    }
  }

  // =================================================================
  // 3. GIFTS HUB SELECTION (Image 2)
  // =================================================================
  function setupGiftHub() {
    const giftTulips = document.getElementById('gift-card-tulips');
    const giftLetter = document.getElementById('gift-card-letter');
    const giftPlaylist = document.getElementById('gift-card-playlist');

    // Gift 1: Tulips
    if (giftTulips) {
      giftTulips.addEventListener('click', () => {
        window.romanticAudio?.playUnwrapSparkle();
        state.openedGifts.add('tulips');
        markGiftOpened('badge-gift-tulips', 'Opened 🌷');
        triggerConfetti(window.innerWidth * 0.3, window.innerHeight * 0.5);

        setTimeout(() => {
          goToScreen('screen-tulips');
        }, 350);
      });
    }

    // Gift 2: Letter
    if (giftLetter) {
      giftLetter.addEventListener('click', () => {
        window.romanticAudio?.playUnwrapSparkle();
        state.openedGifts.add('letter');
        markGiftOpened('badge-gift-letter', 'Opened 💌');
        triggerConfetti(window.innerWidth * 0.5, window.innerHeight * 0.5);

        setTimeout(() => {
          goToScreen('screen-letter');
        }, 350);
      });
    }

    // Gift 3: Playlist
    if (giftPlaylist) {
      giftPlaylist.addEventListener('click', () => {
        window.romanticAudio?.playUnwrapSparkle();
        state.openedGifts.add('playlist');
        markGiftOpened('badge-gift-playlist', 'Opened 🎶');
        triggerConfetti(window.innerWidth * 0.7, window.innerHeight * 0.5);

        setTimeout(() => {
          goToScreen('screen-playlist');
        }, 350);
      });
    }

    function markGiftOpened(badgeId, text) {
      const badge = document.getElementById(badgeId);
      if (badge) {
        badge.textContent = text;
        badge.style.background = '#8bd39a';
        badge.style.color = '#ffffff';
        badge.style.borderColor = '#8bd39a';
      }
    }

    // "Back to Gifts" Buttons on all pages
    const backGiftsBtns = document.querySelectorAll('[data-action="back-to-gifts"]');
    backGiftsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        goToScreen('screen-gifts');
      });
    });

    const topNavBackBtn = document.getElementById('nav-back-gifts-btn');
    if (topNavBackBtn) {
      topNavBackBtn.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        goToScreen('screen-gifts');
      });
    }

    // Next gift shortcuts
    const nextGiftBtns = document.querySelectorAll('.nav-next-gift-btn');
    nextGiftBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) {
          window.romanticAudio?.playPop();
          goToScreen(target);
        }
      });
    });
  }

  // =================================================================
  // 4. TULIP SCREEN INTERACTIONS (Image 1)
  // =================================================================
  function setupTulipInteractions() {
    const bouquet = document.getElementById('interactive-tulips');
    const cloudCards = document.querySelectorAll('.story-cloud-card');

    if (bouquet) {
      bouquet.addEventListener('click', (e) => {
        window.romanticAudio?.playPop();
        const rect = bouquet.getBoundingClientRect();
        triggerHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    }

    cloudCards.forEach(card => {
      card.addEventListener('click', (e) => {
        window.romanticAudio?.playPop();
        card.style.transform = 'scale(1.08) translateY(-4px)';
        const rect = card.getBoundingClientRect();
        triggerHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
        setTimeout(() => {
          card.style.transform = '';
        }, 300);
      });
    });

    // Cat sticker click
    const catSticker = document.getElementById('letter-cat');
    if (catSticker) {
      catSticker.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        const rect = catSticker.getBoundingClientRect();
        triggerHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
      });
    }
  }

  // =================================================================
  // 5. MUSIC PLAYER & SPINNING VINYL (Image 4)
  // =================================================================
  function setupMusicPlayer() {
    const playBtn = document.getElementById('master-play-btn');
    const vinyl = document.getElementById('vinyl-disc');
    const progressBar = document.getElementById('music-progress-bar');
    const progressFill = document.getElementById('music-progress-fill');
    const currentTimeEl = document.getElementById('music-current-time');
    const totalTimeEl = document.getElementById('music-total-time');
    const likeBtn = document.getElementById('heart-like-btn');
    const audioUpload = document.getElementById('custom-song-upload');
    const uploadTrigger = document.getElementById('upload-song-btn');

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const isPlaying = window.romanticAudio?.toggleMusic();
        state.isMusicPlaying = isPlaying;
        updateMusicUI();
      });
    }

    if (vinyl) {
      vinyl.addEventListener('click', () => {
        const isPlaying = window.romanticAudio?.toggleMusic();
        state.isMusicPlaying = isPlaying;
        updateMusicUI();
      });
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        window.romanticAudio?.playPop();
        state.likedSong = !state.likedSong;
        likeBtn.textContent = state.likedSong ? '❤️' : '🤍';
        const rect = likeBtn.getBoundingClientRect();
        triggerHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
      });
    }

    // Custom song upload
    if (uploadTrigger && audioUpload) {
      uploadTrigger.addEventListener('click', () => audioUpload.click());
      audioUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          window.romanticAudio?.loadCustomAudio(file);
          window.romanticAudio?.startMusic();
          state.isMusicPlaying = true;
          document.getElementById('track-title').textContent = file.name.replace(/\.[^/.]+$/, "");
          document.getElementById('track-artist').textContent = "Our Favorite Song";
          updateMusicUI();
        }
      });
    }

    // Audio progress sync from engine
    if (window.romanticAudio) {
      window.romanticAudio.onProgressUpdate = (currentSec, totalSec) => {
        if (currentTimeEl) currentTimeEl.textContent = formatTime(currentSec);
        if (totalTimeEl) totalTimeEl.textContent = formatTime(totalSec);
        if (progressFill && totalSec > 0) {
          progressFill.style.width = `${(currentSec / totalSec) * 100}%`;
        }
      };
    }

    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
  }

  function updateMusicUI() {
    const playBtn = document.getElementById('master-play-btn');
    const vinyl = document.getElementById('vinyl-disc');
    const topMusicBtn = document.getElementById('top-music-btn');

    if (playBtn) {
      playBtn.innerHTML = state.isMusicPlaying ? '❚❚' : '▶';
    }
    if (vinyl) {
      if (state.isMusicPlaying) {
        vinyl.classList.add('spinning');
      } else {
        vinyl.classList.remove('spinning');
      }
    }
    if (topMusicBtn) {
      if (state.isMusicPlaying) {
        topMusicBtn.classList.add('playing');
        topMusicBtn.title = "Music Playing (Tap to Pause)";
      } else {
        topMusicBtn.classList.remove('playing');
        topMusicBtn.title = "Play Romantic Music";
      }
    }
  }

  // =================================================================
  // 6. EXTRA MODALS (Reunion Text, Coupons, Certificate)
  // =================================================================
  function setupModals() {
    const btnText = document.getElementById('open-text-mockup-btn');
    const btnCoupons = document.getElementById('open-coupons-btn');
    const btnCert = document.getElementById('open-certificate-btn');

    const closeBtns = document.querySelectorAll('.modal-close-btn');
    const backdrops = document.querySelectorAll('.modal-backdrop');

    if (btnText) {
      btnText.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        openModal('modal-gift-reunion-text');
      });
    }
    if (btnCoupons) {
      btnCoupons.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        openModal('modal-gift-coupons');
      });
    }
    if (btnCert) {
      btnCert.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        openModal('modal-gift-certificate');
      });
    }

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllModals();
      });
    });

    backdrops.forEach(bd => {
      bd.addEventListener('click', (e) => {
        if (e.target === bd) {
          closeAllModals();
        }
      });
    });

    // Love Coupons redeem logic
    const redeemBtns = document.querySelectorAll('.coupon-redeem-btn');
    redeemBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.romanticAudio?.playPop();
        const card = btn.closest('.love-coupon-card');
        card.classList.add('redeemed');
        btn.textContent = 'Redeemed ✓';
        btn.disabled = true;

        const rect = card.getBoundingClientRect();
        triggerHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
      });
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeAllModals() {
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(m => m.classList.remove('active'));
  }

  // =================================================================
  // 7. 100% CUSTOMIZER DRAWER
  // =================================================================
  function setupCustomizer() {
    const drawer = document.getElementById('customizer-drawer');
    const openBtn = document.getElementById('open-customizer-btn');
    const closeBtn = document.getElementById('close-customizer-btn');
    const saveBtn = document.getElementById('save-custom-btn');

    if (openBtn && drawer) {
      openBtn.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        drawer.classList.add('open');
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveCustomData();
        window.romanticAudio?.playSuccessChime();
        drawer.classList.remove('open');
        applyCustomDataToDOM();
        alert('✨ Changes saved successfully! Your website is updated.');
      });
    }
  }

  function saveCustomData() {
    state.partnerName = document.getElementById('input-partner-name')?.value || state.partnerName;
    state.senderName = document.getElementById('input-sender-name')?.value || state.senderName;
    state.secretCode = document.getElementById('input-passcode')?.value || state.secretCode;
    state.reunionDate = document.getElementById('input-anniversary-date')?.value || state.reunionDate;
    state.letterText = document.getElementById('input-letter-body')?.value || state.letterText;
    state.chatTextThem = document.getElementById('input-chat-them')?.value || state.chatTextThem;
    state.chatTextMe = document.getElementById('input-chat-me')?.value || state.chatTextMe;

    localStorage.setItem('love_site_custom_data', JSON.stringify({
      partnerName: state.partnerName,
      senderName: state.senderName,
      secretCode: state.secretCode,
      reunionDate: state.reunionDate,
      letterText: state.letterText,
      chatTextThem: state.chatTextThem,
      chatTextMe: state.chatTextMe
    }));
  }

  function loadCustomData() {
    try {
      const stored = localStorage.getItem('love_site_custom_data');
      if (stored) {
        const data = JSON.parse(stored);
        Object.assign(state, data);
      }
    } catch (e) {
      console.warn('Error loading custom settings:', e);
    }
    applyCustomDataToDOM();
  }

  function applyCustomDataToDOM() {
    // Populate form fields
    const pName = document.getElementById('input-partner-name');
    const sName = document.getElementById('input-sender-name');
    const sCode = document.getElementById('input-passcode');
    const rDate = document.getElementById('input-anniversary-date');
    const lBody = document.getElementById('input-letter-body');
    const cThem = document.getElementById('input-chat-them');
    const cMe = document.getElementById('input-chat-me');

    if (pName) pName.value = state.partnerName;
    if (sName) sName.value = state.senderName;
    if (sCode) sCode.value = state.secretCode;
    if (rDate) rDate.value = state.reunionDate;
    if (lBody) lBody.value = state.letterText;
    if (cThem) cThem.value = state.chatTextThem;
    if (cMe) cMe.value = state.chatTextMe;

    // Apply to Page Elements
    document.querySelectorAll('.data-partner-name').forEach(el => el.textContent = state.partnerName);
    document.querySelectorAll('.data-sender-name').forEach(el => el.textContent = state.senderName);
    document.querySelectorAll('.data-reunion-date').forEach(el => el.textContent = state.reunionDate);

    const letterBodyContainer = document.getElementById('letter-body-paragraphs');
    if (letterBodyContainer) {
      letterBodyContainer.innerHTML = state.letterText.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }

    const chatThemEl = document.getElementById('chat-msg-them');
    const chatMeEl = document.getElementById('chat-msg-me');
    if (chatThemEl) chatThemEl.textContent = state.chatTextThem;
    if (chatMeEl) chatMeEl.textContent = state.chatTextMe;
  }

  // =================================================================
  // 8. GLOBAL CONTROLS & SHOWCASE TOGGLE
  // =================================================================
  function setupGlobalControls() {
    const topMusicBtn = document.getElementById('top-music-btn');
    const toggleFrameBtn = document.getElementById('toggle-frame-mode-btn');

    if (topMusicBtn) {
      topMusicBtn.addEventListener('click', () => {
        const isPlaying = window.romanticAudio?.toggleMusic();
        state.isMusicPlaying = isPlaying;
        updateMusicUI();
      });
    }

    if (toggleFrameBtn) {
      toggleFrameBtn.addEventListener('click', () => {
        document.body.classList.toggle('fullscreen-mode');
        const isFs = document.body.classList.contains('fullscreen-mode');
        toggleFrameBtn.textContent = isFs ? '🖼️ Frame' : '🖥️ Full';
        window.romanticAudio?.playPop();
      });
    }
  }

  // =================================================================
  // 9. CANVAS PARTICLES: FALLING HEARTS & ROSE PETALS
  // =================================================================
  function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#ff8da1', '#ffb6c1', '#ffa7b9', '#ffd1dc', '#ff6b8b'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.9 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHeart: Math.random() > 0.4
      });
    }

    function drawHeart(ctx, x, y, size, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, topCurveHeight / 2, 0, size);
      ctx.bezierCurveTo(size, topCurveHeight / 2, size / 2, -topCurveHeight, 0, topCurveHeight);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.restore();
    }

    function drawPetal(ctx, x, y, size, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.8, size * 0.4, 0, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.45;
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.8;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        if (p.isHeart) {
          drawHeart(ctx, 0, 0, p.size, p.color);
        } else {
          drawPetal(ctx, 0, 0, p.size, p.color);
        }
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // Interactive Burst Effects
  function triggerHeartBurst(x, y, count = 15) {
    const container = document.body;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.textContent = ['💖', '🌸', '🌷', '✨', '🤍'][Math.floor(Math.random() * 5)];
      heart.style.position = 'fixed';
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = `${Math.random() * 16 + 14}px`;
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '999';
      heart.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      heart.style.opacity = '1';

      const destX = (Math.random() - 0.5) * 160;
      const destY = (Math.random() - 0.8) * 160;

      container.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translate(${destX}px, ${destY}px) scale(${Math.random() * 0.6 + 0.8})`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 850);
    }
  }

  function triggerConfetti(x, y) {
    const container = document.body;
    const colors = ['#ff4d6d', '#ff85a2', '#a2d2ff', '#ffe066', '#ffffff'];

    for (let i = 0; i < 30; i++) {
      const bit = document.createElement('div');
      bit.style.position = 'fixed';
      bit.style.left = `${x}px`;
      bit.style.top = `${y}px`;
      bit.style.width = `${Math.random() * 8 + 4}px`;
      bit.style.height = `${Math.random() * 8 + 4}px`;
      bit.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      bit.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      bit.style.pointerEvents = 'none';
      bit.style.zIndex = '999';
      bit.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';

      const destX = (Math.random() - 0.5) * 260;
      const destY = (Math.random() - 0.7) * 240;

      container.appendChild(bit);

      requestAnimationFrame(() => {
        bit.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 720}deg)`;
        bit.style.opacity = '0';
      });

      setTimeout(() => bit.remove(), 1000);
    }
  }
});
