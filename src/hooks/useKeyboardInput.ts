/**
 * Keyboard Input Hook
 * 
 * Custom hook for handling keyboard input with proper event management,
 * debouncing, and mobile-friendly touch event support.
 */

import { useEffect, useCallback, useRef } from 'react';
import { Direction, DirectionChangeHandler } from '../types/game.types';
import { debounce, throttle } from '../utils/gameHelpers';

interface UseKeyboardInputOptions {
  onDirectionChange: DirectionChangeHandler;
  onPause?: () => void;
  onStart?: () => void;
  onReset?: () => void;
  enabled?: boolean;
  debounceMs?: number;
  throttleMs?: number;
}

/**
 * Hook for handling keyboard input with direction changes and game controls
 */
export function useKeyboardInput({
  onDirectionChange,
  onPause,
  onStart,
  onReset,
  enabled = true,
  debounceMs = 100,
  throttleMs = 50,
}: UseKeyboardInputOptions) {
  const isEnabled = useRef(enabled);
  const lastKeyTime = useRef(0);

  // Update enabled state
  useEffect(() => {
    isEnabled.current = enabled;
  }, [enabled]);

  // Debounced direction change handler
  const debouncedDirectionChange = useCallback(
    debounce((direction: Direction) => {
      if (isEnabled.current) {
        onDirectionChange(direction);
      }
    }, debounceMs),
    [onDirectionChange, debounceMs]
  );

  // Throttled direction change handler for rapid key presses
  const throttledDirectionChange = useCallback(
    throttle((direction: Direction) => {
      if (isEnabled.current) {
        onDirectionChange(direction);
      }
    }, throttleMs),
    [onDirectionChange, throttleMs]
  );

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled.current) return;

    // Prevent default behavior for game keys
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'r', 'R'];
    if (gameKeys.includes(event.key)) {
      event.preventDefault();
    }

    const currentTime = Date.now();
    const timeSinceLastKey = currentTime - lastKeyTime.current;
    lastKeyTime.current = currentTime;

    // Use throttled handler for rapid key presses, debounced for normal use
    const directionHandler = timeSinceLastKey < 100 ? throttledDirectionChange : debouncedDirectionChange;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        directionHandler('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        directionHandler('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        directionHandler('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        directionHandler('RIGHT');
        break;
      case ' ':
      case 'Escape':
        onPause?.();
        break;
      case 'Enter':
        onStart?.();
        break;
      case 'r':
      case 'R':
        onReset?.();
        break;
    }
  }, [debouncedDirectionChange, throttledDirectionChange, onPause, onStart, onReset]);

  // Set up keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Cleanup function to disable input
  const disableInput = useCallback(() => {
    isEnabled.current = false;
  }, []);

  // Enable input function
  const enableInput = useCallback(() => {
    isEnabled.current = true;
  }, []);

  return {
    disableInput,
    enableInput,
  };
}

/**
 * Hook for handling touch events on mobile devices
 */
export function useTouchInput({
  onDirectionChange,
  enabled = true,
}: {
  onDirectionChange: DirectionChangeHandler;
  enabled?: boolean;
}) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 30;

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enabled) return;
    
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, [enabled]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!enabled || !touchStart.current) return;

    const touch = event.changedTouches[0];
    const touchEnd = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = touchEnd.x - touchStart.current.x;
    const deltaY = touchEnd.y - touchStart.current.y;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Determine if it's a swipe
    if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
      touchStart.current = null;
      return;
    }
    
    // Determine direction based on the larger delta
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      onDirectionChange(deltaX > 0 ? 'RIGHT' : 'LEFT');
    } else {
      // Vertical swipe
      onDirectionChange(deltaY > 0 ? 'DOWN' : 'UP');
    }
    
    touchStart.current = null;
  }, [enabled, onDirectionChange]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd, enabled]);
}

/**
 * Hook for handling gamepad input (if supported)
 */
export function useGamepadInput({
  onDirectionChange,
  onPause,
  enabled = true,
}: {
  onDirectionChange: DirectionChangeHandler;
  onPause?: () => void;
  enabled?: boolean;
}) {
  const gamepadIndex = useRef<number | null>(null);
  const lastButtonStates = useRef<{ [key: number]: boolean }>({});

  const handleGamepadInput = useCallback(() => {
    if (!enabled) return;

    const gamepads = navigator.getGamepads();
    const gamepad = gamepadIndex.current !== null ? gamepads[gamepadIndex.current] : null;
    
    if (!gamepad) {
      // Try to find any connected gamepad
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          gamepadIndex.current = i;
          break;
        }
      }
      return;
    }

    const buttons = gamepad.buttons;
    const axes = gamepad.axes;

    // Handle D-pad buttons
    if (buttons[12]?.pressed && !lastButtonStates.current[12]) { // D-pad up
      onDirectionChange('UP');
    }
    if (buttons[13]?.pressed && !lastButtonStates.current[13]) { // D-pad down
      onDirectionChange('DOWN');
    }
    if (buttons[14]?.pressed && !lastButtonStates.current[14]) { // D-pad left
      onDirectionChange('LEFT');
    }
    if (buttons[15]?.pressed && !lastButtonStates.current[15]) { // D-pad right
      onDirectionChange('RIGHT');
    }

    // Handle analog stick
    const leftStickX = axes[0];
    const leftStickY = axes[1];
    const deadZone = 0.5;

    if (Math.abs(leftStickX) > deadZone || Math.abs(leftStickY) > deadZone) {
      if (Math.abs(leftStickX) > Math.abs(leftStickY)) {
        onDirectionChange(leftStickX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onDirectionChange(leftStickY > 0 ? 'DOWN' : 'UP');
      }
    }

    // Handle pause button (usually Start button)
    if (buttons[9]?.pressed && !lastButtonStates.current[9]) {
      onPause?.();
    }

    // Update button states
    buttons.forEach((button, index) => {
      lastButtonStates.current[index] = button.pressed;
    });
  }, [enabled, onDirectionChange, onPause]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(handleGamepadInput, 50); // Check every 50ms
    
    return () => clearInterval(interval);
  }, [handleGamepadInput, enabled]);
}

/**
 * Combined input hook that handles keyboard, touch, and gamepad input
 */
export function useGameInput({
  onDirectionChange,
  onPause,
  onStart,
  onReset,
  enabled = true,
}: {
  onDirectionChange: DirectionChangeHandler;
  onPause?: () => void;
  onStart?: () => void;
  onReset?: () => void;
  enabled?: boolean;
}) {
  const keyboardInput = useKeyboardInput({
    onDirectionChange,
    onPause,
    onStart,
    onReset,
    enabled,
  });

  useTouchInput({
    onDirectionChange,
    enabled,
  });

  useGamepadInput({
    onDirectionChange,
    onPause,
    enabled,
  });

  return keyboardInput;
}
