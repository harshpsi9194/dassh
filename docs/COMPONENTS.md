
# Component Documentation

## Core Components

### DinosaurGame
**File**: `src/components/DinosaurGame.tsx`
**Purpose**: Animated background element

#### Props
- None (self-contained component)

#### Key Features
- Canvas-based HTML5 game implementation
- Auto-running dinosaur with random jumping
- Obstacle generation and collision detection
- Responsive canvas sizing
- Low opacity background styling

#### Technical Details
```typescript
interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Dino extends GameObject {
  dy: number;
  isJumping: boolean;
  isDucking: boolean;
}
```

#### Customization Options
- Opacity: Modify inline styles (currently 0.15)
- Colors: Change fillStyle values in draw functions
- Speed: Adjust gameSpeed in gameStateRef
- Jump frequency: Modify probability in autoJump function

---

### AuthModal
**File**: `src/components/AuthModal.tsx`
**Purpose**: User authentication interface

#### Props
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; id: string }) => void;
}
```

#### Key Features
- Tabbed interface (Login/Signup)
- Form validation with error handling
- Cyberpunk-styled modal design
- Loading states and feedback
- Mock authentication (demo mode)

#### Form Structure
```typescript
interface FormData {
  email: string;
  password: string;
  confirmPassword: string; // Signup only
}
```

#### Validation Rules
- Email format validation
- Password minimum 6 characters
- Password confirmation matching (signup)
- Required field checking

---

### UserSidebar
**File**: `src/components/UserSidebar.tsx`
**Purpose**: User dashboard and navigation

#### Props
```typescript
interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}
```

#### Key Features
- Responsive design (overlay on mobile, sidebar on desktop)
- Tabbed content (Queries/Games)
- User profile display
- Mock data for demonstration
- Smooth slide animations

#### Data Structures
```typescript
interface Query {
  id: string;
  prompt: string;
  timestamp: Date;
}

interface Game {
  id: string;
  name: string;
  description: string;
  timestamp: Date;
}
```

#### Responsive Behavior
- Mobile: Full-width overlay with backdrop
- Desktop: Fixed sidebar (320px width)
- Touch-friendly interactions
- Swipe gestures (future enhancement)

---

### Header
**File**: `src/components/Header.tsx`
**Purpose**: Main navigation header

#### Props
```typescript
interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onSidebarToggle: () => void;
}
```

#### Key Features
- Logo with cyberpunk styling
- Conditional authentication button
- Menu toggle for logged-in users
- Responsive layout
- Glow effects on hover

#### Styling Classes
- `cyber-glow`: Text shadow effect
- `glow-on-hover`: Hover animation
- `cyber-button`: Primary button styling

## Styling Components

### CSS Classes Reference

#### Cyberpunk Theme Classes
```css
.cyber-text        /* Primary text color (#f0f0f0) */
.cyber-primary     /* Neon green (#00ff00) */
.cyber-secondary   /* Electric purple (#cc00ff) */
.cyber-accent      /* Cyan (#00ffff) */
.cyber-muted       /* Muted gray (#666666) */
```

#### Interactive Elements
```css
.cyber-button           /* Primary button style */
.cyber-button-secondary /* Secondary button style */
.cyber-input           /* Input field styling */
.cyber-modal          /* Modal container */
.cyber-modal-overlay  /* Modal backdrop */
```

#### Effects and Animations
```css
.cyber-glow       /* Text glow effect */
.cyber-glow-sm    /* Small glow effect */
.glow-on-hover    /* Hover glow animation */
.delayed-fade-in  /* Staggered fade animation */
```

## Shared Interfaces

### User Interface
```typescript
interface User {
  email: string;
  id: string;
}
```

### Component State Patterns

#### Modal State Management
```typescript
const [showModal, setShowModal] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

#### Form Handling
```typescript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

#### Error Handling
```typescript
const { toast } = useToast();

// Success
toast({
  title: "Success!",
  description: "Operation completed successfully",
});

// Error
toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

## Best Practices

### Component Design
1. **Single Responsibility**: Each component has one clear purpose
2. **Prop Interfaces**: All props are properly typed
3. **Error Boundaries**: Handle errors gracefully
4. **Accessibility**: Include ARIA labels and keyboard navigation

### State Management
1. **Local State**: Use useState for component-specific data
2. **Prop Drilling**: Pass data through props (consider Context for deep nesting)
3. **State Lifting**: Move shared state to common parent components

### Styling Guidelines
1. **Utility First**: Use Tailwind classes over custom CSS
2. **Consistent Theming**: Use cyber-* classes for brand consistency
3. **Responsive Design**: Mobile-first approach
4. **Performance**: Avoid inline styles where possible

### Animation Guidelines
1. **Subtle Effects**: Enhance without distraction
2. **Performance**: Use transform and opacity for animations
3. **Accessibility**: Respect prefers-reduced-motion
4. **Consistency**: Use defined animation classes
