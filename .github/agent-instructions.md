# Copilot Agent Instructions

## Project Overview
This is a 3D interactive globe application built with Three.js. The globe displays a simplified Earth representation and allows users to rotate it by dragging with mouse or touch input.

## Technology Stack
- **Three.js**: 3D graphics library for rendering the globe
- **Vite**: Build tool and development server
- **Vanilla JavaScript**: No additional frameworks

## Project Structure
- `index.html`: Main HTML file with canvas container
- `main.js`: Three.js setup and globe implementation
- `package.json`: npm dependencies and scripts

## Development Commands
- `npm run dev`: Start the development server (default port: 5173)
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Code Style Guidelines
- Use ES6+ JavaScript features
- Use clear, descriptive variable names
- Comment complex Three.js configurations
- Maintain consistent indentation (4 spaces)

## Key Components

### Globe Implementation
- Sphere geometry with 64 segments for smooth appearance
- Procedurally generated texture simulating oceans and landmasses
- Phong material for realistic lighting
- Atmosphere layer with transparent glow effect

### Interaction System
- Mouse drag to rotate
- Touch support for mobile devices
- Inertia/momentum effect with damping
- Responsive to window resize

## Future Enhancements
The project is designed to support:
- Custom labels pinned to globe coordinates
- Emoji markers at specific locations
- Real earth texture maps
- Additional interactive features

## Making Changes
When modifying the code:
1. Test locally with `npm run dev`
2. Ensure the globe renders correctly
3. Verify drag interaction works on both mouse and touch
4. Check responsiveness on different screen sizes
5. Build with `npm run build` to check for errors

## Dependencies
- Keep Three.js updated for latest features and bug fixes
- Vite for fast development and optimized builds
- No additional runtime dependencies to keep bundle size small
