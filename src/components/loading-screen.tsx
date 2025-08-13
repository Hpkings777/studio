'use client';

import { PartyPopper } from 'lucide-react';

export default function LoadingScreen() {

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-4">
        <div className="animate-pulse mb-4">
          <PartyPopper className="w-16 h-16 text-primary drop-shadow-[0_0_15px_hsl(var(--primary))]" />
        </div>
        <h1
          className="text-2xl md:text-4xl font-headline font-bold text-foreground"
        >
          Getting the party started...
        </h1>
        <p className="mt-4 text-sm font-semibold text-foreground/70 tracking-widest uppercase"
        >
          Powered by Bhoot services
        </p>
      </div>
    </div>
  );
}
