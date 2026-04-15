import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Static credentials
    const VALID_EMAIL = "admin@polo.com";
    const VALID_PASSWORD = "admin123";

    const enteredEmail = email.trim();
    const enteredPassword = password.trim();

    console.log('Entered Email:', enteredEmail);
    console.log('Entered Password:', enteredPassword);
    console.log('Valid Email:', VALID_EMAIL);
    console.log('Valid Password:', VALID_PASSWORD);
    console.log('Email Match:', enteredEmail === VALID_EMAIL);
    console.log('Password Match:', enteredPassword === VALID_PASSWORD);

    setTimeout(() => {
      if (enteredEmail === VALID_EMAIL && enteredPassword === VALID_PASSWORD) {
        login({ email: enteredEmail, name: "Admin User", role: "admin" });
        setIsLoading(false);
        toast.success("Welcome back!", {
          description: "You have successfully logged in.",
        });
        navigate('/');
      } else {
        setIsLoading(false);
        toast.error("Invalid credentials", {
          description: "Please check your email and password.",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-900/40 z-0" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Polo Live</h1>
        </div>
        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Experience the next generation of live streaming management. Powerful, intuitive, and designed for scale."
            </p>
            <footer className="text-sm text-zinc-400">Polo Live Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>
              <Button disabled={isLoading} className="w-full">
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </div>
          </form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;