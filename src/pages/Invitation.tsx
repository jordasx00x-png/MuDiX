import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import InvitationTemplate from '../components/invitation/TemplateSwitcher';
import { defaultInvitation, InvitationData } from '../lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { MailOpen, X } from 'lucide-react';
import { db, doc, getDoc } from '../firebase-firestore';

function PersonalizedLoading({ data }: { data: InvitationData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={data.coverImage || 'https://picsum.photos/seed/invitation/1080/1920?blur=4'} 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 blur-xl scale-110" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-lg w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <p className="text-sm md:text-base font-light tracking-[0.3em] uppercase mb-4 opacity-70">Invitación de</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-2 tracking-tight">{data.name}</h1>
        </motion.div>

        {data.guestName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12"
          >
            <p className="text-xs md:text-sm font-light tracking-[0.2em] uppercase mb-3 opacity-50">Especialmente para</p>
            <p className="text-3xl md:text-4xl font-serif font-medium text-white/90">{data.guestName}</p>
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-6">
          <div className="h-0.5 w-24 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-full"
              style={{ backgroundColor: data.primaryColor || '#ffffff' }}
            />
          </div>
          <div 
            className="w-8 h-8 border-2 border-white/10 rounded-full animate-spin" 
            style={{ borderTopColor: data.primaryColor || '#ffffff' }}
          />
        </div>
      </div>
    </motion.div>
  );
}


export default function Invitation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setError('Ocurrió un error inesperado. Por favor, intenta recargar la página.');
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (data && !isReady) {
      const timer = setTimeout(() => {
        setIsReady(true);
        window.scrollTo(0, 0);
      }, 3500); // 3.5 seconds of personalized loading
      return () => clearTimeout(timer);
    }
  }, [data, isReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!data && !error) {
        setLoadingTimeout(true);
      }
    }, 10000); // Increased to 10s for slower connections
    return () => clearTimeout(timer);
  }, [data, error, retryCount]);

  useEffect(() => {
    const guestId = searchParams.get('guest');

    const updateDataWithGuest = (invData: InvitationData) => {
      const updatedData = { ...invData };
      if (guestId && invData.guests) {
        const guest = invData.guests.find(g => g.id === guestId);
        if (guest) {
          updatedData.guestName = guest.name;
          updatedData.guestCount = guest.tickets;
        }
      }
      return updatedData;
    };

    if (id) {
      const invDocRef = doc(db, 'invitations', id);
      getDoc(invDocRef)
        .then(docSnap => {
          if (!docSnap.exists()) {
            throw new Error('La invitación no existe o ha sido eliminada.');
          }
          
          const invData = docSnap.data() as InvitationData;
          
          const mergedData: InvitationData = {
            ...defaultInvitation,
            ...invData,
            ceremony: { 
              ...defaultInvitation.ceremony, 
              ...(invData.ceremony || {}) 
            },
            reception: { 
              ...defaultInvitation.reception, 
              ...(invData.reception || {}) 
            },
            gifts: { 
              ...defaultInvitation.gifts, 
              ...(invData.gifts || {}) 
            },
            dressCode: invData.dressCode ? { 
              ...defaultInvitation.dressCode, 
              ...invData.dressCode 
            } : undefined,
            itinerary: Array.isArray(invData.itinerary) ? invData.itinerary : defaultInvitation.itinerary,
            guests: Array.isArray(invData.guests) ? invData.guests : [],
            galleryImages: Array.isArray(invData.galleryImages) ? invData.galleryImages : [],
          };
          setData(updateDataWithGuest(mergedData));
          setError(null);
          setLoadingTimeout(false);
        })
        .catch(err => {
          console.error('[INVITATION] Error fetching:', err);
          
          if (err.code === 'permission-denied') {
            setError('No tienes permiso para ver esta invitación. Asegúrate de que el enlace sea correcto.');
            return;
          }

          // Fallback to local storage
          let saved: string | null = null;
          try {
            saved = localStorage.getItem('invitationData');
          } catch (e) { /* ignore */ }
          
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.id === id) {
                setData(updateDataWithGuest(parsed));
                setError(null);
                return;
              }
            } catch (e) { /* ignore */ }
          }
          setError('Hubo un problema al cargar la invitación. Por favor, verifica tu conexión.');
        });
    }
  }, [id, searchParams, retryCount]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4 text-white">¡Ups! Algo salió mal</h2>
          <p className="text-zinc-400 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
            >
              Intentar de nuevo
            </button>
            <a href="/" className="text-zinc-500 hover:text-white transition-colors text-sm">
              Ir al inicio
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 font-light tracking-widest uppercase text-sm">Cargando Invitación...</p>
        {loadingTimeout && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <p className="text-zinc-500 text-xs max-w-xs">La conexión está tardando un poco. Si no carga pronto, intenta reintentar.</p>
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors border border-white/10"
            >
              Reintentar Carga
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black relative">
      <AnimatePresence mode="wait">
        {!isReady ? (
          <PersonalizedLoading key="loading" data={data} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <InvitationTemplate data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
