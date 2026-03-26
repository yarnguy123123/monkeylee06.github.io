import games from './games.js';

const modal = document.getElementById('gameModal');
const closeBtn = document.getElementById('closeModal');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const titleEl = document.getElementById('modalTitle');

let currentGame = null;

function openGame(name, label) {
  if (currentGame && currentGame.stop) currentGame.stop();

  const game = games[name];
  if (!game) return;

  currentGame = game;
  titleEl.textContent = label;
  modal.classList.remove('hidden');
  game.start(canvas, ctx);
}

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-launch');
    const label = btn.parentElement.querySelector('h3').textContent;
    openGame(key, label);
  });
});

closeBtn.addEventListener('click', () => {
  if (currentGame && currentGame.stop) currentGame.stop();
  modal.classList.add('hidden');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
