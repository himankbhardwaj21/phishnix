
'use client';

import { AppHeader } from '@/components/phishnix/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, FlaskConical, Eye, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-10">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              About PhishNix
            </h1>
            <p className="max-w-[700px] text-center mx-auto text-muted-foreground md:text-xl mt-4">
              Our mission is to empower individuals and organizations to defend against digital fraud by providing intelligent, accessible, and educational security tools.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                    <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Phishing attacks are becoming more sophisticated every day. Our goal is to level the playing field by giving everyone access to a powerful AI-driven analysis engine. We believe that by making security simple and transparent, we can help create a safer digital world.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                    <FlaskConical className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Our Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  PhishNix is built on a foundation of cutting-edge technology. We leverage Google's Gemini generative AI model to perform deep contextual analysis of URLs and QR codes, identifying threats that traditional systems might miss. Our platform is built for speed, security, and scalability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                    <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We envision a future where users don't have to be security experts to be safe online. By providing proactive analysis and educational insights—like flagging newly registered domains—we aim to build a community of informed and resilient digital citizens.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                    <Lock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Our Commitment to Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your privacy is paramount. We designed PhishNix from the ground up to be secure. For authenticated users, analysis history is stored privately and is only accessible by you, enforced by strict security rules. We do not share your data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
