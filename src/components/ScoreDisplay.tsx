/**
 * Score Display Component
 * 
 * Shows current score, best score, level, and game status with
 * smooth animations and visual feedback.
 */

import React, { useEffect, useState } from 'react';
import { ScoreDisplayProps } from '../types/game.types';
import { formatScore } from '../utils/gameHelpers';

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  bestScore,
  level,
  gameState,
}) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate score changes
  useEffect(() => {
    if (score !== displayScore) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayScore(score);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [score, displayScore]);

  // Get game status text and color
  const getGameStatus = () => {
    switch (gameState) {
      case 'READY':
        return { text: 'READY', color: 'text-neon-blue' };
      case 'PLAYING':
        return { text: 'PLAYING', color: 'text-neon-green' };
      case 'PAUSED':
        return { text: 'PAUSED', color: 'text-yellow-400' };
      case 'GAME_OVER':
        return { text: 'GAME OVER', color: 'text-neon-red' };
      default:
        return { text: 'READY', color: 'text-neon-blue' };
    }
  };

  const gameStatus = getGameStatus();

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      {/* Game Title */}
      <div className="text-center mb-6">
        <h1 className="font-black text-3xl md:text-4xl mb-2" style={{fontFamily: "'Orbitron', 'JetBrains Mono', monospace", color: '#00ff00'}}>
          🐍 SNAKE GAME
        </h1>
        <div className="text-sm font-mono transition-colors duration-300" style={{color: gameStatus.color === 'text-neon-blue' ? '#00bfff' : gameStatus.color === 'text-neon-green' ? '#00ff00' : gameStatus.color === 'text-yellow-400' ? '#facc15' : '#ff0000'}}>
          {gameStatus.text}
        </div>
      </div>

      {/* Score and Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Current Score */}
        <div className="rounded-lg p-4 text-center" style={{background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333333'}}>
          <div className="text-xs text-gray-400 font-mono mb-1">SCORE</div>
          <div 
            className={`score-text transition-all duration-300 ${
              isAnimating ? 'scale-110' : 'scale-100'
            }`}
          >
            {formatScore(displayScore)}
          </div>
        </div>

        {/* Best Score */}
        <div className="rounded-lg p-4 text-center" style={{background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333333'}}>
          <div className="text-xs text-gray-400 font-mono mb-1 flex items-center justify-center gap-1">
            🏆 BEST
          </div>
          <div className="font-black text-2xl" style={{fontFamily: "'Orbitron', 'JetBrains Mono', monospace", color: '#00bfff'}}>
            {formatScore(bestScore)}
          </div>
        </div>
      </div>

      {/* Level and Progress */}
      <div className="rounded-lg p-4" style={{background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333333'}}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-400 font-mono">LEVEL</div>
          <div className="font-bold text-lg" style={{fontFamily: "'Orbitron', 'JetBrains Mono', monospace", color: '#00ff00'}}>
            {level}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full rounded-full h-2" style={{backgroundColor: '#333333'}}>
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{
              background: 'linear-gradient(to right, #00ff00, #00bfff)',
              width: `${Math.min((score % 50) / 50 * 100, 100)}%`
            }}
          />
        </div>
        
        <div className="text-xs text-gray-500 font-mono mt-1 text-center">
          Next level: {Math.ceil(score / 50) * 50 - score} points
        </div>
      </div>

      {/* Snake Length Indicator */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-400 font-mono mb-1">SNAKE LENGTH</div>
        <div className="font-bold text-lg" style={{fontFamily: "'Orbitron', 'JetBrains Mono', monospace", color: '#00ff00'}}>
          {Math.floor(score / 10) + 3}
        </div>
      </div>

      {/* Achievement Notifications */}
      {score > 0 && score % 50 === 0 && (
        <div className="mt-4 animate-bounce">
          <div className="px-4 py-2 rounded-lg text-center font-bold" style={{backgroundColor: '#00ff00', color: '#0a0a0a', fontFamily: "'Orbitron', 'JetBrains Mono', monospace"}}>
            🎉 LEVEL UP! 🎉
          </div>
        </div>
      )}

      {score > 0 && score % 100 === 0 && (
        <div className="mt-4 animate-pulse">
          <div className="px-4 py-2 rounded-lg text-center font-bold" style={{backgroundColor: '#00bfff', color: '#0a0a0a', fontFamily: "'Orbitron', 'JetBrains Mono', monospace"}}>
            🏆 CENTURY CLUB! 🏆
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ScoreDisplay);
