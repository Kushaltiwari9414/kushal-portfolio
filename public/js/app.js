// Main App Orchestrator: Progressive Game Rounds, Quest System, Teleportation, Audio, and HUD

class ProgressionManager {
  constructor(map, soundManager) {
    this.map = map;
    this.sound = soundManager;
    this.currentRound = 1;
    this.maxRounds = 6;
    this.lastGateToastTime = 0;

    // Progression definitions for all 6 Rounds
    this.rounds = {
      1: {
        title: 'ROUND 1: ACADEMIC CITADEL',
        targetZone: 1,
        unlocksZone: 2,
        desc: 'Consult Guide Master & Examine Academic Monument at NIT Manipur',
        required: ['obj-guide', 'obj-education'],
        completed: new Set(),
        clearMessage: {
          tag: 'ROUND 1 CLEARED! 🌟',
          title: 'Zone 2: Tech Sanctum Unlocked!',
          desc: 'You have reviewed Kushal\'s academic credentials and career objective. The red laser barrier across the eastern highway has dissipated!'
        }
      },
      2: {
        title: 'ROUND 2: TECH SANCTUM & SKILL FORGE',
        targetZone: 2,
        unlocksZone: 3,
        desc: 'Inspect at least 3 Tech Altars (Languages, Frontend, Backend, AI, CS)',
        required: ['obj-skill-languages', 'obj-skill-frameworks', 'obj-skill-backend', 'obj-skill-ai', 'obj-skill-cs'],
        minCount: 3,
        completed: new Set(),
        clearMessage: {
          tag: 'ROUND 2 CLEARED! ⚡',
          title: 'Zone 3: Work Experience Guild Unlocked!',
          desc: 'You have examined Kushal\'s full-stack and AI technical mastery. The southern barrier to the Work Experience Guild is now OPEN!'
        }
      },
      3: {
        title: 'ROUND 3: WORK EXPERIENCE GUILD',
        targetZone: 3,
        unlocksZone: 4,
        desc: 'Review Khatakhat Logistics SDE Intern & Learntricks Web Dev scrolls',
        required: ['obj-exp-khatakhat', 'obj-exp-learntricks'],
        completed: new Set(),
        clearMessage: {
          tag: 'ROUND 3 CLEARED! 💼',
          title: 'Zone 4: Project Research Labs Unlocked!',
          desc: 'Internship contributions and engineering impact verified. The barrier to the Project Research Labs & Cyber Arcade is now OPEN!'
        }
      },
      4: {
        title: 'ROUND 4: PROJECT LABS & CYBER ARCADE',
        targetZone: 4,
        unlocksZone: 5,
        desc: 'Inspect HAR Engine, Ollama Script & play the Bug Hunter Arcade Game',
        required: ['obj-proj-har', 'obj-proj-ollama', 'obj-arcade-game'],
        minCount: 2,
        completed: new Set(),
        clearMessage: {
          tag: 'ROUND 4 CLEARED! 🚀',
          title: 'Zone 5: Hall of Fame & Hackathons Unlocked!',
          desc: 'Real-time telemetry algorithms and arcade tests cleared. The barrier to the Hall of Fame & Hackathon archives is now OPEN!'
        }
      },
      5: {
        title: 'ROUND 5: HALL OF FAME & HONORS',
        targetZone: 5,
        unlocksZone: 6,
        desc: 'Inspect CDAC Open Source Monument & RE GEN Hackathons Lead Trophy',
        required: ['obj-trophy-cdac', 'obj-trophy-regen'],
        completed: new Set(),
        clearMessage: {
          tag: 'ROUND 5 CLEARED! 🏆',
          title: 'Zone 6: Contact Embassy & Final Terminal Unlocked!',
          desc: 'Leadership and technical honors confirmed. The final portal to the Contact Embassy is now OPEN!'
        }
      },
      6: {
        title: 'ROUND 6: FINAL TRANSMISSION & EMBASSY',
        targetZone: 6,
        unlocksZone: 6,
        desc: 'Transmit a message to Kushal, sign the Guestbook, or download the Official Resume',
        required: ['obj-terminal-contact', 'obj-terminal-resume', 'obj-terminal-guestbook'],
        minCount: 1,
        completed: new Set(),
        clearMessage: {
          tag: 'GRAND VICTORY! 👑',
          title: 'All 6 Rounds Cleared!',
          desc: 'Congratulations! You have completed Kushal Tiwari\'s full-stack game portfolio adventure. Kushal is ready for software engineering opportunities!'
        }
      }
    };

    this.initUI();
  }

