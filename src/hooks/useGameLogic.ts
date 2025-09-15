/**
 * Game Logic Hook
 * 
 * Main hook containing all game logic including snake movement,
 * collision detection, scoring, and game state management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameData, 
  Direction, 
  GameState, 
  DEFAULT_GAME_CONFIG, 
  INITIAL_GAME_DATA 
} from '../types/game.types';
import { 
  getNextPosition, 
  isValidDirectionChange, 
  checkWallCollision, 
  checkSelfCollision, 
  checkFoodCollision, 
  generateFoodPosition, 
  calculateGameSpeed,
  getNextLevel 
} from '../utils/gameHelpers';
import { useBestScore, useGameStats, useAchievements } from './useLocalStorage';

interface UseGameLogicReturn {
  gameData: GameData;
  changeDirection: (direction: Direction) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  isGameOver: boolean;
  isPlaying: boolean;
  isPaused: boolean;
}

/**
 * Main game logic hook
 */
export function useGameLogic(): UseGameLogicReturn {
  const [gameData, setGameData] = useState<GameData>(INITIAL_GAME_DATA);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);

  const { bestScore, updateBestScore } = useBestScore();
  const { updateStats } = useGameStats();

  // Update best score when it changes
  useEffect(() => {
    setGameData(prev => ({ ...prev, bestScore }));
  }, [bestScore]);

  // Game loop - runs when game is playing
  useEffect(() => {
    if (gameData.gameState === 'PLAYING' && !gameData.isPaused) {
      const currentTime = Date.now();
      const timeSinceLastMove = currentTime - lastMoveTimeRef.current;
      
      if (timeSinceLastMove >= gameData.gameSpeed) {
        moveSnake();
        lastMoveTimeRef.current = currentTime;
      }

      const gameInterval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastMove = now - lastMoveTimeRef.current;
        
        if (timeSinceLastMove >= gameData.gameSpeed) {
          moveSnake();
          lastMoveTimeRef.current = now;
        }
      }, 16); // ~60fps check rate

      gameIntervalRef.current = gameInterval;
      
      return () => {
        if (gameIntervalRef.current) {
          clearInterval(gameIntervalRef.current);
          gameIntervalRef.current = null;
        }
      };
    }
  }, [gameData.gameState, gameData.isPaused, gameData.gameSpeed]);

  // Move snake function
  const moveSnake = useCallback(() => {
    setGameData(prev => {
      const { snake, food, score, level } = prev;
      const currentDirection = snake.nextDirection;
      
      // Get new head position
      const head = snake.segments[0];
      const newHead = getNextPosition(head, currentDirection);
      
      // Check for collisions
      if (checkWallCollision({ ...snake, direction: currentDirection }, DEFAULT_GAME_CONFIG.BOARD_SIZE)) {
        return { ...prev, gameState: 'GAME_OVER' as GameState };
      }
      
      if (checkSelfCollision({ ...snake, direction: currentDirection })) {
        return { ...prev, gameState: 'GAME_OVER' as GameState };
      }
      
      // Check if food is eaten
      const ateFood = checkFoodCollision({ ...snake, direction: currentDirection }, food);
      
      let newSnake = { ...snake };
      let newScore = score;
      let newLevel = level;
      let newFood = food;
      
      if (ateFood) {
        // Grow snake by adding new head (don't remove tail)
        newSnake = {
          ...snake,
          segments: [newHead, ...snake.segments],
          direction: currentDirection,
          nextDirection: currentDirection,
        };
        
        // Update score and level
        newScore = score + DEFAULT_GAME_CONFIG.POINTS_PER_FOOD;
        newLevel = getNextLevel(newScore, DEFAULT_GAME_CONFIG.LEVEL_UP_SCORE);
        
        // Generate new food
        newFood = generateFoodPosition(newSnake, DEFAULT_GAME_CONFIG.BOARD_SIZE);
      } else {
        // Move snake normally (add new head, remove tail)
        newSnake = {
          ...snake,
          segments: [newHead, ...snake.segments.slice(0, -1)],
          direction: currentDirection,
          nextDirection: currentDirection,
        };
      }
      
      // Calculate new game speed
      const newGameSpeed = calculateGameSpeed(newLevel, DEFAULT_GAME_CONFIG);
      
      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        level: newLevel,
        gameSpeed: newGameSpeed,
      };
    });
  }, []);

  // Change snake direction
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameData(prev => {
      if (prev.gameState !== 'PLAYING' || prev.isPaused) return prev;
      
      const { snake } = prev;
      
      // Validate direction change
      if (!isValidDirectionChange(snake.direction, newDirection)) {
        return prev;
      }
      
      return {
        ...prev,
        snake: {
          ...snake,
          nextDirection: newDirection,
        },
      };
    });
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameData(prev => {
      if (prev.gameState === 'READY' || prev.gameState === 'GAME_OVER') {
        gameStartTimeRef.current = Date.now();
        lastMoveTimeRef.current = Date.now();
        return {
          ...INITIAL_GAME_DATA,
          bestScore: prev.bestScore,
          gameState: 'PLAYING' as GameState,
        };
      }
      return prev;
    });
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameData(prev => {
      if (prev.gameState === 'PLAYING') {
        return { ...prev, isPaused: true };
      }
      return prev;
    });
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameData(prev => {
      if (prev.gameState === 'PLAYING' && prev.isPaused) {
        lastMoveTimeRef.current = Date.now();
        return { ...prev, isPaused: false };
      }
      return prev;
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    
    setGameData(prev => ({
      ...INITIAL_GAME_DATA,
      bestScore: prev.bestScore,
    }));
  }, []);

  // Handle game over
  useEffect(() => {
    if (gameData.gameState === 'GAME_OVER') {
      // Update best score
      updateBestScore(gameData.score);
      
      // Update game statistics
      const playTime = gameStartTimeRef.current > 0 ? 
        Math.floor((Date.now() - gameStartTimeRef.current) / 1000) : 0;
      
      updateStats({
        totalGamesPlayed: 1,
        totalScore: gameData.score,
        longestSnake: Math.max(gameData.snake.segments.length, 0),
        bestLevel: Math.max(gameData.level, 1),
        playTime: playTime,
      });
      
      // Clear interval
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    }
  }, [gameData.gameState, gameData.score, gameData.snake.segments.length, gameData.level, updateBestScore, updateStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

  return {
    gameData,
    changeDirection,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    isGameOver: gameData.gameState === 'GAME_OVER',
    isPlaying: gameData.gameState === 'PLAYING' && !gameData.isPaused,
    isPaused: gameData.isPaused,
  };
}

/**
 * Hook for managing game achievements
 */
export function useGameAchievements(score: number) {
  const { unlockAchievement, isAchievementUnlocked } = useAchievements();

  useEffect(() => {
    // Check for score-based achievements
    if (score >= 10 && !isAchievementUnlocked('first_food')) {
      unlockAchievement('first_food');
    }
    if (score >= 50 && !isAchievementUnlocked('score_50')) {
      unlockAchievement('score_50');
    }
    if (score >= 100 && !isAchievementUnlocked('score_100')) {
      unlockAchievement('score_100');
    }
    if (score >= 250 && !isAchievementUnlocked('score_250')) {
      unlockAchievement('score_250');
    }
    if (score >= 500 && !isAchievementUnlocked('score_500')) {
      unlockAchievement('score_500');
    }
  }, [score, unlockAchievement, isAchievementUnlocked]);

  return {
    isAchievementUnlocked,
  };
}
