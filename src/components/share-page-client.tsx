'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Copy, Eye, Send, Share2, MessageSquare, Instagram, Shell } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
)

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

  const shareText = "Check out this awesome birthday page I made!";

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
      <div className="flex justify-center space-x-2">
        <Button variant="outline" size="icon" asChild>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                <span className="sr-only">Share on WhatsApp</span>
            </a>
        </Button>
         <Button variant="outline" size="icon" asChild>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                <Send className="h-4 w-4" />
                <span className="sr-only">Share on Telegram</span>
            </a>
        </Button>
        <Button variant="outline" size="icon" disabled>
            <Instagram className="h-4 w-4" />
            <span className="sr-only">Share on Instagram (Not available)</span>
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
