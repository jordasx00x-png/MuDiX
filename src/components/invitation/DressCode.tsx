import React from 'react';
import { motion } from 'motion/react';
import { Shirt } from 'lucide-react';
import { InvitationData } from '../../lib/types';
import { cn } from '../../lib/utils';

interface DressCodeProps {
  data: InvitationData;
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

export default function DressCode({ data, theme }: DressCodeProps) {
  if (!data.dressCode) return null;

  return (
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
      <h3 
        className={cn("text-3xl mb-6", !theme.accentColor && theme.accent)}
        style={theme.accentColor ? { color: theme.accentColor } : {}}
      >
        Código de Vestimenta
      </h3>
      
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shirt 
          className={cn("w-12 h-12 mx-auto mb-4", !theme.accentColor && theme.accent)} 
          style={theme.accentColor ? { color: theme.accentColor } : {}}
        />
      </motion.div>

      <p className="text-xl font-bold mb-6 uppercase tracking-widest">{data.dressCode.style}</p>
      
      {data.dressCode.colors && data.dressCode.colors.length > 0 && (
        <div>
          <p className="opacity-80 mb-4 text-sm">Paleta de colores sugerida:</p>
          <div className="flex justify-center gap-3 flex-wrap">
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
