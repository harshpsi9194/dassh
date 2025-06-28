
import { useState } from 'react';
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
    <header className="py-4 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - moved to extreme left */}
        <div className="flex items-center">
          <h1 
            className="font-bold text-cyber-accent text-xl md:text-2xl tracking-widest font-cyber cyber-glow-sm"
            style={{ letterSpacing: '0.2em' }}
          >
            DASSH
          </h1>
        </div>

        {/* Right side - About, Auth/User */}
        <div className="flex items-center space-x-3">
          {/* About button */}
          <button
            onClick={onAboutClick}
            className="cyber-button-small glow-on-hover text-sm"
          >
            ABOUT
          </button>

          {user ? (
            <button
              onClick={onSidebarToggle}
              className="flex items-center space-x-2 cyber-button-small glow-on-hover text-sm"
            >
              <Menu size={16} />
              <span className="hidden sm:inline">MENU</span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="cyber-button-small glow-on-hover text-sm"
            >
              <span className="flex items-center space-x-2">
                <User size={16} />
                <span>LOGIN</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
