
'use client';

import { useTheme } from 'next-themes';
import { AppHeader } from '@/components/phishnix/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-10">
        <div className="w-full max-w-2xl">
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
            Settings
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span className="font-medium">Dark Mode</span>
                  <span className="text-xs font-normal leading-snug text-muted-foreground">
                    Adjust the appearance to a light or dark theme.
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                    <Sun className={`h-5 w-5 transition-all ${isDarkMode ? 'text-muted-foreground' : 'text-yellow-500'}`} />
                    <Switch
                        id="dark-mode"
                        checked={isDarkMode}
                        onCheckedChange={toggleTheme}
                    />
                    <Moon className={`h-5 w-5 transition-all ${isDarkMode ? 'text-blue-400' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
