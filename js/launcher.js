import { games } from './games.js';

const modal = document.getElementById("gameModal");
const modalTitle = document.getElementById("modalTitle");
const canvas = document.getElementById("gameCanvas");
const closeBtn = document.getElementById("closeModal");
const ctx = canvas.getContext("2d");

let currentGame = null;

document.querySelectorAll(".play-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const gameName = btn.dataset.launch;
    const game = games[gameName];

    if (!game) {
      console.error("Game not found:", gameName);
      return;
    }

    // Stop previous game if running
    if (currentGame && currentGame.stop) {
      currentGame.stop();
    }

    currentGame = game;

    modal.classList.remove("hidden");
    modalTitle.textContent = btn.previousElementSibling.textContent;

    // Start the selected game
    game.start(canvas, ctx);
  });
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");

  if (currentGame && currentGame.stop) {
    currentGame.stop();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
