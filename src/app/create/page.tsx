import { BirthdayForm } from '@/components/birthday-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateBirthdayPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a Birthday Page</CardTitle>
          <CardDescription>Fill in the details below to generate a shareable birthday page.</CardDescription>
        </CardHeader>
        <CardContent>
          <BirthdayForm />
        </CardContent>
      </Card>
    </main>
  );
}
