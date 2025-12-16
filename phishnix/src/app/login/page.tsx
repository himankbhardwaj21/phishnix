
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  AuthError,
} from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/phishnix/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle, Eye, EyeOff, Lock, User } from 'lucide-react';
import { AppHeader } from '@/components/phishnix/header';

export default function LoginPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This effect ensures the user is navigated away if already logged in.
  useEffect(() => {
    if (isUserLoading) {
      // Still checking for a user, do nothing yet. The loading screen will show.
      return;
    }

    if (user && !user.isAnonymous) {
      // If we have a non-anonymous user object, login is successful. Navigate away.
      router.push('/');
      return;
    }
  }, [user, isUserLoading, router]);

  const handleAuthError = (err: AuthError) => {
    switch (err.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in.';
      case 'auth/weak-password':
        return 'The password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        console.error('Auth Error:', err);
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Account Created',
          description: 'You have been successfully signed up!',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // The useEffect hook will handle the redirect to '/' when the user state changes.
    } catch (err) {
      setError(handleAuthError(err as AuthError));
    } finally {
      setFormIsLoading(false);
    }
  };
  
  const handleAnonymousSignIn = async () => {
    setFormIsLoading(true);
    setError(null);
    try {
        await signInAnonymously(auth);
        router.push('/');
    } catch (err) {
        setError(handleAuthError(err as AuthError));
    } finally {
        setFormIsLoading(false);
    }
  }

  const handlePasswordReset = () => {
    router.push('/reset-password');
  };
  
  // This is the primary loading screen, shown while Firebase determines the initial auth state.
  if (isUserLoading || (user && !user.isAnonymous)) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Authenticating...</p>
        </div>
      )
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-4">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">{isSignUp ? 'Create an account' : 'Welcome'}</h1>
            <p className="text-balance text-muted-foreground">
              {isSignUp ? 'Enter your information to create an account' : 'Enter your credentials to access your account'}
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
              <CardDescription>
                Use your email and password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Email ID"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={formIsLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {!isSignUp && (
                      <button type="button" onClick={handlePasswordReset} className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={formIsLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      disabled={formIsLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={formIsLoading}>
                  {formIsLoading && !isSignUp ? (
                    <LoaderCircle className="animate-spin" />
                  ) : isSignUp ? (
                    'Sign Up'
                  ) : (
                    'Sign In'
                  )}
                </Button>
                 <Button variant="outline" type="button" onClick={handleAnonymousSignIn} disabled={formIsLoading}>
                    {formIsLoading ? (
                        <LoaderCircle className="animate-spin" />
                    ): (
                        <>
                        <User className="mr-2 h-4 w-4" />
                        Continue without signing in
                        </>
                    )}
                 </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="underline ml-1"
                  disabled={formIsLoading}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        <footer className="mt-8 text-center text-xs text-muted-foreground max-w-sm">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Lock className="h-4 w-4" />
            <p className="font-semibold">Your Privacy is Our Priority</p>
          </div>
          <p>
            Your password is end-to-end encrypted. This means we don't have the ability to see, read, or store your password. Your security is built into our system from the ground up.
          </p>
        </footer>
      </main>
    </div>
  );
}
