import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (data.session) {
          toast({
            title: "Welcome!",
            description: "Successfully logged in with OAuth",
          });
          navigate('/');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-accent mx-auto mb-4"></div>
        <p className="text-cyber-text">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;