import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StarDefenderGame from '@/components/StarDefenderGame';
import BottomTerminalInput from '@/components/BottomTerminalInput';
import AuthModal from '@/components/AuthModal';
import UserSidebar from '@/components/UserSidebar';
import AboutPage from '@/components/AboutPage';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/supabase';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle authentication state
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await auth.getSession();
        if (session?.user) {
          setUser({
            email: session.user.email!,
            id: session.user.id,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
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
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    toast({
      title: "Welcome back!",
      description: `Logged in as ${userData.email}`,
    });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setShowSidebar(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
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
            <span className="text-cyber-accent cyber-glow-sm">Hi user, I am DASSH</span>
          </h2>
          <p className="text-lg text-cyber-text max-w-3xl mx-auto mb-8 leading-relaxed">
            Welcome to the future of game development. I'm your AI-powered game creation assistant, 
            designed to transform your wildest gaming ideas into playable experiences. Whether you're 
            dreaming of retro arcade adventures, mind-bending puzzle platformers, or epic space odysseys, 
            I can bring your vision to life instantly. Simply describe what you want to create, and 
            I'll handle all the technical complexity behind the scenes.
          </p>
        </div>
      </div>

      {/* Bottom Terminal Input */}
      <BottomTerminalInput />

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