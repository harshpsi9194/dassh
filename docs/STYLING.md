# Styling Guide

## Theme Overview

Engine Arcade uses a cyberpunk-inspired design system with a dark background and neon accent colors. The design emphasizes a terminal/hacker aesthetic with monospace fonts and glowing effects.

## Color Palette

### Primary Colors
```css
--cyber-dark: #0a0a0a;        /* Main background */
--cyber-card: #11141f;        /* Card backgrounds */
--cyber-terminal: #0f0f23;    /* Terminal backgrounds */
--cyber-primary: #00ff00;     /* Neon green - primary actions */
--cyber-secondary: #cc00ff;   /* Electric purple - secondary elements */
--cyber-accent: #00ffff;      /* Cyan - highlights */
--cyber-text: #f0f0f0;        /* Primary text */
--cyber-muted: #666666;       /* Secondary text */
--cyber-border: #333333;      /* Borders and separators */
```

### Usage Guidelines
- **Primary (#00ff00)**: Interactive elements, CTAs, active states
- **Secondary (#cc00ff)**: Accent headings, special elements
- **Accent (#00ffff)**: Highlights, status indicators
- **Text (#f0f0f0)**: Main content, readability focus
- **Muted (#666666)**: Secondary text, timestamps, metadata

## Typography

### Font Stack
```css
font-family: 'JetBrains Mono', 'Space Mono', monospace;
```

### Font Loading
Fonts are loaded via Google Fonts CDN in the CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
```

### Typography Scale
- **Hero Text**: 4xl-6xl (36px-60px) with cyberpunk glow
- **Headings**: xl-3xl (20px-30px) with medium weight
- **Body Text**: sm-base (14px-16px) for readability
- **Captions**: xs-sm (12px-14px) for metadata

### Typography Classes
```css
.cyber-glow      /* Main glow effect for headings */
.cyber-glow-sm   /* Subtle glow for interactive elements */
.gradient-text   /* Gradient text effect (primary to secondary) */
```

## Component Styling

### Buttons
```css
.cyber-button {
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cyber-button:hover {
  background: #00ff00;
  color: #0a0a0a;
  box-shadow: 0 0 15px #00ff00;
}
```

#### Button Variants
- **Primary**: Green border and text, fills on hover
- **Secondary**: Purple border and text, fills on hover
- **Ghost**: No border, subtle hover effects

### Input Fields
```css
.cyber-input {
  background: rgba(17, 20, 31, 0.9);
  border: 1px solid #333;
  color: #f0f0f0;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-family: 'JetBrains Mono', monospace;
  transition: all 0.3s ease;
}

.cyber-input:focus {
  border-color: #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  outline: none;
}
```

### Cards and Containers
```css
.cyber-bg-card {
  background: rgba(17, 20, 31, 0.8);
  backdrop-filter: blur(10px);
}

.cyber-terminal {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  border: 1px solid #00ff00;
}
```

### Modals
```css
.cyber-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
}

.cyber-modal {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  border: 1px solid #00ff00;
  border-radius: 0.5rem;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.2);
}
```

## Animations

### Keyframes
```css
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor; }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

### Animation Classes
```css
.delayed-fade-in    /* Fade in with delay options */
.glow-on-hover     /* Glow effect on hover */
.slide-in          /* Slide in from left */
.slide-out         /* Slide out to left */
```

### Delay Classes
```css
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
```

## Layout System

### Container Sizes
- **Max Width**: 6xl (1152px) for main content
- **Padding**: 4-8 responsive padding for containers
- **Margins**: Consistent spacing using Tailwind scale

### Grid Systems
```css
/* Feature cards */
.grid-cols-1.md:grid-cols-3 /* Mobile stack, desktop 3-column */

/* Responsive sidebar */
.w-80           /* 320px sidebar width */
.w-full         /* Full width on mobile */
```

### Z-Index Management
```css
.z-10    /* Main content */
.z-40    /* Mobile overlay */
.z-50    /* Sidebar */
.z-1000  /* Modals */
.z--1    /* Background elements */
```

## Responsive Design

### Breakpoints (Tailwind)
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

### Mobile-First Approach
```css
/* Base styles for mobile */
.text-base

/* Tablet and up */
.md:text-lg

/* Desktop and up */
.lg:text-xl
```

### Responsive Patterns
1. **Sidebar**: Overlay on mobile, fixed on desktop
2. **Grid**: Single column on mobile, multi-column on desktop
3. **Typography**: Smaller sizes on mobile, larger on desktop
4. **Spacing**: Reduced padding/margins on mobile

## Performance Considerations

### CSS Optimizations
1. **Tailwind Purging**: Remove unused styles in production
2. **Critical CSS**: Inline critical styles for faster rendering
3. **Font Loading**: Use font-display: swap for better loading

### Animation Performance
1. **Transform/Opacity**: Use for smooth animations
2. **Will-Change**: Apply sparingly for complex animations
3. **Reduced Motion**: Respect user preferences

### Color Usage
1. **CSS Variables**: Use for easy theme switching
2. **Contrast Ratios**: Ensure accessibility compliance
3. **Fallbacks**: Provide fallback colors for older browsers

## Accessibility

### Color Contrast
- **Text on Dark**: White/light gray text on dark backgrounds
- **Interactive Elements**: High contrast for buttons and links
- **Focus States**: Clear focus indicators with sufficient contrast

### Focus Management
```css
.cyber-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #00ff00;
}
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  .animation-class {
    animation: none;
  }
}
```

## Theming and Customization

### CSS Custom Properties
Use CSS variables for easy theme switching:
```css
:root {
  --cyber-primary: #00ff00;
  --cyber-secondary: #cc00ff;
  /* ... other variables */
}

.alternative-theme {
  --cyber-primary: #ff0080;
  --cyber-secondary: #0080ff;
}
```

### Tailwind Configuration
Extend Tailwind with custom colors:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      cyber: {
        primary: '#00ff00',
        secondary: '#cc00ff',
        // ... other colors
      }
    }
  }
}
```

## Style Guide Checklist

### Development
- [ ] Use consistent color variables
- [ ] Follow responsive design patterns
- [ ] Test animations on slower devices
- [ ] Validate color contrast ratios
- [ ] Test with reduced motion preferences

### Code Quality
- [ ] Use Tailwind classes over custom CSS when possible
- [ ] Keep custom CSS minimal and well-documented
- [ ] Use semantic HTML elements
- [ ] Implement proper focus management
- [ ] Test across different browsers and devices
