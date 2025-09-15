/**
 * Mobile Controls Component
 * 
 * Provides touch-friendly directional controls for mobile devices
 * with haptic feedback and visual animations.
 */

import React, { useState } from 'react';
import { MobileControlsProps, MobileControl } from '../types/game.types';
import { isMobileDevice } from '../utils/gameHelpers';

const MobileControls: React.FC<MobileControlsProps> = ({
  onDirectionChange,
  isVisible,
}) => {
  const [isPressed, setIsPressed] = useState<MobileControl | null>(null);

  // Check if device supports haptic feedback
  const supportsHaptics = 'vibrate' in navigator;

  // Handle direction button press
  const handlePress = (direction: MobileControl) => {
    setIsPressed(direction);
    onDirectionChange(direction);
    
    // Haptic feedback
    if (supportsHaptics) {
      navigator.vibrate(50);
    }
  };

  // Handle button release
  const handleRelease = () => {
    setIsPressed(null);
  };

  // Prevent context menu on long press
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Don't render on desktop
  if (!isMobileDevice() || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
      <div className="bg-dark-panel bg-opacity-90 backdrop-blur-sm border border-dark-border rounded-2xl p-4">
        {/* D-Pad Layout */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Up Button */}
          <button
            className={`mobile-control-btn absolute top-0 left-1/2 transform -translate-x-1/2 ${
              isPressed === 'UP' ? 'bg-neon-blue text-dark-bg scale-95' : ''
            }`}
            onTouchStart={() => handlePress('UP')}
            onTouchEnd={handleRelease}
            onMouseDown={() => handlePress('UP')}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
            onContextMenu={handleContextMenu}
            aria-label="Move Up"
          >
            ↑
          </button>

          {/* Left Button */}
          <button
            className={`mobile-control-btn absolute left-0 top-1/2 transform -translate-y-1/2 ${
              isPressed === 'LEFT' ? 'bg-neon-blue text-dark-bg scale-95' : ''
            }`}
            onTouchStart={() => handlePress('LEFT')}
            onTouchEnd={handleRelease}
            onMouseDown={() => handlePress('LEFT')}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
            onContextMenu={handleContextMenu}
            aria-label="Move Left"
          >
            ←
          </button>

          {/* Center Area (for visual balance) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          </div>

          {/* Right Button */}
          <button
            className={`mobile-control-btn absolute right-0 top-1/2 transform -translate-y-1/2 ${
              isPressed === 'RIGHT' ? 'bg-neon-blue text-dark-bg scale-95' : ''
            }`}
            onTouchStart={() => handlePress('RIGHT')}
            onTouchEnd={handleRelease}
            onMouseDown={() => handlePress('RIGHT')}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
            onContextMenu={handleContextMenu}
            aria-label="Move Right"
          >
            →
          </button>

          {/* Down Button */}
          <button
            className={`mobile-control-btn absolute bottom-0 left-1/2 transform -translate-x-1/2 ${
              isPressed === 'DOWN' ? 'bg-neon-blue text-dark-bg scale-95' : ''
            }`}
            onTouchStart={() => handlePress('DOWN')}
            onTouchEnd={handleRelease}
            onMouseDown={() => handlePress('DOWN')}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
            onContextMenu={handleContextMenu}
            aria-label="Move Down"
          >
            ↓
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-4">
          <div className="text-xs text-gray-400 font-mono">
            Use buttons or swipe on screen
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileControls);
