import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface MusicPlayerProps {
  url: string;
  theme: {
    bg: string;
    text: string;
    accent: string;
    border: string;
    primaryColor?: string;
    accentColor?: string;
  };
}

export default function MusicPlayer({ url, theme }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url || !audioRef.current) {
      if (!url) return;
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
    }

    // Attempt to play automatically (might be blocked by browser)
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Auto-play was prevented
          setIsPlaying(false);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={togglePlay}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border transition-transform hover:scale-110",
        !theme.primaryColor && theme.bg,
        theme.text,
        !theme.accentColor && theme.border
      )}
      style={{
        backgroundColor: theme.primaryColor ? theme.primaryColor : undefined,
        borderColor: theme.accentColor ? theme.accentColor : undefined,
        color: theme.accentColor ? theme.accentColor : undefined,
      }}
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
      
      {/* Animated rings when playing */}
      {isPlaying && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-current opacity-50 animate-ping" style={{ animationDuration: '2s' }} />
          <span className="absolute inset-0 rounded-full border-2 border-current opacity-30 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
        </>
      )}
    </motion.button>
  );
}
