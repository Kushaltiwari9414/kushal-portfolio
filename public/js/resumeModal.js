// Dynamic Modal Renderer for Skills, Projects, Experience, Contact, and Resume

class ModalManager {
  constructor(resumeData) {
    this.resume = resumeData;
    this.modalOverlay = document.getElementById('modal-overlay');
    this.modalContent = document.getElementById('modal-content');
    this.modalTitle = document.getElementById('modal-title');
    this.modalCategoryBadge = document.getElementById('modal-badge');
    this.modalCloseBtn = document.getElementById('modal-close-btn');

    this.sensorInterval = null;
    this.bindEvents();
  }

  bindEvents() {
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.close());
    }
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.close();
      });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalOverlay.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  open(interactable) {
    if (!this.modalOverlay) return;
    this.modalTitle.textContent = interactable.title || interactable.name;
    this.modalCategoryBadge.textContent = (interactable.category || 'INFO').toUpperCase();

    // Render body based on category and data
    const d = interactable.data || {};
    let html = '';

    if (d.type === 'bio') {
      html = this.renderBio();
    } else if (d.type === 'education') {
      html = this.renderEducation();
    } else if (d.type === 'skills') {
      html = this.renderSkills(d);
    } else if (d.type === 'fundamentals') {
      html = this.renderFundamentals(d);
    } else if (d.type === 'experience') {
      html = this.renderExperience(d.experience);
    } else if (d.type === 'project') {
      html = this.renderProject(d.project);
    } else if (d.type === 'minigame') {
      html = this.renderMiniGameLauncher();
    } else if (d.type === 'achievement' || d.type === 'responsibility') {
      html = this.renderTrophy(d);
    } else if (d.type === 'contact') {
      html = this.renderContactForm();
    } else if (d.type === 'guestbook') {
      html = this.renderGuestbook();
    } else if (d.type === 'full-resume') {
      html = this.renderFullResume();
    } else {
      html = `<div class="p-4 text-slate-300">${interactable.subtitle || 'Details unlocked.'}</div>`;
    }

    this.modalContent.innerHTML = html;
    this.modalOverlay.classList.remove('hidden');

    // Post-mount interactive hooks (e.g. sensor canvas)
    if (d.type === 'project' && d.project.id === 'proj-har') {
      this.initSensorSimulator();
    } else if (d.type === 'project' && d.project.id === 'proj-ollama') {
      this.initOcrSimulator();
    } else if (d.type === 'guestbook') {
      this.loadGuestbookData();
    } else if (d.type === 'contact') {
      this.initContactFormSubmit();
    } else if (d.type === 'minigame') {
      this.initMiniGameInstance();
    }
  }

  close() {
    if (this.sensorInterval) {
      clearInterval(this.sensorInterval);
      this.sensorInterval = null;
    }
    if (window.miniGameInstance) {
      window.miniGameInstance.stop();
    }
    this.modalOverlay.classList.add('hidden');
  }

  renderBio() {
    const b = this.resume.basics;
    return `
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row items-center gap-6 bg-slate-900/80 p-5 rounded-xl border border-sky-500/30">
          <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg shadow-sky-500/20">
            👨‍💻
          </div>
          <div class="space-y-1 text-center md:text-left flex-1">
            <h3 class="text-2xl font-bold text-white">${b.name}</h3>
            <p class="text-sky-400 font-medium">${b.title}</p>
            <p class="text-xs text-slate-400">📍 ${b.location} | 📞 ${b.phone} | ✉️ ${b.email}</p>
            <div class="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              <span class="px-2.5 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">NIT Manipur CSE</span>
              <span class="px-2.5 py-1 text-xs rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">Full-Stack & AI</span>
              <span class="px-2.5 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">SDE Intern @ Khatakhat</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 class="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-2">🎯 Career Objective</h4>
          <p class="text-slate-300 text-sm leading-relaxed">${b.summary}</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <a href="${b.github}" target="_blank" class="flex-1 min-w-[140px] text-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition flex items-center justify-center gap-2 font-medium text-sm">
            <span>🐙</span> GitHub Profile
          </a>
          <a href="${b.linkedin}" target="_blank" class="flex-1 min-w-[140px] text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium text-sm">
            <span>💼</span> LinkedIn Profile
          </a>
          <button onclick="window.modalManager.open({data:{type:'contact'}, title:'Contact Kushal Tiwari', category:'direct'})" class="flex-1 min-w-[140px] text-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium text-sm">
            <span>✉️</span> Hire / Message
          </button>
        </div>
      </div>
    `;
  }

  renderEducation() {
    return `
      <div class="space-y-4">
        <p class="text-sm text-slate-400">Formal academic qualifications, coursework, and engineering milestones.</p>
        ${this.resume.education.map((edu, idx) => `
          <div class="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 transition">
            <div class="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <h4 class="text-lg font-bold text-white">${edu.institution}</h4>
                <p class="text-sky-400 text-sm font-medium">${edu.degree}</p>
              </div>
              <span class="px-3 py-1 bg-indigo-950 text-indigo-300 text-xs font-mono rounded-full border border-indigo-800">${edu.period}</span>
            </div>
            <p class="text-slate-300 text-xs mt-3 leading-relaxed">${edu.details}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSkills(data) {
    return `
      <div class="space-y-5">
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-bold text-white">${data.title}</h4>
          <span class="text-xs text-slate-400 font-mono">Mastery Matrix</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${data.skills.map(s => `
            <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 hover:border-sky-500/40 transition">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-sm font-semibold text-white flex items-center gap-2">
                  <span>${s.icon || '⚡'}</span> ${s.name}
                </span>
                <span class="text-xs text-sky-400 font-mono">${s.level}% (${s.tier || 'Proficient'})</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style="width: ${s.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderFundamentals(data) {
    return `
      <div class="space-y-6">
        <div class="bg-slate-900/80 p-5 rounded-xl border border-pink-500/30">
          <h4 class="text-md font-bold text-pink-400 mb-3 flex items-center gap-2">
            <span>🧠</span> Core CS Engineering Principles
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${data.csFundamentals.map(f => `
              <div class="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-slate-200 text-sm flex items-center gap-2">
                <span class="text-pink-400 font-bold">✔</span> ${f}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-slate-900/80 p-5 rounded-xl border border-cyan-500/30">
          <h4 class="text-md font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <span>🤝</span> Professional & Soft Capabilities
          </h4>
          <div class="flex flex-wrap gap-2">
            ${data.softSkills.map(s => `
              <span class="px-3 py-1.5 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-800 font-medium">
                ⭐ ${s}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderExperience(exp) {
    return `
      <div class="space-y-5">
        <div class="bg-slate-900/90 p-5 rounded-xl border border-blue-500/30">
          <div class="flex justify-between items-start flex-wrap gap-2">
            <div>
              <h3 class="text-xl font-bold text-white">${exp.role}</h3>
              <p class="text-sky-400 text-base font-medium">${exp.company}</p>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 bg-blue-950 text-blue-300 text-xs font-mono rounded-full border border-blue-800">${exp.period}</span>
              <p class="text-xs text-slate-400 mt-1">${exp.type}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Contributions & Engineering Impact:</h4>
            ${exp.highlights.map(h => `
              <div class="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span class="text-sky-400 mt-1">▸</span>
                <span>${h}</span>
              </div>
            `).join('')}
          </div>

          <div class="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <span class="text-slate-400">Quest Title: <strong class="text-white">${exp.questTitle}</strong></span>
            <span class="text-amber-400 font-bold">${exp.reward}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderProject(proj) {
    return `
      <div class="space-y-6">
        <div class="bg-slate-900/90 p-5 rounded-xl border border-sky-500/30">
          <div class="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span class="px-2.5 py-1 bg-sky-500/20 text-sky-300 text-xs rounded-full border border-sky-500/40 font-mono">${proj.badge}</span>
              <h3 class="text-xl font-bold text-white mt-2">${proj.name}</h3>
            </div>
          </div>

          <p class="text-slate-300 text-sm mt-3 leading-relaxed">${proj.description}</p>

          <div class="flex flex-wrap gap-2 mt-4">
            ${proj.tech.map(t => `
              <span class="px-2.5 py-1 bg-slate-800 text-slate-200 text-xs rounded-md border border-slate-700 font-mono">
                ${t}
              </span>
            `).join('')}
          </div>

          <div class="mt-4 pt-4 border-t border-slate-800 space-y-2">
            ${proj.points.map(p => `
              <div class="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>${p}</span>
              </div>
            `).join('')}
          </div>

          <!-- Interactive Simulator Area -->
          <div class="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800" id="project-interactive-area">
            ${proj.id === 'proj-har' ? `
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <h4 class="text-xs font-bold text-sky-400 uppercase tracking-wider">🔬 Real-Time 20Hz Telemetry & Gemini 2.5 Simulator</h4>
                  <span id="har-state-badge" class="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 font-mono">WALKING</span>
                </div>
                <canvas id="har-sensor-canvas" width="460" height="90" class="w-full bg-slate-900 rounded-lg border border-slate-800"></canvas>
                <div class="flex gap-2 flex-wrap text-xs">
                  <button id="sim-walk" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium">Simulate Walking</button>
                  <button id="sim-run" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium">Simulate Running</button>
                  <button id="sim-still" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium">Simulate Stationary</button>
                </div>
                <div class="p-2.5 bg-slate-900/90 rounded border border-slate-800 font-mono text-xs text-slate-300">
                  <span class="text-purple-400">Gemini 2.5 Inference:</span> <span id="har-gemini-output">Activity: Walking (Confidence: 96.4%, Frequency: 1.8Hz cadence)</span>
                </div>
              </div>
            ` : `
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider">📝 Handwritten OCR & AI Marks Engine Simulator</h4>
                  <span class="text-xs text-slate-400 font-mono">Ollama Local LLM</span>
                </div>
                <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
                  <p class="text-slate-400">// Scanned Input Image: <span class="text-slate-200 font-bold">"Student_Answer_Sheet_Q3.jpg"</span></p>
                  <button id="btn-run-ocr" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium">Run OCR & Auto-Evaluation</button>
                  <div id="ocr-result" class="hidden mt-2 pt-2 border-t border-slate-800 space-y-1">
                    <p class="text-sky-300">Extracted Text: "Dijkstra's algorithm finds the shortest path between nodes in a graph with non-negative edge weights using priority queues..."</p>
                    <p class="text-amber-400 font-bold">Grade: 9.5 / 10 | Criterion: Complete algorithmic correctness and optimal time complexity O((V+E)log V).</p>
                  </div>
                </div>
              </div>
            `}
          </div>

          <!-- Project Links -->
          <div class="flex flex-wrap gap-3 mt-5">
            <a href="${proj.liveDemo}" target="_blank" class="flex-1 min-w-[150px] text-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm">
              <span>🚀</span> Launch Live Demo
            </a>
            <a href="${proj.github}" target="_blank" class="flex-1 min-w-[150px] text-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-700 transition flex items-center justify-center gap-2 text-sm">
              <span>🐙</span> View GitHub Code
            </a>
          </div>
        </div>
      </div>
    `;
  }

  initSensorSimulator() {
    const canvas = document.getElementById('har-sensor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const badge = document.getElementById('har-state-badge');
    const output = document.getElementById('har-gemini-output');

    let mode = 'walking';
    let t = 0;
    const waveData = [];

    const updateWave = () => {
      t += 0.1;
      let amp = mode === 'running' ? 24 : (mode === 'walking' ? 12 : 2);
      let freq = mode === 'running' ? 0.35 : (mode === 'walking' ? 0.18 : 0.05);

      const val = Math.sin(t * freq * 10) * amp + (Math.random() - 0.5) * (mode === 'still' ? 1 : 4);
      waveData.push(val);
      if (waveData.length > canvas.width) waveData.shift();

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const mid = canvas.height / 2;
      for (let i = 0; i < waveData.length; i++) {
        const x = i;
        const y = mid + waveData[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    this.sensorInterval = setInterval(updateWave, 50);

    const btnWalk = document.getElementById('sim-walk');
    const btnRun = document.getElementById('sim-run');
    const btnStill = document.getElementById('sim-still');

    if (btnWalk) btnWalk.onclick = () => {
      mode = 'walking';
      badge.textContent = 'WALKING';
      badge.className = 'px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 font-mono';
      output.textContent = 'Activity: Walking (Confidence: 96.4%, Frequency: 1.8Hz cadence)';
    };
    if (btnRun) btnRun.onclick = () => {
      mode = 'running';
      badge.textContent = 'RUNNING';
      badge.className = 'px-2 py-0.5 text-xs bg-rose-500/20 text-rose-400 rounded border border-rose-500/30 font-mono';
      output.textContent = 'Activity: High-Intensity Sprint / Running (Confidence: 98.7%, Frequency: 3.2Hz cadence)';
    };
    if (btnStill) btnStill.onclick = () => {
      mode = 'still';
      badge.textContent = 'STATIONARY';
      badge.className = 'px-2 py-0.5 text-xs bg-slate-500/20 text-slate-300 rounded border border-slate-500/30 font-mono';
      output.textContent = 'Activity: Resting / Device Stationary (Confidence: 99.2%, Sensor delta < 0.05g)';
    };
  }

  initOcrSimulator() {
    const btn = document.getElementById('btn-run-ocr');
    const res = document.getElementById('ocr-result');
    if (!btn || !res) return;
    btn.onclick = () => {
      btn.textContent = 'Analyzing with Ollama LLM...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Evaluation Complete! ✔';
        res.classList.remove('hidden');
        if (window.soundManager) window.soundManager.playCoin();
      }, 700);
    };
  }

  renderTrophy(data) {
    if (data.type === 'achievement') {
      const ach = data.achievement;
      return `
        <div class="text-center p-6 bg-slate-900/90 rounded-xl border border-sky-500/30 space-y-4">
          <div class="text-6xl animate-bounce">${ach.icon || '📜'}</div>
          <h3 class="text-2xl font-bold text-white">${ach.title}</h3>
          <p class="text-sky-300 text-sm max-w-md mx-auto">${ach.desc}</p>
          <div class="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 max-w-sm mx-auto">
            Badge: <strong class="text-sky-400">${ach.title}</strong>
          </div>
        </div>
      `;
    }

    const resp = data.responsibility;
    const extraAch = data.achievements || [];
    return `
      <div class="space-y-5">
        <div class="bg-slate-900/90 p-5 rounded-xl border border-amber-500/30">
          <h3 class="text-xl font-bold text-white">${resp.role}</h3>
          <p class="text-amber-400 text-sm font-medium">${resp.event} — ${resp.organization}</p>
          <div class="mt-4 space-y-2">
            ${resp.points.map(p => `
              <div class="flex items-start gap-2 text-sm text-slate-300">
                <span class="text-amber-400 font-bold">⚡</span>
                <span>${p}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-slate-900/90 p-5 rounded-xl border border-slate-800">
          <h4 class="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3">Honors & Certifications</h4>
          <div class="space-y-2">
            ${extraAch.map(a => `
              <div class="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
                <span class="text-2xl">${a.icon}</span>
                <div>
                  <h5 class="text-xs font-bold text-white">${a.title}</h5>
                  <p class="text-xs text-slate-400">${a.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderMiniGameLauncher() {
    return `
      <div class="space-y-4 text-center">
        <div class="flex justify-between items-center bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <div class="text-left">
            <h4 class="font-bold text-white text-base">Bug Hunter: Algo Runner</h4>
            <p class="text-xs text-slate-400">Use <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-400 font-mono">←</kbd> and <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-400 font-mono">→</kbd> keys or touch drag to move catcher!</p>
          </div>
          <button id="minigame-restart-btn" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold">Restart Game</button>
        </div>

        <div class="relative mx-auto flex justify-center">
          <canvas id="arcade-mini-canvas" width="480" height="380" class="rounded-xl border-2 border-rose-500/50 shadow-2xl max-w-full bg-slate-950"></canvas>
        </div>

        <div class="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-400 flex justify-around">
          <span>💎 Catch: <strong>DSA Gems (+50)</strong></span>
          <span>✨ Gemini: <strong>(+100)</strong></span>
          <span>🐛 Avoid: <strong>NullPtr / Bugs (-HP)</strong></span>
        </div>
      </div>
    `;
  }

  initMiniGameInstance() {
    window.miniGameInstance = new window.MiniGame('arcade-mini-canvas', (finalScore) => {
      // Auto prompt guestbook with score
      const name = prompt(`Great game! Your score is ${finalScore}. Enter your name for the Leaderboard:`, 'Visitor');
      if (name) {
        fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, score: finalScore, comment: 'Bug Hunter Champion!' })
        }).then(() => {
          alert('Score posted to global leaderboard! Check the Leaderboard Terminal.');
        });
      }
    });
    window.miniGameInstance.start();

    const restartBtn = document.getElementById('minigame-restart-btn');
    if (restartBtn) {
      restartBtn.onclick = () => window.miniGameInstance.start();
    }
  }

  renderContactForm() {
    return `
      <div class="space-y-5">
        <p class="text-sm text-slate-300">Send an instant transmission directly to Kushal's backend inbox or use direct channels below.</p>

        <form id="contact-form" class="space-y-3.5 bg-slate-900/90 p-5 rounded-xl border border-sky-500/30">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Your Name *</label>
            <input type="text" id="contact-name" required placeholder="e.g. John Doe / Tech Recruiter" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Your Email *</label>
            <input type="email" id="contact-email" required placeholder="recruiter@company.com" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Company / Team (Optional)</label>
            <input type="text" id="contact-company" placeholder="e.g. Google, Microsoft, Startup" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Message / Opportunity *</label>
            <textarea id="contact-message" required rows="3" placeholder="Hello Kushal, we would love to connect with you regarding a software engineering opportunity..." class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"></textarea>
          </div>

          <button type="submit" id="btn-submit-contact" class="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-lg shadow-sky-600/30 transition flex items-center justify-center gap-2 text-sm">
            <span>📡</span> Transmit Message to Kushal
          </button>
          <div id="contact-feedback" class="hidden text-center text-xs font-medium py-2 rounded"></div>
        </form>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a href="mailto:kushalsharma9414@gmail.com" class="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2">
            <span>✉️</span> kushalsharma9414@gmail.com
          </a>
          <a href="tel:+919256455186" class="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2">
            <span>📞</span> +91-9256455186
          </a>
        </div>
      </div>
    `;
  }

  initContactFormSubmit() {
    const form = document.getElementById('contact-form');
    const fb = document.getElementById('contact-feedback');
    const btn = document.getElementById('btn-submit-contact');
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      btn.disabled = true;
      btn.innerHTML = `<span>⏳</span> Transmitting...`;

      const payload = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        company: document.getElementById('contact-company').value,
        message: document.getElementById('contact-message').value
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          fb.className = 'text-center text-xs font-medium py-2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
          fb.textContent = '✔ ' + (data.message || 'Transmission successfully received!');
          fb.classList.remove('hidden');
          form.reset();
          if (window.soundManager) window.soundManager.playCoin();
        } else {
          throw new Error(data.error || 'Failed to send');
        }
      } catch (err) {
        fb.className = 'text-center text-xs font-medium py-2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40';
        fb.textContent = '❌ Error: ' + err.message;
        fb.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>📡</span> Transmit Message to Kushal`;
      }
    };
  }

  renderGuestbook() {
    return `
      <div class="space-y-5">
        <div class="flex justify-between items-center">
          <h4 class="text-base font-bold text-white">Global Leaderboard & Visitor Signatures</h4>
          <button id="btn-open-sign-modal" class="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition">✍️ Sign Guestbook</button>
        </div>

        <div id="guestbook-list" class="space-y-2 max-h-72 overflow-y-auto pr-1">
          <div class="p-4 text-center text-slate-400 text-xs">Loading leaderboard from backend...</div>
        </div>
      </div>
    `;
  }

  async loadGuestbookData() {
    const list = document.getElementById('guestbook-list');
    const signBtn = document.getElementById('btn-open-sign-modal');
    if (signBtn) {
      signBtn.onclick = async () => {
        const name = prompt('Enter your name / handle:');
        if (!name) return;
        const comment = prompt('Enter a short note or shoutout:');
        await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, score: Math.floor(Math.random() * 500) + 700, comment })
        });
        this.loadGuestbookData();
      };
    }

    try {
      const res = await fetch('/api/guestbook');
      const data = await res.json();
      if (!list) return;

      if (!data || data.length === 0) {
        list.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs">No entries yet. Be the first to sign!</div>`;
        return;
      }

      list.innerHTML = data.map((entry, idx) => `
        <div class="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-full ${idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-slate-400 text-black' : 'bg-slate-800 text-slate-300'} text-xs font-bold flex items-center justify-center font-mono">
              ${idx + 1}
            </span>
            <div>
              <h5 class="text-xs font-bold text-white">${entry.name}</h5>
              <p class="text-xs text-slate-400">${entry.comment || 'Visited portfolio'}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono font-bold text-pink-400">${entry.score || 0} PTS</span>
            <p class="text-[10px] text-slate-500">${entry.date || 'Recent'}</p>
          </div>
        </div>
      `).join('');
    } catch (e) {
      if (list) list.innerHTML = `<div class="p-4 text-center text-rose-400 text-xs">Failed to connect to backend API.</div>`;
    }
  }

  renderFullResume() {
    const b = this.resume.basics;
    const skills = this.resume.skills;
    return `
      <div class="space-y-6 printable-resume text-slate-800 bg-white p-6 md:p-8 rounded-xl shadow-2xl">
        <!-- Resume Actions -->
        <div class="flex justify-between items-center pb-4 border-b border-slate-200 no-print">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Official Curriculum Vitae</span>
          <div class="flex gap-2">
            <button onclick="window.print()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition">
              <span>🖨️</span> Print / Save PDF
            </button>
          </div>
        </div>

        <!-- Header -->
        <div class="text-center space-y-1">
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">${b.name}</h1>
          <p class="text-xs text-slate-600">${b.location} | ${b.phone} | ${b.email}</p>
          <p class="text-xs text-indigo-600 font-semibold space-x-2">
            <a href="${b.github}" target="_blank" class="hover:underline">GitHub</a> •
            <a href="${b.linkedin}" target="_blank" class="hover:underline">LinkedIn</a>
          </p>
        </div>

        <!-- Career Objective -->
        <div class="space-y-1">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Career Objective</h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${b.summary}</p>
        </div>

        <!-- Education -->
        <div class="space-y-2">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Education</h2>
          ${this.resume.education.map(edu => `
            <div class="flex justify-between items-start text-xs">
              <div>
                <p class="font-bold text-slate-900">${edu.institution}</p>
                <p class="text-slate-700 italic">${edu.degree}</p>
              </div>
              <span class="font-mono text-slate-600">${edu.period}</span>
            </div>
          `).join('')}
        </div>

        <!-- Technical Skills -->
        <div class="space-y-1 text-xs">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Technical Skills</h2>
          <p><strong class="text-slate-900">Programming Languages:</strong> ${skills.languages.map(l => l.name).join(', ')}</p>
          <p><strong class="text-slate-900">Frameworks & Libraries:</strong> ${skills.frameworks.map(f => f.name).join(', ')}</p>
          <p><strong class="text-slate-900">Tools & Platforms:</strong> ${skills.aiAndTools.map(t => t.name).join(', ')}</p>
          <p><strong class="text-slate-900">Databases:</strong> ${skills.backendAndDatabases.map(d => d.name).join(', ')}</p>
          <p><strong class="text-slate-900">CS Fundamentals:</strong> ${skills.csFundamentals.join(', ')}</p>
          <p><strong class="text-slate-900">Soft Skills:</strong> ${skills.softSkills.join(', ')}</p>
        </div>

        <!-- Experience -->
        <div class="space-y-2.5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Experience</h2>
          ${this.resume.experience.map(exp => `
            <div class="space-y-1 text-xs">
              <div class="flex justify-between items-baseline font-bold text-slate-900">
                <span>${exp.company}</span>
                <span class="font-mono font-normal text-slate-600">${exp.period}</span>
              </div>
              <div class="flex justify-between items-baseline italic text-slate-700">
                <span>${exp.role}</span>
                <span class="font-normal">${exp.type}</span>
              </div>
              <ul class="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <!-- Projects -->
        <div class="space-y-2.5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Projects</h2>
          ${this.resume.projects.map(proj => `
            <div class="space-y-1 text-xs">
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${proj.name}</span>
                <span class="text-slate-600 italic text-[11px]">${proj.tech.join(', ')}</span>
              </div>
              <ul class="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                ${proj.points.map(pt => `<li>${pt}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <!-- Positions of Responsibility & Achievements -->
        <div class="space-y-2">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Achievements & Leadership</h2>
          <ul class="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
            ${this.resume.achievements.map(a => `<li><strong class="text-slate-900">${a.title}:</strong> ${a.desc}</li>`).join('')}
            ${this.resume.positionsOfResponsibility.map(r => `<li><strong class="text-slate-900">${r.event}:</strong> ${r.points.join(' ')}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}

window.ModalManager = ModalManager;
