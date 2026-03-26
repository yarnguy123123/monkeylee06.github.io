export const games = {

  flappyYarn: {
    running: false,
    loop: null,

    start(canvas, ctx) {
      this.running = true;

      let x = 100;
      let y = canvas.height / 2;
      let velocity = 0;
      const gravity = 0.4;
      const jump = -7;

      let pipes = [];
      let frame = 0;

      function spawnPipe() {
        const gap = 140;
        const top = Math.random() * (canvas.height - gap - 100) + 20;
        pipes.push({
          x: canvas.width,
          top,
          bottom: top + gap
        });
      }

      const draw = () => {
        if (!this.running) return;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff66ff";
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        velocity += gravity;
        y += velocity;

        pipes.forEach(pipe => {
          pipe.x -= 3;
          ctx.fillStyle = "#aa00aa";
          ctx.fillRect(pipe.x, 0, 50, pipe.top);
          ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height - pipe.bottom);
        });

        pipes = pipes.filter(p => p.x > -60);

        frame++;
        if (frame % 90 === 0) spawnPipe();

        pipes.forEach(pipe => {
          if (
            x + 15 > pipe.x &&
            x - 15 < pipe.x + 50 &&
            (y - 15 < pipe.top || y + 15 > pipe.bottom)
          ) {
            this.stop();
          }
        });

        if (y > canvas.height || y < 0) this.stop();

        this.loop = requestAnimationFrame(draw);
      };

      window.onkeydown = () => {
        velocity = jump;
      };

      draw();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  yarnPlatformer: {
    running: false,
    loop: null,
    keys: {},

    start(canvas, ctx) {
      this.running = true;
      this.keys = {};

      const player = { x: 80, y: canvas.height - 80, w: 30, h: 40, vy: 0, onGround: false };
      const gravity = 0.6;
      const speed = 4;
      const jump = -11;

      const platforms = [
        { x: 0, y: canvas.height - 30, w: canvas.width, h: 30 },
        { x: 150, y: canvas.height - 120, w: 120, h: 20 },
        { x: 340, y: canvas.height - 200, w: 140, h: 20 },
        { x: 560, y: canvas.height - 150, w: 120, h: 20 }
      ];

      const keyDown = e => this.keys[e.key] = true;
      const keyUp = e => this.keys[e.key] = false;
      window.addEventListener('keydown', keyDown);
      window.addEventListener('keyup', keyUp);

      const loop = () => {
        if (!this.running) {
          window.removeEventListener('keydown', keyDown);
          window.removeEventListener('keyup', keyUp);
          return;
        }

        ctx.fillStyle = "#050010";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.keys["ArrowLeft"]) player.x -= speed;
        if (this.keys["ArrowRight"]) player.x += speed;

        player.vy += gravity;
        player.y += player.vy;
        player.onGround = false;

        platforms.forEach(p => {
          ctx.fillStyle = "#6611aa";
          ctx.fillRect(p.x, p.y, p.w, p.h);

          if (
            player.x < p.x + p.w &&
            player.x + player.w > p.x &&
            player.y + player.h > p.y &&
            player.y + player.h < p.y + p.h + player.vy + 1 &&
            player.vy >= 0
          ) {
            player.y = p.y - player.h;
            player.vy = 0;
            player.onGround = true;
          }
        });

        if (this.keys[" "] && player.onGround) {
          player.vy = jump;
        }

        ctx.fillStyle = "#ff66ff";
        ctx.fillRect(player.x, player.y, player.w, player.h);

        this.loop = requestAnimationFrame(loop);
      };

      loop();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  yarnMaze: {
    running: false,
    loop: null,
    keys: {},

    start(canvas, ctx) {
      this.running = true;
      this.keys = {};

      const cellSize = 40;
      const cols = Math.floor(canvas.width / cellSize);
      const rows = Math.floor(canvas.height / cellSize);

      const walls = [];
      for (let i = 0; i < cols; i++) {
        walls.push({ x: i * cellSize, y: 0, w: cellSize, h: cellSize });
        walls.push({ x: i * cellSize, y: (rows - 1) * cellSize, w: cellSize, h: cellSize });
      }
      for (let j = 0; j < rows; j++) {
        walls.push({ x: 0, y: j * cellSize, w: cellSize, h: cellSize });
        walls.push({ x: (cols - 1) * cellSize, y: j * cellSize, w: cellSize, h: cellSize });
      }

      for (let i = 2; i < cols - 2; i += 2) {
        walls.push({ x: i * cellSize, y: 3 * cellSize, w: cellSize, h: cellSize });
        walls.push({ x: i * cellSize, y: 6 * cellSize, w: cellSize, h: cellSize });
      }

      const player = { x: cellSize * 1.5, y: cellSize * 1.5, r: 12, speed: 3 };
      const goal = { x: (cols - 2) * cellSize + cellSize / 2, y: (rows - 2) * cellSize + cellSize / 2, r: 14 };

      const keyDown = e => this.keys[e.key] = true;
      const keyUp = e => this.keys[e.key] = false;
      window.addEventListener('keydown', keyDown);
      window.addEventListener('keyup', keyUp);

      const loop = () => {
        if (!this.running) {
          window.removeEventListener('keydown', keyDown);
          window.removeEventListener('keyup', keyUp);
          return;
        }

        ctx.fillStyle = "#000010";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let vx = 0, vy = 0;
        if (this.keys["ArrowUp"]) vy -= player.speed;
        if (this.keys["ArrowDown"]) vy += player.speed;
        if (this.keys["ArrowLeft"]) vx -= player.speed;
        if (this.keys["ArrowRight"]) vx += player.speed;

        const nextX = player.x + vx;
        const nextY = player.y + vy;

        let blocked = false;
        walls.forEach(w => {
          ctx.fillStyle = "#330066";
          ctx.fillRect(w.x, w.y, w.w, w.h);

          const closestX = Math.max(w.x, Math.min(nextX, w.x + w.w));
          const closestY = Math.max(w.y, Math.min(nextY, w.y + w.h));
          const dx = nextX - closestX;
          const dy = nextY - closestY;
          if (dx * dx + dy * dy < player.r * player.r) {
            blocked = true;
          }
        });

        if (!blocked) {
          player.x = nextX;
          player.y = nextY;
        }

        ctx.fillStyle = "#00ff99";
        ctx.beginPath();
        ctx.arc(goal.x, goal.y, goal.r, 0, Math.PI * 2);
        ctx.fill();

        const dxg = player.x - goal.x;
        const dyg = player.y - goal.y;
        if (dxg * dxg + dyg * dyg < (player.r + goal.r) * (player.r + goal.r)) {
          this.stop();
        }

        ctx.fillStyle = "#ff66ff";
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
        ctx.fill();

        this.loop = requestAnimationFrame(loop);
      };

      loop();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  // ⭐ Continue pasting your remaining games here (Runner, Drift, Dodge, Clicker, Jump)
  // The structure is now correct — just paste your existing code inside each start()

};
