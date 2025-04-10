
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  onAuthenticated: (user: { id: string; username: string; email: string }) => void;
}

const AuthForm = ({ onAuthenticated }: AuthFormProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This would typically be an API call to your authentication endpoint
      // For now, we'll simulate a successful authentication
      setTimeout(() => {
        setIsLoading(false);

        // Mock user data
        const user = {
          id: '123',
          username: authMode === 'signup' ? username : 'John Doe',
          email: email,
        };

        // Show success message
        toast({
          title: authMode === 'login' ? 'Logged in successfully!' : 'Account created successfully!',
          description: `Welcome${authMode === 'signup' ? ' to Train Seat Reservation System' : ' back'}, ${user.username}!`,
        });

        // Call the onAuthenticated callback
        onAuthenticated(user);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Authentication failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Train Seat Reservation</CardTitle>
          <CardDescription>
            {authMode === 'login'
              ? 'Enter your credentials to access your account'
              : 'Create an account to start booking train seats'}
          </CardDescription>
        </CardHeader>
        <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as AuthMode)} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="auth-form">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading
                  ? 'Processing...'
                  : authMode === 'login'
                  ? 'Login'
                  : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Tabs>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {authMode === 'login' ? (
            <p>Don't have an account? Click Sign Up above to create one.</p>
          ) : (
            <p>Already have an account? Click Login above to sign in.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
