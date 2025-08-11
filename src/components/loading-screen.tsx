'use client';

import { PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

const GlitchLine = ({ top, duration }: { top: string; duration: string }) => (
  <div
    className="absolute left-0 w-full h-px bg-primary/50 animate-glitch"
    style={{ top, animationDuration: duration }}
  />
);

export default function LoadingScreen() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--primary)) 1px, hsl(var(--background)) 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            perspective: '200px',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--accent)) 1px, hsl(var(--background)) 1px)',
              backgroundSize: '80px 80px',
              transform: 'rotateX(60deg) scale(1.5)',
              animation: 'scrollGrid 20s linear infinite',
            }}
          />
        </div>
      </div>
      {isClient && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <GlitchLine
              key={i}
              top={`${Math.random() * 100}%`}
              duration={`${Math.random() * 2 + 1}s`}
            />
          ))}
        </div>
      )}
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-4">
        <div className="animate-pulse mb-4" data-text="B">
          <PartyPopper className="w-16 h-16 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]" />
        </div>
        <h1
          className="text-2xl md:text-4xl font-headline font-bold text-foreground animate-glitch-text"
          data-text="Getting the party started..."
        >
          Getting the party started...
        </h1>
        <p className="mt-4 text-sm font-bold text-primary-foreground tracking-widest uppercase animate-glitch-text-sub"
           data-text="Hpkings • Bhoot Services"
        >
          Hpkings • Bhoot Services
        </p>
      </div>
      <style jsx global>{`
        @keyframes scrollGrid {
          from {
            transform: rotateX(60deg) scale(1.5) translateY(0px);
          }
          to {
            transform: rotateX(60deg) scale(1.5) translateY(-80px);
          }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-glitch {
            animation-name: glitch;
            animation-timing-function: steps(1, end);
            animation-iteration-count: infinite;
        }

        @keyframes glitch-text {
          0%, 100% {
            clip-path: inset(0 0 0 0);
          }
          5% {
            clip-path: inset(0.8em 0 0.4em 0);
          }
          10% {
            clip-path: inset(0.4em 0 0.8em 0);
          }
          15% {
            clip-path: inset(0.2em 0 0.1em 0);
          }
          20% {
             clip-path: inset(0.9em 0 0.3em 0);
          }
          25% {
            clip-path: inset(0.5em 0 0.5em 0);
          }
        }
        .animate-glitch-text::before,
        .animate-glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: hsl(var(--background));
        }
        .animate-glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 hsl(var(--accent));
          animation: glitch-text 2s infinite linear alternate-reverse;
        }
        .animate-glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 hsl(var(--primary));
           animation: glitch-text 3.5s infinite linear alternate-reverse;
        }
        
        .animate-glitch-text-sub {
             animation: glitch-text 5s infinite linear alternate-reverse;
        }

      `}</style>
    </div>
  );
}