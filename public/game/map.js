// Map World, Zones, Tile Rendering, and Colliders

class GameMap {
  constructor(resumeData) {
    this.resume = resumeData;
    this.width = 1800;
    this.height = 1450;
    this.tileSize = 32;
    this.colliders = [];
    this.interactables = [];
    this.decorations = [];

    this.initWorld();
  }

  initWorld() {
    // Outer boundaries colliders
    this.colliders.push({ x: 0, y: 0, width: this.width, height: 40 }); // Top
    this.colliders.push({ x: 0, y: this.height - 40, width: this.width, height: 40 }); // Bottom
    this.colliders.push({ x: 0, y: 0, width: 40, height: this.height }); // Left
    this.colliders.push({ x: this.width - 40, y: 0, width: 40, height: this.height }); // Right

    // Zone 1: Spawn & Hero Citadel (NIT Manipur & Dausa, Rajasthan)
    this.interactables.push(new InteractableObject({
      id: 'obj-guide',
      name: 'Guide Master',
      x: 320,
      y: 200,
      category: 'npc',
      color: '#38bdf8',
      title: 'Kushal Tiwari - Full-Stack & AI Engineer',
      subtitle: 'Final-Year B.Tech CSE @ NIT Manipur',
      data: {
        type: 'bio',
        name: 'Kushal Tiwari',
        location: 'Dausa, Rajasthan | NIT Manipur',
        objective: this.resume.basics.summary,
        phone: this.resume.basics.phone,
        email: this.resume.basics.email,
        github: this.resume.basics.github,
        linkedin: this.resume.basics.linkedin
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-education',
      name: 'NIT Manipur Monument',
      x: 180,
      y: 280,
      category: 'skill',
      icon: '🎓',
      color: '#6366f1',
      title: 'Academic Journey & Foundations',
      subtitle: 'NIT Manipur & Rajasthan Board',
      data: {
        type: 'education',
        list: this.resume.education
      }
    }));

    // Zone 2: Tech Altar & Skill Tree (Top-Right)
    this.interactables.push(new InteractableObject({
      id: 'obj-skill-languages',
      name: 'Languages Sanctum',
      x: 950,
      y: 160,
      category: 'skill',
      icon: '☕',
      color: '#f59e0b',
      title: 'Programming Languages',
      subtitle: 'Java, Python, C, JavaScript, HTML5/CSS3',
      data: {
        type: 'skills',
        title: 'Core Programming Languages',
        skills: this.resume.skills.languages,
        category: 'languages'
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-frameworks',
      name: 'Web & UI Foundry',
      x: 1150,
      y: 160,
      category: 'skill',
      icon: '⚛️',
      color: '#06b6d4',
      title: 'Frontend & UI Frameworks',
      subtitle: 'React.js, Tailwind CSS, Recharts, Bootstrap',
      data: {
        type: 'skills',
        title: 'Frontend & Web Libraries',
        skills: this.resume.skills.frameworks,
        category: 'frameworks'
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-backend',
      name: 'Database & Backend Vault',
      x: 1350,
      y: 160,
      category: 'skill',
      icon: '🗄️',
      color: '#10b981',
      title: 'Backend & Data Systems',
      subtitle: 'SQL, PostgreSQL, MongoDB, Node.js, Oracle',
      data: {
        type: 'skills',
        title: 'Databases & Backend Architecture',
        skills: this.resume.skills.backendAndDatabases,
        category: 'backend'
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-ai',
      name: 'AI & GenAI Shrine',
      x: 1050,
      y: 300,
      category: 'skill',
      icon: '✨',
      color: '#a855f7',
      title: 'GenAI & Cloud Tools',
      subtitle: 'Google Gemini 2.5 API, REST APIs, Git, Linux',
      data: {
        type: 'skills',
        title: 'Artificial Intelligence & Development Tools',
        skills: this.resume.skills.aiAndTools,
        fundamentals: this.resume.skills.csFundamentals,
        category: 'ai'
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-skill-cs',
      name: 'CS Core Monolith',
      x: 1250,
      y: 300,
      category: 'skill',
      icon: '🧠',
      color: '#ec4899',
      title: 'Computer Science Fundamentals',
      subtitle: 'DSA (Java), OOPS, CN, Operating Systems',
      data: {
        type: 'fundamentals',
        title: 'Core CS Foundations & Problem Solving',
        csFundamentals: this.resume.skills.csFundamentals,
        softSkills: this.resume.skills.softSkills
      }
    }));

    // Zone 3: Experience Guildhall (Mid-Left)
    this.interactables.push(new InteractableObject({
      id: 'obj-exp-khatakhat',
      name: 'Khatakhat Logistics',
      x: 200,
      y: 650,
      category: 'experience',
      icon: '🚚',
      color: '#3b82f6',
      title: 'Software Development Engineer Intern',
      subtitle: 'Khatakhat Logistics Pvt. Ltd. (May 2026 – June 2026)',
      data: {
        type: 'experience',
        experience: this.resume.experience[0]
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-exp-learntricks',
      name: 'Learntricks Guild',
      x: 400,
      y: 650,
      category: 'experience',
      icon: '🚀',
      color: '#8b5cf6',
      title: 'Web Development Intern',
      subtitle: 'Learntricks (May 2025 – June 2025)',
      data: {
        type: 'experience',
        experience: this.resume.experience[1]
      }
    }));

    // Zone 4: Project Research Labs & Arcade (Mid-Right)
    this.interactables.push(new InteractableObject({
      id: 'obj-proj-har',
      name: 'HAR Engine Console',
      x: 960,
      y: 650,
      category: 'project',
      icon: '📱',
      color: '#38bdf8',
      title: 'Real-Time Human Activity Recognition Engine',
      subtitle: 'React.js, Gemini 2.5 API, DeviceMotion 20Hz Telemetry',
      data: {
        type: 'project',
        project: this.resume.projects[0]
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-proj-ollama',
      name: 'Ollama Script Terminal',
      x: 1180,
      y: 650,
      category: 'project',
      icon: '📝',
      color: '#10b981',
      title: 'Ollama Answer Script Evaluator',
      subtitle: 'Python, React, Handwritten OCR, Automated Grading',
      data: {
        type: 'project',
        project: this.resume.projects[1]
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-arcade-game',
      name: 'Bug Hunter Arcade',
      x: 1390,
      y: 650,
      category: 'arcade',
      icon: '👾',
      color: '#f43f5e',
      title: 'Bug Hunter: Algo Runner Mini-Game',
      subtitle: 'Catch Algorithms, Dodge Bugs, Submit High Score!',
      data: {
        type: 'minigame'
      }
    }));

    // Zone 5: Trophy Room & Hall of Fame (Bottom-Left)
    this.interactables.push(new InteractableObject({
      id: 'obj-trophy-cdac',
      name: 'CDAC Open Source Monument',
      x: 200,
      y: 1100,
      category: 'trophy',
      icon: '📜',
      color: '#38bdf8',
      title: 'CDAC Open Source Development',
      subtitle: 'Open Source Software Development Program',
      data: {
        type: 'achievement',
        achievement: this.resume.achievements[0]
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-trophy-regen',
      name: 'RE GEN Hackathons Altar',
      x: 380,
      y: 1100,
      category: 'trophy',
      icon: '⚡',
      color: '#f59e0b',
      title: 'RE GEN 25 & 2.0 Organizing Committee',
      subtitle: 'NIT Manipur (200+ participants)',
      data: {
        type: 'responsibility',
        responsibility: this.resume.positionsOfResponsibility[0],
        achievements: this.resume.achievements.slice(1)
      }
    }));

    // Zone 6: Contact & Quest Complete Embassy (Bottom-Right)
    this.interactables.push(new InteractableObject({
      id: 'obj-terminal-contact',
      name: 'Transceiver Terminal',
      x: 1000,
      y: 1100,
      category: 'terminal',
      icon: '📡',
      color: '#38bdf8',
      title: 'Direct Recruiter Transceiver',
      subtitle: 'Send message to Kushal + Backend Storage',
      data: {
        type: 'contact'
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-terminal-resume',
      name: 'Holographic Resume Portal',
      x: 1220,
      y: 1100,
      category: 'terminal',
      icon: '📜',
      color: '#a855f7',
      title: 'Full ATS Resume & PDF Print',
      subtitle: 'Instant view, export, and complete credential summary',
      data: {
        type: 'full-resume'
      }
    }));

    this.interactables.push(new InteractableObject({
      id: 'obj-terminal-guestbook',
      name: 'Leaderboard & Guestbook',
      x: 1420,
      y: 1100,
      category: 'terminal',
      icon: '⭐',
      color: '#ec4899',
      title: 'Visitor Hall & Global High Scores',
      subtitle: 'Sign your name and see the top players',
      data: {
        type: 'guestbook'
      }
    }));

    // Add obstacles/colliders around building monoliths
    this.interactables.forEach(item => {
      this.colliders.push({
        x: item.x + 4,
        y: item.y + 10,
        width: item.width - 8,
        height: item.height - 10
      });
    });

    // Zone Energy Gates / Round Progression Barriers
    this.gates = [
      {
        id: 'gate-1',
        zoneUnlock: 2,
        roundNeeded: 1,
        x: 710,
        y: 236,
        width: 36,
        height: 56,
        orientation: 'vertical',
        label: 'ZONE 2 BARRIER (Round 1 Required)',
        locked: true
      },
      {
        id: 'gate-2',
        zoneUnlock: 3,
        roundNeeded: 2,
        x: 336,
        y: 490,
        width: 56,
        height: 36,
        orientation: 'horizontal',
        label: 'ZONE 3 BARRIER (Round 2 Required)',
        locked: true
      },
      {
        id: 'gate-3',
        zoneUnlock: 4,
        roundNeeded: 3,
        x: 735,
        y: 696,
        width: 36,
        height: 56,
        orientation: 'vertical',
        label: 'ZONE 4 BARRIER (Round 3 Required)',
        locked: true
      },
      {
        id: 'gate-3-shortcut',
        zoneUnlock: 4,
        roundNeeded: 3,
        x: 1216,
        y: 490,
        width: 56,
        height: 36,
        orientation: 'horizontal',
        label: 'ZONE 4 BARRIER (Round 3 Required)',
        locked: true
      },
      {
        id: 'gate-4',
        zoneUnlock: 5,
        roundNeeded: 4,
        x: 336,
        y: 940,
        width: 56,
        height: 36,
        orientation: 'horizontal',
        label: 'ZONE 5 BARRIER (Round 4 Required)',
        locked: true
      },
      {
        id: 'gate-5',
        zoneUnlock: 6,
        roundNeeded: 5,
        x: 735,
        y: 1136,
        width: 36,
        height: 56,
        orientation: 'vertical',
        label: 'ZONE 6 BARRIER (Round 5 Required)',
        locked: true
      },
      {
        id: 'gate-5-shortcut',
        zoneUnlock: 6,
        roundNeeded: 5,
        x: 1216,
        y: 940,
        width: 56,
        height: 36,
        orientation: 'horizontal',
        label: 'ZONE 6 BARRIER (Round 5 Required)',
        locked: true
      }
    ];
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
      if (
        g.locked &&
        x < g.x + g.width &&
        x + width > g.x &&
        y < g.y + g.height &&
        y + height > g.y
      ) {
        return g;
      }
    }
    return null;
  }

  isColliding(x, y, width, height) {
    for (const c of this.colliders) {
      if (
        x < c.x + c.width &&
        x + width > c.x &&
        y < c.y + c.height &&
        y + height > c.y
      ) {
        return true;
      }
    }
    // Check locked gates
    if (this.getCollidingGate(x, y, width, height)) {
      return true;
    }
    return false;
  }

  draw(ctx, camera) {
    // 1. Draw Background Grid & Zones
    ctx.save();

    // Base Ground (Cyber RPG Dark Slate)
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0 - camera.x, 0 - camera.y, this.width, this.height);

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1;
    const startCol = Math.floor(camera.x / this.tileSize) * this.tileSize;
    const endCol = Math.min(this.width, camera.x + camera.viewportWidth + this.tileSize);
    const startRow = Math.floor(camera.y / this.tileSize) * this.tileSize;
    const endRow = Math.min(this.height, camera.y + camera.viewportHeight + this.tileSize);

    for (let x = startCol; x <= endCol; x += this.tileSize) {
      ctx.beginPath();
      ctx.moveTo(x - camera.x, 0 - camera.y);
      ctx.lineTo(x - camera.x, this.height - camera.y);
      ctx.stroke();
    }
    for (let y = startRow; y <= endRow; y += this.tileSize) {
      ctx.beginPath();
      ctx.moveTo(0 - camera.x, y - camera.y);
      ctx.lineTo(this.width - camera.x, y - camera.y);
      ctx.stroke();
    }

    // 2. Draw Zone Platforms / Courtyards
    this.drawZonePlatform(ctx, camera, 100, 80, 500, 360, '🏰 ZONE 1: SPAWN & ACADEMICS (NIT MANIPUR)', '#0f172a', '#38bdf8');
    this.drawZonePlatform(ctx, camera, 860, 80, 750, 360, '⚡ ZONE 2: TECH SANCTUM & SKILL FORGE', '#0f172a', '#f59e0b');
    this.drawZonePlatform(ctx, camera, 100, 550, 550, 340, '💼 ZONE 3: WORK EXPERIENCE GUILDHALL', '#0f172a', '#3b82f6');
    this.drawZonePlatform(ctx, camera, 860, 550, 750, 340, '🚀 ZONE 4: PROJECT RESEARCH & MINI-GAME ARCADE', '#0f172a', '#10b981');
    this.drawZonePlatform(ctx, camera, 100, 1000, 550, 320, '🏆 ZONE 5: HALL OF FAME & HACKATHONS', '#0f172a', '#fbbf24');
    this.drawZonePlatform(ctx, camera, 860, 1000, 750, 320, '📡 ZONE 6: CONTACT EMBASSY & RESUME PORTAL', '#0f172a', '#a855f7');

    // 3. Draw Connecting Cyber Walkways / Highways
    this.drawWalkway(ctx, camera, 600, 240, 260, 48); // Zone 1 to Zone 2
    this.drawWalkway(ctx, camera, 340, 440, 48, 110); // Zone 1 to Zone 3
    this.drawWalkway(ctx, camera, 650, 700, 210, 48); // Zone 3 to Zone 4
    this.drawWalkway(ctx, camera, 1220, 440, 48, 110); // Zone 2 to Zone 4
    this.drawWalkway(ctx, camera, 340, 890, 48, 110); // Zone 3 to Zone 5
    this.drawWalkway(ctx, camera, 650, 1140, 210, 48); // Zone 5 to Zone 6
    this.drawWalkway(ctx, camera, 1220, 890, 48, 110); // Zone 4 to Zone 6

    // 4. Draw Energy Gates on Top of Walkways
    this.drawGates(ctx, camera);

    ctx.restore();
  }

  drawGates(ctx, camera) {
    const time = performance.now() * 0.003;
    this.gates.forEach(g => {
      const sx = g.x - camera.x;
      const sy = g.y - camera.y;

      ctx.save();
      if (g.locked) {
        // Red / Crimson Glowing Laser Forcefield Barrier
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.fillRect(sx, sy, g.width, g.height);

        // Pulsing border & laser lines
        const pulse = Math.sin(time * 4) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(244, 63, 94, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(sx, sy, g.width, g.height);

        // Scanning laser beam
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        if (g.orientation === 'vertical') {
          const scanY = sy + (Math.sin(time * 5) * 0.5 + 0.5) * g.height;
          ctx.beginPath();
          ctx.moveTo(sx, scanY);
          ctx.lineTo(sx + g.width, scanY);
          ctx.stroke();
        } else {
          const scanX = sx + (Math.sin(time * 5) * 0.5 + 0.5) * g.width;
          ctx.beginPath();
          ctx.moveTo(scanX, sy);
          ctx.lineTo(scanX, sy + g.height);
          ctx.stroke();
        }

        // Lock Icon
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', sx + g.width / 2, sy + g.height / 2 + 5);

        // Warning text
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#f87171';
        ctx.fillText(`LOCKED (R${g.roundNeeded})`, sx + g.width / 2, sy - 4);
      } else {
        // Unlocked: Green neon gateway with particles
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fillRect(sx, sy, g.width, g.height);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(sx, sy, g.width, g.height);

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#34d399';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ OPEN', sx + g.width / 2, sy + g.height / 2 + 4);
      }
      ctx.restore();
    });
  }

  drawZonePlatform(ctx, camera, x, y, w, h, label, bg, border) {
    const sx = x - camera.x;
    const sy = y - camera.y;

    // Platform glow
    ctx.save();
    ctx.fillStyle = bg;
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(sx, sy, w, h, 16);
    ctx.fill();
    ctx.stroke();

    // Banner
    ctx.fillStyle = border;
    ctx.beginPath();
    ctx.roundRect(sx + 16, sy + 12, w - 32, 28, 6);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, sx + w / 2, sy + 30);
    ctx.restore();
  }

  drawWalkway(ctx, camera, x, y, w, h) {
    const sx = x - camera.x;
    const sy = y - camera.y;
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.fillRect(sx, sy, w, h);
    ctx.strokeRect(sx, sy, w, h);
    ctx.restore();
  }
}

window.GameMap = GameMap;
