import { Cake } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function BirthdayAfter({ name }: { name: string }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center shadow-2xl">
        <CardHeader>
          <div className="mx-auto bg-muted/20 text-muted-foreground p-3 rounded-full w-fit">
            <Cake className="h-10 w-10" />
          </div>
          <CardTitle className="font-headline text-4xl pt-4">The Party's Over!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            The birthday celebration for {name} has finished. Hope you had a great time!
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">You can create your own birthday page to celebrate someone special.</p>
        </CardContent>
      </Card>
    </main>
  );
}
