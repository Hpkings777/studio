import SharePageClient from '@/components/share-page-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

export default function SharePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 text-primary p-3 rounded-full w-fit">
                <Share2 className="h-10 w-10" />
            </div>
          <CardTitle className="font-headline text-3xl pt-4">Your Birthday Page is Ready!</CardTitle>
          <CardDescription>Share this link with your friends and family.</CardDescription>
        </CardHeader>
        <CardContent>
          <SharePageClient id={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
