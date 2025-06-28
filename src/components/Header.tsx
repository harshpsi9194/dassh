
import { useState } from 'react';
import { Menu, User, Github } from 'lucide-react';

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
  const handleGitHubClick = () => {
    window.open('https://github.com/dassh-project', '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="py-4 px-0">
      <div className="w-full flex items-center justify-between">
        {/* DASSH Logo in a box - extreme left */}
        <div className="flex items-center pl-0">
          <div className="border border-cyber-accent rounded-md px-3 py-1">
            <h1 
              className="font-bold text-cyber-accent text-lg md:text-xl tracking-widest font-cyber"
              style={{ letterSpacing: '0.2em' }}
            >
              DASSH
            </h1>
          </div>
        </div>

        {/* Right side - LOGIN, ABOUT, GitHub - extreme right with uniform sizing */}
        <div className="flex items-center space-x-3 pr-0">
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

          {/* GitHub icon */}
          <button
            onClick={handleGitHubClick}
            className="cyber-button-small glow-on-hover text-sm w-16 h-10 flex items-center justify-center"
          >
            <Github size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
