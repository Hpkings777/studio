'use client';

import { PartyPopper } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/20 rounded-full animate-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-200px',
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="animate-bounce mb-4">
            <PartyPopper className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-2xl md:text-4xl font-headline font-bold text-foreground animate-pulse">
            Getting the party started...
        </h1>
        <p className="mt-4 text-sm font-bold text-primary-foreground tracking-widest uppercase">
            Hpkings • Bhoot Services
        </p>
      </div>
      <style jsx global>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(0.5);
            opacity: 0;
          }
        }
        .animate-bubble {
            animation-name: bubble;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
