import { InvitationData, SectionStyle } from '../../lib/types';
import { cn } from '../../lib/utils';
import { MapPin, Calendar, Clock, Gift, Mail, CheckCircle2, Heart, Instagram, Camera, Type, Palette, Maximize, AlignLeft, AlignCenter, AlignRight, X, Check, Sparkles, Rocket, Zap, Star, Baby, Shield, TreePine, Footprints, Leaf, Cloud, Moon, Orbit, Dog, Bone, Gamepad2, Trophy, Pickaxe, Sword, Gamepad, User, FastForward, Circle, Square, Box, Crown, Flower, Flower2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import InteractiveRSVP from './InteractiveRSVP';
import MusicPlayer from './MusicPlayer';
import DressCode from './DressCode';
import { Editable } from './Editable';
import QRShare from './QRShare';
import { InteractiveTilt, MagneticButton, ElegantBorder } from './DynamicEffects';

export const themes = {
// ... (rest of themes)
  bosque: {
    bg: 'bg-emerald-900',
    text: 'text-emerald-50',
    accent: 'text-emerald-300',
    accentBg: 'bg-emerald-800/50',
    border: 'border-emerald-700/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/bosque_encantado/1080/1920?blur=2',
  },
  bridgerton: {
    bg: 'bg-blue-900',
    text: 'text-blue-50',
    accent: 'text-blue-300',
    accentBg: 'bg-blue-800/50',
    border: 'border-blue-700/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/bridgerton_style/1080/1920?blur=2',
  },
  princesa: {
    bg: 'bg-purple-900',
    text: 'text-purple-50',
    accent: 'text-purple-300',
    accentBg: 'bg-purple-800/50',
    border: 'border-purple-700/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/princesa_sapo/1080/1920?blur=2',
  },
  elegancia: {
    bg: 'bg-stone-900',
    text: 'text-stone-50',
    accent: 'text-amber-300',
    accentBg: 'bg-stone-800/50',
    border: 'border-stone-700/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/elegancia_celestial/1080/1920?blur=2',
  },
  floral: {
    bg: 'bg-rose-900',
    text: 'text-rose-50',
    accent: 'text-rose-300',
    accentBg: 'bg-rose-800/50',
    border: 'border-rose-700/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/floral_rosa/1080/1920?blur=2',
  },
  estrellas: {
    bg: 'bg-indigo-950',
    text: 'text-indigo-50',
    accent: 'text-indigo-300',
    accentBg: 'bg-indigo-900/50',
    border: 'border-indigo-800/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/noche_estrellas/1080/1920?blur=2',
  },
  dorado: {
    bg: 'bg-yellow-950',
    text: 'text-yellow-50',
    accent: 'text-yellow-400',
    accentBg: 'bg-yellow-900/50',
    border: 'border-yellow-800/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/sueno_dorado/1080/1920?blur=2',
  },
  rose_gold: {
    bg: 'bg-[#2D1B1E]',
    text: 'text-[#F8E1E5]',
    accent: 'text-[#E5A9B4]',
    accentBg: 'bg-[#3D2B2E]/50',
    border: 'border-[#4D3B3E]/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/rose_gold_luxury/1080/1920?blur=2',
  },
  noche_magica: {
    bg: 'bg-[#0A0E1A]',
    text: 'text-[#E0E7FF]',
    accent: 'text-[#93C5FD]',
    accentBg: 'bg-[#1E293B]/50',
    border: 'border-[#334155]/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/midnight_magic/1080/1920?blur=2',
  },
  esmeralda_plata: {
    bg: 'bg-[#062C22]',
    text: 'text-[#ECFDF5]',
    accent: 'text-[#94A3B8]',
    accentBg: 'bg-[#064E3B]/50',
    border: 'border-[#065F46]/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/emerald_silver/1080/1920?blur=2',
  },
  minimalista: {
    bg: 'bg-zinc-900',
    text: 'text-zinc-50',
    accent: 'text-zinc-300',
    accentBg: 'bg-zinc-800/50',
    border: 'border-zinc-700/50',
    font: 'font-sans',
    image: 'https://picsum.photos/seed/minimalista/1080/1920?blur=2',
  },
  rojo_pasion: {
    bg: 'bg-red-900',
    text: 'text-red-50',
    accent: 'text-red-300',
    accentBg: 'bg-red-800/50',
    border: 'border-red-700/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/rojo_pasion/1080/1920?blur=2',
  },
  vino_tinto: {
    bg: 'bg-rose-950',
    text: 'text-rose-50',
    accent: 'text-rose-200',
    accentBg: 'bg-rose-900/50',
    border: 'border-rose-800/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/vino_tinto/1080/1920?blur=2',
  },
  carmesi: {
    bg: 'bg-red-950',
    text: 'text-red-50',
    accent: 'text-red-400',
    accentBg: 'bg-red-900/50',
    border: 'border-red-800/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/carmesi/1080/1920?blur=2',
  },
  mariposa_azul: {
    bg: 'bg-cyan-950',
    text: 'text-cyan-50',
    accent: 'text-cyan-300',
    accentBg: 'bg-cyan-900/50',
    border: 'border-cyan-800/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/mariposa_azul/1080/1920?blur=2',
  },
  vintage_sepia: {
    bg: 'bg-orange-950',
    text: 'text-orange-50',
    accent: 'text-orange-300',
    accentBg: 'bg-orange-900/50',
    border: 'border-orange-800/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/vintage_sepia/1080/1920?blur=2',
  },
  neon_party: {
    bg: 'bg-fuchsia-950',
    text: 'text-fuchsia-50',
    accent: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-900/50',
    border: 'border-fuchsia-800/50',
    font: 'font-sans',
    image: 'https://picsum.photos/seed/neon_party/1080/1920?blur=2',
  },
  invierno_magico: {
    bg: 'bg-slate-900',
    text: 'text-slate-50',
    accent: 'text-sky-300',
    accentBg: 'bg-slate-800/50',
    border: 'border-slate-700/50',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/invierno_magico/1080/1920?blur=2',
  },
  atardecer_tropical: {
    bg: 'bg-orange-900',
    text: 'text-orange-50',
    accent: 'text-yellow-300',
    accentBg: 'bg-orange-800/50',
    border: 'border-orange-700/50',
    font: 'font-sans',
    image: 'https://picsum.photos/seed/atardecer_tropical/1080/1920?blur=2',
  },
  boda_clasica: {
    bg: 'bg-black',
    text: 'text-zinc-100',
    accent: 'text-white/60',
    accentBg: 'bg-zinc-900/50',
    border: 'border-white/10',
    font: 'font-serif',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1080&auto=format&fit=crop', // Elegant wedding photo
    primaryColor: '#000000',
    accentColor: '#ffffff'
  },
  boda_rustica: {
    bg: 'bg-[#2A2A2A]',
    text: 'text-[#F5F5F0]',
    accent: 'text-[#D4AF37]', // Gold accent
    accentBg: 'bg-black/30',
    border: 'border-[#D4AF37]/30',
    font: 'font-serif',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1080&auto=format&fit=crop',
    primaryColor: '#2A2A2A',
    accentColor: '#D4AF37'
  },
  cumpleanos_infantil: {
    bg: 'bg-sky-100',
    text: 'text-sky-900',
    accent: 'text-pink-500',
    accentBg: 'bg-white/80',
    border: 'border-sky-200',
    font: 'font-sans',
    image: 'https://picsum.photos/seed/cumpleanos_infantil/1080/1920?blur=2',
  },
  baby_shower: {
    bg: 'bg-teal-50',
    text: 'text-teal-900',
    accent: 'text-teal-600',
    accentBg: 'bg-white/80',
    border: 'border-teal-200',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/baby_shower/1080/1920?blur=2',
  },
  graduacion: {
    bg: 'bg-slate-900',
    text: 'text-slate-50',
    accent: 'text-amber-400',
    accentBg: 'bg-slate-800/80',
    border: 'border-slate-700',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/graduacion/1080/1920?blur=2',
  },
  bautizo: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    accent: 'text-blue-500',
    accentBg: 'bg-white/80',
    border: 'border-blue-200',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/bautizo/1080/1920?blur=2',
  },
  aniversario: {
    bg: 'bg-rose-50',
    text: 'text-rose-950',
    accent: 'text-rose-600',
    accentBg: 'bg-white/80',
    border: 'border-rose-200',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/aniversario/1080/1920?blur=2',
  },
  superheroe: {
    bg: 'bg-blue-700',
    text: 'text-white',
    accent: 'text-yellow-400',
    accentBg: 'bg-red-600/80',
    border: 'border-yellow-500',
    font: 'font-sans font-black uppercase',
    image: 'https://picsum.photos/seed/superhero_comic/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/superhero,marvel',
  },
  dinosaurio: {
    bg: 'bg-lime-900',
    text: 'text-lime-50',
    accent: 'text-orange-400',
    accentBg: 'bg-lime-800/80',
    border: 'border-lime-600',
    font: 'font-sans font-bold',
    image: 'https://picsum.photos/seed/dinosaur_jungle/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/dinosaur,t-rex',
  },
  unicornio: {
    bg: 'bg-pink-100',
    text: 'text-pink-900',
    accent: 'text-purple-500',
    accentBg: 'bg-white/90',
    border: 'border-pink-300',
    font: 'font-serif',
    image: 'https://picsum.photos/seed/unicorn_rainbow/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/unicorn,rainbow',
  },
  espacio: {
    bg: 'bg-slate-950',
    text: 'text-slate-50',
    accent: 'text-cyan-400',
    accentBg: 'bg-slate-900/80',
    border: 'border-cyan-900',
    font: 'font-mono',
    image: 'https://picsum.photos/seed/space_galaxy/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/astronaut,space',
  },
  bluey: {
    bg: 'bg-sky-400',
    text: 'text-white',
    accent: 'text-orange-400',
    accentBg: 'bg-sky-600/80',
    border: 'border-sky-300',
    font: 'font-sans font-bold',
    image: 'https://picsum.photos/seed/bluey_dog/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/bluey,dog',
  },
  mario: {
    bg: 'bg-red-600',
    text: 'text-white',
    accent: 'text-yellow-400',
    accentBg: 'bg-blue-600/80',
    border: 'border-yellow-500',
    font: 'font-sans font-black uppercase',
    image: 'https://picsum.photos/seed/super_mario/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/mario,nintendo',
  },
  minecraft: {
    bg: 'bg-emerald-900',
    text: 'text-emerald-50',
    accent: 'text-stone-400',
    accentBg: 'bg-emerald-800/80',
    border: 'border-emerald-700',
    font: 'font-mono',
    image: 'https://picsum.photos/seed/minecraft_blocks/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/minecraft,creeper',
  },
  roblox: {
    bg: 'bg-slate-900',
    text: 'text-white',
    accent: 'text-red-600',
    accentBg: 'bg-slate-800/80',
    border: 'border-red-700',
    font: 'font-sans font-black',
    image: 'https://picsum.photos/seed/roblox_game/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/roblox,character',
  },
  sonic: {
    bg: 'bg-blue-800',
    text: 'text-white',
    accent: 'text-red-500',
    accentBg: 'bg-yellow-400/80',
    border: 'border-blue-600',
    font: 'font-sans font-black italic',
    image: 'https://picsum.photos/seed/sonic_hedgehog/1080/1920?blur=1',
    characterImage: 'https://loremflickr.com/400/400/sonic,hedgehog',
  }
};

