'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Copy, Eye } from 'lucide-react';

export default function SharePageClient({ id }: { id: string }) {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(`${window.location.origin}/birthday/${id}`);
    }
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied to clipboard!',
      description: 'The link is now ready to be shared.',
    });
  };

  if (!url) {
    return null; 
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input value={url} readOnly className="text-muted-foreground" />
        <Button variant="outline" size="icon" onClick={copyToClipboard}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <Button asChild className="w-full" size="lg">
        <Link href={url}>
          <Eye className="mr-2 h-5 w-5" />
          View Your Page
        </Link>
      </Button>
    </div>
  );
}
