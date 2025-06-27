
import { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; id: string }) => void;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate authentication for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, create a mock user
      const mockUser = {
        email: formData.email,
        id: Date.now().toString(),
      };

      toast({
        title: "Success!",
        description: `Successfully ${activeTab === 'login' ? 'logged in' : 'signed up'}`,
      });

      onLoginSuccess(mockUser);
      onClose();
      
      // Reset form
      setFormData({ email: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cyber-modal-overlay flex items-center justify-center p-4">
      <div className="cyber-modal w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyber-muted hover:text-cyber-primary transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-cyber-primary cyber-glow mb-2">
            {activeTab === 'login' ? 'ACCESS TERMINAL' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-cyber-muted text-sm">
            {activeTab === 'login' 
              ? 'Enter your credentials to access the system' 
              : 'Initialize new user account'}
          </p>
        </div>

        <div className="flex mb-6 border-b border-cyber-border">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-cyber-primary border-b-2 border-cyber-primary'
                : 'text-cyber-muted hover:text-cyber-text'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'signup'
                ? 'text-cyber-primary border-b-2 border-cyber-primary'
                : 'text-cyber-muted hover:text-cyber-text'
            }`}
          >
            SIGNUP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyber-text mb-2">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="cyber-input w-full"
              placeholder="user@domain.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyber-text mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="cyber-input w-full"
              placeholder="••••••••"
              required
            />
          </div>

          {activeTab === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-cyber-text mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="cyber-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="cyber-button w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'PROCESSING...' : (activeTab === 'login' ? 'ACCESS SYSTEM' : 'CREATE ACCOUNT')}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-cyber-muted">
          <p>// Demo mode - authentication is simulated</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