  initUI() {
    this.updateHUD();
    this.updateNavButtons();

    const continueBtn = document.getElementById('btn-round-continue');
    const modal = document.getElementById('round-clear-modal');
    if (continueBtn && modal) {
      continueBtn.onclick = () => {
        modal.classList.add('hidden');
      };
    }
  }

  onInteract(interactable) {
    const round = this.rounds[this.currentRound];
    if (!round) return;

    if (round.required.includes(interactable.id)) {
      round.completed.add(interactable.id);
    }

    const needed = round.minCount || round.required.length;
    const count = round.completed.size;

    this.updateHUD();

    if (count >= needed) {
      this.clearRound(this.currentRound);
    }
  }

  clearRound(roundNum) {
    const round = this.rounds[roundNum];
    if (!round) return;

    if (this.sound) this.sound.playFanfare();

    // Unlock gate in map
    if (round.unlocksZone) {
      this.map.unlockZone(round.unlocksZone);
    }

    // Show celebration modal
    const modal = document.getElementById('round-clear-modal');
    const tag = document.getElementById('round-clear-tag');
    const title = document.getElementById('round-clear-title');
    const desc = document.getElementById('round-clear-desc');

    if (modal && tag && title && desc) {
      tag.textContent = round.clearMessage.tag;
      title.textContent = round.clearMessage.title;
      desc.textContent = round.clearMessage.desc;
      modal.classList.remove('hidden');
    }

    // Advance round
    if (this.currentRound < this.maxRounds) {
      this.currentRound++;
      this.updateNavButtons();
      this.updateHUD();
    }
  }

