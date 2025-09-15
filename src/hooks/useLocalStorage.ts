/**
 * Local Storage Hook
 * 
 * Custom hook for managing localStorage with TypeScript support,
 * error handling, and automatic JSON serialization/deserialization.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for localStorage with type safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook specifically for game statistics
 */
export function useGameStats() {
  const [gameStats, setGameStats] = useLocalStorage('snake-game-stats', {
    totalGamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    longestSnake: 0,
    bestLevel: 1,
    playTime: 0,
  });

  const updateStats = useCallback((newStats: Partial<typeof gameStats>) => {
    setGameStats(prev => {
      const updated = { ...prev, ...newStats };
      // Recalculate average score
      if (updated.totalGamesPlayed > 0) {
        updated.averageScore = Math.round(updated.totalScore / updated.totalGamesPlayed);
      }
      return updated;
    });
  }, [setGameStats]);

  const resetStats = useCallback(() => {
    setGameStats({
      totalGamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      longestSnake: 0,
      bestLevel: 1,
      playTime: 0,
    });
  }, [setGameStats]);

  return { gameStats, updateStats, resetStats };
}

/**
 * Hook for managing best score
 */
export function useBestScore() {
  const [bestScore, setBestScore] = useLocalStorage('snake-game-best-score', 0);

  const updateBestScore = useCallback((newScore: number) => {
    if (newScore > bestScore) {
      setBestScore(newScore);
      return true; // New best score achieved
    }
    return false;
  }, [bestScore, setBestScore]);

  return { bestScore, updateBestScore };
}

/**
 * Hook for managing game settings
 */
export function useGameSettings() {
  const [settings, setSettings] = useLocalStorage('snake-game-settings', {
    soundEnabled: true,
    showGrid: true,
    showAnimations: true,
    difficulty: 'normal' as 'easy' | 'normal' | 'hard',
    theme: 'dark' as 'dark' | 'light',
  });

  const updateSetting = useCallback((key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, [setSettings]);

  return { settings, updateSetting };
}

/**
 * Hook for managing achievements
 */
export function useAchievements() {
  const [achievements, setAchievements] = useLocalStorage<string[]>('snake-game-achievements', []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => {
      if (!prev.includes(achievementId)) {
        return [...prev, achievementId];
      }
      return prev;
    });
  }, [setAchievements]);

  const isAchievementUnlocked = useCallback((achievementId: string) => {
    return achievements.includes(achievementId);
  }, [achievements]);

  const resetAchievements = useCallback(() => {
    setAchievements([]);
  }, [setAchievements]);

  return { achievements, unlockAchievement, isAchievementUnlocked, resetAchievements };
}

/**
 * Hook for managing game history
 */
export function useGameHistory() {
  const [gameHistory, setGameHistory] = useLocalStorage<Array<{
    score: number;
    level: number;
    snakeLength: number;
    playTime: number;
    date: string;
  }>>('snake-game-history', []);

  const addGameToHistory = useCallback((gameData: {
    score: number;
    level: number;
    snakeLength: number;
    playTime: number;
    date: string;
  }) => {
    setGameHistory(prev => {
      const newHistory = [gameData, ...prev].slice(0, 50); // Keep only last 50 games
      return newHistory;
    });
  }, [setGameHistory]);

  const clearHistory = useCallback(() => {
    setGameHistory([]);
  }, [setGameHistory]);

  return { gameHistory, addGameToHistory, clearHistory };
}
