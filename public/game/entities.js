// Entities: Player, NPCs, Interactable Objects, and Particles

class Particle {
  constructor(x, y, color = '#38bdf8') {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = -Math.random() * 2 - 0.5;
    this.size = Math.random() * 3 + 1.5;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx, camera) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x - camera.x, this.y - camera.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 36;
    this.speed = 3.6;
    this.direction = 'down'; // 'down', 'up', 'left', 'right'
    this.isMoving = false;
    this.animTimer = 0;
    this.animFrame = 0;
    this.stepAudioTimer = 0;
  }

  update(keys, map) {
    let dx = 0;
    let dy = 0;

    if (keys['w'] || keys['ArrowUp'] || keys['W']) {
      dy -= 1;
      this.direction = 'up';
    }
    if (keys['s'] || keys['ArrowDown'] || keys['S']) {
      dy += 1;
      this.direction = 'down';
    }
    if (keys['a'] || keys['ArrowLeft'] || keys['A']) {
      dx -= 1;
      this.direction = 'left';
    }
    if (keys['d'] || keys['ArrowRight'] || keys['D']) {
      dx += 1;
      this.direction = 'right';
    }

    if (dx !== 0 && dy !== 0) {
      // Normalize diagonal movement
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.isMoving = dx !== 0 || dy !== 0;

    if (this.isMoving) {
      const nextX = this.x + dx * this.speed;
      const nextY = this.y + dy * this.speed;

      // Check collision with map bounds & colliders
      if (!map.isColliding(nextX, this.y, this.width, this.height)) {
        this.x = nextX;
      } else {
        const gate = map.getCollidingGate(nextX, this.y, this.width, this.height);
        if (gate && window.progressionManager) window.progressionManager.onGateHit(gate);
      }
      if (!map.isColliding(this.x, nextY, this.width, this.height)) {
        this.y = nextY;
      } else {
        const gate = map.getCollidingGate(this.x, nextY, this.width, this.height);
        if (gate && window.progressionManager) window.progressionManager.onGateHit(gate);
      }

      this.animTimer++;
      if (this.animTimer % 8 === 0) {
        this.animFrame = (this.animFrame + 1) % 4;
      }

      this.stepAudioTimer++;
      if (this.stepAudioTimer % 16 === 0 && window.soundManager) {
        window.soundManager.playStep();
      }
    } else {
      this.animFrame = 0;
    }
  }

  draw(ctx, camera) {
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);

    ctx.save();
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(screenX + 16, screenY + 34, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player Sprite Rendering (Pixel RPG Character: Kushal)
    // Blue hoodie / jacket
    const legOffset = this.isMoving ? Math.sin(this.animFrame * Math.PI / 2) * 4 : 0;

    // Legs / Pants (Dark Indigo)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(screenX + 9, screenY + 24 + legOffset, 5, 10 - legOffset);
    ctx.fillRect(screenX + 18, screenY + 24 - legOffset, 5, 10 + legOffset);

    // Shoes (White/Orange sneakers)
    ctx.fillStyle = '#f97316';
    ctx.fillRect(screenX + 8, screenY + 32, 6, 4);
    ctx.fillRect(screenX + 18, screenY + 32, 6, 4);

    // Body / Hoodie (Cyan / Teal developer hoodie)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(screenX + 8, screenY + 12, 16, 14);

    // Hoodie pocket / accent
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(screenX + 11, screenY + 18, 10, 6);

    // Hands
    ctx.fillStyle = '#fbcfe8';
    if (this.direction === 'left') {
      ctx.fillRect(screenX + 4, screenY + 16, 4, 5);
    } else if (this.direction === 'right') {
      ctx.fillRect(screenX + 24, screenY + 16, 4, 5);
    } else {
      ctx.fillRect(screenX + 5, screenY + 16, 3, 5);
      ctx.fillRect(screenX + 24, screenY + 16, 3, 5);
    }

    // Head / Skin
    ctx.fillStyle = '#fde047';
    ctx.fillRect(screenX + 9, screenY + 2, 14, 12);

    // Hair (Dark neat hair)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(screenX + 8, screenY, 16, 5);
    ctx.fillRect(screenX + 7, screenY + 3, 4, 6);
    ctx.fillRect(screenX + 21, screenY + 3, 4, 6);

    // Eyes / Glasses
    if (this.direction !== 'up') {
      ctx.fillStyle = '#0284c7';
      // Glasses frames
      ctx.strokeRect(screenX + 10.5, screenY + 5.5, 4, 3);
      ctx.strokeRect(screenX + 17.5, screenY + 5.5, 4, 3);
      ctx.fillStyle = '#0f172a';
      if (this.direction === 'left') {
        ctx.fillRect(screenX + 11, screenY + 6, 2, 2);
        ctx.fillRect(screenX + 17, screenY + 6, 2, 2);
      } else if (this.direction === 'right') {
        ctx.fillRect(screenX + 13, screenY + 6, 2, 2);
        ctx.fillRect(screenX + 19, screenY + 6, 2, 2);
      } else {
        ctx.fillRect(screenX + 12, screenY + 6, 2, 2);
        ctx.fillRect(screenX + 18, screenY + 6, 2, 2);
      }
    }

    // Name Tag Floating Overhead
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 3;
    ctx.strokeText('Kushal Tiwari (You)', screenX + 16, screenY - 6);
    ctx.fillText('Kushal Tiwari (You)', screenX + 16, screenY - 6);

    ctx.restore();
  }
}

