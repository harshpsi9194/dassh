
import { useEffect, useRef } from 'react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Spaceship extends GameObject {
  dx: number;
}

interface Enemy extends GameObject {
  dy: number;
}

interface Missile extends GameObject {
  dy: number;
}

const StarDefenderGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    spaceship: { x: 0, y: 0, width: 12, height: 8, dx: 1 } as Spaceship,
    enemies: [] as Enemy[],
    missiles: [] as Missile[],
    gameSpeed: 0.5,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gameState = gameStateRef.current;
    gameState.spaceship.x = canvas.width / 2 - gameState.spaceship.width / 2;
    gameState.spaceship.y = canvas.height - 60;

    const spawnEnemy = () => {
      if (Math.random() < 0.002) {
        const enemy: Enemy = {
          x: Math.random() * (canvas.width - 15),
          y: -15,
          width: 8,
          height: 8,
          dy: 0.3 + Math.random() * 0.5
        };
        gameState.enemies.push(enemy);
      }
    };

    const spawnMissile = () => {
      if (Math.random() < 0.001) {
        const missile: Missile = {
          x: gameState.spaceship.x + gameState.spaceship.width / 2 - 1,
          y: gameState.spaceship.y,
          width: 2,
          height: 6,
          dy: -2
        };
        gameState.missiles.push(missile);
      }
    };

    const updateSpaceship = () => {
      gameState.spaceship.x += gameState.spaceship.dx;
      
      if (gameState.spaceship.x <= 0 || gameState.spaceship.x >= canvas.width - gameState.spaceship.width) {
        gameState.spaceship.dx *= -1;
      }
    };

    const updateEnemies = () => {
      gameState.enemies = gameState.enemies.filter(enemy => {
        enemy.y += enemy.dy;
        return enemy.y < canvas.height + enemy.height;
      });
    };

    const updateMissiles = () => {
      gameState.missiles = gameState.missiles.filter(missile => {
        missile.y += missile.dy;
        return missile.y > -missile.height;
      });
    };

    const drawSpaceship = () => {
      ctx.fillStyle = 'rgba(128, 128, 128, 0.4)';
      ctx.fillRect(gameState.spaceship.x, gameState.spaceship.y, gameState.spaceship.width, gameState.spaceship.height);
    };

    const drawEnemies = () => {
      ctx.fillStyle = 'rgba(128, 128, 128, 0.35)';
      gameState.enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
    };

    const drawMissiles = () => {
      ctx.fillStyle = 'rgba(0, 255, 204, 0.2)';
      gameState.missiles.forEach(missile => {
        ctx.fillRect(missile.x, missile.y, missile.width, missile.height);
      });
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateSpaceship();
      updateEnemies();
      updateMissiles();
      spawnEnemy();
      spawnMissile();

      drawSpaceship();
      drawEnemies();
      drawMissiles();

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="star-defender-game"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.35,
        pointerEvents: 'none',
      }}
    />
  );
};

export default StarDefenderGame;
