
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
}

const Header = ({ user, onLoginClick, onSidebarToggle }: HeaderProps) => {
  return (
    <header className="py-6 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 
            className="font-bold text-cyber-text text-2xl md:text-3xl tracking-widest font-cyber cyber-glow"
            style={{ letterSpacing: '0.2em' }}
          >
            ENGINE ARCADE
          </h1>
        </div>

        {/* Right side - Auth/User */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={onSidebarToggle}
              className="flex items-center space-x-2 cyber-button glow-on-hover"
            >
              <Menu size={18} />
              <span className="hidden sm:inline">MENU</span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="cyber-button glow-on-hover"
            >
              <span className="flex items-center space-x-2">
                <User size={18} />
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
