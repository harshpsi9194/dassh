
# Engine Arcade - Documentation

## Overview
Engine Arcade is a cyberpunk-themed web application that allows users to create games through natural language prompts. The application features a dark, futuristic aesthetic inspired by terminal/hacker themes with an intelligent AI assistant named DASSH.

## Project Structure

### Core Files

#### `src/index.css`
**Purpose**: Global styles and theme configuration
**Key Features**:
- Cyberpunk color palette (neon cyan #00FFCC primary accent)
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

#### `src/components/StarDefenderGame.tsx`
**Purpose**: Intelligent background game animation
**Functionality**:
- Smart spaceship that actively targets and destroys enemies
- Reduced enemy spawn rate for cleaner visual experience
- Canvas-based implementation with responsive sizing
- Reduced opacity (0.25) for subtle background presence
- AI-driven movement system that seeks nearest threats

#### `src/components/BottomTerminalInput.tsx`
**Purpose**: Enhanced terminal-style input interface
**Features**:
- Increased height terminal window with authentic header
- Red, yellow, green terminal control buttons
- Thick cursor bar that remains consistent during typing
- Auto-cycling game creation suggestions
- Submit button with hover effects
- Professional terminal aesthetics

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
**Purpose**: Navigation header with improved layout
**Features**:
- DASSH logo positioned at leftmost edge
- LOGIN/ABOUT buttons positioned at rightmost edge
- Cyberpunk styling with consistent button sizing
- Responsive design for mobile and desktop

### Pages

#### `src/pages/Index.tsx`
**Purpose**: Main landing page with AI assistant introduction
**Features**:
- Personal greeting: "Hi user, I am DASSH"
- Expanded description (4-5 lines) explaining AI game creation capabilities
- Enhanced user experience with intelligent background game
- Authentication flow management
- Responsive design with improved typography

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

## AI Assistant - DASSH

### Personality
- **Name**: DASSH (Digital AI Smart System Helper)
- **Role**: AI-powered game creation assistant
- **Capability**: Transforms natural language prompts into playable games
- **Specialization**: Handles technical complexity behind the scenes

### User Experience
- Personal greeting on homepage
- Comprehensive explanation of capabilities
- Terminal-style interaction interface
- Intelligent suggestion system

## Styling System

### Color Scheme
- **Primary Accent**: Cyan (#00FFCC) - Interactive elements, primary highlights
- **Secondary**: Electric Purple (#cc00ff) - Accent elements, secondary highlights
- **Background**: Very Dark (#1f1f1f) - Main background
- **Terminal**: Dark gradients (#2a2a2a to #303030) - Terminal windows
- **Text**: Light Gray (#c0c0c0) - Primary text
- **Muted**: Medium Gray (#666666) - Secondary text

### Typography
- **Primary Font**: JetBrains Mono (monospace for terminal feel)
- **Fallback**: Space Mono, monospace
- **Usage**: All text uses monospace fonts to maintain cyberpunk aesthetic
- **Sizing**: Responsive scaling for different screen sizes

### Terminal Design
- **Header Icons**: Red, yellow, green terminal control buttons
- **Cursor**: Thick cyan bar (2px width, 5px height)
- **Input**: Enhanced height for better usability
- **Styling**: Professional terminal window appearance

## Background Game Intelligence

### Smart Spaceship System
- **AI Targeting**: Automatically seeks nearest enemy
- **Strategic Movement**: Positions optimally for enemy elimination
- **Smooth Navigation**: Fluid movement between targets
- **Boundary Management**: Stays within screen limits
- **Return Behavior**: Returns to center when no enemies present

### Reduced Visual Noise
- **Enemy Spawn Rate**: Decreased to 0.004 probability
- **Opacity**: Reduced to 0.25 for subtle background presence
- **Performance**: Optimized for smooth operation without distraction

## Authentication System

### Current Implementation
- **Type**: Demo/Mock authentication
- **Features**: Form validation, success/error states
- **Storage**: Local state only

### Recommended Enhancement
- **Integration**: Supabase Authentication
- **Features**: Email/password, social logins, persistent sessions
- **Data**: User profiles, query history, game saves

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Overlay sidebar, stacked layout
- **Tablet**: 768px - 1024px - Adjusted spacing, responsive grid
- **Desktop**: > 1024px - Full sidebar, optimal layout

### Key Responsive Features
- Terminal input scales appropriately
- Header maintains proper spacing across devices
- Background game adapts to screen dimensions
- Typography scales for readability

## Recent Enhancements (Latest Update)

### User Interface Improvements
1. **Terminal Input Enhancement**
   - Increased height for better usability
   - Added authentic terminal header with control buttons
   - Maintained thick cursor consistency during typing

2. **Content Updates**
   - Changed main heading to personal "Hi user, I am DASSH"
   - Expanded description to 4-5 lines explaining AI capabilities
   - Improved user engagement and clarity

3. **Background Game Intelligence**
   - Implemented smart targeting system for spaceship
   - Reduced enemy spawn rate for cleaner experience
   - Decreased opacity to 0.25 for subtle presence

4. **Layout Refinements**
   - DASSH logo positioned at leftmost edge
   - LOGIN/ABOUT buttons at rightmost edge
   - Consistent button sizing and spacing

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

### Performance Considerations
- Optimize canvas rendering for background game
- Minimize re-renders in terminal input
- Use efficient state management
- Consider memory usage in game loops
