
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StarDefenderGame from '@/components/StarDefenderGame';
import BottomTerminalInput from '@/components/BottomTerminalInput';
import AuthModal from '@/components/AuthModal';
import UserSidebar from '@/components/UserSidebar';
import AboutPage from '@/components/AboutPage';
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  id: string;
}

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    toast({
      title: "Welcome back!",
      description: `Logged in as ${userData.email}`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setShowSidebar(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleAboutClick = () => {
    setShowAbout(true);
  };

  const handleBackToMain = () => {
    setShowAbout(false);
  };

  if (showAbout) {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden relative">
        <StarDefenderGame />
        <AboutPage onBackClick={handleBackToMain} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Background Star Defender Game */}
      <StarDefenderGame />
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <Header 
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
          onSidebarToggle={() => setShowSidebar(true)}
          onAboutClick={handleAboutClick}
        />
        
        <div className={`mt-20 mb-32 text-center transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-cyber">
            <span className="text-cyber-accent cyber-glow-sm">Create Games</span>
            <br />
            <span className="text-cyber-accent cyber-glow-sm">With Just a Prompt</span>
          </h2>
          <p className="text-lg text-cyber-text max-w-2xl mx-auto mb-8">
            Type a prompt, get a playable game instantly. No coding required.
          </p>
        </div>
      </div>

      {/* Bottom Terminal Input */}
      <BottomTerminalInput />
      
      <footer className="py-6 border-t border-cyber-border text-center text-sm text-cyber-muted relative z-10 mb-20">
        <p>© 2025 DASSH. All rights reserved.</p>
        <p className="text-xs mt-1 text-cyber-accent">// INITIALIZING GAME ENGINE //</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Sidebar */}
      <UserSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Index;
