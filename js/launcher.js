import * as Games from './games.js';

const modal = document.getElementById("gameModal");
const modalTitle = document.getElementById("modalTitle");
const canvas = document.getElementById("gameCanvas");
const closeBtn = document.getElementById("closeModal");

document.querySelectorAll(".play-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const gameName = btn.dataset.launch;
    const gameFunction = Games[gameName];

    if (gameFunction) {
      modal.classList.remove("hidden");
      modalTitle.textContent = btn.previousElementSibling.textContent;
      gameFunction(canvas);
    } else {
      console.error("Game not found:", gameName);
    }
  });
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
