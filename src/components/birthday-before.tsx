import CountdownTimer from './countdown-timer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock } from 'lucide-react';

interface BirthdayBeforeProps {
  name: string;
  birthdayDate: string;
}

export default function BirthdayBefore({ name, birthdayDate }: BirthdayBeforeProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full text-center shadow-2xl">
        <CardHeader>
          <div className="mx-auto bg-primary/20 text-primary p-3 rounded-full w-fit">
            <Clock className="h-10 w-10" />
          </div>
          <CardTitle className="font-headline text-4xl pt-4">Get Ready to Celebrate!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            The birthday party for {name} hasn't started yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="font-bold text-xl text-primary-foreground">The party starts in:</p>
            <CountdownTimer targetDate={new Date(birthdayDate)} isBirthday={false} />
        </CardContent>
      </Card>
    </main>
  );
}
