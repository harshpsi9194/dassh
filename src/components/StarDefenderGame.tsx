
import { useEffect, useRef } from 'react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Spaceship extends GameObject {
  dx: number;
  dy: number;
  hoverDirection: number;
}

interface Enemy extends GameObject {
  dy: number;
  health: number;
}

interface Missile extends GameObject {
  dy: number;
}

interface Explosion {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

const StarDefenderGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    spaceship: { x: 0, y: 0, width: 20, height: 16, dx: 2, dy: 0, hoverDirection: 1 } as Spaceship,
    enemies: [] as Enemy[],
    missiles: [] as Missile[],
    explosions: [] as Explosion[],
    gameSpeed: 1,
    lastMissileTime: 0,
    missileInterval: 100, // Fire every 100ms for intense combat
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
    gameState.spaceship.y = canvas.height - 120; // Position in the gap above input box

    const spawnEnemy = () => {
      if (Math.random() < 0.008) { // Increased spawn rate for more combat
        const enemy: Enemy = {
          x: Math.random() * (canvas.width - 20),
          y: -20,
          width: 16,
          height: 16,
          dy: 0.8 + Math.random() * 1.2,
          health: 1
        };
        gameState.enemies.push(enemy);
      }
    };

    const spawnMissile = (currentTime: number) => {
      if (currentTime - gameState.lastMissileTime > gameState.missileInterval) {
        const missile: Missile = {
          x: gameState.spaceship.x + gameState.spaceship.width / 2 - 1,
          y: gameState.spaceship.y,
          width: 2,
          height: 8,
          dy: -4
        };
        gameState.missiles.push(missile);
        gameState.lastMissileTime = currentTime;
      }
    };

    const createExplosion = (x: number, y: number) => {
      gameState.explosions.push({
        x,
        y,
        life: 0,
        maxLife: 15
      });
    };

    const checkCollisions = () => {
      gameState.missiles.forEach((missile, missileIndex) => {
        gameState.enemies.forEach((enemy, enemyIndex) => {
          if (
            missile.x < enemy.x + enemy.width &&
            missile.x + missile.width > enemy.x &&
            missile.y < enemy.y + enemy.height &&
            missile.y + missile.height > enemy.y
          ) {
            // Hit detected
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            gameState.missiles.splice(missileIndex, 1);
            gameState.enemies.splice(enemyIndex, 1);
          }
        });
      });
    };

    const updateSpaceship = () => {
      // Horizontal movement
      gameState.spaceship.x += gameState.spaceship.dx;
      
      if (gameState.spaceship.x <= 0 || gameState.spaceship.x >= canvas.width - gameState.spaceship.width) {
        gameState.spaceship.dx *= -1;
      }

      // Hover effect (vertical bobbing) 
      gameState.spaceship.dy += gameState.spaceship.hoverDirection * 0.02;
      if (Math.abs(gameState.spaceship.dy) > 0.5) {
        gameState.spaceship.hoverDirection *= -1;
      }
      gameState.spaceship.y += gameState.spaceship.dy;
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

    const updateExplosions = () => {
      gameState.explosions = gameState.explosions.filter(explosion => {
        explosion.life++;
        return explosion.life < explosion.maxLife;
      });
    };

    const drawSpaceship = () => {
      ctx.fillStyle = 'rgba(0, 255, 204, 0.8)';
      ctx.fillRect(gameState.spaceship.x, gameState.spaceship.y, gameState.spaceship.width, gameState.spaceship.height);
      
      // Add ship outline for better visibility
      ctx.strokeStyle = '#00FFCC';
      ctx.lineWidth = 1;
      ctx.strokeRect(gameState.spaceship.x, gameState.spaceship.y, gameState.spaceship.width, gameState.spaceship.height);
    };

    const drawEnemies = () => {
      ctx.fillStyle = 'rgba(180, 180, 180, 0.7)';
      gameState.enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Add enemy outline
        ctx.strokeStyle = 'rgba(180, 180, 180, 0.9)';
        ctx.lineWidth = 1;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
    };

    const drawMissiles = () => {
      ctx.fillStyle = '#00FFCC';
      gameState.missiles.forEach(missile => {
        ctx.fillRect(missile.x, missile.y, missile.width, missile.height);
        
        // Add missile trail effect
        ctx.fillStyle = 'rgba(0, 255, 204, 0.3)';
        ctx.fillRect(missile.x - 1, missile.y + missile.height, missile.width + 2, 4);
        ctx.fillStyle = '#00FFCC';
      });
    };

    const drawExplosions = () => {
      gameState.explosions.forEach(explosion => {
        const progress = explosion.life / explosion.maxLife;
        const size = 8 * (1 - progress);
        const opacity = 1 - progress;
        
        ctx.fillStyle = `rgba(0, 255, 204, ${opacity})`;
        ctx.fillRect(explosion.x - size/2, explosion.y - size/2, size, size);
      });
    };

    const gameLoop = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateSpaceship();
      updateEnemies();
      updateMissiles();
      updateExplosions();
      spawnEnemy();
      spawnMissile(currentTime);
      checkCollisions();

      drawSpaceship();
      drawEnemies();
      drawMissiles();
      drawExplosions();

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);

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
        opacity: 0.5,
        pointerEvents: 'none',
      }}
    />
  );
};

export default StarDefenderGame;
