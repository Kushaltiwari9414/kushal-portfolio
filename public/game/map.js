// Map World — Zones with thick neon borders, wall colliders, walkways, gates, and mini-map

class GameMap {
  constructor(resumeData) {
    this.resume = resumeData;
    this.width = 1800;
    this.height = 1450;
    this.tileSize = 32;
    this.colliders = [];
    this.interactables = [];
    this.decorations = [];
    this.wallThickness = 16;

    // Zone definitions (x, y, w, h, label, color, number)
    this.zones = [
      { x: 100, y: 80,   w: 500, h: 360, label: '🏰 ZONE 1: SPAWN & ACADEMICS',            color: '#38bdf8', num: 1, floorTint: 'rgba(56,189,248,0.04)' },
      { x: 860, y: 80,   w: 750, h: 360, label: '⚡ ZONE 2: TECH SANCTUM & SKILL FORGE',    color: '#f59e0b', num: 2, floorTint: 'rgba(245,158,11,0.04)' },
      { x: 100, y: 550,  w: 550, h: 340, label: '💼 ZONE 3: WORK EXPERIENCE GUILDHALL',     color: '#3b82f6', num: 3, floorTint: 'rgba(59,130,246,0.04)' },
      { x: 860, y: 550,  w: 750, h: 340, label: '🚀 ZONE 4: PROJECT LABS & ARCADE',         color: '#10b981', num: 4, floorTint: 'rgba(16,185,129,0.04)' },
      { x: 100, y: 1000, w: 550, h: 320, label: '🏆 ZONE 5: HALL OF FAME & HACKATHONS',     color: '#fbbf24', num: 5, floorTint: 'rgba(251,191,36,0.04)' },
      { x: 860, y: 1000, w: 750, h: 320, label: '📡 ZONE 6: CONTACT EMBASSY & RESUME',      color: '#a855f7', num: 6, floorTint: 'rgba(168,85,247,0.04)' }
    ];

    // Walkway definitions: { x, y, w, h, dir }
    this.walkways = [
      { x: 600,  y: 240, w: 260, h: 48, dir: 'right', from: 1, to: 2 },
      { x: 340,  y: 440, w: 48,  h: 110, dir: 'down',  from: 1, to: 3 },
      { x: 650,  y: 700, w: 210, h: 48, dir: 'right', from: 3, to: 4 },
      { x: 1220, y: 440, w: 48,  h: 110, dir: 'down',  from: 2, to: 4 },
      { x: 340,  y: 890, w: 48,  h: 110, dir: 'down',  from: 3, to: 5 },
      { x: 650,  y: 1140, w: 210, h: 48, dir: 'right', from: 5, to: 6 },
      { x: 1220, y: 890, w: 48,  h: 110, dir: 'down',  from: 4, to: 6 }
    ];

    this.initWorld();
  }

