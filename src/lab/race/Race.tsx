import React, { useEffect, useRef, useState } from "react";
import "./Race.css";

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isOnGround: boolean;
  jumpAttempts: number;
  lastJumpTime: number;
}

interface GameState {
  player: Player;
  cameraX: number;
  levelWidth: number;
  gameRunning: boolean;
  boostEndTime: number | null;
  boostCooldownEndTime: number | null;
}

const Race: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const gameStateRef = useRef<GameState>({
    player: {
      x: 50,
      y: 200,
      width: 30,
      height: 30,
      velocityX: 2, // Start with base speed
      velocityY: 0,
      isOnGround: false,
      jumpAttempts: 2, // Start with 2 jump attempts
      lastJumpTime: 0,
    },
    cameraX: 0,
    levelWidth: 2000,
    gameRunning: true,
    boostEndTime: null,
    boostCooldownEndTime: null,
  });
  const keysRef = useRef<Set<string>>(new Set());

  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [keys, setKeys] = useState<Set<string>>(() => new Set());

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      setKeys(new Set(keysRef.current));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
      setKeys(new Set(keysRef.current));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      // Update game state only if game is running
      if (gameStateRef.current.gameRunning) {
        const newGameState = updateGame(gameStateRef.current, keysRef.current);
        gameStateRef.current = newGameState;
        setGameState(newGameState);
      }

      // Always render, even when game is won
      render(ctx, gameStateRef.current);

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency array - only run once

  const updateGame = (state: GameState, pressedKeys: Set<string>): GameState => {
    const newState = { ...state };
    const player = { ...state.player };
    const currentTime = Date.now();

    // Handle boost system
    const baseSpeed = 2;
    const maxBoostSpeed = 4;
    const boostDuration = 2000; // 2 seconds
    const boostCooldown = 4000; // 4 seconds

    // Check if boost should end
    if (state.boostEndTime && currentTime > state.boostEndTime) {
      newState.boostEndTime = null;
      // Decelerate to base speed after boost ends
      player.velocityX = Math.max(player.velocityX - 0.5, baseSpeed);
    }

    // Check if boost cooldown should end
    if (state.boostCooldownEndTime && currentTime > state.boostCooldownEndTime) {
      newState.boostCooldownEndTime = null;
    }

    // Handle boost activation
    if (pressedKeys.has('KeyD') && !state.boostEndTime && !state.boostCooldownEndTime) {
      newState.boostEndTime = currentTime + boostDuration;
      newState.boostCooldownEndTime = currentTime + boostCooldown;
      player.velocityX = maxBoostSpeed;
    }

    // Auto acceleration - player always moves forward
    const acceleration = 0.1;

    // If player is below base speed, accelerate towards it
    if (player.velocityX < baseSpeed) {
      player.velocityX = Math.min(player.velocityX + acceleration, baseSpeed);
    }

    // Handle boost speed maintenance
    if (state.boostEndTime && currentTime < state.boostEndTime) {
      // Maintain boost speed
      player.velocityX = maxBoostSpeed;
    } else if (!state.boostEndTime && player.velocityX > baseSpeed) {
      // Decelerate to base speed when not boosting
      player.velocityX = Math.max(player.velocityX - 0.2, baseSpeed);
    }

    // Handle input for additional speed or slowing down
    if (pressedKeys.has('ArrowRight')) {
      player.velocityX = Math.min(player.velocityX + 0.3, 8); // Boost speed
    } else if (pressedKeys.has('ArrowLeft')) {
      player.velocityX = Math.max(player.velocityX - 0.2, baseSpeed); // Slow down but don't stop
    }

    // Jump with deceleration and jump attempts (with cooldown to prevent double consumption)
    const jumpCooldown = 200; // 200ms cooldown between jumps
    if ((pressedKeys.has('ArrowUp') || pressedKeys.has('KeyW') || pressedKeys.has('Space')) && 
        player.jumpAttempts > 0 && 
        currentTime - player.lastJumpTime > jumpCooldown) {
      player.velocityY = -12;
      player.isOnGround = false;
      player.jumpAttempts--; // Consume one jump attempt
      player.lastJumpTime = currentTime; // Set jump time to prevent double consumption
      // Decelerate when jumping
      player.velocityX = Math.max(player.velocityX - 0.5, baseSpeed * 0.8);
    }

    // Apply gravity
    player.velocityY += 0.6;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Ground collision
    const groundY = 300;
    if (player.y + player.height > groundY) {
      player.y = groundY - player.height;
      player.velocityY = 0;
      player.isOnGround = true;
      // Recover all jump attempts when landing
      player.jumpAttempts = 2;
    }

    // Obstacle collision detection and handling
    const obstacles = [];
    for (let i = 0; i < state.levelWidth; i += 200) {
      obstacles.push({ x: i, y: 250, width: 20, height: 50 });
    }

    for (const obstacle of obstacles) {
      if (player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y) {
        
        // Collision detected - slow down and auto-climb
        player.velocityX = Math.max(player.velocityX - 1, baseSpeed * 0.5);
        
        // Auto-climb: if player is on ground and hitting obstacle, jump over it
        if (player.isOnGround && player.y + player.height >= obstacle.y) {
          player.velocityY = -8;
          player.isOnGround = false;
        }
        
        // Push player back slightly to prevent getting stuck
        if (player.x < obstacle.x + obstacle.width) {
          player.x = obstacle.x - player.width;
        }
      }
    }

    // Boundary collision
    if (player.x < 0) {
      player.x = 0;
      player.velocityX = 0;
    }

    // Update camera to follow player
    const targetCameraX = player.x - 400; // Keep player in center
    newState.cameraX = Math.max(0, Math.min(targetCameraX, state.levelWidth - 800));

    // Check if player reached the end
    if (player.x >= state.levelWidth - 50) {
      newState.gameRunning = false;
    }

    newState.player = player;
    return newState;
  };

  const render = (ctx: CanvasRenderingContext2D, state: GameState) => {
    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, 800, 400);

    // Save context for camera transform
    ctx.save();
    ctx.translate(-state.cameraX, 0);

    // Draw ground
    ctx.fillStyle = '#8B4513'; // Brown ground
    ctx.fillRect(0, 300, state.levelWidth, 100);

    // Draw grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 300, state.levelWidth, 20);

    // Draw player
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);

    // Draw obstacles
    ctx.fillStyle = '#654321';
    for (let i = 0; i < state.levelWidth; i += 200) {
      if (i > state.cameraX - 50 && i < state.cameraX + 850) {
        ctx.fillRect(i, 250, 20, 50);
      }
    }

    // Draw finish line
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(state.levelWidth - 50, 0, 50, 400);
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('FINISH', state.levelWidth - 40, 200);

    // Restore context
    ctx.restore();

    // Draw UI
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Position: ${Math.round(state.player.x)}`, 10, 30);
    ctx.fillText(`Speed: ${state.player.velocityX.toFixed(1)}`, 10, 50);
    ctx.fillText(`Camera: ${Math.round(state.cameraX)}`, 10, 70);
    ctx.fillText(`Jumps: ${state.player.jumpAttempts}/2`, 10, 110);

    // Draw boost status
    const currentTime = Date.now();
    if (state.boostEndTime && currentTime < state.boostEndTime) {
      ctx.fillStyle = '#00FF00';
      ctx.fillText('BOOST ACTIVE!', 10, 90);
    } else if (state.boostCooldownEndTime && currentTime < state.boostCooldownEndTime) {
      const cooldownLeft = Math.ceil((state.boostCooldownEndTime - currentTime) / 1000);
      ctx.fillStyle = '#FF0000';
      ctx.fillText(`Boost Cooldown: ${cooldownLeft}s`, 10, 90);
    } else {
      ctx.fillStyle = '#0000FF';
      ctx.fillText('Press D to Boost!', 10, 90);
    }

    if (!state.gameRunning) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 800, 400);
      ctx.fillStyle = '#FFD700';
      ctx.font = '48px Arial';
      ctx.fillText('YOU WIN!', 300, 200);
    }
  };

  const resetGame = () => {
    const newState = {
      player: {
        x: 50,
        y: 200,
        width: 30,
        height: 30,
        velocityX: 2, // Start with base speed
        velocityY: 0,
        isOnGround: false,
        jumpAttempts: 2, // Start with 2 jump attempts
        lastJumpTime: 0,
      },
      cameraX: 0,
      levelWidth: 2000,
      gameRunning: true,
      boostEndTime: null,
      boostCooldownEndTime: null,
    };
    gameStateRef.current = newState;
    setGameState(newState);

    // Clear all keys when resetting
    keysRef.current.clear();
    setKeys(new Set());

    // Remove focus from the button after clicking
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="race-container">
      <div className="game-info">
        <p>W/Space: Jump (2 attempts, recover on landing), D: Boost (2s duration, 4s cooldown), Arrow keys: Manual control</p>
        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="game-canvas"
      />
    </div>
  );
};

export default Race;