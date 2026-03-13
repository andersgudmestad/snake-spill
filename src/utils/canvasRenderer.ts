import type { DrawConfig } from '../types/game';
import { COLORS, POWER_UP_COLORS, POWER_UP_SYMBOLS, POWER_UP_BOARD_DURATION } from '../constants/game';

export function drawGame(config: DrawConfig, timestamp: number = 0) {
  const { ctx, state, cellSize, gridSize, particles } = config;
  const size = gridSize * cellSize;

  // Background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, size, size);

  // Grid lines
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(size, i * cellSize);
    ctx.stroke();
  }

  // Obstacles
  for (const obs of state.obstacles) {
    ctx.fillStyle = COLORS.obstacle;
    roundRect(ctx, obs.x * cellSize + 1, obs.y * cellSize + 1, cellSize - 2, cellSize - 2, 3);
    ctx.fill();
    // X cross detail
    ctx.strokeStyle = COLORS.obstacleDetail;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(obs.x * cellSize + 5, obs.y * cellSize + 5);
    ctx.lineTo((obs.x + 1) * cellSize - 5, (obs.y + 1) * cellSize - 5);
    ctx.moveTo((obs.x + 1) * cellSize - 5, obs.y * cellSize + 5);
    ctx.lineTo(obs.x * cellSize + 5, (obs.y + 1) * cellSize - 5);
    ctx.stroke();
  }

  // Power-up on board
  if (state.powerUp) {
    const pu = state.powerUp;
    const age = Date.now() - pu.spawnedAt;
    const timeLeft = POWER_UP_BOARD_DURATION - age;
    // Blink when < 2 seconds left
    const visible = timeLeft > 2000 || Math.floor(timestamp / 200) % 2 === 0;

    if (visible) {
      const puPulse = 1 + 0.1 * Math.sin(timestamp / 200);
      const puX = pu.position.x * cellSize + cellSize / 2;
      const puY = pu.position.y * cellSize + cellSize / 2;
      const puR = (cellSize / 2 - 2) * puPulse;

      ctx.globalAlpha = 0.9;
      ctx.fillStyle = POWER_UP_COLORS[pu.type];
      ctx.beginPath();
      ctx.arc(puX, puY, puR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(cellSize * 0.42)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(POWER_UP_SYMBOLS[pu.type], puX, puY + 1);
    }
  }

  // Food (pulsing)
  const pulse = 1 + 0.12 * Math.sin(timestamp / 300);
  const foodX = state.food.x * cellSize + cellSize / 2;
  const foodY = state.food.y * cellSize + cellSize / 2;
  const foodR = (cellSize / 2 - 3) * pulse;
  ctx.fillStyle = COLORS.food;
  ctx.beginPath();
  ctx.arc(foodX, foodY, foodR, 0, Math.PI * 2);
  ctx.fill();

  // Snake body
  ctx.fillStyle = COLORS.snakeBody;
  for (let i = 1; i < state.snake.length; i++) {
    const seg = state.snake[i];
    roundRect(ctx, seg.x * cellSize + 2, seg.y * cellSize + 2, cellSize - 4, cellSize - 4, 4);
    ctx.fill();
  }

  // Snake head
  if (state.snake.length > 0) {
    const head = state.snake[0];
    ctx.fillStyle = COLORS.snakeHead;
    roundRect(ctx, head.x * cellSize + 1, head.y * cellSize + 1, cellSize - 2, cellSize - 2, 5);
    ctx.fill();
  }

  // Active effect border glow
  if (state.activeEffect) {
    const effectColor = POWER_UP_COLORS[state.activeEffect.type];
    const timeLeft = state.activeEffect.endsAt - Date.now();
    const blink = timeLeft < 1500 && Math.floor(timestamp / 180) % 2 === 0;
    ctx.strokeStyle = effectColor;
    ctx.lineWidth = 4;
    ctx.globalAlpha = blink ? 0.2 : 0.65;
    ctx.strokeRect(2, 2, size - 4, size - 4);
    ctx.globalAlpha = 1;
  }

  // Particles
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
