import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center shadow-2xl">
        <CardHeader>
          <div className="mx-auto bg-primary/20 text-primary p-3 rounded-full w-fit">
            <PartyPopper className="h-10 w-10" />
          </div>
          <CardTitle className="font-headline text-4xl pt-4">Welcome to Birthday Bliss!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Create and share personalized birthday pages with a touch of magic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="w-full font-bold text-lg">
            <Link href="/create">Get Started</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
