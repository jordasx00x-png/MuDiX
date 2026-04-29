import React, { useState } from 'react';
import { CheckCircle2, XCircle, Users, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { InvitationData } from '../../lib/types';
import { cn } from '../../lib/utils';
import { MagneticButton } from './DynamicEffects';

interface InteractiveRSVPProps {
  data: InvitationData;
  theme: {
    bg: string;
    text: string;
    accent: string;
    border: string;
    primaryColor?: string;
    accentColor?: string;
  };
}

export default function InteractiveRSVP({ data, theme }: InteractiveRSVPProps) {
  const [status, setStatus] = useState<'idle' | 'attending' | 'declined'>('idle');
  const [guests, setGuests] = useState(data.guestCount || 1);

  // Update guests if data.guestCount changes
  React.useEffect(() => {
    if (data.guestCount) {
      setGuests(data.guestCount);
    }
  }, [data.guestCount]);

  const handleAttend = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('attending');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: theme.accentColor ? [theme.accentColor] : ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32']
    });
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('declined');
  };

  const getWhatsAppLink = () => {
    if (!data.rsvpPhone) return '#';
    const phone = data.rsvpPhone.replace(/\D/g, '');
    let message = '';
    
    const guestIntro = data.guestName ? `¡Hola! Soy ${data.guestName}. ` : '¡Hola! ';
    
    if (status === 'attending') {
      message = `${guestIntro}Confirmo mi asistencia al evento de ${data.name}. Seremos ${guests} persona(s) en total. ¡Nos vemos ahí! 🎉`;
    } else if (status === 'declined') {
      message = `${guestIntro}Muchas gracias por la invitación al evento de ${data.name}, pero lamentablemente no podré asistir. ¡Les deseo lo mejor! ✨`;
    } else {
      message = `${guestIntro}Quiero confirmar mi asistencia al evento de ${data.name}.`;
    }
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-50 pointer-events-auto">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col gap-4"
          >
            <MagneticButton className="w-full">
              <button
                onClick={handleAttend}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold font-sans tracking-wide transition-all",
                  !theme.primaryColor && theme.bg,
                  "text-white shadow-xl ring-2 ring-white/20 hover:scale-105 hover:shadow-2xl"
                )}
                style={theme.primaryColor ? { backgroundColor: theme.primaryColor, textShadow: '0 2px 4px rgba(0,0,0,0.3)' } : { textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 drop-shadow-md" />
                <span className="drop-shadow-md">¡Sí, asistiré!</span>
              </button>
            </MagneticButton>
            <MagneticButton className="w-full">
              <button
                onClick={handleDecline}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold font-sans tracking-wide transition-all hover:bg-black/5 hover:scale-105 border-2 border-current opacity-80"
                style={theme.accentColor ? { color: theme.accentColor, borderColor: theme.accentColor, backgroundColor: 'rgba(255,255,255,0.8)' } : { backgroundColor: 'rgba(255,255,255,0.8)' }}
              >
                <XCircle className="w-5 h-5 flex-shrink-0" />
                No podré asistir
              </button>
            </MagneticButton>
          </motion.div>
        )}

        {status === 'attending' && (
          <motion.div
            key="attending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20"
            style={{
              backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 80%)` : undefined,
              borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 80%)` : undefined,
            }}
          >
            <h4 className="text-xl font-medium">¡Qué emoción! 🎉</h4>
            
            {data.guestName && (
              <p className="text-sm opacity-80">
                Confirmando para: <strong>{data.guestName}</strong>
              </p>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-sm opacity-80 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                ¿Cuántas personas asistirán?
                {data.guestCount && <span className="text-xs opacity-70">(Máx. {data.guestCount})</span>}
              </label>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); setGuests(Math.max(1, guests - 1)); }}
                  className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl hover:bg-black/20 transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">{guests}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setGuests(Math.min(data.guestCount || 10, guests + 1)); }}
                  className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl hover:bg-black/20 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <MagneticButton className="w-full">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg font-bold transition-transform",
                  !theme.primaryColor && theme.bg,
                  "text-white shadow-lg"
                )}
                style={theme.primaryColor ? { backgroundColor: theme.primaryColor } : {}}
              >
                <Send className="w-5 h-5" />
                Enviar confirmación
              </a>
            </MagneticButton>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
              className="text-sm opacity-60 hover:opacity-100 underline"
            >
              Volver
            </button>
          </motion.div>
        )}

        {status === 'declined' && (
          <motion.div
            key="declined"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20"
            style={{
              backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 80%)` : undefined,
              borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 80%)` : undefined,
            }}
          >
            <h4 className="text-xl font-medium">¡Te extrañaremos! 🥺</h4>
            <p className="opacity-80 text-sm">Por favor, avísanos por WhatsApp para tenerlo en cuenta.</p>
            
            <MagneticButton className="w-full">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg font-bold transition-transform",
                  !theme.primaryColor && theme.bg,
                  "text-white shadow-lg"
                )}
                style={theme.primaryColor ? { backgroundColor: theme.primaryColor } : {}}
              >
                <Send className="w-5 h-5" />
                Avisar por WhatsApp
              </a>
            </MagneticButton>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
              className="text-sm opacity-60 hover:opacity-100 underline"
            >
              Volver
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