export function getTheme(data: InvitationData) {
  const baseTheme = themes[data.theme] || themes.bosque;
  return {
    ...baseTheme,
    primaryColor: data.primaryColor,
    accentColor: data.accentColor,
    titleFont: data.titleFont,
    nameFont: data.nameFont,
    bodyFont: data.bodyFont,
  };
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function FloatingParticles({ theme }: { theme?: string }) {
  const mounted = useMounted();
  const isXV = theme === 'princesa' || theme === 'elegancia' || theme === 'dorado' || theme === 'floral' || theme === 'rose_gold' || theme === 'noche_magica' || theme === 'esmeralda_plata';
  const isWedding = theme === 'boda_clasica' || theme === 'boda_rustica';
  const isKids = KIDS_THEMES.includes(theme || '');
  const isFloral = theme === 'floral';
  const isForest = theme === 'bosque';
  const isButterfly = theme === 'mariposa_azul';
  const isSky = theme === 'invierno_magico' || theme === 'estrellas';
  
  const particles = useMemo(() => {
    return [...Array(isXV || isWedding ? 70 : 50)].map((_, i) => ({
      size: Math.random() * (isXV || isWedding ? 5 : 8) + 2,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 15,
      left: Math.random() * 100 + '%',
      top: Math.random() * 110 + '%',
      x: Math.random() * 300 - 150,
      scale: Math.random() * 4 + 1,
      rotation: Math.random() * 720,
    }));
  }, [isXV, isWedding]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => {
        return (
          <motion.div
            key={i}
            className={cn(
              "absolute rounded-full",
              isXV ? "bg-white/40 shadow-[0_0_20px_rgba(255,255,255,0.8)]" : 
              isWedding ? "bg-amber-100/30 shadow-[0_0_15px_rgba(255,240,200,0.5)]" : "bg-white/20"
            )}
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              left: p.left,
              top: p.top,
              perspective: 1000
            }}
            animate={{
              y: [0, -1200],
              x: [0, p.x],
              scale: [1, p.scale, 0.5],
              opacity: [0, (isXV || isWedding) ? 1 : 0.7, 0],
              rotate: [0, p.rotation]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          >
            {isXV && i % 6 === 0 && <Sparkles className="w-full h-full text-white/80 animate-pulse shadow-glow" />}
            {isWedding && i % 8 === 0 && <Sparkles className="w-full h-full text-amber-100/60 animate-pulse" />}
            {isFloral && i % 8 === 0 && <Flower className="w-full h-full text-rose-200/50" />}
            {isKids && i % 5 === 0 && <Star className="w-full h-full text-yellow-200/50" />}
            {isForest && i % 7 === 0 && <Leaf className="w-full h-full text-emerald-300/40" />}
            {isButterfly && i % 10 === 0 && <Moon className="w-full h-full text-cyan-300/50 scale-150 rotate-45" />}
            {isSky && i % 9 === 0 && <Cloud className="w-full h-full text-blue-100/30" />}
          </motion.div>
        );
      })}
    </div>
  );
}


