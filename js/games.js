export const games = {
  flappyYarn: {
    running: false,
    loop: null,

    start(canvas, ctx) {
      // your flappy yarn code here
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
      // your platformer code here
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
      // your maze code here
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
      // your runner code here
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
      // your drift code here
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
      // your dodge code here
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
      // your clicker code here
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  },

  yarnJump: {
    running: false,
    loop: null,

    start(canvas, ctx) {
      // your jump code here
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this.loop);
    }
  }
};
