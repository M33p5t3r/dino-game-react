# Chrome Dino Game - React Edition 🦕

A faithful recreation of the famous Chrome Dino game built with React and Vite, perfect for learning Azure DevOps pipelines.

## Features

- 🎮 **Complete Game Mechanics**: Jump, dodge obstacles, score tracking
- 🏆 **High Score System**: Saves your best score locally
- 📱 **Responsive Design**: Works on desktop and mobile
- ⌨️ **Multiple Controls**: Spacebar, click, or tap to jump
- 🎨 **Pixel Art Style**: Matches the original Chrome game aesthetic
- ⚡ **Performance Optimized**: 60 FPS canvas rendering

## How to Play

1. Press **SPACE** or **click** the canvas to start
2. Press **SPACE** or **click** to jump over cacti
3. Avoid collisions to keep your score growing
4. Game speed increases as your score gets higher!

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone or download this project
cd dino-game-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── DinoGame.jsx    # Main game component with canvas logic
│   └── DinoGame.css    # Game styles
├── App.jsx             # Root component
├── App.css             # App-level styles
├── index.css           # Global styles
└── main.jsx           # Entry point
```

## Perfect for Azure DevOps

This project is ideal for learning Azure DevOps because:
- ✅ Standard React build process (`npm run build`)
- ✅ No complex dependencies or external APIs
- ✅ Clean project structure
- ✅ Fast build times with Vite
- ✅ Ready for containerization with Docker

## Game Features

- **Physics Engine**: Realistic jump mechanics with gravity
- **Collision Detection**: Precise hit detection between dino and obstacles
- **Progressive Difficulty**: Speed increases with score
- **Local Storage**: High scores persist between sessions
- **Canvas Rendering**: Smooth 60 FPS animations

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **HTML5 Canvas** - Game rendering
- **CSS3** - Styling and responsive design
- **Local Storage** - High score persistence

## Development

The game uses modern React patterns:
- Functional components with hooks
- useRef for game state management
- useEffect for game loops and event handling
- useCallback for performance optimization

## Deployment

Ready for deployment to any static hosting service or Azure:

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

Perfect for Azure Static Web Apps, Azure App Service, or any CI/CD pipeline!

---

Made with ❤️ for learning Azure DevOps
