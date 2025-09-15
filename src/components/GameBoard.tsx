/**
 * Game Board Component
 * 
 * Renders the 20x20 game grid with snake, food, and handles user interactions.
 * Features smooth animations, responsive design, and mobile touch support.
 */

import React, { useCallback, useMemo } from 'react';
import { GameBoardProps, Position } from '../types/game.types';
import { isMobileDevice, calculateCellSize } from '../utils/gameHelpers';
import SnakeHeadIcon from '../assets/snake-head.svg';
import SnakeBodyIcon from '../assets/snake-body.svg';
import FrogIcon from '../assets/frog.svg';

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  boardSize,
  onCellClick,
}) => {
  // Calculate responsive cell size
  const cellSize = useMemo(() => {
    const containerWidth = Math.min(window.innerWidth - 40, 600);
    return calculateCellSize(boardSize, containerWidth);
  }, [boardSize]);

  // Check if position is snake head
  const isSnakeHead = useCallback((position: Position) => {
    return snake.segments.length > 0 && 
           snake.segments[0].x === position.x && 
           snake.segments[0].y === position.y;
  }, [snake.segments]);

  // Check if position is snake body
  const isSnakeBody = useCallback((position: Position) => {
    return snake.segments.some((segment, index) => 
      index > 0 && segment.x === position.x && segment.y === position.y
    );
  }, [snake.segments]);

  // Check if position is food
  const isFood = useCallback((position: Position) => {
    return food.x === position.x && food.y === position.y;
  }, [food]);

  // Handle cell click for mobile
  const handleCellClick = useCallback((position: Position) => {
    if (onCellClick && isMobileDevice()) {
      onCellClick(position);
    }
  }, [onCellClick]);

  // Generate grid cells
  const gridCells = useMemo(() => {
    const cells = [];
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        const position = { x, y };
        const isHead = isSnakeHead(position);
        const isBody = isSnakeBody(position);
        const isFoodCell = isFood(position);
        
        let cellClass = 'game-cell';
        let cellContent = null;

        if (isHead) {
          cellClass += ' snake-head';
          cellContent = <img src={SnakeHeadIcon} alt="Snake Head" className="w-full h-full object-contain" />;
        } else if (isBody) {
          cellClass += ' snake-segment';
          cellContent = <img src={SnakeBodyIcon} alt="Snake Body" className="w-full h-full object-contain" />;
        } else if (isFoodCell) {
          cellClass += ' food';
          cellContent = <img src={FrogIcon} alt="Frog Food" className="w-full h-full object-contain animate-pulse" />;
        }

        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
            onClick={() => handleCellClick(position)}
            data-x={x}
            data-y={y}
          >
            {cellContent}
          </div>
        );
      }
    }
    return cells;
  }, [boardSize, cellSize, isSnakeHead, isSnakeBody, isFood, handleCellClick]);

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className="game-container p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
          gap: '1px',
          width: 'fit-content',
          height: 'fit-content',
        }}
      >
        {gridCells}
      </div>
    </div>
  );
};

export default React.memo(GameBoard);
