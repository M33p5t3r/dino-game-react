import React, { useEffect, useRef, useState, useCallback } from 'react';
import './DinoGame.css';

const DinoGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('dinoHighScore')) || 0
  );

  // Game variables
  const gameRef = useRef({
    dino: {
      x: 50,
      y: 150,
      width: 40,
      height: 40,
      dy: 0,
      jumpPower: 15,
      grounded: true
    },
    obstacles: [],
    ground: 200,
    gameSpeed: 3,
    obstacleTimer: 0,
    score: 0,
    gameRunning: false
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 200;
  const GRAVITY = 0.8;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  }, []);

  // Draw functions
  const drawDino = (ctx, dino) => {
    ctx.fillStyle = '#535353';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    
    // Simple dino shape
    ctx.fillStyle = '#535353';
    // Body
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    // Head
    ctx.fillRect(dino.x + 25, dino.y - 15, 20, 20);
    // Legs
    if (Math.floor(Date.now() / 100) % 2) {
      ctx.fillRect(dino.x + 5, dino.y + dino.height, 8, 10);
      ctx.fillRect(dino.x + 25, dino.y + dino.height, 8, 10);
    } else {
      ctx.fillRect(dino.x + 10, dino.y + dino.height, 8, 10);
      ctx.fillRect(dino.x + 20, dino.y + dino.height, 8, 10);
    }
  };

  const drawObstacle = (ctx, obstacle) => {
    ctx.fillStyle = '#535353';
    // Cactus shape
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    // Cactus arms
    ctx.fillRect(obstacle.x - 5, obstacle.y + 10, 10, 15);
    ctx.fillRect(obstacle.x + obstacle.width - 5, obstacle.y + 20, 10, 15);
  };

  const drawGround = (ctx) => {
    ctx.strokeStyle = '#535353';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, gameRef.current.ground);
    ctx.lineTo(CANVAS_WIDTH, gameRef.current.ground);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawScore = (ctx, score) => {
    ctx.fillStyle = '#535353';
    ctx.font = '16px Courier New';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${Math.floor(score)}`, CANVAS_WIDTH - 20, 30);
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH - 20, 50);
  };

  const drawGameOver = (ctx) => {
    ctx.fillStyle = '#535353';
    ctx.font = '24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.font = '16px Courier New';
    ctx.fillText('Press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
  };

  const drawWaiting = (ctx) => {
    ctx.fillStyle = '#535353';
    ctx.font = '18px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  };

  // Game logic
  const jump = useCallback(() => {
    const game = gameRef.current;
    if (game.dino.grounded) {
      game.dino.dy = -game.dino.jumpPower;
      game.dino.grounded = false;
    }
  }, []);

  const resetGame = useCallback(() => {
    const game = gameRef.current;
    game.dino.y = 150;
    game.dino.dy = 0;
    game.dino.grounded = true;
    game.obstacles = [];
    game.obstacleTimer = 0;
    game.score = 0;
    game.gameSpeed = 3;
    setScore(0);
  }, []);

  const checkCollision = (dino, obstacle) => {
    return (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + obstacle.height &&
      dino.y + dino.height > obstacle.y
    );
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gameState === 'waiting') {
      drawDino(ctx, game.dino);
      drawGround(ctx);
      drawWaiting(ctx);
      return;
    }

    if (gameState === 'playing') {
      // Update dino physics
      if (!game.dino.grounded) {
        game.dino.dy += GRAVITY;
        game.dino.y += game.dino.dy;
      }

      // Ground collision
      if (game.dino.y >= 150) {
        game.dino.y = 150;
        game.dino.dy = 0;
        game.dino.grounded = true;
      }

      // Generate obstacles
      game.obstacleTimer++;
      if (game.obstacleTimer > 100) {
        game.obstacles.push({
          x: CANVAS_WIDTH,
          y: 160,
          width: 20,
          height: 40
        });
        game.obstacleTimer = 0;
      }

      // Update obstacles
      game.obstacles = game.obstacles.filter(obstacle => {
        obstacle.x -= game.gameSpeed;
        return obstacle.x > -obstacle.width;
      });

      // Check collisions
      for (let obstacle of game.obstacles) {
        if (checkCollision(game.dino, obstacle)) {
          setGameState('gameOver');
          if (game.score > highScore) {
            setHighScore(Math.floor(game.score));
            localStorage.setItem('dinoHighScore', Math.floor(game.score).toString());
          }
          return;
        }
      }

      // Update score and speed
      game.score += 0.1;
      game.gameSpeed = 3 + Math.floor(game.score / 100) * 0.5;
      setScore(game.score);
    }

    // Draw everything
    drawGround(ctx);
    drawDino(ctx, game.dino);
    
    if (gameState === 'playing') {
      game.obstacles.forEach(obstacle => drawObstacle(ctx, obstacle));
      drawScore(ctx, game.score);
    } else if (gameState === 'gameOver') {
      game.obstacles.forEach(obstacle => drawObstacle(ctx, obstacle));
      drawScore(ctx, game.score);
      drawGameOver(ctx);
    }
  }, [gameState, highScore]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'waiting') {
          setGameState('playing');
        } else if (gameState === 'playing') {
          jump();
        } else if (gameState === 'gameOver') {
          resetGame();
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, jump, resetGame]);

  // Game loop
  useEffect(() => {
    const interval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [gameLoop]);

  const handleCanvasClick = () => {
    if (gameState === 'waiting') {
      setGameState('playing');
    } else if (gameState === 'playing') {
      jump();
    } else if (gameState === 'gameOver') {
      resetGame();
      setGameState('playing');
    }
  };

  return (
    <div className="dino-game">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        onClick={handleCanvasClick}
      />
      <div className="game-instructions">
        <p>Press SPACE or click to jump!</p>
        <p>Current Score: {Math.floor(score)}</p>
      </div>
    </div>
  );
};

export default DinoGame; 