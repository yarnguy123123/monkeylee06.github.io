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

  yarnRunner: {
    running: false,
    loop: null,

    start(canvas, ctx) {
      this.running = true;

      const groundY = canvas.height - 60;
      const player = { x: 80, y: groundY, vy: 0, r: 18, onGround: true };
      const gravity = 0.7;
      const jump = -13;

      let obstacles = [];
      let frame = 0;

      function spawnObstacle() {
        obstacles.push({
          x: canvas.width + 20,
          y: groundY,
          w: 30,
          h: 40
        });
      }

      window.onkeydown = e => {
        if (e.key === " " && player.onGround) {
          player.vy = jump;
          player.onGround = false;
        }
      };

      const loop = () => {
        if (!this.running) return;

        ctx.fillStyle = "#050015";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#6611aa";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, groundY + player.r);
        ctx.lineTo(canvas.width, groundY + player.r);
        ctx.stroke();

        player.vy += gravity;
        player.y += player.vy;

        if (player.y >= groundY) {
          player.y = groundY;
          player.vy = 0;
          player.onGround = true;
        }

        ctx.fillStyle = "#ff66ff";
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
        ctx.fill();

        obstacles.forEach(o => {
          o.x -= 6;
          ctx.fillStyle = "#ff2255";
          ctx.fillRect(o.x, o.y - o.h, o.w, o.h);

          const closestX = Math.max(o.x, Math.min(player.x, o.x + o.w));
          const closestY = Math.max(o.y - o.h, Math.min(player.y, o.y));
          const dx = player.x - closestX;
          const dy = player.y - closestY;
          if (dx * dx + dy * dy < player.r * player.r) {
            this.stop();
          }
        });

        obstacles = obstacles.filter(o => o.x + o.w > 0);

        frame++;
        if (frame % 70 === 0) spawnObstacle();

        this.loop = requestAnimationFrame(loop);
      };

      loop();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  yarnDrift: {
    running: false,
    loop: null,
    keys: {},

    start(canvas, ctx) {
      this.running = true;
      this.keys = {};

      const car = { x: canvas.width / 2, y: canvas.height - 100, angle: -Math.PI / 2, speed: 0 };
      const maxSpeed = 6;
      const accel = 0.2;
      const friction = 0.05;
      const turnSpeed = 0.06;

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

        ctx.fillStyle = "#020010";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.keys["ArrowUp"]) car.speed += accel;
        if (this.keys["ArrowDown"]) car.speed -= accel;

        if (car.speed > maxSpeed) car.speed = maxSpeed;
        if (car.speed < -maxSpeed / 2) car.speed = -maxSpeed / 2;

        if (this.keys["ArrowLeft"]) car.angle -= turnSpeed;
        if (this.keys["ArrowRight"]) car.angle += turnSpeed;

        if (!this.keys["ArrowUp"] && !this.keys["ArrowDown"]) {
          if (car.speed > 0) car.speed -= friction;
          else if (car.speed < 0) car.speed += friction;
          if (Math.abs(car.speed) < 0.05) car.speed = 0;
        }

        car.x += Math.cos(car.angle) * car.speed;
        car.y += Math.sin(car.angle) * car.speed;

        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(car.angle);
        ctx.fillStyle = "#ff66ff";
        ctx.fillRect(-15, -10, 30, 20);
        ctx.restore();

        this.loop = requestAnimationFrame(loop);
      };

      loop();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  // Simple Breakout-style placeholder so the button works
  yarnBreakout: {
    running: false,
    loop: null,
    keys: {},

    start(canvas, ctx) {
      this.running = true;
      this.keys = {};

      const paddle = { w: 80, h: 15, x: canvas.width / 2 - 40, y: canvas.height - 40, speed: 6 };
      const ball = { x: canvas.width / 2, y: canvas.height / 2, r: 8, vx: 4, vy: -4 };

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

        ctx.fillStyle = "#000015";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.keys["ArrowLeft"]) paddle.x -= paddle.speed;
        if (this.keys["ArrowRight"]) paddle.x += paddle.speed;

        paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, paddle.x));

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
        if (ball.y - ball.r < 0) ball.vy *= -1;

        if (
          ball.y + ball.r >= paddle.y &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.w &&
          ball.vy > 0
        ) {
          ball.vy *= -1;
        }

        if (ball.y - ball.r > canvas.height) {
          this.stop();
        }

        ctx.fillStyle = "#ff66ff";
        ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
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

  yarnDodge: {
    running: false,
    loop: null,
    keys: {},

    start(canvas, ctx) {
      this.running = true;
      this.keys = {};

      const player = { x: canvas.width / 2, y: canvas.height - 80, r: 16, speed: 5 };
      let hazards = [];
      let frame = 0;

      const keyDown = e => this.keys[e.key] = true;
      const keyUp = e => this.keys[e.key] = false;
      window.addEventListener('keydown', keyDown);
      window.addEventListener('keyup', keyUp);

      function spawnHazard() {
        hazards.push({
          x: Math.random() * canvas.width,
          y: -20,
          r: 10 + Math.random() * 10,
          vy: 2 + Math.random() * 3
        });
      }

      const loop = () => {
        if (!this.running) {
          window.removeEventListener('keydown', keyDown);
          window.removeEventListener('keyup', keyUp);
          return;
        }

        ctx.fillStyle = "#000015";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.keys["ArrowLeft"]) player.x -= player.speed;
        if (this.keys["ArrowRight"]) player.x += player.speed;

        player.x = Math.max(player.r, Math.min(canvas.width - player.r, player.x));

        frame++;
        if (frame % 30 === 0) spawnHazard();

        hazards.forEach(h => {
          h.y += h.vy;
        });

        hazards = hazards.filter(h => h.y - h.r < canvas.height + 40);

        ctx.fillStyle = "#ff66ff";
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ff2255";
        hazards.forEach(h => {
          ctx.beginPath();
          ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
          ctx.fill();

          const dx = player.x - h.x;
          const dy = player.y - h.y;
          if (dx * dx + dy * dy < (player.r + h.r) * (player.r + h.r)) {
            this.stop();
          }
        });

        this.loop = requestAnimationFrame(loop);
      };

      loop();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  yarnClicker: {
    running: false,
    loop: null,

    start(canvas, ctx) {
      this.running = true;

      let score = 0;

      const clickHandler = e => {
        if (!this.running) return;
        score++;
      };

      canvas.addEventListener('click', clickHandler);

      const loop = () => {
        if (!this.running) {
          canvas.removeEventListener('click', clickHandler);
          return;
        }

        ctx.fillStyle = "#000020";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff66ff";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Click anywhere!", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);

        this.loop = requestAnimationFrame(loop);
      };

      loop();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  yarnJump: {
    running: false,
    loop: null,
    keys: {},

    start(canvas, ctx) {
      this.running = true;
      this.keys = {};

      const player = { x: canvas.width / 2, y: canvas.height - 80, vy: 0, r: 16, onGround: true };
      const gravity = 0.7;
      const jump = -14;

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

        ctx.fillStyle = "#000020";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.keys[" "] && player.onGround) {
          player.vy = jump;
          player.onGround = false;
        }

        player.vy += gravity;
        player.y += player.vy;

        const groundY = canvas.height - 60;
        if (player.y >= groundY) {
          player.y = groundY;
          player.vy = 0;
          player.onGround = true;
        }

        ctx.fillStyle = "#ff66ff";
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#6611aa";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, groundY + player.r);
        ctx.lineTo(canvas.width, groundY + player.r);
        ctx.stroke();

        this.loop = requestAnimationFrame(loop);
      };

      loop();
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  }

};
