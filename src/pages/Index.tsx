
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Terminal from '@/components/Terminal';
import EmailForm from '@/components/EmailForm';
import FeatureCard from '@/components/FeatureCard';
import DinosaurGame from '@/components/DinosaurGame';
import AuthModal from '@/components/AuthModal';
import UserSidebar from '@/components/UserSidebar';
import { MessageSquare, Code, Play } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  id: string;
}

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Add small delay before starting animations
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

  const handleCreateGameClick = () => {
    navigate('/create-game');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Background Dinosaur Game */}
      <DinosaurGame />
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <Header 
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
          onSidebarToggle={() => setShowSidebar(true)}
        />
        
        <div className={`mt-16 mb-12 text-center transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-cyber">
            <span className="text-cyber-primary cyber-glow">Create Games</span>
            <br />
            <span className="text-cyber-secondary cyber-glow">With Just a Prompt</span>
          </h2>
          <p className="text-lg text-cyber-text max-w-2xl mx-auto mb-8">
            Type a prompt, get a playable game instantly. No coding required.
          </p>
          
          {/* CTA Button */}
          <button
            onClick={handleCreateGameClick}
            className="cyber-button text-lg px-8 py-3 glow-on-hover mb-8"
          >
            START CREATING
          </button>
        </div>
        
        <Terminal />
        
        <EmailForm />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 mb-16">
          <FeatureCard 
            icon={<MessageSquare size={28} className="text-cyber-primary" />}
            title="Chat to Create"
            description="Simply describe your game idea in natural language and watch it come to life"
            delay="delay-100"
          />
          
          <FeatureCard 
            icon={<Code size={28} className="text-cyber-accent" />}
            title="No Coding Required"
            description="Create complex games without writing a single line of code"
            delay="delay-300"
          />
          
          <FeatureCard 
            icon={<Play size={28} className="text-cyber-secondary" />}
            title="Instantly Playable"
            description="Get a working game in seconds that you can play and share immediately"
            delay="delay-500"
          />
        </div>
      </div>
      
      <footer className="py-6 border-t border-cyber-border text-center text-sm text-cyber-muted relative z-10">
        <p>© 2025 Engine Arcade. All rights reserved.</p>
        <p className="text-xs mt-1 text-cyber-primary">// INITIALIZING GAME ENGINE //</p>
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