export function DecorativeFrame({ theme }: { theme: any }) {
  return (
    <div className="absolute inset-4 pointer-events-none z-40 border-2 border-white/20 rounded-[2rem] overflow-hidden">
      <motion.div 
        className="absolute inset-0 border-[12px] border-white/10"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-white/40 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-white/40 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-white/40 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-white/40 rounded-br-3xl" />
    </div>
  );
}

export function XVDecoration({ theme }: { theme: any }) {
  const mounted = useMounted();
  const elements = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      x: Math.random() * 100 + "vw",
      y: Math.random() * 100 + "vh",
      scale: Math.random() * 0.5 + 0.5,
      rotate: Math.random() * 360,
      yAnim: Math.random() * -300 - 100,
      xAnim: Math.random() * 100 - 50,
      rotateAnim: Math.random() * 360 + 180,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Corner Flowers */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ 
          opacity: 0.2, 
          scale: [1, 1.05, 1], 
          rotate: [45, 50, 45],
          y: [0, -15, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-96 h-96"
      >
        <Flower2 className="w-full h-full" />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ 
          opacity: 0.2, 
          scale: [1, 1.05, 1], 
          rotate: [-135, -130, -135],
          y: [0, 15, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-20 -right-20 w-96 h-96"
      >
        <Flower2 className="w-full h-full" />
      </motion.div>

      {/* Floating Thematic Elements */}
      {elements.map((e, i) => {
        const Icon = i % 3 === 0 ? Crown : i % 3 === 1 ? Sparkles : Star;
        return (
          <motion.div
            key={i}
            className="absolute opacity-20"
            initial={{ 
              x: e.x, 
              y: e.y,
              scale: e.scale,
              rotate: e.rotate
            }}
            animate={{
              y: [null, e.yAnim],
              x: [null, e.xAnim],
              rotate: [null, e.rotateAnim],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: e.duration,
              repeat: Infinity,
              ease: "linear",
              delay: e.delay
            }}
          >
            <Icon className="w-12 h-12 text-white/40" />
          </motion.div>
        );
      })}

      {/* Elegant Lines */}
      <div className="absolute inset-0 border-[40px] border-white/5 pointer-events-none" />
      <div className="absolute inset-10 border border-white/10 pointer-events-none" />
    </div>
  );
}

export function Confetti() {
  const mounted = useMounted();
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
      left: Math.random() * 100 + '%',
      x: Math.random() * 100 - 50 + 'px',
      rotate: Math.random() * 360,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: p.color,
            left: p.left,
            top: -20 + 'px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.x],
            rotate: [0, p.rotate],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingBalloons() {
  const mounted = useMounted();
  const balloons = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      color: ['#ff4d4d', '#4d79ff', '#4dff4d', '#ffff4d', '#ff4dff'][Math.floor(Math.random() * 5)],
      left: Math.random() * 90 + '%',
      x: Math.random() * 40 - 20 + 'px',
      rotate: Math.random() * 20 - 10,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-16 rounded-full opacity-60"
          style={{
            backgroundColor: b.color,
            left: b.left,
            bottom: -100 + 'px',
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [0, b.x],
            rotate: [0, b.rotate],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "linear",
            delay: b.delay,
          }}
        >
          <div className="absolute bottom-[-20px] left-1/2 w-0.5 h-10 bg-white/30 -translate-x-1/2" />
        </motion.div>
      ))}
    </div>
  );
}

export const KIDS_THEMES = ['cumpleanos_infantil', 'superheroe', 'dinosaurio', 'unicornio', 'espacio', 'bluey', 'mario', 'minecraft', 'roblox', 'sonic'];

export function CharacterSticker({ theme }: { theme: any }) {
  if (!theme.characterImage) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ 
        scale: 1, 
        rotate: [0, 5, -5, 0],
        y: [0, -10, 0]
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 260, damping: 20, delay: 0.5 },
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      className="relative w-32 h-32 md:w-48 md:h-48 mx-auto my-4 z-10"
    >
      <div className="absolute inset-0 bg-white rounded-full shadow-xl p-2 border-4 border-white overflow-hidden">
        <img 
          src={theme.characterImage} 
          alt="Character" 
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-lg"
      >
        <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
      </motion.div>
    </motion.div>
  );
}

export function FloatingIcons({ theme }: { theme: string }) {
  const mounted = useMounted();
  const icons = {
    superheroe: [Zap, Rocket, Shield, Star],
    dinosaurio: [Baby, TreePine, Footprints, Leaf],
    unicornio: [Sparkles, Heart, Star, Cloud],
    espacio: [Rocket, Star, Moon, Orbit],
    bluey: [Dog, Bone, Heart, Star],
    mario: [Gamepad2, Star, Circle, Trophy],
    minecraft: [Square, Box, Pickaxe, Sword],
    roblox: [Gamepad, User, Square, Box],
    sonic: [Zap, Circle, Star, FastForward],
  };

  const themeIcons = icons[theme as keyof typeof icons] || [Star, Sparkles];

  const floaters = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 10,
      size: 24 + Math.random() * 24,
      iconIndex: i % themeIcons.length
    }));
  }, [themeIcons.length]);

  if (!mounted) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {floaters.map((f, i) => {
        const Icon = themeIcons[f.iconIndex];
        return (
          <motion.div
            key={i}
            initial={{ 
              x: f.x, 
              y: f.y,
              opacity: 0,
              scale: 0.5,
              rotate: 0
            }}
            animate={{ 
              y: [null, "-20%", "120%"],
              opacity: [0, 0.4, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: f.duration,
              repeat: Infinity,
              delay: f.delay,
              ease: "linear"
            }}
            className="absolute text-white/20"
          >
            <Icon size={f.size} />
          </motion.div>
        );
      })}
    </div>
  );
}

