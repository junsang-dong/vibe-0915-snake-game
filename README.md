# 🐍 Snake Game - React + TypeScript

A modern, responsive Snake game built with React, TypeScript, and Tailwind CSS. Features smooth animations, mobile support, and a retro gaming aesthetic.

## ✨ Features

### 🎮 Core Gameplay
- **Classic Snake Mechanics**: Move the snake to eat food and grow longer
- **Progressive Difficulty**: Speed increases with each level (every 50 points)
- **Collision Detection**: Wall and self-collision detection
- **Score System**: 10 points per food, with best score tracking

### 🎨 Modern UI/UX
- **Dark Theme**: Neon green, blue, and red color scheme
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Glass Morphism**: Modern UI effects with backdrop blur
- **Retro Gaming Fonts**: Orbitron and JetBrains Mono typography

### 📱 Mobile Support
- **Touch Controls**: Swipe gestures and virtual D-pad
- **Mobile-First Design**: Optimized for touch interfaces
- **Haptic Feedback**: Vibration on supported devices
- **Prevent Scrolling**: Prevents page scroll during gameplay

### 🎯 Advanced Features
- **Local Storage**: Persistent best score and game statistics
- **Achievement System**: Unlock achievements based on score milestones
- **Game State Management**: Ready, Playing, Paused, Game Over states
- **Keyboard Support**: Arrow keys, space, enter, and R key
- **Gamepad Support**: Xbox/PlayStation controller support

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibe-0915-snake-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎮 How to Play

### Desktop Controls
- **Arrow Keys**: Move snake (Up, Down, Left, Right)
- **Space**: Pause/Resume game
- **Enter**: Start game
- **R**: Reset game

### Mobile Controls
- **Swipe**: Swipe in any direction to move
- **Touch Buttons**: Use the virtual D-pad
- **Tap Board**: Tap on the game board to move towards that direction

### Game Rules
1. Use arrow keys or touch controls to move the snake
2. Eat the red food to grow longer and increase your score
3. Avoid hitting walls or your own body
4. Speed increases every 50 points (new level)
5. Try to achieve the highest score possible!

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── GameBoard.tsx   # Game grid and snake rendering
│   ├── GameControls.tsx # Start, pause, reset controls
│   ├── ScoreDisplay.tsx # Score, level, and stats display
│   ├── GameOverModal.tsx # Game over screen
│   └── MobileControls.tsx # Touch controls for mobile
├── hooks/              # Custom React hooks
│   ├── useGameLogic.ts # Main game logic and state
│   ├── useKeyboardInput.ts # Keyboard and input handling
│   └── useLocalStorage.ts # Local storage management
├── types/              # TypeScript type definitions
│   └── game.types.ts   # Game interfaces and types
├── utils/              # Utility functions
│   └── gameHelpers.ts  # Game logic helpers
└── App.tsx            # Main application component
```

## 🛠️ Technical Details

### Technologies Used
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Hooks**: Reusable logic with useGameLogic, useKeyboardInput, etc.

### Key Features Implementation

#### Game Loop
- Uses `useEffect` with `setInterval` for smooth 60fps game loop
- Throttled movement to prevent too-fast snake movement
- Proper cleanup of intervals on component unmount

#### State Management
- Centralized game state with `useGameLogic` hook
- Immutable state updates for predictable behavior
- Local storage integration for persistence

#### Performance Optimizations
- `React.memo` for component memoization
- `useCallback` and `useMemo` for expensive calculations
- Debounced and throttled input handling
- Efficient collision detection algorithms

#### Mobile Optimization
- Touch event handling with proper preventDefault
- Responsive grid sizing based on screen size
- Mobile-specific UI adaptations
- Haptic feedback support

## 🎨 Customization

### Colors and Theme
The game uses a custom color palette defined in `tailwind.config.js`:
- `neon-green`: #00ff00 (snake, primary UI)
- `neon-blue`: #00bfff (accents, mobile controls)
- `neon-red`: #ff0000 (food, game over)
- `dark-bg`: #0a0a0a (background)
- `dark-panel`: #1a1a1a (UI panels)

### Game Configuration
Modify `DEFAULT_GAME_CONFIG` in `types/game.types.ts`:
- `BOARD_SIZE`: Grid size (default: 20x20)
- `INITIAL_SPEED`: Starting speed in milliseconds
- `SPEED_INCREMENT`: Speed increase per level
- `POINTS_PER_FOOD`: Points awarded per food

## 🐛 Troubleshooting

### Common Issues

1. **Game not starting**
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Try refreshing the page

2. **Mobile controls not working**
   - Ensure device supports touch events
   - Check if browser blocks touch events
   - Try using swipe gestures instead of buttons

3. **Performance issues**
   - Close other browser tabs
   - Check if hardware acceleration is enabled
   - Try reducing browser zoom level

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Classic Snake game concept
- React and TypeScript communities
- Tailwind CSS for the utility-first approach
- Modern web development best practices

---

**Enjoy playing! 🐍🎮**