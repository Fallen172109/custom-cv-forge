import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Don't auto-redirect, let user choose to sign in
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth required message if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="font-heading font-semibold text-2xl">CV Tailor</span>
          </div>
          
          <div className="bg-card border rounded-lg p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-2xl font-semibold mb-2">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to access CV Tailor and protect your personal data.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/auth')} 
                className="w-full"
                size="lg"
              >
                Sign In to Continue
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Your CV and personal information are protected by secure authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;