class InteractableObject {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width || 48;
    this.height = config.height || 48;
    this.category = config.category; // 'npc', 'project', 'skill', 'experience', 'trophy', 'arcade', 'terminal'
    this.icon = config.icon || '📍';
    this.color = config.color || '#3b82f6';
    this.title = config.title;
    this.subtitle = config.subtitle;
    this.data = config.data;
    this.pulsing = 0;
  }

  isNear(player, distance = 48) {
    const cx1 = this.x + this.width / 2;
    const cy1 = this.y + this.height / 2;
    const cx2 = player.x + player.width / 2;
    const cy2 = player.y + player.height / 2;
    const dist = Math.hypot(cx1 - cx2, cy1 - cy2);
    return dist < distance;
  }

  draw(ctx, camera, player) {
    this.pulsing += 0.05;
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    const near = this.isNear(player);

    ctx.save();

    // Base pedestal / shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(screenX + this.width / 2, screenY + this.height + 2, this.width / 2.2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw object graphic based on category
    if (this.category === 'npc') {
      // Friendly NPC
      const bob = Math.sin(this.pulsing * 1.5) * 2;
      ctx.fillStyle = this.color;
      // Body
      ctx.fillRect(screenX + 12, screenY + 14 + bob, 24, 26);
      // Head
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(screenX + 14, screenY + 2 + bob, 20, 14);
      // Hat/Hair
      ctx.fillStyle = '#475569';
      ctx.fillRect(screenX + 12, screenY - 2 + bob, 24, 6);
      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(screenX + 18, screenY + 7 + bob, 3, 3);
      ctx.fillRect(screenX + 27, screenY + 7 + bob, 3, 3);
    } else if (this.category === 'project' || this.category === 'arcade') {
      // Arcade Cabinet / Terminal
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(screenX + 4, screenY, this.width - 8, this.height);
      // Screen glow
      const glow = Math.sin(this.pulsing * 3) * 0.2 + 0.8;
      ctx.fillStyle = this.category === 'arcade' ? `rgba(236, 72, 153, ${glow})` : `rgba(56, 189, 248, ${glow})`;
      ctx.fillRect(screenX + 8, screenY + 6, this.width - 16, 22);
      // Marquee / Banner
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.category === 'arcade' ? 'ARCADE' : 'PROJECT', screenX + this.width / 2, screenY + 18);
      // Buttons
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(screenX + 16, screenY + 36, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(screenX + 24, screenY + 36, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(screenX + 32, screenY + 36, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.category === 'trophy') {
      // Golden Pedestal with glowing trophy
      ctx.fillStyle = '#334155';
      ctx.fillRect(screenX + 8, screenY + 22, this.width - 16, 22);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(screenX + this.width / 2, screenY + 14, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.fillRect(screenX + this.width / 2 - 4, screenY + 18, 8, 8);
    } else {
      // Tech Monolith / Portal
      const grad = ctx.createLinearGradient(screenX, screenY, screenX, screenY + this.height);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(screenX + 6, screenY, this.width - 12, this.height, 8);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rune icon
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.icon, screenX + this.width / 2, screenY + 28);
    }

    // Label over object
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 3;
    ctx.strokeText(this.name, screenX + this.width / 2, screenY - 4);
    ctx.fillText(this.name, screenX + this.width / 2, screenY - 4);

    // Interactive Floating Prompt when player is near
    if (near) {
      const promptY = screenY - 22 + Math.sin(this.pulsing * 4) * 3;
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(screenX + this.width / 2 - 44, promptY - 12, 88, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ Press [E] / Tap', screenX + this.width / 2, promptY + 2);
    }

    ctx.restore();
  }
}

window.Particle = Particle;
window.Player = Player;
window.InteractableObject = InteractableObject;
