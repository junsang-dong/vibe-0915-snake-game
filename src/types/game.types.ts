/**
 * Game Types and Interfaces for Snake Game
 * 
 * This file contains all TypeScript type definitions used throughout the game.
 * It defines the core data structures for game state, configuration, and UI components.
 */

// Basic position type for grid coordinates
export type Position = {
  x: number;
  y: number;
};

// Direction enum for snake movement
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Game state enum for managing different game phases
export type GameState = 'READY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

// Game configuration constants
export interface GameConfig {
  BOARD_SIZE: number;        // 20x20 grid
  INITIAL_SPEED: number;     // Initial game speed in milliseconds
  SPEED_INCREMENT: number;   // Speed increase per level (decrease in ms)
  POINTS_PER_FOOD: number;   // Points awarded for eating food
  LEVEL_UP_SCORE: number;    // Score required to level up
  MAX_SPEED: number;         // Minimum speed (fastest possible)
}

// Snake data structure
export interface Snake {
  segments: Position[];      // Array of snake body positions
  direction: Direction;      // Current movement direction
  nextDirection: Direction;  // Queued direction change (prevents 180° turns)
}

// Game data structure containing all game state
export interface GameData {
  snake: Snake;              // Snake object
  food: Position;            // Current food position
  score: number;             // Current score
  level: number;             // Current level
  gameState: GameState;      // Current game state
  bestScore: number;         // Best score from localStorage
  isPaused: boolean;         // Pause state
  gameSpeed: number;         // Current game speed in ms
}

// Achievement types for score milestones
export type Achievement = {
  id: string;
  name: string;
  description: string;
  scoreThreshold: number;
  unlocked: boolean;
};

// Mobile control button types
export type MobileControl = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Game statistics for tracking performance
export interface GameStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  longestSnake: number;
  bestLevel: number;
  playTime: number; // in seconds
}

// Keyboard event handler type
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

// Direction change handler type
export type DirectionChangeHandler = (direction: Direction) => void;

// Game action types for state management
export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'MOVE_SNAKE'; payload: { newHead: Position; ateFood: boolean } }
  | { type: 'CHANGE_DIRECTION'; payload: Direction }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'UPDATE_BEST_SCORE'; payload: number };

// Component props types
export interface GameBoardProps {
  snake: Snake;
  food: Position;
  boardSize: number;
  onCellClick?: (position: Position) => void;
}

export interface GameControlsProps {
  gameState: GameState;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export interface ScoreDisplayProps {
  score: number;
  bestScore: number;
  level: number;
  gameState: GameState;
}

export interface GameOverModalProps {
  isOpen: boolean;
  finalScore: number;
  bestScore: number;
  level: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export interface MobileControlsProps {
  onDirectionChange: DirectionChangeHandler;
  isVisible: boolean;
}

// Default game configuration
export const DEFAULT_GAME_CONFIG: GameConfig = {
  BOARD_SIZE: 20,
  INITIAL_SPEED: 200,
  SPEED_INCREMENT: 10,
  POINTS_PER_FOOD: 10,
  LEVEL_UP_SCORE: 50,
  MAX_SPEED: 50,
};

// Initial game state
export const INITIAL_GAME_DATA: GameData = {
  snake: {
    segments: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ],
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
  },
  food: { x: 15, y: 15 },
  score: 0,
  level: 1,
  gameState: 'READY',
  bestScore: 0,
  isPaused: false,
  gameSpeed: DEFAULT_GAME_CONFIG.INITIAL_SPEED,
};

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_food',
    name: 'First Bite',
    description: 'Eat your first food!',
    scoreThreshold: 10,
    unlocked: false,
  },
  {
    id: 'score_50',
    name: 'Getting Started',
    description: 'Reach 50 points',
    scoreThreshold: 50,
    unlocked: false,
  },
  {
    id: 'score_100',
    name: 'Century Club',
    description: 'Reach 100 points',
    scoreThreshold: 100,
    unlocked: false,
  },
  {
    id: 'score_250',
    name: 'Snake Master',
    description: 'Reach 250 points',
    scoreThreshold: 250,
    unlocked: false,
  },
  {
    id: 'score_500',
    name: 'Legendary Snake',
    description: 'Reach 500 points',
    scoreThreshold: 500,
    unlocked: false,
  },
];
