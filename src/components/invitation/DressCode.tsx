import React from 'react';
import { motion } from 'motion/react';
import { Shirt } from 'lucide-react';
import { InvitationData } from '../../lib/types';
import { cn } from '../../lib/utils';

interface DressCodeProps {
  data: InvitationData;
  isWedding?: boolean;
  theme: {
    bg: string;
    text: string;
    accent: string;
    accentBg: string;
    border: string;
    primaryColor?: string;
    accentColor?: string;
  };
}

export default function DressCode({ data, theme, isWedding }: DressCodeProps) {
  if (!data.dressCode) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        isWedding ? "p-12 text-center mb-16 relative" : "p-8 rounded-2xl backdrop-blur-sm border text-center mb-16",
        !theme.primaryColor && !isWedding && theme.accentBg, 
        !theme.accentColor && !isWedding && theme.border
      )}
      style={!isWedding ? {
        backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 50%)` : undefined,
        borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 50%)` : undefined,
      } : {}}
    >
      {isWedding && (
        <div className="absolute inset-0 border border-current opacity-20 pointer-events-none rounded-[2rem] md:rounded-[4rem]"></div>
      )}
      
      <h3 
        className={cn(isWedding ? "text-4xl md:text-5xl font-serif font-light mb-8 pt-4 tracking-wider" : "text-3xl mb-6", !theme.accentColor && theme.accent)}
        style={theme.accentColor ? { color: theme.accentColor } : {}}
      >
        Código de Vestimenta
      </h3>
      
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shirt 
          className={cn("w-10 h-10 md:w-12 md:h-12 mx-auto mb-6 opacity-80", !theme.accentColor && theme.accent)} 
          style={theme.accentColor ? { color: theme.accentColor } : {}}
          strokeWidth={isWedding ? 1 : 2}
        />
      </motion.div>

      <p className={cn("mb-8 uppercase tracking-[0.2em]", isWedding ? "text-xl md:text-2xl font-serif font-medium" : "text-xl font-bold tracking-widest")}>{data.dressCode.style}</p>
      
      {data.dressCode.colors && data.dressCode.colors.length > 0 && (
        <div className={isWedding ? "pb-4" : ""}>
          <p className={cn("opacity-70 text-sm", isWedding ? "mb-6 tracking-widest uppercase text-xs" : "mb-4")}>{isWedding ? "Paleta de Colores" : "Paleta de colores sugerida:"}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {data.dressCode.colors.map((color, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="w-10 h-10 rounded-full shadow-lg border-2 border-white/20 relative group cursor-pointer"
                style={{ backgroundColor: color }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {color}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
