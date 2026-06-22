import React, { useState } from 'react';
import { CheckCircle2, XCircle, Users, Send, Phone, MessageSquare, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { InvitationData } from '../../lib/types';
import { cn } from '../../lib/utils';
import { MagneticButton } from './DynamicEffects';
import { db, collection, doc, setDoc } from '../../firebase';
import { toast } from 'sonner';

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
  const [guestName, setGuestName] = useState(data.guestName || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update guests if data.guestCount changes
  React.useEffect(() => {
    if (data.guestCount) {
      setGuests(data.guestCount);
    }
  }, [data.guestCount]);

  React.useEffect(() => {
    if (data.guestName) {
      setGuestName(data.guestName);
    }
  }, [data.guestName]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }

    setIsSubmitting(true);
    try {
      if (data.rsvp?.enabled) {
        const rsvpId = crypto.randomUUID();
        const rsvpRef = doc(collection(db, 'invitations', data.id, 'rsvps'), rsvpId);
        
        await setDoc(rsvpRef, {
          id: rsvpId,
          invitationId: data.id,
          guestName: guestName.trim(),
          attending: status === 'attending',
          guestCount: status === 'attending' ? guests : 0,
          phone: data.rsvp.collectPhone ? phone.trim() : undefined,
          message: message.trim() || undefined,
          createdAt: new Date().toISOString()
        });

        setIsSubmitted(true);
        toast.success('¡Confirmación enviada con éxito!');
        
        if (status === 'attending') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: theme.accentColor ? [theme.accentColor] : ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32']
          });
        }
      } else {
        // Fallback to WhatsApp if Firestore storage is not enabled
        window.open(getWhatsAppLink(), '_blank');
      }
    } catch (error) {
      console.error('Error saving RSVP:', error);
      toast.error('Error al enviar la confirmación. Por favor intenta por WhatsApp.');
      window.open(getWhatsAppLink(), '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!data.rsvpPhone) return '#';
    const cleanPhone = data.rsvpPhone.replace(/\D/g, '');
    let text = '';
    
    const guestIntro = guestName ? `¡Hola! Soy ${guestName}. ` : '¡Hola! ';
    
    if (status === 'attending') {
      text = `${guestIntro}Confirmo mi asistencia al evento de ${data.name}. Seremos ${guests} persona(s) en total. ${message ? `Mensaje: ${message}` : ''} ¡Nos vemos ahí! 🎉`;
    } else if (status === 'declined') {
      text = `${guestIntro}Muchas gracias por la invitación al evento de ${data.name}, pero lamentablemente no podré asistir. ${message ? `Mensaje: ${message}` : ''} ¡Les deseo lo mejor! ✨`;
    } else {
      text = `${guestIntro}Quiero confirmar mi asistencia al evento de ${data.name}.`;
    }
    
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto text-center p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20"
        style={{
          backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 90%)` : undefined,
          borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 70%)` : undefined,
        }}
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Muchas gracias!</h3>
        <p className="opacity-90 mb-6">Tu confirmación ha sido registrada correctamente.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-sm opacity-60 hover:opacity-100 underline"
        >
          Enviar otra respuesta
        </button>
      </motion.div>
    );
  }

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

        {(status === 'attending' || status === 'declined') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5 p-6 rounded-3xl backdrop-blur-md border"
            style={{
              backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 80%)` : 'rgba(255,255,255,0.9)',
              borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 60%)` : undefined,
              color: theme.primaryColor ? 'white' : 'inherit'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-bold">
                {status === 'attending' ? '¡Qué emoción! 🎉' : '¡Te extrañaremos! 🥺'}
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                className="p-1 hover:bg-black/10 rounded-full transition-colors"
                title="Cerrar"
              >
                <XCircle className="w-5 h-5 opacity-60" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2 opacity-90">
                  <User className="w-4 h-4" />
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm focus:bg-white focus:text-gray-900 focus:outline-none transition-all placeholder:text-white/50"
                  style={{ color: theme.primaryColor ? 'white' : 'inherit' }}
                />
              </div>

              {status === 'attending' && data.rsvp?.showGuestCount !== false && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2 opacity-90">
                    <Users className="w-4 h-4" />
                    ¿Cuántas personas asistirán?
                    {data.guestCount && <span className="text-xs opacity-70">(Máx. {data.guestCount})</span>}
                  </label>
                  <div className="flex items-center justify-center gap-6 bg-white/20 rounded-xl p-2 border border-white/20">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setGuests(Math.max(1, guests - 1)); }}
                      className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl hover:bg-black/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-8 text-center">{guests}</span>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setGuests(Math.min(data.guestCount || 10, guests + 1)); }}
                      className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl hover:bg-black/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {data.rsvp?.collectPhone && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2 opacity-90">
                    <Phone className="w-4 h-4" />
                    Teléfono (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Tu número de contacto"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm focus:bg-white focus:text-gray-900 focus:outline-none transition-all placeholder:text-white/50"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2 opacity-90">
                  <MessageSquare className="w-4 h-4" />
                  Mensaje opcional
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ej. ¡Estamos emocionados!"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm focus:bg-white focus:text-gray-900 focus:outline-none transition-all h-20 resize-none placeholder:text-white/50"
                />
              </div>

              <MagneticButton className="w-full mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg",
                    !theme.primaryColor && theme.bg,
                    "text-white"
                  )}
                  style={theme.primaryColor ? { backgroundColor: theme.primaryColor } : {}}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      {data.rsvp?.enabled ? 'Confirmar Asistencia' : 'Confirmar por WhatsApp'}
                    </>
                  )}
                </button>
              </MagneticButton>
              
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                className="text-sm opacity-60 hover:opacity-100 underline text-center"
              >
                Volver
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
