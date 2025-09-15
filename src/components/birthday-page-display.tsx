
'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { getMemories, saveMemory } from '@/lib/storage';
import { multiSpeakerTts } from '@/ai/flows/multi-speaker-tts.ts';
import type { BirthdayData, LayoutConfig, Memory } from '@/types';
import CountdownTimer from './countdown-timer';
import Confetti from './confetti';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Volume2, VolumeX, CalendarPlus, Gift, PlayCircle, Palette } from 'lucide-react';
import MemoryWall from './memory-wall';
import Balloons from './balloons';
import LoadingScreen from './loading-screen';
import ThemeCustomizer from './theme-customizer';
import { useTheme } from '@/hooks/use-theme';
import { isToday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

function Surprise() {
    const [revealed, setRevealed] = useState(false);

    if (!revealed) {
        return (
            <div className="absolute bottom-4 left-4 z-20">
                <Button variant="ghost" size="icon" onClick={() => setRevealed(true)} className="animate-pulse">
                    <Gift />
                    <span className="sr-only">A surprise!</span>
                </Button>
            </div>
        )
    }

    return (
        <div className="absolute bottom-4 left-4 z-20 bg-card p-4 rounded-lg shadow-lg">
             <Image src="https://picsum.photos/seed/surprise/200/200" alt="Funny Gif" width={200} height={200} data-ai-hint="funny meme" />
            <p className="text-center mt-2">SURPRISE!</p>
        </div>
    )
}

const staticLayout: LayoutConfig = {
    header: { element: 'name', position: 'top-center', size: 'large' },
    photo: { element: 'photo', position: 'center', size: 'medium' },
    message: { element: 'message', position: 'center', size: 'medium' },
    countdown: { element: 'countdown', position: 'bottom-center', size: 'small' },
};


export default function BirthdayPageDisplay({ data }: { data: BirthdayData }) {
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ttsAudioRef = useRef<HTMLAudioElement>(null);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const { themeStyles } = useTheme();
  const { toast } = useToast();


  const fetchAndSetData = useCallback(async () => {
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2500));
    setLoading(true);

    if (!data) {
      setError('Birthday celebration not found. The link may be invalid or expired.');
      await minLoadingTime;
      setLoading(false);
      return;
    }
    
    const initialMemories = await getMemories(data.id);
    setMemories(initialMemories);
    setLayout(staticLayout); 

    await minLoadingTime;
    setLoading(false);

  }, [data]);

  useEffect(() => {
    fetchAndSetData();
  }, [data, fetchAndSetData]);
  
  const handleMemorySubmit = async (author: string, message: string) => {
    try {
        const newMemory = await saveMemory(data.id, { author, message });
        setMemories(currentMemories => [...currentMemories, newMemory]);
        setShowMemoryForm(false);
        toast({
            title: 'Message Posted!',
            description: 'Thank you for sharing your memory.',
        });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Failed to Post Message",
            description: `Could not save memory. Reason: ${errorMessage}`,
        });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
            console.error("Audio play failed:", err);
            toast({
                variant: 'destructive',
                title: 'Could not play music',
                description: 'Your browser might be blocking autoplay. Try interacting with the page first.'
            });
        });
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handlePlayMessage = async () => {
    if (!data?.message) return;
    setIsTtsLoading(true);
    try {
        const { audioDataUri } = await multiSpeakerTts({ message: data.message });
        if (ttsAudioRef.current) {
            ttsAudioRef.current.src = audioDataUri;
            ttsAudioRef.current.play();
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error("Error generating TTS:", error);
        toast({
            variant: 'destructive',
            title: 'Text-to-Speech Failed',
            description: `Sorry, couldn't read the message right now. Reason: ${errorMessage}`
        });
    } finally {
        setIsTtsLoading(false);
    }
  }
  
    const getGoogleCalendarLink = () => {
    if (!data) return '';
    const { birthdayDate, name } = data;
    const date = new Date(birthdayDate);
    // Note: The year from the date might be incorrect, so we get the current year.
    const year = new Date().getFullYear(); 
    const startDate = new Date(year, date.getUTCMonth(), date.getUTCDate());
    const endDate = new Date(year, date.getUTCMonth(), date.getUTCDate() + 1);

    const formattedStartDate = startDate.toISOString().replace(/-|:|\.\d+Z/g, '');
    const formattedEndDate = endDate.toISOString().replace(/-|:|\.\d+Z/g, '');

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=Birthday:%20${encodeURIComponent(name)}&dates=${formattedStartDate}/${formattedEndDate}&details=Don't%20forget%20to%20wish%20${encodeURIComponent(name)}%20a%20happy%20birthday!`;
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
    return <LoadingScreen />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-destructive">{error || 'An unknown error occurred.'}</h2>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const birthdayDateObj = new Date(data.birthdayDate);
  const isBirthdayToday = isToday(new Date(birthdayDateObj.getUTCFullYear(), birthdayDateObj.getUTCMonth(), birthdayDateObj.getUTCDate()));


  return (
    <div className="relative min-h-screen w-full overflow-hidden p-4 md:p-8 flex flex-col" style={themeStyles}>
       {isBirthdayToday && <Confetti />}
       {isBirthdayToday && <Balloons />}
       <div className="absolute top-4 right-4 z-20 flex gap-2">
         <Button onClick={toggleMusic} variant="outline" size="icon">
          {isMusicPlaying ? <Volume2 /> : <VolumeX />}
          <span className="sr-only">Toggle Music</span>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={getGoogleCalendarLink()} target="_blank" rel="noopener noreferrer">
            <CalendarPlus />
            <span className="sr-only">Add to Calendar</span>
          </a>
        </Button>
         <Button onClick={() => setShowThemeCustomizer(!showThemeCustomizer)} variant="outline" size="icon">
          <Palette />
          <span className="sr-only">Customize Theme</span>
        </Button>
      </div>

      <audio ref={audioRef} src={data.musicUrl} loop />
      <audio ref={ttsAudioRef} />
      
      {showThemeCustomizer && <ThemeCustomizer birthdayId={data.id} onClose={() => setShowThemeCustomizer(false)} />}

      <div className="flex-grow grid grid-cols-1 grid-rows-4 gap-4">
        {orderedElements.map((item) => {
          if (!item) return null;
          const { element, position, size } = item;
          const wrapperClasses = `flex p-2 ${positionClasses(position)}`;

          let content;
          switch (element) {
            case 'name':
              content = (
                <div className="text-center">
                  <h1 className={`font-headline ${sizeClasses(element, size)}`}>{data.name}</h1>
                  {data.age > 0 && <p className="text-xl md:text-2xl text-muted-foreground">is turning {data.age}!</p>}
                </div>
              );
              break;
            case 'photo':
              content = <div className={`relative ${sizeClasses(element, size)} shadow-2xl rounded-full overflow-hidden border-4 border-secondary`}>
                          <Image src={data.photoDataUri} alt={`Photo of ${data.name}`} layout="fill" objectFit="cover" data-ai-hint="person portrait" />
                        </div>;
              break;
            case 'message':
              content = (
                <div className="flex items-center gap-2 group max-w-prose text-center">
                    <p className={`italic ${sizeClasses(element, size)}`}>"{data.message}"</p>
                    <Button onClick={handlePlayMessage} disabled={isTtsLoading} size="icon" variant="ghost" className="shrink-0">
                        <PlayCircle />
                        <span className="sr-only">Read message</span>
                    </Button>
                </div>
              );
              break;
            case 'countdown':
              content = <div className={sizeClasses(element, size)}><CountdownTimer targetDate={new Date(data.birthdayDate)} isBirthday={isBirthdayToday} /></div>;
              break;
            default:
              content = null;
          }
          return <div key={element} className={wrapperClasses}>{content}</div>;
        })}
      </div>
      <div className="py-8">
         <MemoryWall memories={memories} onAddMemoryClick={() => setShowMemoryForm(true)} showForm={showMemoryForm} onMemorySubmit={handleMemorySubmit} onCancel={() => setShowMemoryForm(false)} />
      </div>
       {isBirthdayToday && <Surprise />}
    </div>
  );
}
