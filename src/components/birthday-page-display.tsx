'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { getBirthdayData } from '@/lib/storage';
import { arrangeElements } from '@/ai/flows/arrange-elements';
import type { BirthdayData, LayoutConfig } from '@/types';
import CountdownTimer from './countdown-timer';
import Confetti from './confetti';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Music, Volume2, VolumeX } from 'lucide-react';

export default function BirthdayPageDisplay({ id }: { id: string }) {
  const [data, setData] = useState<BirthdayData | null>(null);
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchAndArrange = useCallback(async () => {
    setLoading(true);
    const birthdayData = getBirthdayData(id);

    if (!birthdayData) {
      setError('Birthday celebration not found. The link may be invalid or expired.');
      setLoading(false);
      return;
    }
    setData(birthdayData);

    try {
      const device = window.innerWidth < 768 ? 'mobile' : 'desktop';
      const result = await arrangeElements({
        template: birthdayData.template,
        device,
        name: birthdayData.name,
        message: birthdayData.message,
        photoDataUri: birthdayData.photoDataUri,
        birthdayDate: new Date(birthdayData.birthdayDate).toISOString().split('T')[0],
      });
      
      const parsedLayout = JSON.parse(result.layout);
      setLayout(parsedLayout);
    } catch (e) {
      console.error('Failed to arrange elements:', e);
      setError('Could not prepare the celebration layout. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAndArrange();
  }, [id, fetchAndArrange]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };


  const positionClasses = (position: string) => {
    const positions: { [key: string]: string } = {
      'top-center': 'justify-center items-start', 'top-left': 'justify-start items-start', 'top-right': 'justify-end items-start',
      'center': 'justify-center items-center', 'center-left': 'justify-start items-center', 'center-right': 'justify-end items-center',
      'bottom-center': 'justify-center items-end', 'bottom-left': 'justify-start items-end', 'bottom-right': 'justify-end items-end',
    };
    return positions[position] || 'justify-center items-center';
  };

  const sizeClasses = (element: string, size: string) => {
    if (element === 'photo') {
      const sizes: { [key: string]: string } = { small: 'w-32 h-32 md:w-48 md:h-48', medium: 'w-48 h-48 md:w-64 md:h-64', large: 'w-64 h-64 md:w-96 md:h-96' };
      return sizes[size] || sizes.medium;
    }
    const sizes: { [key: string]: string } = { small: 'text-lg md:text-xl', medium: 'text-2xl md:text-4xl', large: 'text-4xl md:text-6xl font-bold' };
    return sizes[size] || sizes.medium;
  };
  
  const orderedElements = useMemo(() => {
    if (!layout) return [];
    return Object.values(layout).sort((a, b) => {
      const order = ['header', 'photo', 'message', 'countdown'];
      return order.indexOf(a.element) - order.indexOf(b.element);
    });
  }, [layout]);


  if (loading) {
    return (
      <div className="w-full min-h-screen p-8 flex flex-col items-center justify-center gap-8">
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-64 w-64 rounded-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-1/2" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-destructive-foreground">{error || 'An unknown error occurred.'}</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden p-4 md:p-8 flex flex-col">
       <Confetti />
       <Button onClick={toggleMusic} variant="outline" size="icon" className="absolute top-4 right-4 z-20">
        {isMusicPlaying ? <Volume2 /> : <VolumeX />}
        <span className="sr-only">Toggle Music</span>
      </Button>
      {/* Ensure music can be played. You would replace music.mp3 with your actual file in /public */}
      <audio ref={audioRef} src="/music.mp3" loop />
      
      <div className="flex-grow grid grid-cols-1 grid-rows-4 gap-4">
        {orderedElements.map((item) => {
          const { element, position, size } = item;
          const wrapperClasses = `flex p-2 ${positionClasses(position)}`;

          let content;
          switch (element) {
            case 'name':
              content = <h1 className={`text-center font-headline ${sizeClasses(element, size)}`}>{data.name}</h1>;
              break;
            case 'photo':
              content = <div className={`relative ${sizeClasses(element, size)} shadow-2xl rounded-full overflow-hidden border-4 border-secondary`}>
                          <Image src={data.photoDataUri} alt={`Photo of ${data.name}`} layout="fill" objectFit="cover" data-ai-hint="person portrait" />
                        </div>;
              break;
            case 'message':
              content = <p className={`text-center italic ${sizeClasses(element, size)}`}>"{data.message}"</p>;
              break;
            case 'countdown':
              content = <div className={sizeClasses(element, size)}><CountdownTimer targetDate={new Date(data.birthdayDate)} /></div>;
              break;
            default:
              content = null;
          }
          return <div key={element} className={wrapperClasses}>{content}</div>;
        })}
      </div>
    </div>
  );
}