  onGateHit(gate) {
    const now = performance.now();
    if (now - this.lastGateToastTime < 1500) return;
    this.lastGateToastTime = now;

    if (this.sound) this.sound.playGateLocked();

    const toast = document.getElementById('gate-toast');
    const msg = document.getElementById('gate-toast-msg');
    if (toast && msg) {
      const zoneName = gate.label ? gate.label.split('(')[0].trim() : 'Next Zone';
      msg.textContent = `🔒 GATE LOCKED: Complete Round ${gate.roundNeeded} to unlock ${zoneName}!`;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2500);
    }
  }

  isZoneUnlocked(zoneNum) {
    return zoneNum <= this.currentRound;
  }

  updateHUD() {
    const round = this.rounds[this.currentRound];
    if (!round) return;

    const badge = document.getElementById('round-badge');
    const title = document.getElementById('round-title');
    const counter = document.getElementById('round-step-counter');
    const desc = document.getElementById('round-task-desc');

    if (badge) badge.textContent = `R${this.currentRound}`;
    if (title) title.textContent = round.title;
    if (desc) desc.textContent = round.desc;

    const needed = round.minCount || round.required.length;
    const count = Math.min(needed, round.completed.size);
    if (counter) counter.textContent = `${count}/${needed}`;
  }

  updateNavButtons() {
    const zoneNavMap = [
      { id: 'btn-nav-spawn', zone: 1 },
      { id: 'btn-nav-skills', zone: 2 },
      { id: 'btn-nav-exp', zone: 3 },
      { id: 'btn-nav-projects', zone: 4 },
      { id: 'btn-nav-arcade', zone: 4 },
      { id: 'btn-nav-trophies', zone: 5 },
      { id: 'btn-nav-contact', zone: 6 }
    ];

    zoneNavMap.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const isUnlocked = item.zone <= this.currentRound;
      const lockIcon = el.querySelector('.lock-icon');

      if (isUnlocked) {
        el.classList.remove('opacity-50', 'cursor-not-allowed', 'text-slate-500');
        el.classList.add('text-slate-200', 'hover:bg-slate-800');
        if (lockIcon) lockIcon.textContent = '✔';
      } else {
        el.classList.add('opacity-50', 'cursor-not-allowed', 'text-slate-500');
        el.classList.remove('hover:bg-slate-800');
        if (lockIcon) lockIcon.textContent = '🔒';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch Resume Data from Backend API (with fallback if needed)
  let resumeData = null;
  try {
    const res = await fetch('/api/resume');
    resumeData = await res.json();
  } catch (e) {
    console.warn('Backend /api/resume unavailable, using local cache', e);
  }

  if (!resumeData || !resumeData.basics) {
    resumeData = {
      basics: {
        name: "Kushal Tiwari",
        title: "Full-Stack Web Developer & AI Solutions Engineer",
        location: "Dausa, Rajasthan | NIT Manipur",
        phone: "+91-9256455186",
        email: "kushalsharma9414@gmail.com",
        github: "https://github.com/kushaltiwari",
        linkedin: "https://linkedin.com/in/kushaltiwari",
        summary: "Final-year B.Tech Computer Science student at NIT Manipur with hands-on experience in full-stack web development and AI-driven web applications."
      },
      stats: { level: 22, exp: 8450 },
      education: [],
      skills: { languages: [], frameworks: [], backendAndDatabases: [], aiAndTools: [], csFundamentals: [], softSkills: [] },
      experience: [],
      projects: [],
      achievements: [],
      positionsOfResponsibility: []
    };
  }

  // 2. Initialize Modal Manager
  window.modalManager = new window.ModalManager(resumeData);

  // 3. Quest Tracker for Sidebar
  const quests = {
    spawn: { name: 'Round 1: Visit NIT Manipur Citadel', done: false },
    skills: { name: 'Round 2: Inspect Tech Altars', done: false },
    experience: { name: 'Round 3: Consult Experience Guild', done: false },
    projects: { name: 'Round 4: Test Projects & Arcade', done: false },
    trophy: { name: 'Round 5: Inspect Honors & Trophies', done: false },
    contact: { name: 'Round 6: Transmit Final Message', done: false }
  };

  const updateQuestLogUI = () => {
    const questList = document.getElementById('quest-list');
    const questProgress = document.getElementById('quest-progress-bar');
    const questPercent = document.getElementById('quest-percent');
    if (!questList) return;

    let completed = 0;
    const total = Object.keys(quests).length;

    questList.innerHTML = Object.entries(quests).map(([key, q]) => {
      if (q.done) completed++;
      return `
        <div class="flex items-center justify-between text-xs py-1">
          <span class="${q.done ? 'text-emerald-400 line-through' : 'text-slate-300'} flex items-center gap-1.5">
            <span>${q.done ? '✔' : '○'}</span> ${q.name}
          </span>
          <span class="text-[10px] font-mono ${q.done ? 'text-emerald-400' : 'text-amber-400'}">${q.done ? '+200 XP' : 'Open'}</span>
        </div>
      `;
    }).join('');

    const pct = Math.round((completed / total) * 100);
    if (questPercent) questPercent.textContent = `${pct}%`;
    if (questProgress) questProgress.style.width = `${pct}%`;
  };

  const markSidebarQuest = (roundNum) => {
    if (roundNum === 1) quests.spawn.done = true;
    if (roundNum === 2) quests.skills.done = true;
    if (roundNum === 3) quests.experience.done = true;
    if (roundNum === 4) quests.projects.done = true;
    if (roundNum === 5) quests.trophy.done = true;
    if (roundNum === 6) quests.contact.done = true;
    updateQuestLogUI();
  };

  updateQuestLogUI();

  // 4. Initialize Main Game Engine
  const engine = new window.GameEngine('game-canvas', resumeData, (interactable) => {
    window.progressionManager.onInteract(interactable);
    window.modalManager.open(interactable);
  });
  window.gameEngine = engine;

  // 5. Initialize Progression Manager
  window.progressionManager = new ProgressionManager(engine.map, window.soundManager);

  // Hook round clear to sidebar quest tracker
  const originalClearRound = window.progressionManager.clearRound.bind(window.progressionManager);
  window.progressionManager.clearRound = function(roundNum) {
    markSidebarQuest(roundNum);
    originalClearRound(roundNum);
  };

  engine.start();

  // 6. Connect Fast Travel Navigation with Locked Checks
  const navButtons = [
    { id: 'btn-nav-spawn', zone: 1, x: 260, y: 220 },
    { id: 'btn-nav-skills', zone: 2, x: 1050, y: 220 },
    { id: 'btn-nav-exp', zone: 3, x: 280, y: 680 },
    { id: 'btn-nav-projects', zone: 4, x: 1050, y: 680 },
    { id: 'btn-nav-arcade', zone: 4, x: 1390, y: 680 },
    { id: 'btn-nav-trophies', zone: 5, x: 280, y: 1100 },
    { id: 'btn-nav-contact', zone: 6, x: 1100, y: 1100 }
  ];

  navButtons.forEach(nav => {
    const el = document.getElementById(nav.id);
    if (el) {
      el.addEventListener('click', () => {
        if (!window.progressionManager.isZoneUnlocked(nav.zone)) {
          if (window.soundManager) window.soundManager.playGateLocked();
          const toast = document.getElementById('gate-toast');
          const msg = document.getElementById('gate-toast-msg');
          if (toast && msg) {
            msg.textContent = `🔒 Zone ${nav.zone} is LOCKED! Complete Round ${nav.zone - 1} first!`;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 2500);
          }
          return;
        }
        engine.teleportTo(nav.x, nav.y);
      });
    }
  });

  // 7. Direct Buttons: Resume & Audio
  const btnToggleResume = document.getElementById('btn-toggle-resume');
  if (btnToggleResume) {
    btnToggleResume.addEventListener('click', () => {
      window.modalManager.open({
        data: { type: 'full-resume' },
        title: 'Kushal Tiwari — Official Resume',
        category: 'terminal'
      });
    });
  }

  const btnSoundToggle = document.getElementById('btn-toggle-sound');
  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', () => {
      const isMuted = window.soundManager.toggleMute();
      btnSoundToggle.innerHTML = isMuted ? '🔇 Muted' : '🔊 Sound FX';
      btnSoundToggle.classList.toggle('text-rose-400', isMuted);
      btnSoundToggle.classList.toggle('text-emerald-400', !isMuted);
    });
  }

  const btnBgmToggle = document.getElementById('btn-toggle-bgm');
  if (btnBgmToggle) {
    btnBgmToggle.addEventListener('click', () => {
      const isPlaying = window.soundManager.toggleBGM();
      btnBgmToggle.innerHTML = isPlaying ? '🎵 Stop BGM' : '🎶 Play 8-Bit BGM';
      btnBgmToggle.classList.toggle('text-pink-400', isPlaying);
    });
  }

  // 8. Quest Drawer Toggle
  const questToggle = document.getElementById('quest-toggle-btn');
  const questDrawer = document.getElementById('quest-drawer');
  if (questToggle && questDrawer) {
    questToggle.addEventListener('click', () => {
      questDrawer.classList.toggle('translate-x-full');
    });
  }

  // 9. Load Backend Stats
  try {
    const statsRes = await fetch('/api/stats');
    if (statsRes.ok) {
      const stats = await statsRes.json();
      const visitorEl = document.getElementById('stat-visitors');
      if (visitorEl) visitorEl.textContent = stats.visitors || 42;
    }
  } catch (e) {
    // optional stat tracking
  }
});
