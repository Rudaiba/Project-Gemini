'use client';

import { useEffect, useState } from 'react';

interface NeuralLayoutProps {
  children: React.ReactNode;
}

export function NeuralLayout({ children }: NeuralLayoutProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Neural Grid Background */}
      <div className="fixed inset-0 neural-grid opacity-[0.03]" />

      {/* Gradient Orbs */}
      <div
        className="fixed w-[500px] h-[500px] rounded-full bg-accent-purple/20 blur-[100px] animate-float"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 1s cubic-bezier(0.075, 0.82, 0.165, 1)',
        }}
      />
      <div
        className="fixed w-[700px] h-[700px] rounded-full bg-accent-blue/10 blur-[120px] animate-float"
        style={{
          right: `${100 - mousePosition.x}%`,
          bottom: `${100 - mousePosition.y}%`,
          transform: 'translate(50%, 50%)',
          transition: 'all 1.2s cubic-bezier(0.075, 0.82, 0.165, 1)',
          animationDelay: '0.2s',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Neural Wave Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-neural-gradient opacity-50 animate-neural-wave" />
    </div>
  );
} 