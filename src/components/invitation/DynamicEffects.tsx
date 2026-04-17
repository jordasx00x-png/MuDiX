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
      className={cn("inline-block relative group", className)}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none rounded-full"
        style={{ zIndex: -1 }}
      />
      {children}
    </motion.div>
  );
}
