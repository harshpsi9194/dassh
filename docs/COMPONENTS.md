# Component Documentation

## Core Components

### StarDefenderGame
**File**: `src/components/StarDefenderGame.tsx`
**Purpose**: Intelligent background game animation

#### Props
- None (self-contained component)

#### Key Features
- Canvas-based HTML5 game implementation
- Smart spaceship with AI targeting system
- Predictive enemy tracking and elimination
- Responsive canvas sizing
- Low opacity background styling (0.25)

#### Technical Details
```typescript
interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Spaceship extends GameObject {
  dx: number;
  dy: number;
  targetX: number;
  targetY: number;
}
```

#### AI Behavior Updates
- **Smart Targeting**: Spaceship now uses `findBestTargetEnemy()` algorithm
- **Threat Assessment**: Prioritizes enemies based on proximity to bottom
- **Predictive Aiming**: Calculates enemy position when missile will reach target
- **Fixed Y-Position**: Spaceship only moves horizontally for better gameplay
- **Increased Speed**: Enhanced movement speed (2.5) for more responsive targeting

#### Customization Options
- Opacity: Modify inline styles (currently 0.25)
- Colors: Change fillStyle values in draw functions
- Speed: Adjust gameSpeed and moveSpeed values
- Targeting: Modify scoring algorithm in `findBestTargetEnemy()`

---

### AuthModal
**File**: `src/components/AuthModal.tsx`
**Purpose**: Real Supabase authentication interface

#### Props
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; id: string }) => void;
}
```

#### Key Features
- **Real Authentication**: Integrated with Supabase Auth
- **Social Login**: Google and GitHub OAuth support
- **Form Validation**: Email format and password strength validation
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Comprehensive error messaging

#### Authentication Methods
```typescript
// Email/Password
await auth.signIn(email, password);
await auth.signUp(email, password);

// Social OAuth
await auth.signInWithOAuth('google');
await auth.signInWithOAuth('github');
```

#### Validation Rules
- Email format validation
- Password minimum 6 characters
- Password confirmation matching (signup)
- Required field checking
- Real-time form validation

---

### BottomTerminalInput
**File**: `src/components/BottomTerminalInput.tsx`
**Purpose**: Enhanced terminal-style input interface

#### Recent Updates
- **Increased Height**: Terminal window now 28 units tall (h-28)
- **Top-Aligned Text**: Text and cursor positioned at top of input area
- **Smaller Font**: Reduced font size for better proportion
- **Aligned Elements**: Dollar sign, text, and button properly aligned
- **Smaller Button**: Reduced arrow button size (w-10 h-10)

#### Key Features
- Authentic terminal header with control buttons
- Auto-cycling game creation suggestions
- Thick cursor bar with consistent positioning
- Submit button with hover effects
- Professional terminal aesthetics

#### Technical Implementation
```typescript
// Top-aligned text positioning
<div className="flex items-start pt-1">
  <span className="text-cyber-accent font-mono text-lg">$</span>
</div>

// Input with top alignment
className="w-full bg-transparent border-none outline-none text-cyber-text font-mono text-sm pt-1"
```

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
- User profile display with real user data
- Mock data for demonstration
- Smooth slide animations
- Real logout functionality

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
  onAboutClick: () => void;
}
```

#### Key Features
- Logo with cyberpunk styling
- Conditional authentication button (LOGIN/MENU)
- Real user state management
- Responsive layout
- Glow effects on hover

## Authentication Integration

### Supabase Client (`src/lib/supabase.ts`)
**Purpose**: Centralized authentication service

#### Key Functions
```typescript
export const auth = {
  signUp: async (email: string, password: string) => { ... },
  signIn: async (email: string, password: string) => { ... },
  signOut: async () => { ... },
  signInWithOAuth: async (provider: 'google' | 'github') => { ... },
  getSession: async () => { ... },
  onAuthStateChange: (callback) => { ... }
}
```

#### Features
- Session management
- OAuth integration
- Error handling
- Type safety

### Authentication State Management

#### Index Page Updates (`src/pages/Index.tsx`)
- **Session Restoration**: Automatically checks for existing sessions
- **Real-time Updates**: Listens for auth state changes
- **Loading States**: Shows loading during auth checks
- **Error Handling**: Graceful error handling for auth operations

```typescript
// Session check on mount
useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await auth.getSession();
    if (session?.user) {
      setUser({
        email: session.user.email!,
        id: session.user.id,
      });
    }
  };
  checkSession();
}, []);

// Real-time auth state listener
useEffect(() => {
  const { data: { subscription } } = auth.onAuthStateChange(
    (event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email!,
          id: session.user.id,
        });
      } else {
        setUser(null);
      }
    }
  );
  return () => subscription.unsubscribe();
}, []);
```

## Styling Components

### CSS Classes Reference

#### Cyberpunk Theme Classes
```css
.cyber-text        /* Primary text color (#c0c0c0) */
.cyber-primary     /* Neon green (#00ff00) */
.cyber-secondary   /* Electric purple (#cc00ff) */
.cyber-accent      /* Cyan (#00FFCC) */
.cyber-muted       /* Muted gray (#808080) */
```

#### Interactive Elements
```css
.cyber-button           /* Primary button style */
.cyber-button-secondary /* Secondary button style */
.cyber-button-small     /* Compact header button style */
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

#### Authentication State Management
```typescript
const [user, setUser] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [showAuthModal, setShowAuthModal] = useState(false);
```

#### Form Handling with Validation
```typescript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: '',
});

const validateForm = () => {
  // Email format validation
  // Password strength validation
  // Confirmation matching
  return isValid;
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

### Authentication Integration
1. **Session Management**: Proper session restoration and cleanup
2. **Error Handling**: Comprehensive error handling for auth operations
3. **Loading States**: Visual feedback during auth operations
4. **Security**: Secure token handling and validation

### State Management
1. **Local State**: Use useState for component-specific data
2. **Auth State**: Centralized authentication state management
3. **Real-time Updates**: Listen for auth state changes
4. **State Lifting**: Move shared state to common parent components

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

## Recent Updates Summary

### StarDefenderGame Improvements
- Enhanced AI targeting system with threat assessment
- Predictive enemy tracking for better accuracy
- Fixed Y-position movement for improved gameplay
- Increased movement speed for more responsive behavior

### Authentication Implementation
- Complete Supabase integration
- Real email/password authentication
- Social login support (Google/GitHub)
- Session management and persistence
- Comprehensive error handling

### UI Enhancements
- Improved terminal input sizing and alignment
- Better visual hierarchy in authentication modal
- Enhanced loading states and user feedback
- Responsive design improvements

### Documentation Updates
- Added comprehensive authentication documentation
- Updated component documentation with new features
- Included setup instructions and troubleshooting guides
- Added API reference and testing guidelines