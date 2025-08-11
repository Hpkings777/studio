'use client';
import React, { useEffect, useState } from 'react';

const Balloon = ({ id }: { id: number }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const randomXStart = Math.random() * 100;
    const duration = Math.random() * 10 + 10; // 10 to 20 seconds
    const delay = Math.random() * 10;
    const colors = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 50 + 50; // 50 to 100px

    const keyframes = `
      @keyframes float-${id} {
        0% {
          transform: translate(${randomXStart}vw, 110vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(${randomXStart - 10 + Math.random() * 20}vw, -20vh) rotate(${720 * (Math.random() - 0.5)}deg);
          opacity: 0;
        }
      }
    `;

    // Prevent error during server-side rendering
    if (typeof window !== 'undefined') {
        const styleSheet = document.styleSheets[0];
        try {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch (e) {
            console.warn('Could not insert CSS rule.', e);
        }
    }


    setStyle({
      position: 'fixed',
      bottom: `-${size}px`,
      left: 0,
      width: `${size}px`,
      height: `${size * 1.2}px`,
      backgroundColor: color,
      borderRadius: '50%',
      opacity: 0,
      animation: `float-${id} ${duration}s linear ${delay}s forwards`,
      zIndex: 5,
    });
  }, [id]);

  return <div style={style} />;
};

const Balloons = () => {
  const [balloons, setBalloons] = useState<number[]>([]);

  useEffect(() => {
    setBalloons(Array.from({ length: 15 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none w-full h-full overflow-hidden">
      {balloons.map((id) => (
        <Balloon key={id} id={id} />
      ))}
    </div>
  );
};

export default Balloons;
