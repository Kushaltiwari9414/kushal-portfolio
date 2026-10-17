// Arcade Mini-Game: "Bug Hunter & Algo Runner"

class MiniGame {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    this.running = false;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.paddle = { x: 200, y: 350, width: 70, height: 16, speed: 7 };
    this.items = [];
    this.keys = {};
    this.spawnTimer = 0;
    this.animationId = null;

    this.itemTypes = [
      { text: '💎 DSA', type: 'good', score: 50, color: '#38bdf8' },
      { text: '⚛️ React', type: 'good', score: 60, color: '#06b6d4' },
      { text: '✨ Gemini', type: 'good', score: 100, color: '#a855f7' },
      { text: '☕ Java', type: 'good', score: 40, color: '#f59e0b' },
      { text: '🐘 SQL', type: 'good', score: 50, color: '#10b981' },
      { text: '🐛 NullPtr', type: 'bad', score: -30, color: '#ef4444' },
      { text: '💥 StackOverflow', type: 'bad', score: -50, color: '#f43f5e' },
      { text: '🛑 500 Error', type: 'bad', score: -40, color: '#e11d48' }
    ];

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Touch controls for mobile
    let touchStartX = null;
    this.canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (touchStartX === null) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX;
      this.paddle.x += diff * 0.8;
      this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
      touchStartX = currentX;
    }, { passive: true });
  }

  start() {
    this.running = true;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.items = [];
    this.paddle.x = this.canvas.width / 2 - this.paddle.width / 2;
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  spawnItem() {
    const isBad = Math.random() < 0.35;
    const pool = this.itemTypes.filter(it => isBad ? it.type === 'bad' : it.type === 'good');
    const template = pool[Math.floor(Math.random() * pool.length)];

    this.items.push({
      ...template,
      x: Math.random() * (this.canvas.width - 60) + 10,
      y: -20,
      speed: 2 + Math.random() * 2 + (this.level * 0.5),
      size: 24
    });
  }

  update() {
    if (!this.running) return;

    // Paddle movement
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.paddle.x -= this.paddle.speed;
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.paddle.x += this.paddle.speed;
    }
    this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));

    // Item spawning
    this.spawnTimer++;
    const spawnRate = Math.max(25, 60 - this.level * 5);
    if (this.spawnTimer % spawnRate === 0) {
      this.spawnItem();
    }

    // Update items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.y += it.speed;

      // Check collision with paddle
      if (
        it.y + 12 >= this.paddle.y &&
        it.y <= this.paddle.y + this.paddle.height &&
        it.x + 20 >= this.paddle.x &&
        it.x <= this.paddle.x + this.paddle.width
      ) {
        if (it.type === 'good') {
          this.score += it.score;
          if (window.soundManager) window.soundManager.playCoin();
          if (this.score >= this.level * 300) {
            this.level++;
            if (window.soundManager) window.soundManager.playLevelUp();
          }
        } else {
          this.lives--;
          if (window.soundManager) window.soundManager.playHurt();
          if (this.lives <= 0) {
            this.gameOver();
            return;
          }
        }
        this.items.splice(i, 1);
        continue;
      }

      // Fallen below screen
      if (it.y > this.canvas.height) {
        this.items.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#090d16';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid lines
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Draw paddle (Catcher shield)
    this.ctx.save();
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.shadowColor = '#38bdf8';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height, 8);
    this.ctx.fill();

    this.ctx.fillStyle = '#0284c7';
    this.ctx.fillRect(this.paddle.x + 10, this.paddle.y + 3, this.paddle.width - 20, 4);
    this.ctx.restore();

    // Draw falling items
    this.items.forEach(it => {
      this.ctx.save();
      this.ctx.fillStyle = it.color;
      this.ctx.font = 'bold 13px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(it.text, it.x + 16, it.y + 16);
      this.ctx.restore();
    });

    // Draw HUD
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SCORE: ${this.score}`, 16, 26);
    this.ctx.fillText(`LVL: ${this.level}`, 160, 26);

    this.ctx.textAlign = 'right';
    let hearts = '';
    for (let l = 0; l < this.lives; l++) hearts += '❤️';
    this.ctx.fillText(hearts, this.canvas.width - 16, 26);
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  gameOver() {
    this.stop();
    this.draw();

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = 'bold 26px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);

    this.ctx.fillStyle = '#f8fafc';
    this.ctx.font = '16px monospace';
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = '13px monospace';
    this.ctx.fillText('Submitting to Global Leaderboard...', this.canvas.width / 2, this.canvas.height / 2 + 40);
    this.ctx.restore();

    if (this.onGameOver) {
      this.onGameOver(this.score);
    }
  }
}

window.MiniGame = MiniGame;
