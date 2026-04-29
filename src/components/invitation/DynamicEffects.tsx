import React, { useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * 3D Tilt effect for cards
 */
export function InteractiveTilt({ children, className, intensity = 20 }: { children: React.ReactNode, className?: string, intensity?: number }) {
  const x = useSpring(0, { stiffness: 40, damping: 25, mass: 0.5 });
  const y = useSpring(0, { stiffness: 40, damping: 25, mass: 0.5 });
  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 2000 }}
      className={cn("relative transition-colors duration-300 ease-out", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic button effect
 */
export function MagneticButton({ children, className, style, onClick, power = 0.3 }: { children: React.ReactNode, className?: string, style?: any, onClick?: () => void, power?: number }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * power, y: y * power });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ ...style, x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 100, damping: 12, mass: 0.1 }}
      className={cn("inline-block relative group z-10", className)}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none rounded-full"
        style={{ zIndex: 1 }}
      />
      {children}
    </motion.div>
  );
}

/**
 * Elegant floating particles for a magical look
 */
export function FloatingParticles({ count = 20, color = 'rgba(255,255,255,0.4)' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            backgroundColor: color,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, -Math.random() * 100 - 50],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, Math.random() * 0.5 + 0.3, 0],
            scale: [0, Math.random() + 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Animated refined border
 */
export function ElegantBorder({ children, className, glowColor = 'rgba(255,255,255,0.2)' }: { children: React.ReactNode, className?: string, glowColor?: string }) {
  return (
    <div className={cn("relative group p-[1px] rounded-3xl overflow-hidden", className)}>
      <motion.div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-1000"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-[100%] opacity-20 pointer-events-none"
        style={{ background: `conic-gradient(from 0deg, transparent 0 340deg, ${glowColor} 360deg)` }}
      />
      <div className="relative h-full w-full bg-black/10 backdrop-blur-sm rounded-[calc(1.5rem-1px)]">
        {children}
      </div>
    </div>
  );
}
