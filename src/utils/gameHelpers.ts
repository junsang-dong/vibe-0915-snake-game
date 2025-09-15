/**
 * Game Helper Functions
 * 
 * This file contains utility functions for game logic, calculations,
 * and helper methods used throughout the Snake game.
 */

import { Position, Direction, GameConfig, Snake } from '../types/game.types';

/**
 * Check if two positions are equal
 */
export const positionsEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

/**
 * Check if a position is within the game board bounds
 */
export const isPositionInBounds = (position: Position, boardSize: number): boolean => {
  return position.x >= 0 && position.x < boardSize && position.y >= 0 && position.y < boardSize;
};

/**
 * Check if a position collides with any snake segment
 */
export const isPositionOnSnake = (position: Position, snake: Snake): boolean => {
  return snake.segments.some(segment => positionsEqual(segment, position));
};

/**
 * Generate a random position within the game board
 */
export const generateRandomPosition = (boardSize: number): Position => {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
};

/**
 * Generate a random food position that doesn't overlap with the snake
 */
export const generateFoodPosition = (snake: Snake, boardSize: number): Position => {
  let foodPosition: Position;
  do {
    foodPosition = generateRandomPosition(boardSize);
  } while (isPositionOnSnake(foodPosition, snake));
  
  return foodPosition;
};

/**
 * Calculate the next position based on current position and direction
 */
export const getNextPosition = (position: Position, direction: Direction): Position => {
  switch (direction) {
    case 'UP':
      return { x: position.x, y: position.y - 1 };
    case 'DOWN':
      return { x: position.x, y: position.y + 1 };
    case 'LEFT':
      return { x: position.x - 1, y: position.y };
    case 'RIGHT':
      return { x: position.x + 1, y: position.y };
    default:
      return position;
  }
};

/**
 * Check if a direction change is valid (prevents 180° turns)
 */
export const isValidDirectionChange = (currentDirection: Direction, newDirection: Direction): boolean => {
  const oppositeDirections: Record<Direction, Direction> = {
    'UP': 'DOWN',
    'DOWN': 'UP',
    'LEFT': 'RIGHT',
    'RIGHT': 'LEFT',
  };
  
  return newDirection !== oppositeDirections[currentDirection];
};

/**
 * Calculate the current game speed based on level
 */
export const calculateGameSpeed = (level: number, config: GameConfig): number => {
  const newSpeed = config.INITIAL_SPEED - (level - 1) * config.SPEED_INCREMENT;
  return Math.max(newSpeed, config.MAX_SPEED);
};

/**
 * Check if the snake has collided with walls
 */
export const checkWallCollision = (snake: Snake, boardSize: number): boolean => {
  const head = snake.segments[0];
  return !isPositionInBounds(head, boardSize);
};

/**
 * Check if the snake has collided with itself
 */
export const checkSelfCollision = (snake: Snake): boolean => {
  const head = snake.segments[0];
  const body = snake.segments.slice(1);
  return body.some(segment => positionsEqual(segment, head));
};

/**
 * Check if the snake has eaten the food
 */
export const checkFoodCollision = (snake: Snake, food: Position): boolean => {
  const head = snake.segments[0];
  return positionsEqual(head, food);
};

/**
 * Calculate the distance between two positions (for AI or advanced features)
 */
export const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Get the direction from one position to another
 */
export const getDirectionToPosition = (from: Position, to: Position): Direction | null => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'RIGHT' : 'LEFT';
  } else if (dy !== 0) {
    return dy > 0 ? 'DOWN' : 'UP';
  }
  
  return null;
};

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format score with commas for thousands
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

/**
 * Calculate the percentage of board filled by snake
 */
export const calculateBoardFillPercentage = (snakeLength: number, boardSize: number): number => {
  const totalCells = boardSize * boardSize;
  return (snakeLength / totalCells) * 100;
};

/**
 * Get a random direction (for AI or demo mode)
 */
export const getRandomDirection = (): Direction => {
  const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  return directions[Math.floor(Math.random() * directions.length)];
};

/**
 * Check if the game is in a playable state
 */
export const isGamePlayable = (gameState: string): boolean => {
  return gameState === 'READY' || gameState === 'PLAYING' || gameState === 'PAUSED';
};

/**
 * Get the next level based on current score
 */
export const getNextLevel = (score: number, levelUpScore: number): number => {
  return Math.floor(score / levelUpScore) + 1;
};

/**
 * Calculate the score needed for the next level
 */
export const getScoreForNextLevel = (currentLevel: number, levelUpScore: number): number => {
  return currentLevel * levelUpScore;
};

/**
 * Generate a unique ID for game sessions
 */
export const generateGameId = (): string => {
  return `snake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if the device is mobile based on screen size and touch capability
 */
export const isMobileDevice = (): boolean => {
  return window.innerWidth <= 768 || ('ontouchstart' in window);
};

/**
 * Get the appropriate grid size for the current screen
 */
export const getResponsiveGridSize = (): number => {
  if (window.innerWidth <= 480) return 16; // Smaller grid for very small screens
  if (window.innerWidth <= 768) return 18; // Medium grid for mobile
  return 20; // Full grid for desktop
};

/**
 * Calculate the optimal cell size for the current screen
 */
export const calculateCellSize = (boardSize: number, containerWidth: number): number => {
  const padding = 40; // Account for padding and borders
  const availableWidth = containerWidth - padding;
  return Math.floor(availableWidth / boardSize);
};
