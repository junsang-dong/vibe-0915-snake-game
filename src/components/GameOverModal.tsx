/**
 * Game Over Modal Component
 * 
 * Displays game over screen with final score, achievements,
 * and play again options with smooth animations.
 */

import React, { useEffect, useState } from 'react';
import { GameOverModalProps } from '../types/game.types';
import { formatScore } from '../utils/gameHelpers';

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  finalScore,
  bestScore,
  level,
  onPlayAgain,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Handle modal visibility with animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  const isNewBest = finalScore > bestScore;

  // Get achievement message based on score
  const getAchievementMessage = () => {
    if (finalScore >= 500) return "🏆 LEGENDARY SNAKE! 🏆";
    if (finalScore >= 250) return "🎯 SNAKE MASTER! 🎯";
    if (finalScore >= 100) return "🎉 CENTURY CLUB! 🎉";
    if (finalScore >= 50) return "🚀 GETTING STARTED! 🚀";
    if (finalScore >= 10) return "🐍 FIRST BITE! 🐍";
    return "💪 KEEP TRYING! 💪";
  };

  return (
    <div 
      className={`game-over-overlay transition-opacity duration-300 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`game-over-modal transition-all duration-500 transform ${
          showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Game Over Title */}
        <div className="mb-6">
          <h2 className="font-gaming font-black text-4xl text-neon-red mb-2 animate-pulse">
            GAME OVER
          </h2>
          <div className="w-full h-1 bg-gradient-to-r from-neon-red to-neon-blue rounded-full"></div>
        </div>

        {/* Final Score */}
        <div className="mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400 font-mono mb-2">FINAL SCORE</div>
            <div className="font-gaming font-black text-5xl text-neon-green mb-2">
              {formatScore(finalScore)}
            </div>
            
            {isNewBest && (
              <div className="bg-neon-green text-dark-bg px-4 py-2 rounded-lg font-gaming font-bold animate-bounce">
                🎉 NEW BEST SCORE! 🎉
              </div>
            )}
          </div>
        </div>

        {/* Score Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-panel border border-dark-border rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 font-mono mb-1">BEST SCORE</div>
            <div className="font-gaming font-bold text-xl text-neon-blue">
              {formatScore(bestScore)}
            </div>
          </div>
          
          <div className="bg-dark-panel border border-dark-border rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 font-mono mb-1">LEVEL REACHED</div>
            <div className="font-gaming font-bold text-xl text-neon-green">
              {level}
            </div>
          </div>
        </div>

        {/* Achievement Message */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-neon-blue to-neon-green text-dark-bg px-4 py-3 rounded-lg text-center font-gaming font-bold text-lg">
            {getAchievementMessage()}
          </div>
        </div>

        {/* Snake Length Stats */}
        <div className="mb-6 text-center">
          <div className="text-sm text-gray-400 font-mono mb-2">SNAKE LENGTH</div>
          <div className="font-gaming font-bold text-2xl text-neon-green">
            {Math.floor(finalScore / 10) + 3} segments
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPlayAgain}
            className="control-button flex-1 py-4 text-lg font-gaming bg-neon-green text-dark-bg hover:bg-green-400"
          >
            PLAY AGAIN
          </button>
          
          <button
            onClick={onClose}
            className="control-button flex-1 py-4 text-lg font-gaming border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-bg"
          >
            CLOSE
          </button>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 pt-4 border-t border-dark-border">
          <div className="grid grid-cols-2 gap-4 text-center text-sm font-mono">
            <div>
              <div className="text-gray-400 mb-1">Points per Food</div>
              <div className="text-neon-green font-bold">10</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Food Eaten</div>
              <div className="text-neon-green font-bold">{Math.floor(finalScore / 10)}</div>
            </div>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 font-mono">
            Press ENTER to play again or ESC to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GameOverModal);
