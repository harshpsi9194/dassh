import { Menu, User } from 'lucide-react';

interface User {
  email: string;
  id: string;
}

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onSidebarToggle: () => void;
  onAboutClick: () => void;
}

const Header = ({ user, onLoginClick, onSidebarToggle, onAboutClick }: HeaderProps) => {
  return (
    // Use fixed positioning to ensure it spans the full screen width
    <header className="py-4 fixed top-0 left-0 right-0 w-full z-50 bg-transparent">
      {/* Minimal padding to touch screen edges */}
      <div className="w-full flex items-center justify-between px-2">
        {/* DASSH Logo in a box - extreme left */}
        <div className="border border-cyber-accent rounded-md">
          <h1
            className="font-bold text-cyber-accent text-lg md:text-xl tracking-widest font-cyber px-2 py-1"
            style={{ letterSpacing: '0.2em' }}
          >
            DASSH
          </h1>
        </div>

        {/* Right side - LOGIN/MENU and ABOUT - extreme right */}
        <div className="flex items-center space-x-3">
          {user ? (
            <button
              onClick={onSidebarToggle}
              className="flex items-center justify-center cyber-button-small glow-on-hover text-sm w-16 h-10"
            >
              <Menu size={16} />
              <span className="hidden sm:inline ml-1">MENU</span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="cyber-button-small glow-on-hover text-sm w-16 h-10 flex items-center justify-center"
            >
              <User size={16} />
              <span className="hidden sm:inline ml-1">LOGIN</span>
            </button>
          )}

          {/* About button */}
          <button
            onClick={onAboutClick}
            className="cyber-button-small glow-on-hover text-sm w-16 h-10 flex items-center justify-center"
          >
            ABOUT
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;