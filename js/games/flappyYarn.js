export default {
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

      // Background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Player (Yarn ball)
      ctx.fillStyle = "#ff66ff";
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Physics
      velocity += gravity;
      y += velocity;

      // Pipes
      pipes.forEach(pipe => {
        pipe.x -= 3;

        ctx.fillStyle = "#aa00aa";
        ctx.fillRect(pipe.x, 0, 50, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height - pipe.bottom);
      });

      // Remove off-screen pipes
      pipes = pipes.filter(p => p.x > -60);

      // Spawn new pipes
      frame++;
      if (frame % 90 === 0) spawnPipe();

      // Collision detection
      pipes.forEach(pipe => {
        if (
          x + 15 > pipe.x &&
          x - 15 < pipe.x + 50 &&
          (y - 15 < pipe.top || y + 15 > pipe.bottom)
        ) {
          this.stop();
        }
      });

      // Out of bounds
      if (y > canvas.height || y < 0) this.stop();

      this.loop = requestAnimationFrame(draw);
    };

    // Controls
    window.onkeydown = () => {
      velocity = jump;
    };

    draw();
  },

  stop() {
    this.running = false;
    cancelAnimationFrame(this.loop);
  }
};
