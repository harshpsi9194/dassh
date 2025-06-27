
# Engine Arcade - Documentation

## Overview
Engine Arcade is a cyberpunk-themed web application that allows users to create games through natural language prompts. The application features a dark, futuristic aesthetic inspired by terminal/hacker themes.

## Project Structure

### Core Files

#### `src/index.css`
**Purpose**: Global styles and theme configuration
**Key Features**:
- Cyberpunk color palette (neon green #00ff00, electric purple #cc00ff)
- Custom CSS classes for cyber aesthetics (.cyber-*, .terminal, .glow-*)
- Animation keyframes for UI effects
- Font imports (JetBrains Mono, Space Mono)

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration
**Key Features**:
- Extended color palette for cyberpunk theme
- Custom animations and keyframes
- Font family configurations
- Component-specific styling utilities

### Components

#### `src/components/DinosaurGame.tsx`
**Purpose**: Background animation component
**Functionality**:
- Renders Chrome dinosaur game as low-opacity background
- Auto-running with auto-jump mechanics
- Canvas-based implementation with responsive sizing
- Muted color scheme to avoid distraction

#### `src/components/AuthModal.tsx`
**Purpose**: User authentication interface
**Features**:
- Login/Signup tabs
- Form validation
- Cyberpunk-styled modal design
- Demo authentication (replace with real auth when Supabase is connected)

#### `src/components/UserSidebar.tsx`
**Purpose**: User dashboard for logged-in users
**Features**:
- User profile display
- Query history management
- Game library access
- Logout functionality
- Responsive design (overlay on mobile, sidebar on desktop)

#### `src/components/Header.tsx`
**Purpose**: Navigation header
**Features**:
- Logo display with cyberpunk styling
- Authentication state management
- Menu toggle for sidebar
- Responsive design

### Pages

#### `src/pages/Index.tsx`
**Purpose**: Main landing page
**Features**:
- Hero section with call-to-action
- Feature showcases
- Background game integration
- Authentication flow management
- Navigation to game creation

#### `src/pages/CreateGame.tsx`
**Purpose**: Game creation interface
**Features**:
- Text input for game prompts
- Category selection
- Game generation simulation
- Navigation to workspace

#### `src/pages/GameWorkspace.tsx`
**Purpose**: Game development environment
**Status**: Not yet implemented with cyberpunk theme

## Styling System

### Color Scheme
- **Primary**: Neon Green (#00ff00) - Interactive elements, primary text
- **Secondary**: Electric Purple (#cc00ff) - Accent elements, secondary headings
- **Accent**: Cyan (#00ffff) - Special highlights
- **Background**: Very Dark (#0a0a0a) - Main background
- **Card**: Dark Blue-Gray (#11141f) - Content cards
- **Text**: Light Gray (#f0f0f0) - Primary text
- **Muted**: Medium Gray (#666666) - Secondary text

### Typography
- **Primary Font**: JetBrains Mono (monospace for terminal feel)
- **Fallback**: Space Mono, monospace
- **Usage**: All text uses monospace fonts to maintain cyberpunk aesthetic

### Animations
- **Glow Effects**: Subtle glowing on hover for interactive elements
- **Fade In**: Page load animations with staggered delays
- **Slide Transitions**: Smooth sidebar and modal animations
- **Cursor Blink**: Terminal-style cursor animation

## Authentication System

### Current Implementation
- **Type**: Demo/Mock authentication
- **Features**: Form validation, success/error states
- **Storage**: Local state only

### Recommended Enhancement
- **Integration**: Supabase Authentication
- **Features**: Email/password, social logins, persistent sessions
- **Data**: User profiles, query history, game saves

## Background Game

### Implementation
- **Technology**: HTML5 Canvas with JavaScript
- **Game Loop**: RequestAnimationFrame for smooth animation
- **Auto-Play**: Automated jumping to create continuous movement
- **Styling**: Low opacity (0.15), fixed positioning, muted colors

### Customization
- Opacity can be adjusted in `DinosaurGame.tsx`
- Colors can be modified to match theme changes
- Game speed and mechanics are configurable

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Overlay sidebar, stacked layout
- **Tablet**: 768px - 1024px - Adjusted spacing, responsive grid
- **Desktop**: > 1024px - Full sidebar, optimal layout

### Key Responsive Features
- Sidebar transforms to overlay on mobile
- Grid layouts adapt to screen size
- Font sizes scale appropriately
- Touch-friendly button sizes on mobile

## Future Enhancements

### Backend Integration
1. **Supabase Setup**: Replace mock auth with real authentication
2. **Database**: Store user queries, games, and preferences
3. **Real-time**: Live updates for collaborative features

### Game Engine
1. **AI Integration**: Connect to game generation AI
2. **Asset Management**: File upload and storage system
3. **Publishing**: Game sharing and distribution

### UI Improvements
1. **Themes**: Multiple cyberpunk variants
2. **Accessibility**: Screen reader support, keyboard navigation
3. **Performance**: Optimized animations and rendering

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Maintain consistent naming conventions
- Comment complex logic thoroughly

### Component Structure
- Keep components focused and reusable
- Use proper props interfaces
- Implement error boundaries where needed
- Maintain separation of concerns

### Styling Approach
- Prefer Tailwind classes over custom CSS
- Use cyber-* utility classes for theme consistency
- Implement responsive design from the start
- Test across different devices and browsers
