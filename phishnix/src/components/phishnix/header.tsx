
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Logo } from './logo';
import { useFirebase, useUser } from '@/firebase';
import { User as UserIcon, LoaderCircle, Menu, LogIn, Info } from 'lucide-react';
import { signOut } from 'firebase/auth';

export function AppHeader() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();

  const handleContactClick = () => {
    router.push('/contact');
  };

  const handleAboutClick = () => {
    router.push('/about');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally, show a toast notification for the error
    }
  };

  const renderUserMenu = () => {
    if (isUserLoading) {
        return (
             <Button variant="ghost" size="icon" disabled>
                <LoaderCircle className="animate-spin" />
             </Button>
        )
    }

    if (user) {
       if (user.isAnonymous) {
        // Menu for anonymous users
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem onClick={() => router.push('/login')}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>
                Dashboard
              </DropdownMenuItem>
               <DropdownMenuItem onClick={handleAboutClick}>
                About Us
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleContactClick}>
                Contact Us
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
      
      // Menu for fully authenticated (non-anonymous) users
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/')}>Dashboard</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleAboutClick}>
                About Us
              </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleContactClick}>Contact Us</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    // Menu for non-logged-in (guest) users
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSignIn}>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </DropdownMenuItem>
           <DropdownMenuSeparator />
           <DropdownMenuItem onClick={() => router.push('/')}>
            Dashboard
          </DropdownMenuItem>
           <DropdownMenuItem onClick={handleAboutClick}>
            About Us
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleContactClick}>
            Contact Us
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="sr-only">PhishNix Home</span>
      </Link>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {renderUserMenu()}
      </div>
    </header>
  );
}
