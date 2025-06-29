import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/supabase';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      if (activeTab === 'login') {
        const { data, error } = await auth.signIn(formData.email, formData.password);
        
        if (error) throw error;
        
        if (data.user) {
          onLoginSuccess({
            email: data.user.email!,
            id: data.user.id,
          });
          
          toast({
            title: "Success!",
            description: "Successfully logged in",
          });
          
          onClose();
          setFormData({ email: '', password: '', confirmPassword: '' });
        }
      } else {
        const { data, error } = await auth.signUp(formData.email, formData.password);
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Account created! Please check your email to confirm your account.",
        });
        
        onClose();
        setFormData({ email: '', password: '', confirmPassword: '' });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await auth.signInWithOAuth(provider);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      // Note: For OAuth, the user will be redirected, so we don't close the modal here
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Social login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="cyber-modal-overlay flex items-center justify-center p-4">
      <div className="cyber-modal w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyber-muted hover:text-cyber-accent transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-cyber-accent cyber-glow mb-2">
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
                ? 'text-cyber-accent border-b-2 border-cyber-accent'
                : 'text-cyber-muted hover:text-cyber-text'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'signup'
                ? 'text-cyber-accent border-b-2 border-cyber-accent'
                : 'text-cyber-muted hover:text-cyber-text'
            }`}
          >
            SIGNUP
          </button>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 cyber-button text-sm py-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 cyber-button text-sm py-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-cyber-border"></div>
          <span className="px-3 text-cyber-muted text-sm">OR</span>
          <div className="flex-1 h-px bg-cyber-border"></div>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="cyber-input w-full pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-muted hover:text-cyber-accent transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {activeTab === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-cyber-text mb-2">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="cyber-input w-full pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-muted hover:text-cyber-accent transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
      </div>
    </div>
  );
};

export default AuthModal;