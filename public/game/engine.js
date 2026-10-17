// Main Game Engine Loop, Camera, Controls, and Rendering

class GameEngine {
  constructor(canvasId, resumeData, onInteract) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resume = resumeData;
    this.onInteract = onInteract;

    this.keys = {};
    this.particles = [];
    this.activeInteractable = null;

    // Responsive Canvas Resizing
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Init Map & Player
    this.map = new window.GameMap(this.resume);
    this.player = new window.Player(260, 220); // Spawn at Zone 1

    this.camera = {
      x: 0,
      y: 0,
      viewportWidth: this.canvas.width,
      viewportHeight: this.canvas.height
    };

    this.bindInputs();
    this.running = true;
    this.lastTime = performance.now();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.camera) {
      this.camera.viewportWidth = this.canvas.width;
      this.camera.viewportHeight = this.canvas.height;
    }
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;

      // Handle interaction key
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') && this.activeInteractable) {
        if (window.soundManager) window.soundManager.playInteract();
        this.onInteract(this.activeInteractable);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Touch Virtual Joystick & Buttons
    const btnUp = document.getElementById('ctrl-up');
    const btnDown = document.getElementById('ctrl-down');
    const btnLeft = document.getElementById('ctrl-left');
    const btnRight = document.getElementById('ctrl-right');
    const btnAction = document.getElementById('ctrl-action');

    const setupBtn = (btn, key) => {
      if (!btn) return;
      const press = (ev) => { ev.preventDefault(); this.keys[key] = true; };
      const release = (ev) => { ev.preventDefault(); this.keys[key] = false; };
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
    };

    setupBtn(btnUp, 'ArrowUp');
    setupBtn(btnDown, 'ArrowDown');
    setupBtn(btnLeft, 'ArrowLeft');
    setupBtn(btnRight, 'ArrowRight');

    if (btnAction) {
      btnAction.addEventListener('click', () => {
        if (this.activeInteractable) {
          if (window.soundManager) window.soundManager.playInteract();
          this.onInteract(this.activeInteractable);
        }
      });
    }
  }

  teleportTo(x, y) {
    this.player.x = x;
    this.player.y = y;
    if (window.soundManager) window.soundManager.playLevelUp();
    for (let i = 0; i < 20; i++) {
      this.particles.push(new window.Particle(x + 16, y + 16, '#a855f7'));
    }
  }

  update() {
    // 1. Update Player
    this.player.update(this.keys, this.map);

    // 2. Spawn particles while moving
    if (this.player.isMoving && Math.random() < 0.25) {
      this.particles.push(new window.Particle(this.player.x + 16, this.player.y + 32, '#38bdf8'));
    }

    // 3. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 4. Update Camera (Smooth lerp follow)
    const targetCamX = this.player.x + this.player.width / 2 - this.camera.viewportWidth / 2;
    const targetCamY = this.player.y + this.player.height / 2 - this.camera.viewportHeight / 2;

    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;

    // Clamp camera within map bounds
    this.camera.x = Math.max(0, Math.min(this.map.width - this.camera.viewportWidth, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.map.height - this.camera.viewportHeight, this.camera.y));

    // 5. Detect nearest interactable
    let nearest = null;
    let minDist = 55;
    for (const obj of this.map.interactables) {
      const cx1 = obj.x + obj.width / 2;
      const cy1 = obj.y + obj.height / 2;
      const cx2 = this.player.x + this.player.width / 2;
      const cy2 = this.player.y + this.player.height / 2;
      const dist = Math.hypot(cx1 - cx2, cy1 - cy2);
      if (dist < minDist) {
        nearest = obj;
        minDist = dist;
      }
    }
    this.activeInteractable = nearest;

    // Update Action button prompt visibility on mobile HUD
    const mobileActionBtn = document.getElementById('ctrl-action');
    if (mobileActionBtn) {
      if (nearest) {
        mobileActionBtn.classList.remove('opacity-40');
        mobileActionBtn.classList.add('opacity-100', 'animate-pulse');
      } else {
        mobileActionBtn.classList.add('opacity-40');
        mobileActionBtn.classList.remove('opacity-100', 'animate-pulse');
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Map Grounds & Paths
    this.map.draw(this.ctx, this.camera);

    // 2. Draw Particles (Ground layer)
    this.particles.forEach(p => p.draw(this.ctx, this.camera));

    // 3. Draw Interactables
    this.map.interactables.forEach(obj => {
      obj.draw(this.ctx, this.camera, this.player);
    });

    // 4. Draw Player
    this.player.draw(this.ctx, this.camera);

    // 5. Draw Mini-Map Radar in top-right or overlay HUD
  }

  start() {
    const loop = (currentTime) => {
      if (!this.running) return;
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.GameEngine = GameEngine;
