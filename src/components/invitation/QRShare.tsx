import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Share2, Download, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

import { InvitationData } from '../../lib/types';

interface QRShareProps {
  data: InvitationData;
  theme: {
    bg: string;
    text: string;
    accent: string;
    border: string;
    primaryColor?: string;
    accentColor?: string;
  };
  initialGuestId?: string | null;
  onClose?: () => void;
}

export default function QRShare({ data, theme, initialGuestId, onClose }: QRShareProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [selectedGuestId, setSelectedGuestId] = React.useState<string | null>(initialGuestId || null);
  const qrRef = useRef<HTMLDivElement>(null);

  // Sync with initialGuestId when it changes or modal opens
  React.useEffect(() => {
    if (initialGuestId) {
      setSelectedGuestId(initialGuestId);
      setIsOpen(true);
    }
  }, [initialGuestId]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const selectedGuest = React.useMemo(() => {
    return data.guests?.find(g => g.id === selectedGuestId);
  }, [data.guests, selectedGuestId]);

  const shareUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    // Automatically convert AI Studio dev URL to shared URL to avoid authentication locks
    let origin = window.location.origin;
    if (origin.includes('ais-dev')) {
      origin = origin.replace('ais-dev', 'ais-pre');
    }
    const baseUrl = `${origin}/invitation/${data.id}`;
    return selectedGuestId ? `${baseUrl}?guest=${selectedGuestId}` : baseUrl;
  }, [data.id, selectedGuestId]);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "invitacion-qr.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Invitación',
          text: '¡Estás invitado a mi evento!',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyUrl();
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: [
            "0 0 0 0px rgba(255, 255, 255, 0)",
            "0 0 0 10px rgba(255, 255, 255, 0.2)",
            "0 0 0 0px rgba(255, 255, 255, 0)"
          ]
        }}
        transition={{ 
          scale: { type: "spring", stiffness: 260, damping: 20 },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-28 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-xl border-2 transition-transform",
          !theme.primaryColor && "bg-black/50",
          theme.text,
          !theme.accentColor && "border-white/20"
        )}
        style={{
          backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 20%)` : undefined,
          borderColor: theme.accentColor ? theme.accentColor : undefined,
          color: theme.accentColor ? theme.accentColor : undefined,
        }}
      >
        <Share2 className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full max-w-sm p-8 rounded-[2.5rem] border shadow-2xl text-center",
                !theme.primaryColor && "bg-neutral-900",
                theme.text,
                !theme.accentColor && theme.border
              )}
              style={{
                backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, black 20%)` : undefined,
                borderColor: theme.accentColor ? theme.accentColor : undefined,
              }}
            >
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 opacity-60 hover:opacity-100 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {typeof window !== 'undefined' && window.location.origin.includes('ais-dev') && (
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 text-center animate-pulse z-0 rounded-t-[2.5rem]">
                  ⚠️ Debes darle clic a "Compartir" o "Publicar" (arriba a la derecha)
                </div>
              )}

              <h3 className={cn("text-2xl font-bold mb-2", typeof window !== 'undefined' && window.location.origin.includes('ais-dev') ? "mt-4" : "")}>Compartir Invitación</h3>
              {selectedGuest && (
                <p className="text-sm opacity-80 mb-4 font-medium">Link para: {selectedGuest.name}</p>
              )}
              
              {data.guests && data.guests.length > 0 && (
                <div className="mb-6 px-4">
                  <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">Personalizar para:</label>
                  <select
                    value={selectedGuestId || ''}
                    onChange={(e) => setSelectedGuestId(e.target.value || null)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                    style={{
                      color: 'inherit',
                      backgroundColor: theme.primaryColor ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'
                    }}
                  >
                    <option value="" className="text-black">Enlace General (Sin nombre)</option>
                    {data.guests.map(guest => (
                      <option key={guest.id} value={guest.id} className="text-black">
                        {guest.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div 
                ref={qrRef}
                className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-inner"
              >
                <QRCodeCanvas 
                  value={shareUrl} 
                  size={200}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={downloadQR}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95 shadow-lg",
                    theme.primaryColor ? "bg-white/10 hover:bg-white/20 border border-white/20" : "bg-primary-600 hover:bg-primary-700 text-white"
                  )}
                >
                  <Download className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Descargar QR</span>
                </button>
                <button
                  onClick={shareNative}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95 shadow-lg",
                    theme.primaryColor ? "bg-white/10 hover:bg-white/20 border border-white/20" : "bg-white text-black hover:bg-gray-100"
                  )}
                >
                  {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {copied ? '¡Copiado!' : 'Copiar Link'}
                  </span>
                </button>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-black/20 text-[10px] opacity-60 break-all select-all font-mono leading-relaxed">
                {shareUrl}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