export function WobblyText({ text, className, style }: { text: string, className?: string, style?: React.CSSProperties }) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-x-2", className)} style={style}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      
      if (target > now) {
        setTimeLeft({
          days: differenceInDays(target, now),
          hours: differenceInHours(target, now) % 24,
          minutes: differenceInMinutes(target, now) % 60,
          seconds: differenceInSeconds(target, now) % 60,
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 my-8">
      {[
        {
          label: 'Días',
          value: timeLeft.days
        },
        {
          label: 'Horas',
          value: timeLeft.hours
        },
        {
          label: 'Minutos',
          value: timeLeft.minutes
        },
        {
          label: 'Segundos',
          value: timeLeft.seconds
        },
      ].map((item, index) => (
        <motion.div 
          key={item.label} 
          className="flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.3 + (index * 0.05) }}
        >
          <div className="relative h-10 md:h-12 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div 
                key={item.value}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-3xl md:text-4xl font-light mb-1"
              >
                {String(item.value).padStart(2, '0')}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-60 mt-1">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function RevealText({ text, className, style, delay = 0 }: { text: string, className?: string, style?: any, delay?: number }) {
  return (
    <div className="overflow-hidden py-1">
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
        className={cn("block", className)}
        style={style}
      >
        {text}
      </motion.span>
    </div>
  );
}

export function ScrollProgress({ color }: { color?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 z-[100] origin-left"
      style={{ 
        scaleX,
        backgroundColor: color || '#ffffff',
        boxShadow: `0 0 15px ${color || '#ffffff'}`
      }}
    />
  );
}

export function ShimmerText({ text, className, style }: { text: string, className?: string, style?: any }) {
  return (
    <div className={cn("relative inline-block overflow-hidden", className)} style={style}>
      <motion.span
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"
      />
      {text}
    </div>
  );
}

export function ParallaxSection({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Use spring for smoother parallax tracking instead of raw value
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });
  
  const y = useTransform(smoothProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

export function GlassCard({ children, className, theme, delay = 0 }: { children: React.ReactNode, className?: string, theme: any, delay?: number }) {
  return (
    <InteractiveTilt intensity={10} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.4, ease: "easeOut" } }}
        className={cn(
          "p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl border shadow-2xl relative overflow-hidden group text-center flex flex-col items-center justify-center transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
          !theme.primaryColor && theme.accentBg,
          !theme.accentColor && theme.border,
          className
        )}
        style={{
          backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 70%)` : undefined,
          borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 60%)` : undefined,
        }}
      >
        {/* Shimmer Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
        />
        
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        {/* Animated Corner Decor */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full transition-transform group-hover:scale-110" />
        
        <div className="relative z-10 w-full">
          {children}
        </div>
      </motion.div>
    </InteractiveTilt>
  );
}

export function PhotoGallery({ images, theme }: { images: string[], theme: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Carousel */}
      <div className="relative aspect-square md:aspect-video overflow-hidden rounded-2xl shadow-2xl group bg-black/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Blurred background for full photo effect */}
            <img
              src={images[currentIndex]}
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110"
              referrerPolicy="no-referrer"
              alt=""
            />
            <motion.img
              src={images[currentIndex]}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full object-contain cursor-pointer z-10"
              onClick={() => setSelectedImage(images[currentIndex])}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white transition-all hover:bg-black/60 hover:scale-110 backdrop-blur-md z-10 shadow-lg border border-white/10"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white transition-all hover:bg-black/60 hover:scale-110 backdrop-blur-md z-10 shadow-lg border border-white/10"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === currentIndex 
                    ? "w-6" 
                    : "bg-white/50 hover:bg-white/80"
                )}
                style={{
                  backgroundColor: idx === currentIndex 
                    ? (theme.accentColor || '#ffffff') 
                    : undefined
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-[110]"
            >
              <X className="w-8 h-8" />
            </motion.button>
            
            <motion.img
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              src={selectedImage}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function TraditionalTemplate({ data, isEditing, onUpdate }: { data: InvitationData, isEditing?: boolean, onUpdate?: (id: string, value: string, style?: SectionStyle) => void }) {
  const theme = getTheme(data);
  const eventDate = data.date ? new Date(data.date) : new Date();
  const isValidDate = !isNaN(eventDate.getTime());
  const isWedding = data.theme === 'boda_clasica' || data.theme === 'boda_rustica';
  const isKidsBirthday = KIDS_THEMES.includes(data.theme);
  const isXV = data.title?.toLowerCase().includes('xv') || data.theme === 'princesa' || data.theme === 'elegancia' || data.theme === 'rose_gold' || data.theme === 'noche_magica' || data.theme === 'esmeralda_plata';

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 250]);
  const bgY = useTransform(scrollY, [0, 2000], [0, 400]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0.4]);

  const mouseX = useSpring(0, { stiffness: 40, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 25 });
  const bgMouseX = useTransform(mouseX, [-0.5, 0.5], [30, -30]);
  const bgMouseY = useTransform(mouseY, [-0.5, 0.5], [30, -30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  };

  const titleSizeClass = {
    'pequeño': 'text-sm md:text-base',
    'mediano': 'text-xl md:text-2xl',
    'grande': 'text-3xl md:text-4xl'
  };

  const nameSizeClass = {
    'pequeño': 'text-6xl md:text-7xl',
    'mediano': 'text-7xl md:text-9xl',
    'grande': 'text-8xl md:text-[10rem]'
  };

  const dateSizeClass = {
    'pequeño': 'text-base md:text-lg',
    'mediano': 'text-lg md:text-xl',
    'grande': 'text-2xl md:text-3xl'
  };

  return (
    <motion.div 
      key={data.theme}
      onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("min-h-screen relative overflow-hidden", !theme.primaryColor && theme.bg, theme.text, !theme.bodyFont && theme.font)}
        style={{
          backgroundColor: theme.primaryColor || undefined,
          fontFamily: theme.bodyFont || undefined
        }}
      >
        <ScrollProgress color={theme.accentColor} />
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          className="absolute inset-[-5%] w-[110%] h-[110%]"
          style={{ x: bgMouseX, y: useTransform([bgY, bgMouseY], ([y1, y2]) => (y1 as number) + (y2 as number)) }}
        >
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={data.coverImage || theme.image} 
            alt="Background" 
            className="w-full h-full object-cover mix-blend-overlay blur-sm" 
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className={cn("absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80")} />
        <FloatingParticles theme={data.theme} />
        {isXV && <XVDecoration theme={theme} />}
        {isKidsBirthday && (
          <>
            <Confetti />
            <FloatingBalloons />
            <FloatingIcons theme={data.theme} />
          </>
        )}
      </div>

      {/* Wedding Hero Section */}
      {isWedding && data.coverImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[100svh] w-full overflow-hidden z-20 flex flex-col items-center justify-center text-center"
        >
          {/* Subtle slow zooming for dynamic effect */}
          <motion.img 
            style={{ y: heroY }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            src={data.coverImage} 
            alt={data.name} 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* High-end gradient fade to black for high contrast */}
          <motion.div 
            className="absolute inset-0 z-10"
            style={{ 
              opacity: heroOpacity,
              background: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, ${theme.primaryColor || (data.theme === 'boda_rustica' ? '#f5f5f4' : '#f8fafc')} 95%)` 
            }}
          />

          {/* Elegant Arch Frame */}
          <div className="absolute inset-4 sm:inset-8 z-20 pointer-events-none border-[1px] border-white/40 rounded-t-full shadow-[inset_0_0_50px_rgba(0,0,0,0.15)]" />
          <div className="absolute inset-6 sm:inset-10 z-20 pointer-events-none border-[1px] border-white/20 rounded-t-full mix-blend-overlay" />
          
          <div className="relative z-30 flex flex-col h-full items-center justify-center space-y-6 pt-24 pb-16 px-6 max-w-2xl mt-auto">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Editable
                id="title"
                value={data.title}
                isEditing={isEditing}
                onUpdate={onUpdate}
                style={data.styles?.title}
                className={cn("block uppercase tracking-[0.4em] text-xs md:text-sm font-medium text-white drop-shadow-md", !theme.accentColor && theme.accent)}
                as="h2"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.8, 
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="py-4"
            >
              {!isEditing ? (
                <ShimmerText
                  text={data.name}
                  className={cn("block font-bold text-white tracking-wide", nameSizeClass[data.nameSize || 'mediano'])}
                  style={{ ...data.styles?.name, textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                />
              ) : (
                <Editable
                  id="name"
                  value={data.name}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  style={{ ...data.styles?.name, textShadow: '0 4px 20px rgba(0,0,0,0.4)' } as any}
                  className={cn("block font-bold text-white tracking-wide", nameSizeClass[data.nameSize || 'mediano'])}
                  as="h1"
                />
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-5 mt-6 w-full max-w-sm mx-auto"
            >
              <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/80 font-light drop-shadow-md">
                Nuestra Boda
              </p>
              
              <div className="flex items-center justify-center w-full gap-4">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/40"></div>
                <p className={cn("font-serif text-white/95 drop-shadow-md px-2", dateSizeClass[data.dateSize || 'mediano'], data.dateUppercase && "uppercase")}>
                  {isValidDate ? format(eventDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : 'Fecha por confirmar'}
                </p>
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/40"></div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="pt-6 w-full flex justify-center"
            >
              <div className="bg-black/20 backdrop-blur-sm px-6 mx-4 rounded-xl border border-white/10 shadow-xl py-4 text-white">
                 <Countdown targetDate={data.date} />
              </div>
            </motion.div>

            {/* Elegant downward indicator pulse */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ delay: 2, duration: 2.5, repeat: Infinity }}
              className="absolute bottom-6 md:bottom-12 w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent"
            />
          </div>
        </motion.div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
        {data.musicUrl && <MusicPlayer url={data.musicUrl} theme={theme} />}
        {/* Header */}
        {(!isWedding || !data.coverImage) && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="text-center mb-16 pt-12"
          >
            <CharacterSticker theme={theme} />
            <motion.div 
              initial={{ opacity: 0, y: -20, letterSpacing: "0em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.3em" }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {isKidsBirthday ? (
                <WobblyText 
                  text={data.title} 
                  className={cn("block uppercase mb-4", titleSizeClass[data.titleSize || 'mediano'], !theme.accentColor && theme.accent)}
                  style={{ fontFamily: theme.titleFont || undefined }}
                />
              ) : (
                <Editable
                  id="title"
                  value={data.title}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  style={{ ...data.styles?.title, fontFamily: data.styles?.title?.fontFamily || theme.titleFont || undefined }}
                  className={cn("block uppercase mb-4 opacity-80", titleSizeClass[data.titleSize || 'mediano'], !theme.accentColor && theme.accent)}
                  as="h2"
                />
              )}
            </motion.div>
            
            {/* Cover Image */}
            {data.coverImage && (
              <div className="relative mb-12">
                {isXV && <DecorativeFrame theme={theme} />}
                <motion.div 
                  initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                  className={cn(
                    "relative mx-auto overflow-hidden shadow-2xl bg-white",
                    data.coverFrame === 'circle' && "w-72 h-72 md:w-96 md:h-96 rounded-full border-4",
                    data.coverFrame === 'diamond' && "w-72 h-72 md:w-96 md:h-96 rotate-45 rounded-xl border-4",
                    data.coverFrame === 'arch' && "w-80 h-[30rem] md:w-[30rem] md:h-[38rem] rounded-t-[10rem] rounded-b-[2rem] border-0",
                    data.coverFrame === 'flower' && "w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] border-4",
                    data.coverFrame === 'vintage' && "w-80 h-[28rem] md:w-[28rem] md:h-[36rem] rounded-[2rem] border-[12px] border-double",
                    (!data.coverFrame || data.coverFrame === 'none') && (isXV 
                      ? "w-80 h-[30rem] md:w-[30rem] md:h-[38rem] rounded-t-[10rem] rounded-b-[2rem] border-0" 
                      : "w-72 h-96 md:w-96 md:h-[32rem] rounded-[2.5rem] border-4")
                  )}
                  style={{ 
                    borderColor: (data.coverFrame && data.coverFrame !== 'none' && data.coverFrame !== 'arch') ? (theme.accentColor || 'currentColor') : (!isXV ? (theme.accentColor || 'currentColor') : undefined),
                    maskImage: (isXV || data.coverFrame === 'arch') ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : undefined,
                    WebkitMaskImage: (isXV || data.coverFrame === 'arch') ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : undefined,
                  }}
                >
                  <motion.img 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    src={data.coverImage} 
                    alt={data.name} 
                    className={cn(
                      "w-full h-full object-cover",
                      data.coverFrame === 'diamond' && "-rotate-45 scale-125"
                    )}
                    referrerPolicy="no-referrer"
                  />
                  
                  {(isXV || data.coverFrame === 'arch') && (
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                  )}
                </motion.div>
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.6 }}
            >
              {isKidsBirthday ? (
                <WobblyText 
                  text={data.name} 
                  className={cn("block font-bold mb-8", nameSizeClass[data.nameSize || 'mediano'], !theme.accentColor && theme.accent)}
                  style={{ fontFamily: theme.nameFont || undefined }}
                />
              ) : (
                <Editable
                  id="name"
                  value={data.name}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  style={{ ...data.styles?.name, fontFamily: data.styles?.name?.fontFamily || theme.nameFont || undefined }}
                  className={cn("block font-bold mb-8", nameSizeClass[data.nameSize || 'mediano'], !theme.accentColor && theme.accent)}
                  as="h1"
                />
              )}
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={cn("opacity-90", dateSizeClass[data.dateSize || 'mediano'], data.dateUppercase && "uppercase")}
            >
              {format(eventDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </motion.p>
            <Countdown targetDate={data.date} />

            {/* Parents Section */}
            {(data.parentsNames?.mother || data.parentsNames?.father) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-12 space-y-4"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.2em] opacity-60">Con la bendición de mis padres</p>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 text-xl font-medium">
                    {data.parentsNames?.mother && <span>{data.parentsNames.mother}</span>}
                    {data.parentsNames?.mother && data.parentsNames?.father && <span className="hidden md:inline opacity-40">&</span>}
                    {data.parentsNames?.father && <span>{data.parentsNames.father}</span>}
                  </div>
                </motion.div>

                {data.gratitudeWords && (
                  <motion.div
                    variants={itemVariants}
                    className="max-w-md mx-auto italic opacity-80 leading-relaxed border-t border-white/10 pt-4"
                  >
                    <Editable
                      id="gratitudeWords"
                      value={data.gratitudeWords}
                      isEditing={isEditing}
                      onUpdate={onUpdate}
                      style={data.styles?.gratitudeWords}
                      multiline
                      className="text-sm"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
            
          </motion.div>
        )}

        {/* Wedding Additional Header Info */}
        {isWedding && data.coverImage && (
          <div className="text-center mb-24 px-6 relative">
            {/* Elegant Top Divider */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-24 h-px bg-current mx-auto opacity-20 mb-16"
            />

            {/* Parents Section */}
            {(data.parentsNames?.mother || data.parentsNames?.father) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] opacity-50">Con la bendición de nuestros padres</p>
                  
                  <div className="flex flex-col gap-6 md:gap-8 items-center justify-center pt-2">
                    {data.parentsNames?.mother && (
                      <span className="text-xl md:text-2xl font-serif text-current opacity-90">{data.parentsNames.mother}</span>
                    )}
                    {data.parentsNames?.mother && data.parentsNames?.father && (
                      <span className="w-1 h-1 bg-current opacity-30 rounded-full md:hidden"></span>
                    )}
                    {data.parentsNames?.father && (
                      <span className="text-xl md:text-2xl font-serif text-current opacity-90">{data.parentsNames.father}</span>
                    )}
                  </div>
                </div>

                {data.gratitudeWords && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="max-w-lg mx-auto relative pt-10 pb-4"
                  >
                    {/* Decorative Quotes */}
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl opacity-10 font-serif">"</span>
                    <Editable
                      id="gratitudeWords"
                      value={data.gratitudeWords}
                      isEditing={isEditing}
                      onUpdate={onUpdate}
                      style={data.styles?.gratitudeWords}
                      multiline
                      className="text-sm md:text-base leading-loose italic opacity-75 font-serif"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {/* Elegant Bottom Divider */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-24 h-px bg-current mx-auto opacity-20 mt-16"
            />
          </div>
        )}

        {/* Guest Info (if provided) */}
        {data.guestName && (
          <GlassCard theme={theme} className="mb-16 mx-4 md:mx-0">
            <RevealText 
              text="Invitación Especial Para"
              className="text-sm uppercase tracking-[0.3em] opacity-70 mb-6 font-medium"
            />
            <Editable
              id="guestName"
              value={data.guestName}
              isEditing={isEditing}
              onUpdate={onUpdate}
              multiline={true}
              style={data.styles?.guestName}
              as="p"
              className={cn("text-4xl md:text-5xl font-serif font-bold mb-8 whitespace-pre-line", !theme.accentColor && theme.accent)}
            />
            
            {data.guestCount !== undefined && data.guestCount > 0 && (
              <div className="inline-flex items-center justify-center gap-4 px-8 py-4 rounded-full bg-white/5 border border-white/10 shadow-inner">
                <span className="text-sm uppercase tracking-wider opacity-80">Pases asignados:</span>
                <span 
                  className={cn("text-xl md:text-2xl font-bold", !theme.accentColor && theme.accent)}
                  style={theme.accentColor ? { color: theme.accentColor } : {}}
                >
                  {data.guestCount}
                </span>
                <span className="text-sm uppercase tracking-wider opacity-80">
                  {data.guestCount === 1 ? 'Persona' : 'Personas'}
                </span>
              </div>
            )}
          </GlassCard>
        )}

        {/* Locations */}
        <div className="space-y-12 mb-24">
          <ParallaxSection offset={-30}>
            <GlassCard theme={theme} className={isWedding ? "py-16 px-8 border-[1px] border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.05)] rounded-t-full relative" : ""}>
            {isWedding && <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-16 bg-current opacity-20" />}
            <RevealText 
              text="Ceremonia"
              className={cn(isWedding ? "text-4xl md:text-5xl font-serif font-light mb-10 pt-12 tracking-wider" : "text-3xl md:text-4xl font-bold mb-8", !theme.accentColor && theme.accent)}
              style={theme.accentColor ? { color: theme.accentColor } : {}}
            />
            <Editable
              id="ceremonyName"
              value={data.ceremony?.name}
              isEditing={isEditing}
              onUpdate={onUpdate}
              style={data.styles?.ceremonyName}
              as="h4"
              className={cn(isWedding ? "text-2xl md:text-3xl font-serif font-medium mb-3" : "text-2xl font-bold mb-2")}
            />
            <Editable
              id="ceremonyAddress"
              value={data.ceremony?.address}
              isEditing={isEditing}
              onUpdate={onUpdate}
              style={data.styles?.ceremonyAddress}
              as="p"
              multiline
              className={cn(isWedding ? "opacity-70 mb-8 text-sm md:text-base max-w-sm mx-auto font-light leading-relaxed" : "opacity-80 mb-6 text-sm max-w-xs mx-auto")}
            />
            <div className={cn("flex items-center justify-center gap-4 mb-10", isWedding ? "opacity-90 text-xl font-serif tracking-widest" : "opacity-90 text-lg", data.dateUppercase && "uppercase")}>
              {isWedding && <span className="w-8 h-px bg-current opacity-30"></span>}
              <span>{data.ceremony?.time}</span>
              {isWedding && <span className="w-8 h-px bg-current opacity-30"></span>}
              {!isWedding && <Clock className="w-5 h-5" />}
            </div>
            <MagneticButton>
              <a 
                href={data.ceremony?.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-3 transition-all relative z-50 pointer-events-auto group",
                  isWedding 
                    ? "px-8 py-3 rounded-none border-b border-current hover:bg-current hover:text-white" 
                    : "px-8 py-4 rounded-full border hover:bg-white/10 shadow-lg",
                  !theme.accentColor && theme.border
                )}
                style={theme.accentColor && !isWedding ? { borderColor: theme.accentColor, color: theme.accentColor } : (isWedding && theme.accentColor ? { color: theme.accentColor } : {})}
              >
                {!isWedding && <MapPin className="w-5 h-5 group-hover:animate-bounce" />}
                <span className="font-medium uppercase tracking-[0.2em] text-xs">Ver ubicación</span>
              </a>
            </MagneticButton>
          </GlassCard>
        </ParallaxSection>

          <ParallaxSection offset={30}>
            <GlassCard theme={theme} delay={0.2} className={isWedding ? "py-16 px-8 border-[1px] border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.05)] rounded-b-full relative" : ""}>
            <RevealText 
              text="Recepción"
              className={cn(isWedding ? "text-4xl md:text-5xl font-serif font-light mb-10 tracking-wider" : "text-3xl md:text-4xl font-bold mb-8", !theme.accentColor && theme.accent)}
              style={theme.accentColor ? { color: theme.accentColor } : {}}
            />
            <Editable
              id="receptionName"
              value={data.reception?.name}
              isEditing={isEditing}
              onUpdate={onUpdate}
              style={data.styles?.receptionName}
              as="h4"
              className={cn(isWedding ? "text-2xl md:text-3xl font-serif font-medium mb-3" : "text-2xl font-bold mb-2")}
            />
            <Editable
              id="receptionAddress"
              value={data.reception?.address}
              isEditing={isEditing}
              onUpdate={onUpdate}
              style={data.styles?.receptionAddress}
              as="p"
              multiline
              className={cn(isWedding ? "opacity-70 mb-8 text-sm md:text-base max-w-sm mx-auto font-light leading-relaxed" : "opacity-80 mb-6 text-sm max-w-xs mx-auto")}
            />
            <div className={cn("flex items-center justify-center gap-4 mb-10", isWedding ? "opacity-90 text-xl font-serif tracking-widest" : "opacity-90 text-lg", data.dateUppercase && "uppercase")}>
              {isWedding && <span className="w-8 h-px bg-current opacity-30"></span>}
              <span>{data.reception?.time}</span>
              {isWedding && <span className="w-8 h-px bg-current opacity-30"></span>}
              {!isWedding && <Clock className="w-5 h-5" />}
            </div>
            <MagneticButton>
              <a 
                href={data.reception?.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-3 transition-all relative z-50 pointer-events-auto group mt-4",
                  isWedding 
                    ? "px-8 py-3 rounded-none border-b border-current hover:bg-current hover:text-white" 
                    : "px-8 py-4 rounded-full border hover:bg-white/10 shadow-lg",
                  !theme.accentColor && theme.border
                )}
                style={theme.accentColor && !isWedding ? { borderColor: theme.accentColor, color: theme.accentColor } : (isWedding && theme.accentColor ? { color: theme.accentColor } : {})}
              >
                {!isWedding && <MapPin className="w-5 h-5 group-hover:animate-bounce" />}
                <span className="font-medium uppercase tracking-[0.2em] text-xs">Ver ubicación</span>
              </a>
            </MagneticButton>
            {isWedding && <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-16 bg-current opacity-20" />}
          </GlassCard>
        </ParallaxSection>
      </div>

        {/* Itinerary */}
        <GlassCard theme={theme} className={cn("mb-16", isWedding ? "bg-transparent border-t border-b border-current py-24 shadow-none rounded-none backdrop-blur-none" : "")}>
          <div className="flex flex-col items-center mb-12">
            {!isWedding && (
              <div 
                className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2", !theme.accentColor && theme.border, !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
              >
                <Clock className="w-8 h-8" />
              </div>
            )}
            <RevealText 
              text="Itinerario"
              className={cn(isWedding ? "text-4xl md:text-5xl font-serif font-light tracking-widest" : "text-3xl md:text-4xl font-bold", !theme.accentColor && theme.accent)}
              style={theme.accentColor ? { color: theme.accentColor } : {}}
            />
            {!isWedding && <div className="h-1 w-12 bg-white/20 rounded-full mt-4" />}
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={cn("w-full mx-auto", isWedding ? "max-w-xl space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl")}
          >
            {data.itinerary?.map((item, index) => {
              const content = (
                <motion.div 
                  key={`${index}-${item.event}`} 
                  variants={itemVariants}
                  whileHover={!isWedding ? { y: -8, scale: 1.02, transition: { duration: 0.3 } } : { scale: 1.05 }}
                  className={cn(
                    "relative flex flex-col items-center justify-center text-center group transition-all duration-500",
                    isWedding 
                      ? "py-8 px-4 rounded-2xl hover:bg-white/5 relative after:content-[''] after:absolute after:bottom-0 after:w-16 after:h-[1px] after:bg-current after:opacity-10 after:left-1/2 after:-translate-x-1/2 last:after:hidden" 
                      : "p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:bg-white/10 overflow-hidden"
                  )}
                >
                  {/* Decorative background element */}
                  {!isWedding && (
                    <div 
                      className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"
                      style={{ backgroundColor: theme.accentColor || '#ffffff' }}
                    />
                  )}
                  {isWedding && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-current to-black/0 opacity-0 group-hover:opacity-[0.03] transition-opacity rounded-2xl pointer-events-none" />
                  )}
                  
                  <div 
                    className={cn(
                      isWedding 
                        ? "text-lg md:text-xl font-serif tracking-widest opacity-80 mb-2 group-hover:scale-110 transition-transform duration-500" 
                        : "text-sm font-mono font-bold tracking-[0.2em] uppercase mb-3 px-4 py-1 rounded-full border border-white/10 bg-white/5",
                      !theme.accentColor && theme.accent
                    )}
                    style={theme.accentColor && !isWedding ? { color: theme.accentColor, borderColor: `${theme.accentColor}33` } : (isWedding && theme.accentColor ? { color: theme.accentColor } : {})}
                  >
                    {item.time}
                  </div>
                  
                  <h5 className={cn(isWedding ? "text-2xl md:text-3xl font-serif font-medium opacity-90 group-hover:tracking-wide transition-all duration-500" : "text-xl md:text-2xl font-serif font-medium leading-tight")}>
                    {item.event}
                  </h5>
                  
                  {!isWedding && (
                    <div className="mt-4 opacity-30 group-hover:opacity-60 transition-opacity">
                      <Heart className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );

              return isWedding ? (
                <InteractiveTilt key={`${index}-${item.event}`} intensity={10}>
                  {content}
                </InteractiveTilt>
              ) : content;
            })}
          </motion.div>
        </GlassCard>

        {/* Dress Code */}
        {data.dressCode && (
          <ParallaxSection offset={20}>
            <div className="flex justify-center w-full">
              <DressCode data={data} theme={theme} isWedding={isWedding} />
            </div>
          </ParallaxSection>
        )}

        {/* Gallery & Instagram */}
        {(!isWedding || data.instagramHashtag) && (data.galleryImages?.length || data.instagramHashtag) && (
          <ParallaxSection offset={40}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-8 rounded-2xl backdrop-blur-sm border text-center mb-16", !theme.primaryColor && theme.accentBg, !theme.accentColor && theme.border)}
            style={{
              backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 50%)` : undefined,
              borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 50%)` : undefined,
            }}
          >
            {(!isWedding) && (
              <RevealText 
                text="Galería"
                className={cn("text-4xl md:text-5xl font-bold mb-8", !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { color: theme.accentColor } : {}}
              />
            )}
            
            {data.instagramHashtag && (
              <div className="mb-8">
                <p className="opacity-80 mb-4">Comparte tus fotos con nosotros usando el hashtag:</p>
                <a 
                  href={`https://www.instagram.com/explore/tags/${data.instagramHashtag.replace('#', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-colors hover:bg-white/10", !theme.accentColor && theme.border, !theme.accentColor && theme.accent)}
                  style={{
                    borderColor: theme.accentColor ? theme.accentColor : undefined,
                    color: theme.accentColor ? theme.accentColor : undefined,
                  }}
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-xl font-bold">{data.instagramHashtag}</span>
                </a>
              </div>
            )}

            {!isWedding && data.galleryImages && data.galleryImages.length > 0 && (
              <PhotoGallery images={data.galleryImages} theme={theme} />
            )}
          </motion.div>
        </ParallaxSection>
      )}

      {/* Gifts */}
      <ParallaxSection offset={-20}>
        <GlassCard theme={theme} className={cn("mb-16", isWedding ? "bg-transparent border-0 shadow-none rounded-none backdrop-blur-none" : "")}>
          <div className="flex flex-col items-center">
            {isWedding && <div className="w-px h-16 bg-current opacity-20 mb-8" />}
            <RevealText 
              text={isWedding ? "Mesa de Regalos" : "Sugerencia de regalo"}
              className={cn(isWedding ? "text-4xl md:text-5xl font-serif font-light mb-6 tracking-wider" : "text-4xl md:text-5xl font-bold mb-8", !theme.accentColor && theme.accent)}
              style={theme.accentColor ? { color: theme.accentColor } : {}}
            />
            <p className={cn("opacity-80 max-w-md mx-auto", isWedding ? "text-base font-light italic font-serif mb-16" : "mb-12 text-lg")}>
              {isWedding ? "El mejor regalo es su presencia, pero si desean tener un detalle con nosotros, estas son nuestras sugerencias:" : "Tu presencia es mi mayor regalo, pero si deseas tener un detalle conmigo te comparto algunas ideas:"}
            </p>
          </div>
          <div className={cn("grid gap-8 max-w-4xl mx-auto", (data.gifts?.envelope && data.gifts?.storeName && data.gifts?.traditional) ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
            {data.gifts?.envelope && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={cn(isWedding ? "p-8 border-b border-current" : "p-8 rounded-3xl border bg-white/5 backdrop-blur-sm transition-all shadow-xl", !theme.accentColor && theme.border)}
                style={theme.accentColor && !isWedding ? { borderColor: `color-mix(in srgb, ${theme.accentColor}, transparent 70%)` } : {}}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Mail 
                    className={cn("w-8 h-8 md:w-10 md:h-10 mx-auto mb-6 opacity-80", !theme.accentColor && theme.accent)} 
                    style={theme.accentColor ? { color: theme.accentColor } : {}}
                  />
                </motion.div>
                <h4 className={cn("mb-3", isWedding ? "text-lg md:text-xl font-serif font-medium uppercase tracking-[0.1em]" : "text-xl font-bold")}>Lluvia de sobres</h4>
                <p className={cn("opacity-70 leading-relaxed", isWedding ? "text-xs md:text-sm font-light" : "text-sm")}>{isWedding ? "La tradición de regalar dinero en efectivo dentro de un sobre el día de nuestra boda." : "Es la tradición de regalar dinero en efectivo a la festejada dentro de un sobre el día del evento."}</p>
              </motion.div>
            )}
            {data.gifts?.traditional && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={cn(isWedding ? "p-8 border-b border-current" : "p-8 rounded-3xl border bg-white/5 backdrop-blur-sm transition-all shadow-xl", !theme.accentColor && theme.border)}
                style={theme.accentColor && !isWedding ? { borderColor: `color-mix(in srgb, ${theme.accentColor}, transparent 70%)` } : {}}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Package 
                    className={cn("w-8 h-8 md:w-10 md:h-10 mx-auto mb-6 opacity-80", !theme.accentColor && theme.accent)} 
                    style={theme.accentColor ? { color: theme.accentColor } : {}}
                  />
                </motion.div>
                <h4 className={cn("mb-3", isWedding ? "text-lg md:text-xl font-serif font-medium uppercase tracking-[0.1em]" : "text-xl font-bold")}>Regalo Tradicional</h4>
                <p className={cn("opacity-70 leading-relaxed", isWedding ? "text-xs md:text-sm font-light" : "text-sm")}>{isWedding ? "Si prefieren darnos un obsequio el día del evento, habrá un espacio especial para recibirlo." : "Puedes traer tu regalo el día del evento. Habrá un espacio especial para recibirlo con mucho cariño."}</p>
              </motion.div>
            )}
            {data.gifts?.storeName && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={cn(isWedding ? "p-8 border-b border-current" : "p-8 rounded-3xl border bg-white/5 backdrop-blur-sm transition-all shadow-xl", !theme.accentColor && theme.border)}
                style={theme.accentColor && !isWedding ? { borderColor: `color-mix(in srgb, ${theme.accentColor}, transparent 70%)` } : {}}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                >
                  <Gift 
                    className={cn("w-8 h-8 md:w-10 md:h-10 mx-auto mb-6 opacity-80", !theme.accentColor && theme.accent)} 
                    style={theme.accentColor ? { color: theme.accentColor } : {}}
                  />
                </motion.div>
                <h4 className={cn("mb-1", isWedding ? "text-lg md:text-xl font-serif font-medium uppercase tracking-[0.1em]" : "text-xl font-bold")}>{data.gifts?.storeName}</h4>
                <p className={cn("opacity-70 mb-6", isWedding ? "text-xs md:text-sm font-light font-mono tracking-widest" : "text-sm")}>Mesa: {data.gifts?.storeCode}</p>
                <a 
                  href={data.gifts?.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-block transition-all relative z-50 pointer-events-auto",
                    isWedding 
                      ? "px-6 py-2 border-b border-current font-serif italic text-sm hover:opacity-70" 
                      : "px-6 py-3 rounded-full border text-sm font-bold hover:bg-white/10 hover:scale-105 shadow-lg",
                    !theme.accentColor && theme.border
                  )}
                  style={theme.accentColor && !isWedding ? { borderColor: theme.accentColor, color: theme.accentColor } : (isWedding && theme.accentColor ? { color: theme.accentColor } : {})}
                >
                  Ver mesa de regalos
                </a>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </ParallaxSection>

        {/* RSVP */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn("text-center", isWedding ? "pt-20 pb-32 max-w-2xl mx-auto" : "pb-12")}
        >
          {isWedding ? (
            <>
              {/* Elegant RSVP Divider */}
              <div className="flex justify-center items-center gap-4 mb-16 opacity-30">
                <span className="w-12 h-px bg-current"></span>
                <span className="w-2 h-2 rotate-45 border border-current"></span>
                <span className="w-12 h-px bg-current"></span>
              </div>
              <p className="text-sm font-mono tracking-[0.2em] uppercase opacity-50 mb-4">Esperamos contar con tu presencia</p>
              <Editable
                id="rsvpTitle"
                value="RSVP"
                isEditing={isEditing}
                onUpdate={onUpdate}
                style={data.styles?.rsvpTitle}
                as="h3"
                className={cn("text-5xl md:text-6xl font-serif font-light tracking-widest mb-10", !theme.accentColor && theme.accent)}
              />
              <div className="flex justify-center">
                <ElegantBorder className="w-full max-w-lg" glowColor={theme.accentColor || 'rgba(255,255,255,0.3)'}>
                  <div className="px-8 py-10 sm:py-14 text-center">
                    <p className="text-lg opacity-80 mb-4 font-light">Por favor confirma tu asistencia</p>
                    {data.date && (
                       <p className={cn("text-sm font-serif italic mb-10 opacity-70")}
                          style={theme.accentColor ? { color: theme.accentColor } : {}}>
                         antes del {(() => {
                            try {
                              const [year, month, day] = data.date.split('-');
                              const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                              return format(subDays(d, 15), "d 'de' MMMM", { locale: es });
                            } catch { return '...'; }
                          })()}
                       </p>
                    )}
                    <div className="flex justify-center">
                      <div className="scale-100 sm:scale-110 w-full sm:w-auto">
                        <InteractiveRSVP data={data} theme={theme} />
                      </div>
                    </div>
                  </div>
                </ElegantBorder>
              </div>
            </>
          ) : (
            <>
              <Editable
                id="rsvpTitle"
                value="RSVP"
                isEditing={isEditing}
                onUpdate={onUpdate}
                style={data.styles?.rsvpTitle}
                as="h3"
                className={cn("text-4xl mb-4", !theme.accentColor && theme.accent)}
              />
              <p className="opacity-80 mb-2">Por favor confirma tu asistencia.</p>
              {data.date && (
                <p className={cn("text-sm font-bold uppercase tracking-widest mb-8", !theme.accentColor && theme.accent)}
                   style={theme.accentColor ? { color: theme.accentColor } : {}}>
                  Confirmar antes del {(() => {
                    try {
                      const [year, month, day] = data.date.split('-');
                      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                      return format(subDays(d, 15), "d 'de' MMMM", { locale: es });
                    } catch { return '...'; }
                  })()}
                </p>
              )}
              <InteractiveRSVP data={data} theme={theme} />
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
