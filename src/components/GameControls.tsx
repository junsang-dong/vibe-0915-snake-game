/**
 * Game Controls Component
 * 
 * Provides start, pause, resume, and reset controls with
 * visual feedback and responsive design.
 */

import React from 'react';
import { GameControlsProps } from '../types/game.types';

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  // Get button text and state based on game state
  const getButtonConfig = () => {
    switch (gameState) {
      case 'READY':
        return {
          primaryText: 'START GAME',
          primaryAction: onStart,
          secondaryText: 'RESET',
          secondaryAction: onReset,
          showSecondary: false,
        };
      case 'PLAYING':
        return {
          primaryText: isPaused ? 'RESUME' : 'PAUSE',
          primaryAction: isPaused ? onResume : onPause,
          secondaryText: 'RESET',
          secondaryAction: onReset,
          showSecondary: true,
        };
      case 'PAUSED':
        return {
          primaryText: 'RESUME',
          primaryAction: onResume,
          secondaryText: 'RESET',
          secondaryAction: onReset,
          showSecondary: true,
        };
      case 'GAME_OVER':
        return {
          primaryText: 'PLAY AGAIN',
          primaryAction: onStart,
          secondaryText: 'RESET',
          secondaryAction: onReset,
          showSecondary: true,
        };
      default:
        return {
          primaryText: 'START GAME',
          primaryAction: onStart,
          secondaryText: 'RESET',
          secondaryAction: onReset,
          showSecondary: false,
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Primary Button */}
        <button
          onClick={buttonConfig.primaryAction}
          className="control-button flex-1 py-4 text-lg font-gaming"
          disabled={!buttonConfig.primaryAction}
        >
          {buttonConfig.primaryText}
        </button>

        {/* Secondary Button */}
        {buttonConfig.showSecondary && (
          <button
            onClick={buttonConfig.secondaryAction}
            className="control-button flex-1 py-4 text-lg font-gaming border-neon-red text-neon-red hover:bg-neon-red hover:text-dark-bg"
            disabled={!buttonConfig.secondaryAction}
          >
            {buttonConfig.secondaryText}
          </button>
        )}
      </div>

      {/* Game Instructions */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
        <h3 className="font-gaming font-bold text-neon-blue mb-3 text-center">
          CONTROLS
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          {/* Desktop Controls */}
          <div>
            <div className="text-gray-400 mb-2">Desktop:</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Move:</span>
                <span className="text-neon-green">Arrow Keys</span>
              </div>
              <div className="flex justify-between">
                <span>Pause:</span>
                <span className="text-neon-green">Space</span>
              </div>
              <div className="flex justify-between">
                <span>Start:</span>
                <span className="text-neon-green">Enter</span>
              </div>
              <div className="flex justify-between">
                <span>Reset:</span>
                <span className="text-neon-green">R</span>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div>
            <div className="text-gray-400 mb-2">Mobile:</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Move:</span>
                <span className="text-neon-green">Swipe</span>
              </div>
              <div className="flex justify-between">
                <span>Or:</span>
                <span className="text-neon-green">Touch Buttons</span>
              </div>
              <div className="flex justify-between">
                <span>Tap:</span>
                <span className="text-neon-green">Game Board</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Status Indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-dark-panel border border-dark-border rounded-lg px-4 py-2">
          <div className={`w-2 h-2 rounded-full ${
            gameState === 'PLAYING' && !isPaused ? 'bg-neon-green animate-pulse' :
            gameState === 'PAUSED' ? 'bg-yellow-400' :
            gameState === 'GAME_OVER' ? 'bg-neon-red' :
            'bg-neon-blue'
          }`} />
          <span className="text-sm font-mono text-gray-300">
            {gameState === 'PLAYING' && !isPaused ? 'Game Running' :
             gameState === 'PAUSED' ? 'Paused' :
             gameState === 'GAME_OVER' ? 'Game Over' :
             'Ready to Play'}
          </span>
        </div>
      </div>

    </div>
  );
};

export default React.memo(GameControls);
