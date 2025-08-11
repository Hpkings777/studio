'use client';
import React, { useEffect, useState } from 'react';

const ConfettiPiece = ({ id }: { id: number }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const randomXStart = Math.random() * 100;
    const randomYEnd = 100 + Math.random() * 30; // End below the viewport
    const randomRotationStart = Math.random() * 360;
    const randomRotationEnd = Math.random() * 360 + randomRotationStart;
    const duration = Math.random() * 5 + 5; // 5 to 10 seconds
    const delay = Math.random() * 5;
    const colors = ['#003049', '#40798C', '#00ADB5', '#FFFFFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;

    const keyframes = `
      @keyframes fall-${id} {
        0% {
          transform: translate(${randomXStart}vw, -20px) rotate(${randomRotationStart}deg);
          opacity: 1;
        }
        100% {
          transform: translate(${randomXStart - 10 + Math.random() * 20}vw, ${randomYEnd}vh) rotate(${randomRotationEnd}deg);
          opacity: 0;
        }
      }
    `;

    if (typeof window !== 'undefined') {
        const styleSheet = document.styleSheets[0];
        try {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch(e) {
            console.warn('Could not insert CSS rule for confetti animation.', e);
        }
    }

    setStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      width: `${size}px`,
      height: `${size * 1.5}px`,
      backgroundColor: color,
      opacity: 0,
      animation: `fall-${id} ${duration}s linear ${delay}s forwards`,
      zIndex: 10,
    });
  }, [id]);

  return <div style={style} className="rounded-sm" />;
};

const Confetti = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    const pieces = Array.from({ length: 150 }, (_, i) => i);

    return (
        <div className="fixed inset-0 pointer-events-none w-full h-full">
        {pieces.map((id) => (
            <ConfettiPiece key={id} id={id} />
        ))}
        </div>
    );
};

export default Confetti;
