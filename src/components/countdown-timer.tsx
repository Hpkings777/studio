'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Card } from './ui/card';

type CountdownTimerProps = {
  targetDate: Date;
};

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const secondsRemaining = differenceInSeconds(targetDate, now);

      if (secondsRemaining <= 0) {
        setIsBirthday(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      setIsBirthday(false);
      return {
        days: Math.floor(secondsRemaining / (3600 * 24)),
        hours: Math.floor((secondsRemaining % (3600 * 24)) / 3600),
        minutes: Math.floor((secondsRemaining % 3600) / 60),
        seconds: Math.floor(secondsRemaining % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isBirthday) {
    return <div className="text-4xl font-bold text-primary animate-pulse">Happy Birthday!</div>;
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4">
      {timeUnits.map((unit) => (
        <Card key={unit.label} className="text-center p-2 md:p-4 bg-secondary/50 border-secondary w-20 md:w-28">
            <div className="text-2xl md:text-5xl font-bold font-mono text-primary-foreground">{String(unit.value).padStart(2, '0')}</div>
            <div className="text-xs md:text-sm uppercase text-muted-foreground">{unit.label}</div>
        </Card>
      ))}
    </div>
  );
}