  initWorld() {
    const T = this.wallThickness;

    // ─── Build zone wall colliders with gaps for walkways ───
    this.zones.forEach(zone => {
      const { x, y, w, h } = zone;
      // Find walkway openings that touch this zone
      const openings = this._getOpeningsForZone(zone);

      // Top wall
      this._addWallSegments(x, y, w, T, 'horizontal', openings);
      // Bottom wall
      this._addWallSegments(x, y + h - T, w, T, 'horizontal', openings);
      // Left wall
      this._addWallSegments(x, y, T, h, 'vertical', openings);
      // Right wall
      this._addWallSegments(x + w - T, y, T, h, 'vertical', openings);
    });

    // Walkway side-rail colliders (thin walls on each side of walkways)
    this.walkways.forEach(wk => {
      if (wk.dir === 'right' || wk.dir === 'left') {
        // Horizontal walkway: rails on top and bottom
        this.colliders.push({ x: wk.x, y: wk.y - 6, width: wk.w, height: 6 });
        this.colliders.push({ x: wk.x, y: wk.y + wk.h, width: wk.w, height: 6 });
      } else {
        // Vertical walkway: rails on left and right
        this.colliders.push({ x: wk.x - 6, y: wk.y, width: 6, height: wk.h });
        this.colliders.push({ x: wk.x + wk.w, y: wk.y, width: 6, height: wk.h });
      }
    });

    // ─── Interactables (all positions unchanged) ───

    // Zone 1: Spawn & Hero Citadel
    this.interactables.push(new InteractableObject({
      id: 'obj-guide', name: 'Guide Master', x: 320, y: 200, category: 'npc',
      color: '#38bdf8', title: 'Kushal Tiwari - Full-Stack & AI Engineer',
      subtitle: 'Final-Year B.Tech CSE @ NIT Manipur',
      data: {
        type: 'bio', name: 'Kushal Tiwari', location: 'Dausa, Rajasthan | NIT Manipur',
        objective: this.resume.basics.summary, phone: this.resume.basics.phone,
        email: this.resume.basics.email, github: this.resume.basics.github,
        linkedin: this.resume.basics.linkedin
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-education', name: 'NIT Manipur Monument', x: 180, y: 280,
      category: 'skill', icon: '🎓', color: '#6366f1',
      title: 'Academic Journey & Foundations', subtitle: 'NIT Manipur & Rajasthan Board',
      data: { type: 'education', list: this.resume.education }
    }));

    // Zone 2: Tech Altar & Skill Tree
    this.interactables.push(new InteractableObject({
      id: 'obj-skill-languages', name: 'Languages Sanctum', x: 950, y: 160,
      category: 'skill', icon: '☕', color: '#f59e0b',
      title: 'Programming Languages', subtitle: 'Java, Python, C, JavaScript, HTML5/CSS3',
      data: { type: 'skills', title: 'Core Programming Languages', skills: this.resume.skills.languages, category: 'languages' }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-frameworks', name: 'Web & UI Foundry', x: 1150, y: 160,
      category: 'skill', icon: '⚛️', color: '#06b6d4',
      title: 'Frontend & UI Frameworks', subtitle: 'React.js, Tailwind CSS, Recharts, Bootstrap',
      data: { type: 'skills', title: 'Frontend & Web Libraries', skills: this.resume.skills.frameworks, category: 'frameworks' }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-backend', name: 'Database & Backend Vault', x: 1350, y: 160,
      category: 'skill', icon: '🗄️', color: '#10b981',
      title: 'Backend & Data Systems', subtitle: 'SQL, PostgreSQL, MongoDB, Node.js, Oracle',
      data: { type: 'skills', title: 'Databases & Backend Architecture', skills: this.resume.skills.backendAndDatabases, category: 'backend' }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-ai', name: 'AI & GenAI Shrine', x: 1050, y: 300,
      category: 'skill', icon: '✨', color: '#a855f7',
      title: 'GenAI & Cloud Tools', subtitle: 'Google Gemini 2.5 API, REST APIs, Git, Linux',
      data: { type: 'skills', title: 'Artificial Intelligence & Development Tools', skills: this.resume.skills.aiAndTools, fundamentals: this.resume.skills.csFundamentals, category: 'ai' }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-cs', name: 'CS Core Monolith', x: 1250, y: 300,
      category: 'skill', icon: '🧠', color: '#ec4899',
      title: 'Computer Science Fundamentals', subtitle: 'DSA (Java), OOPS, CN, Operating Systems',
      data: { type: 'fundamentals', title: 'Core CS Foundations & Problem Solving', csFundamentals: this.resume.skills.csFundamentals, softSkills: this.resume.skills.softSkills }
    }));

    // Zone 3: Experience Guildhall
    this.interactables.push(new InteractableObject({
      id: 'obj-exp-khatakhat', name: 'Khatakhat Logistics', x: 200, y: 650,
      category: 'experience', icon: '🚚', color: '#3b82f6',
      title: 'Software Development Engineer Intern', subtitle: 'Khatakhat Logistics Pvt. Ltd. (May 2026 – June 2026)',
      data: { type: 'experience', experience: this.resume.experience[0] }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-exp-learntricks', name: 'Learntricks Guild', x: 400, y: 650,
      category: 'experience', icon: '🚀', color: '#8b5cf6',
      title: 'Web Development Intern', subtitle: 'Learntricks (May 2025 – June 2025)',
      data: { type: 'experience', experience: this.resume.experience[1] }
    }));

    // Zone 4: Project Research Labs & Arcade
    this.interactables.push(new InteractableObject({
      id: 'obj-proj-har', name: 'HAR Engine Console', x: 960, y: 650,
      category: 'project', icon: '📱', color: '#38bdf8',
      title: 'Real-Time Human Activity Recognition Engine', subtitle: 'React.js, Gemini 2.5 API, DeviceMotion 20Hz Telemetry',
      data: { type: 'project', project: this.resume.projects[0] }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-proj-ollama', name: 'Ollama Script Terminal', x: 1180, y: 650,
      category: 'project', icon: '📝', color: '#10b981',
      title: 'Ollama Answer Script Evaluator', subtitle: 'Python, React, Handwritten OCR, Automated Grading',
      data: { type: 'project', project: this.resume.projects[1] }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-arcade-game', name: 'Bug Hunter Arcade', x: 1390, y: 650,
      category: 'arcade', icon: '👾', color: '#f43f5e',
      title: 'Bug Hunter: Algo Runner Mini-Game', subtitle: 'Catch Algorithms, Dodge Bugs, Submit High Score!',
      data: { type: 'minigame' }
    }));

    // Zone 5: Trophy Room & Hall of Fame
    this.interactables.push(new InteractableObject({
      id: 'obj-trophy-cdac', name: 'CDAC Open Source Monument', x: 200, y: 1100,
      category: 'trophy', icon: '📜', color: '#38bdf8',
      title: 'CDAC Open Source Development', subtitle: 'Open Source Software Development Program',
      data: { type: 'achievement', achievement: this.resume.achievements[0] }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-trophy-regen', name: 'RE GEN Hackathons Altar', x: 380, y: 1100,
      category: 'trophy', icon: '⚡', color: '#f59e0b',
      title: 'RE GEN 25 & 2.0 Organizing Committee', subtitle: 'NIT Manipur (200+ participants)',
      data: { type: 'responsibility', responsibility: this.resume.positionsOfResponsibility[0], achievements: this.resume.achievements.slice(1) }
    }));

    // Zone 6: Contact & Quest Complete Embassy
    this.interactables.push(new InteractableObject({
      id: 'obj-terminal-contact', name: 'Transceiver Terminal', x: 1000, y: 1100,
      category: 'terminal', icon: '📡', color: '#38bdf8',
      title: 'Direct Recruiter Transceiver', subtitle: 'Send message to Kushal + Backend Storage',
      data: { type: 'contact' }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-terminal-resume', name: 'Holographic Resume Portal', x: 1220, y: 1100,
      category: 'terminal', icon: '📜', color: '#a855f7',
      title: 'Full ATS Resume & PDF Print', subtitle: 'Instant view, export, and complete credential summary',
      data: { type: 'full-resume' }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-terminal-guestbook', name: 'Leaderboard & Guestbook', x: 1420, y: 1100,
      category: 'terminal', icon: '⭐', color: '#ec4899',
      title: 'Visitor Hall & Global High Scores', subtitle: 'Sign your name and see the top players',
      data: { type: 'guestbook' }
    }));

    // Add interactable body colliders
    this.interactables.forEach(item => {
      this.colliders.push({
        x: item.x + 4, y: item.y + 10,
        width: item.width - 8, height: item.height - 10
      });
    });

    // ─── Zone Energy Gates / Round Progression Barriers ───
    this.gates = [
      { id: 'gate-1', zoneUnlock: 2, roundNeeded: 1, x: 710, y: 236, width: 36, height: 56, orientation: 'vertical', label: 'ZONE 2 BARRIER (Round 1 Required)', locked: true },
      { id: 'gate-2', zoneUnlock: 3, roundNeeded: 2, x: 336, y: 490, width: 56, height: 36, orientation: 'horizontal', label: 'ZONE 3 BARRIER (Round 2 Required)', locked: true },
      { id: 'gate-3', zoneUnlock: 4, roundNeeded: 3, x: 735, y: 696, width: 36, height: 56, orientation: 'vertical', label: 'ZONE 4 BARRIER (Round 3 Required)', locked: true },
      { id: 'gate-3-shortcut', zoneUnlock: 4, roundNeeded: 3, x: 1216, y: 490, width: 56, height: 36, orientation: 'horizontal', label: 'ZONE 4 BARRIER (Round 3 Required)', locked: true },
      { id: 'gate-4', zoneUnlock: 5, roundNeeded: 4, x: 336, y: 940, width: 56, height: 36, orientation: 'horizontal', label: 'ZONE 5 BARRIER (Round 4 Required)', locked: true },
      { id: 'gate-5', zoneUnlock: 6, roundNeeded: 5, x: 735, y: 1136, width: 36, height: 56, orientation: 'vertical', label: 'ZONE 6 BARRIER (Round 5 Required)', locked: true },
      { id: 'gate-5-shortcut', zoneUnlock: 6, roundNeeded: 5, x: 1216, y: 940, width: 56, height: 36, orientation: 'horizontal', label: 'ZONE 6 BARRIER (Round 5 Required)', locked: true }
    ];
  }

  // ─── Helper: find openings in a zone edge where walkways connect ───
  _getOpeningsForZone(zone) {
    const openings = [];
    const zx = zone.x, zy = zone.y, zw = zone.w, zh = zone.h;

    this.walkways.forEach(wk => {
      // Does this walkway touch a zone edge?
      if (wk.dir === 'right' || wk.dir === 'left') {
        // Horizontal walkway
        // Touches right edge of zone?
        if (Math.abs(wk.x - (zx + zw)) < 20 && wk.y >= zy && wk.y + wk.h <= zy + zh) {
          openings.push({ edge: 'right', start: wk.y, end: wk.y + wk.h });
        }
        // Touches left edge of zone?
        if (Math.abs((wk.x + wk.w) - zx) < 20 && wk.y >= zy && wk.y + wk.h <= zy + zh) {
          openings.push({ edge: 'left', start: wk.y, end: wk.y + wk.h });
        }
      } else {
        // Vertical walkway
        // Touches bottom edge of zone?
        if (Math.abs(wk.y - (zy + zh)) < 20 && wk.x >= zx && wk.x + wk.w <= zx + zw) {
          openings.push({ edge: 'bottom', start: wk.x, end: wk.x + wk.w });
        }
        // Touches top edge of zone?
        if (Math.abs((wk.y + wk.h) - zy) < 20 && wk.x >= zx && wk.x + wk.w <= zx + zw) {
          openings.push({ edge: 'top', start: wk.x, end: wk.x + wk.w });
        }
      }
    });
    return openings;
  }

  // ─── Helper: add wall segments with gaps for openings ───
  _addWallSegments(wx, wy, ww, wh, orientation, openings) {
    const T = this.wallThickness;

    if (orientation === 'horizontal') {
      // Wall runs along X axis
      const wallY = wy;
      const isTop = true; // could be top or bottom
      const relevantOpenings = openings.filter(o => {
        if (o.edge === 'top' || o.edge === 'bottom') {
          // Check if this horizontal wall is at the opening's Y range
          return Math.abs(wallY - (o.edge === 'top' ? wy : wy)) < T + 5;
        }
        return false;
      });

      // For horizontal walls, openings are vertical walkways cutting through
      const gaps = [];
      openings.forEach(o => {
        if ((o.edge === 'top' || o.edge === 'bottom') && wallY >= wy - T && wallY <= wy + T) {
          // This vertical opening cuts this horizontal wall
          gaps.push({ start: o.start - 4, end: o.end + 4 });
        }
      });

      if (gaps.length === 0) {
        this.colliders.push({ x: wx, y: wy, width: ww, height: wh });
      } else {
        // Sort gaps and create segments between them
        gaps.sort((a, b) => a.start - b.start);
        let cursor = wx;
        gaps.forEach(gap => {
          if (gap.start > cursor) {
            this.colliders.push({ x: cursor, y: wy, width: gap.start - cursor, height: wh });
          }
          cursor = gap.end;
        });
        if (cursor < wx + ww) {
          this.colliders.push({ x: cursor, y: wy, width: (wx + ww) - cursor, height: wh });
        }
      }
    } else {
      // Vertical wall runs along Y axis
      const gaps = [];
      openings.forEach(o => {
        if ((o.edge === 'left' || o.edge === 'right') && wx >= this.zones[0].x - T * 2) {
          // This horizontal opening cuts this vertical wall
          gaps.push({ start: o.start - 4, end: o.end + 4 });
        }
      });

      if (gaps.length === 0) {
        this.colliders.push({ x: wx, y: wy, width: ww, height: wh });
      } else {
        gaps.sort((a, b) => a.start - b.start);
        let cursor = wy;
        gaps.forEach(gap => {
          if (gap.start > cursor) {
            this.colliders.push({ x: wx, y: cursor, width: ww, height: gap.start - cursor });
          }
          cursor = gap.end;
        });
        if (cursor < wy + wh) {
          this.colliders.push({ x: wx, y: cursor, width: ww, height: (wy + wh) - cursor });
        }
      }
    }
  }

  unlockZone(zoneNumber) {
    this.gates.forEach(g => {
      if (g.zoneUnlock <= zoneNumber) {
        g.locked = false;
      }
    });
  }

  getCollidingGate(x, y, width, height) {
    for (const g of this.gates) {
      if (g.locked && x < g.x + g.width && x + width > g.x && y < g.y + g.height && y + height > g.y) {
        return g;
      }
    }
    return null;
  }

  isColliding(x, y, width, height) {
    for (const c of this.colliders) {
      if (x < c.x + c.width && x + width > c.x && y < c.y + c.height && y + height > c.y) {
        return true;
      }
    }
    if (this.getCollidingGate(x, y, width, height)) {
      return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════
  //  DRAW — Main rendering pipeline
  // ═══════════════════════════════════════════════════
  draw(ctx, camera) {
    ctx.save();
    const time = performance.now() * 0.001;

    // 1. Dark void background
    ctx.fillStyle = '#050810';
    ctx.fillRect(0 - camera.x, 0 - camera.y, this.width, this.height);

    // 2. Subtle grid
    ctx.strokeStyle = 'rgba(20, 30, 50, 0.5)';
    ctx.lineWidth = 1;
    const ts = this.tileSize;
    const startCol = Math.floor(camera.x / ts) * ts;
    const endCol = Math.min(this.width, camera.x + camera.viewportWidth + ts);
    const startRow = Math.floor(camera.y / ts) * ts;
    const endRow = Math.min(this.height, camera.y + camera.viewportHeight + ts);
    for (let x = startCol; x <= endCol; x += ts) {
      ctx.beginPath();
      ctx.moveTo(x - camera.x, Math.max(0, startRow) - camera.y);
      ctx.lineTo(x - camera.x, Math.min(this.height, endRow) - camera.y);
      ctx.stroke();
    }
    for (let y = startRow; y <= endRow; y += ts) {
      ctx.beginPath();
      ctx.moveTo(Math.max(0, startCol) - camera.x, y - camera.y);
      ctx.lineTo(Math.min(this.width, endCol) - camera.x, y - camera.y);
      ctx.stroke();
    }

    // 3. Draw zone platforms with enhanced borders
    this.zones.forEach(zone => this._drawZone(ctx, camera, zone, time));

    // 4. Draw walkway corridors
    this.walkways.forEach(wk => this._drawWalkway(ctx, camera, wk, time));

    // 5. Draw energy gates on top
    this._drawGates(ctx, camera, time);

    ctx.restore();
  }

  // ─── Enhanced Zone Drawing ───
  _drawZone(ctx, camera, zone, time) {
    const { x, y, w, h, label, color, num, floorTint } = zone;
    const sx = x - camera.x;
    const sy = y - camera.y;
    const T = this.wallThickness;
    const pulse = Math.sin(time * 2 + num) * 0.3 + 0.7;

    ctx.save();

    // ── Floor fill with subtle zone tint ──
    ctx.fillStyle = '#0c1120';
    ctx.fillRect(sx, sy, w, h);

    // Zone-specific tinted floor
    ctx.fillStyle = floorTint;
    ctx.fillRect(sx, sy, w, h);

    // ── Circuit / hex pattern inside zone ──
    ctx.strokeStyle = `rgba(${this._hexToRgb(color)}, 0.06)`;
    ctx.lineWidth = 1;
    const spacing = 48;
    for (let gx = x + T; gx < x + w - T; gx += spacing) {
      ctx.beginPath();
      ctx.moveTo(gx - camera.x, sy + T);
      ctx.lineTo(gx - camera.x, sy + h - T);
      ctx.stroke();
    }
    for (let gy = y + T; gy < y + h - T; gy += spacing) {
      ctx.beginPath();
      ctx.moveTo(sx + T, gy - camera.y);
      ctx.lineTo(sx + w - T, gy - camera.y);
      ctx.stroke();
    }

    // ── Thick glowing border walls ──
    // Get openings for this zone to skip border drawing there
    const openings = this._getOpeningsForZone(zone);

    // Draw each wall edge
    this._drawBorderEdge(ctx, camera, x, y, w, T, 'top', color, pulse, openings);
    this._drawBorderEdge(ctx, camera, x, y + h - T, w, T, 'bottom', color, pulse, openings);
    this._drawBorderEdge(ctx, camera, x, y, T, h, 'left', color, pulse, openings);
    this._drawBorderEdge(ctx, camera, x + w - T, y, T, h, 'right', color, pulse, openings);

    // ── Corner brackets (sci-fi HUD anchors) ──
    const bracketLen = 30;
    const bracketW = 3;
    ctx.strokeStyle = color;
    ctx.lineWidth = bracketW;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(sx + bracketLen, sy); ctx.lineTo(sx, sy); ctx.lineTo(sx, sy + bracketLen);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(sx + w - bracketLen, sy); ctx.lineTo(sx + w, sy); ctx.lineTo(sx + w, sy + bracketLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(sx + bracketLen, sy + h); ctx.lineTo(sx, sy + h); ctx.lineTo(sx, sy + h - bracketLen);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(sx + w - bracketLen, sy + h); ctx.lineTo(sx + w, sy + h); ctx.lineTo(sx + w, sy + h - bracketLen);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // ── Zone number badge in top-left corner ──
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.15;
    ctx.font = 'bold 120px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(num.toString(), sx + w / 2, sy + h / 2 + 40);
    ctx.globalAlpha = 1;

    // ── Banner label at the top ──
    const bannerW = Math.min(w - 40, 460);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.roundRect(sx + (w - bannerW) / 2, sy + 18, bannerW, 28, 6);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#0a0f1c';
    ctx.font = 'bold 11px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, sx + w / 2, sy + 36);

    ctx.restore();
  }

  // ─── Draw a single border edge with gap for openings ───
  _drawBorderEdge(ctx, camera, wx, wy, ww, wh, edge, color, pulse, openings) {
    const sx = wx - camera.x;
    const sy = wy - camera.y;
    const rgb = this._hexToRgb(color);

    // Find gaps (walkway openings) on this edge
    const gaps = [];
    openings.forEach(o => {
      if (edge === 'top' && o.edge === 'top') {
        gaps.push({ start: o.start - wx - 4, end: o.end - wx + 4 });
      } else if (edge === 'bottom' && o.edge === 'bottom') {
        gaps.push({ start: o.start - wx - 4, end: o.end - wx + 4 });
      } else if (edge === 'left' && o.edge === 'left') {
        gaps.push({ start: o.start - wy - 4, end: o.end - wy + 4 });
      } else if (edge === 'right' && o.edge === 'right') {
        gaps.push({ start: o.start - wy - 4, end: o.end - wy + 4 });
      }
    });

    if (edge === 'top' || edge === 'bottom') {
      // Horizontal edge
      gaps.sort((a, b) => a.start - b.start);
      let cursor = 0;
      const segments = [];
      gaps.forEach(gap => {
        if (gap.start > cursor) segments.push({ start: cursor, end: gap.start });
        cursor = gap.end;
      });
      if (cursor < ww) segments.push({ start: cursor, end: ww });

      segments.forEach(seg => {
        const segSx = sx + seg.start;
        const segW = seg.end - seg.start;
        // Dark inner fill
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(segSx, sy, segW, wh);
        // Glowing colored border
        ctx.strokeStyle = `rgba(${rgb}, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(segSx, sy, segW, wh);
        // Inner neon line
        ctx.fillStyle = `rgba(${rgb}, ${pulse * 0.35})`;
        ctx.fillRect(segSx, sy, segW, wh);
      });
    } else {
      // Vertical edge
      gaps.sort((a, b) => a.start - b.start);
      let cursor = 0;
      const segments = [];
      gaps.forEach(gap => {
        if (gap.start > cursor) segments.push({ start: cursor, end: gap.start });
        cursor = gap.end;
      });
      if (cursor < wh) segments.push({ start: cursor, end: wh });

      segments.forEach(seg => {
        const segSy = sy + seg.start;
        const segH = seg.end - seg.start;
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(sx, segSy, ww, segH);
        ctx.strokeStyle = `rgba(${rgb}, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, segSy, ww, segH);
        ctx.fillStyle = `rgba(${rgb}, ${pulse * 0.35})`;
        ctx.fillRect(sx, segSy, ww, segH);
      });
    }
  }

  // ─── Enhanced Walkway Drawing ───
  _drawWalkway(ctx, camera, wk, time) {
    const sx = wk.x - camera.x;
    const sy = wk.y - camera.y;

    ctx.save();

    // Dark corridor floor
    ctx.fillStyle = '#0a0e18';
    ctx.fillRect(sx, sy, wk.w, wk.h);

    // Side rails (glowing blue)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 2;
    if (wk.dir === 'right' || wk.dir === 'left') {
      // Top rail
      ctx.beginPath();
      ctx.moveTo(sx, sy); ctx.lineTo(sx + wk.w, sy);
      ctx.stroke();
      // Bottom rail
      ctx.beginPath();
      ctx.moveTo(sx, sy + wk.h); ctx.lineTo(sx + wk.w, sy + wk.h);
      ctx.stroke();

      // Animated chevron arrows scrolling →
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      const chevronSpacing = 24;
      const offset = (time * 40) % chevronSpacing;
      for (let cx = -chevronSpacing; cx < wk.w + chevronSpacing; cx += chevronSpacing) {
        const arrowX = sx + cx + offset;
        if (arrowX < sx || arrowX > sx + wk.w - 8) continue;
        ctx.beginPath();
        ctx.moveTo(arrowX, sy + wk.h / 2 - 8);
        ctx.lineTo(arrowX + 8, sy + wk.h / 2);
        ctx.lineTo(arrowX, sy + wk.h / 2 + 8);
        ctx.fill();
      }
    } else {
      // Left rail
      ctx.beginPath();
      ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + wk.h);
      ctx.stroke();
      // Right rail
      ctx.beginPath();
      ctx.moveTo(sx + wk.w, sy); ctx.lineTo(sx + wk.w, sy + wk.h);
      ctx.stroke();

      // Animated chevron arrows scrolling ↓
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      const chevronSpacing = 24;
      const offset = (time * 40) % chevronSpacing;
      for (let cy = -chevronSpacing; cy < wk.h + chevronSpacing; cy += chevronSpacing) {
        const arrowY = sy + cy + offset;
        if (arrowY < sy || arrowY > sy + wk.h - 8) continue;
        ctx.beginPath();
        ctx.moveTo(sx + wk.w / 2 - 8, arrowY);
        ctx.lineTo(sx + wk.w / 2, arrowY + 8);
        ctx.lineTo(sx + wk.w / 2 + 8, arrowY);
        ctx.fill();
      }
    }

    // Center dashed line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    if (wk.dir === 'right' || wk.dir === 'left') {
      ctx.moveTo(sx, sy + wk.h / 2);
      ctx.lineTo(sx + wk.w, sy + wk.h / 2);
    } else {
      ctx.moveTo(sx + wk.w / 2, sy);
      ctx.lineTo(sx + wk.w / 2, sy + wk.h);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  // ─── Energy Gate Drawing ───
  _drawGates(ctx, camera, time) {
    this.gates.forEach(g => {
      const sx = g.x - camera.x;
      const sy = g.y - camera.y;

      ctx.save();
      if (g.locked) {
        // ── Red forcefield barrier ──
        // Outer glow
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 16;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(sx, sy, g.width, g.height);
        ctx.shadowBlur = 0;

        // Pulsing border
        const pulse = Math.sin(time * 4) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(244, 63, 94, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(sx, sy, g.width, g.height);

        // Scanning laser beam
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        if (g.orientation === 'vertical') {
          const scanY = sy + (Math.sin(time * 5) * 0.5 + 0.5) * g.height;
          ctx.beginPath(); ctx.moveTo(sx, scanY); ctx.lineTo(sx + g.width, scanY); ctx.stroke();
        } else {
          const scanX = sx + (Math.sin(time * 5) * 0.5 + 0.5) * g.width;
          ctx.beginPath(); ctx.moveTo(scanX, sy); ctx.lineTo(scanX, sy + g.height); ctx.stroke();
        }

        // Cross pattern (X)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, sy); ctx.lineTo(sx + g.width, sy + g.height);
        ctx.moveTo(sx + g.width, sy); ctx.lineTo(sx, sy + g.height);
        ctx.stroke();

        // Lock icon
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('🔒', sx + g.width / 2, sy + g.height / 2 + 5);

        // Warning text
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#f87171';
        ctx.fillText(`LOCKED (R${g.roundNeeded})`, sx + g.width / 2, sy - 6);
      } else {
        // ── Unlocked: Green neon gateway ──
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.fillRect(sx, sy, g.width, g.height);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(sx, sy, g.width, g.height);
        ctx.setLineDash([]);

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#34d399';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ OPEN', sx + g.width / 2, sy + g.height / 2 + 4);
      }
      ctx.restore();
    });
  }

  // ═══════════════════════════════════════════════════
  //  MINI-MAP — Radar overlay (bottom-right corner)
  // ═══════════════════════════════════════════════════
  drawMiniMap(ctx, camera, player) {
    const scale = 0.1;
    const mapW = this.width * scale;
    const mapH = this.height * scale;
    const padding = 12;
    const mx = ctx.canvas.width - mapW - padding;
    const my = ctx.canvas.height - mapH - padding - 60; // above mobile controls

    ctx.save();

    // Background
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#0a0e1c';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(mx - 4, my - 4, mapW + 8, mapH + 8, 8);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Title
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('RADAR', mx, my - 8);

    // Draw zones
    this.zones.forEach(zone => {
      const zx = mx + zone.x * scale;
      const zy = my + zone.y * scale;
      const zw = zone.w * scale;
      const zh = zone.h * scale;

      ctx.fillStyle = zone.color + '30'; // transparent fill
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 1.5;
      ctx.fillRect(zx, zy, zw, zh);
      ctx.strokeRect(zx, zy, zw, zh);

      // Zone number
      ctx.fillStyle = zone.color;
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(zone.num.toString(), zx + zw / 2, zy + zh / 2 + 3);
    });

    // Draw walkways
    ctx.fillStyle = '#1e293b';
    this.walkways.forEach(wk => {
      ctx.fillRect(mx + wk.x * scale, my + wk.y * scale, wk.w * scale, wk.h * scale);
    });

    // Draw gates
    this.gates.forEach(g => {
      ctx.fillStyle = g.locked ? '#ef4444' : '#10b981';
      const gx = mx + g.x * scale;
      const gy = my + g.y * scale;
      const gw = Math.max(3, g.width * scale);
      const gh = Math.max(3, g.height * scale);
      ctx.fillRect(gx, gy, gw, gh);
    });

    // Draw player position (blinking dot)
    const blink = Math.sin(performance.now() * 0.006) > 0;
    if (blink) {
      const px = mx + player.x * scale;
      const py = my + player.y * scale;
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Camera viewport rectangle
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(
      mx + camera.x * scale,
      my + camera.y * scale,
      camera.viewportWidth * scale,
      camera.viewportHeight * scale
    );
    ctx.setLineDash([]);

    ctx.restore();
  }

  // ─── Utility: hex color to "r, g, b" string ───
  _hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}

window.GameMap = GameMap;
