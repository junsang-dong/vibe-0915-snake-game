/**
 * Main App Component
 * 
 * The main application component that orchestrates all game components
 * and manages the overall game state and user interactions.
 */

import { useState, useEffect, useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { useGameInput } from './hooks/useKeyboardInput';
import { useGameAchievements } from './hooks/useGameLogic';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import ScoreDisplay from './components/ScoreDisplay';
import GameOverModal from './components/GameOverModal';
import MobileControls from './components/MobileControls';
import { DEFAULT_GAME_CONFIG } from './types/game.types';
import { isMobileDevice } from './utils/gameHelpers';

function App() {
  // Game logic hook
  const {
    gameData,
    changeDirection,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    isGameOver,
    isPlaying,
    isPaused,
  } = useGameLogic();

  // Game achievements
  useGameAchievements(gameData.score);

  // Input handling
  const { disableInput, enableInput } = useGameInput({
    onDirectionChange: changeDirection,
    onPause: isPlaying ? pauseGame : undefined,
    onStart: startGame,
    onReset: resetGame,
    enabled: true,
  });

  // Modal state
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  // Handle game over
  useEffect(() => {
    if (isGameOver) {
      setShowGameOverModal(true);
      disableInput();
    } else {
      setShowGameOverModal(false);
      enableInput();
    }
  }, [isGameOver, disableInput, enableInput]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    setShowGameOverModal(false);
    startGame();
  }, [startGame]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowGameOverModal(false);
  }, []);

  // Handle cell click for mobile
  const handleCellClick = useCallback((position: { x: number; y: number }) => {
    if (!isMobileDevice() || !isPlaying) return;
    
    // Simple mobile direction logic - move towards clicked cell
    const head = gameData.snake.segments[0];
    const dx = position.x - head.x;
    const dy = position.y - head.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else if (dy !== 0) {
      changeDirection(dy > 0 ? 'DOWN' : 'UP');
    }
  }, [isPlaying, gameData.snake.segments, changeDirection]);

  // Prevent scrolling on mobile during game
  useEffect(() => {
    if (isMobileDevice()) {
      if (isPlaying) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen text-white font-mono" style={{background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'}}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #00ff00 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #00bfff 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px',
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="font-black text-4xl md:text-6xl mb-2" style={{fontFamily: "'Orbitron', 'JetBrains Mono', monospace", color: '#00ff00'}}>
              🐍 SNAKE GAME
            </h1>
            <div className="w-full h-1 rounded-full" style={{background: 'linear-gradient(to right, #00ff00, #00bfff, #ff0000)'}}></div>
          </div>
        </div>

        {/* Game Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Score Display */}
          <ScoreDisplay
            score={gameData.score}
            bestScore={gameData.bestScore}
            level={gameData.level}
            gameState={gameData.gameState}
          />

          {/* Game Board */}
          <div className="flex justify-center mb-8">
            <GameBoard
              snake={gameData.snake}
              food={gameData.food}
              boardSize={DEFAULT_GAME_CONFIG.BOARD_SIZE}
              onCellClick={handleCellClick}
            />
          </div>

          {/* Game Controls */}
          <GameControls
            gameState={gameData.gameState}
            isPaused={isPaused}
            onStart={startGame}
            onPause={pauseGame}
            onResume={resumeGame}
            onReset={resetGame}
          />

          {/* Mobile Controls */}
          <MobileControls
            onDirectionChange={changeDirection}
            isVisible={isMobileDevice()}
          />
        </div>

        {/* Game Over Modal */}
        <GameOverModal
          isOpen={showGameOverModal}
          finalScore={gameData.score}
          bestScore={gameData.bestScore}
          level={gameData.level}
          onPlayAgain={handlePlayAgain}
          onClose={handleCloseModal}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p className="font-mono">
            Use arrow keys to move • Space to pause • R to reset
          </p>
          <p className="mt-1 text-xs">
            Built with React + TypeScript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;