import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { InvitationData, SectionStyle } from '../../lib/types';
import { cn } from '../../lib/utils';
import { Editable } from './Editable';
import { getTheme, KIDS_THEMES, CharacterSticker } from './InvitationTemplate';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InteractiveRSVP from './InteractiveRSVP';
import MusicPlayer from './MusicPlayer';
import DressCode from './DressCode';
import { Gift, MapPin } from 'lucide-react';
import { AdBanner } from '../AdBanner';

interface KidsPosterTemplateProps {
  data: InvitationData;
  isEditing?: boolean;
  onUpdate?: (id: string, value: string, style?: SectionStyle) => void;
}

export default function KidsPosterTemplate({ data, isEditing, onUpdate }: KidsPosterTemplateProps) {
  const theme = getTheme(data) as any;
  const eventDate = data.date ? new Date(data.date) : new Date();
  const isValidDate = !isNaN(eventDate.getTime());
  
  const guestUrlParam = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('guest') || params.get('familia');
    } catch {
      return null;
    }
  }, []);

  const displayGuestName = guestUrlParam || (data as any).guestName;

  return (
    <div 
      className={cn(
        "relative w-full h-full min-h-[100dvh] flex flex-col items-center overflow-x-hidden font-sans pb-32",
        theme.bg,
        theme.text
      )}
      style={data.primaryColor ? { backgroundColor: data.primaryColor } : {}}
    >
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {data.theme === 'bluey' && (
          <div className="absolute top-0 w-full h-[60%] bg-gradient-to-b from-sky-200/80 to-transparent" />
        )}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/30 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      </div>

      {/* Decorative Stickers (Top, Left, Right) */}
      <div className="absolute inset-x-0 top-0 flex justify-center -translate-y-[10%] pointer-events-none z-10">
         {theme.characterImage && <img src={theme.characterImage} alt="Character" className="h-40 md:h-56 object-contain drop-shadow-xl" />}
      </div>
      <div className="absolute -left-10 md:left-0 top-1/4 pointer-events-none z-10 transform -scale-x-100 opacity-90 drop-shadow-lg">
         {theme.characterImage && <img src={theme.characterImage} alt="Character" className="h-32 md:h-48 object-contain" />}
      </div>
      <div className="absolute -right-10 md:right-0 top-[40%] pointer-events-none z-10 opacity-90 drop-shadow-lg">
         {theme.characterImage && <img src={theme.characterImage} alt="Character" className="h-32 md:h-48 object-contain" />}
      </div>
      {(data.galleryImages && data.galleryImages.length > 0) && (
        <div className="absolute -left-8 md:left-4 bottom-1/4 pointer-events-none z-10 opacity-90 drop-shadow-lg rotate-12">
            <img src={data.galleryImages[0]} alt="Gallery" className="h-32 w-32 md:h-40 md:w-40 object-cover rounded-full border-4 border-white shadow-xl" />
        </div>
      )}

      {/* Main Content Card */}
      <div className="z-20 relative bg-white/30 backdrop-blur-md rounded-[3rem] p-8 md:p-12 mx-4 mt-32 md:mt-48 mb-8 border-[3px] border-white/60 shadow-2xl flex flex-col items-center text-center max-w-md w-full space-y-8">
        
        {/* Guest Name if available */}
        {(displayGuestName || isEditing) && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-2 bg-black/10 rounded-2xl px-6 w-full"
          >
            <span className="text-[11px] md:text-sm font-bold text-black/70 uppercase tracking-widest drop-shadow-sm">Invitado especial:</span>
            {isEditing ? (
              <Editable
                id="guestName"
                value={(data as any).guestName || "Familia Especial"}
                isEditing={isEditing}
                onUpdate={onUpdate}
                className="block text-2xl md:text-3xl font-serif italic text-white drop-shadow-md mt-1 font-bold"
                as="div"
              />
            ) : (
              <div className="block text-2xl md:text-3xl font-serif italic text-white drop-shadow-md mt-1 font-bold">
                {displayGuestName}
              </div>
            )}
           </motion.div>
        )}

        <div className="space-y-2">
          {isEditing ? (
            <Editable
              id="title"
              value={data.title}
              isEditing={isEditing}
              onUpdate={onUpdate}
              className="block text-2xl font-black text-black/80 uppercase tracking-widest drop-shadow-sm"
              style={{ fontFamily: data.styles?.title?.fontFamily || theme.titleFont || undefined }}
              as="h2"
            />
          ) : (
            <h2 className="text-2xl font-black text-black/80 uppercase tracking-widest drop-shadow-sm" style={{ fontFamily: data.styles?.title?.fontFamily || theme.titleFont || undefined }}>
              {data.title}
            </h2>
          )}

          {isEditing ? (
            <Editable
              id="name"
              value={data.name}
              isEditing={isEditing}
              onUpdate={onUpdate}
              className="block text-6xl md:text-7xl font-black tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] text-white mt-2"
              style={{ fontFamily: data.styles?.name?.fontFamily || theme.nameFont || 'Impact, sans-serif' }}
              as="h1"
            />
          ) : (
            <h1 
              className="text-6xl md:text-7xl font-black tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] text-white mt-2"
              style={{ fontFamily: data.styles?.name?.fontFamily || theme.nameFont || 'Impact, sans-serif' }}
            >
              {data.name}
            </h1>
          )}

          {data.gratitudeWords && (
            <div className="pt-4 text-black/80 font-bold text-lg leading-snug drop-shadow-sm max-w-[250px] mx-auto">
              <Editable
                id="gratitudeWords"
                value={data.gratitudeWords}
                isEditing={isEditing}
                onUpdate={onUpdate}
                as="p"
              />
            </div>
          )}
        </div>

        {/* Date and Time Group */}
        <div className="bg-white rounded-3xl p-5 w-full text-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-2 border-zinc-100">
           <div className="flex flex-row justify-center items-center gap-6 border-b-2 border-zinc-100 pb-4 mb-4">
             {isValidDate ? (
               <>
                  <div className="text-6xl md:text-7xl font-black leading-none tracking-tighter text-sky-500 drop-shadow-sm">
                    {format(eventDate, 'dd')}
                  </div>
                  <div className="text-left font-black text-xl md:text-2xl leading-tight uppercase text-zinc-600">
                    <div>{format(eventDate, 'MMMM', { locale: es })}</div>
                    <div className="opacity-60">{format(eventDate, 'yyyy')}</div>
                  </div>
               </>
             ) : (
               <span className="font-bold text-xl">Fecha por confirmar</span>
             )}
           </div>
           
           <div className="font-black text-2xl flex items-center justify-center gap-3 text-zinc-700">
              <span className="text-sm tracking-widest uppercase opacity-70">Hrs.</span>
              <span className="text-3xl text-orange-400">{data.ceremony?.time || data.reception?.time || '17:00'}</span>
           </div>
        </div>

        {/* Location */}
        <div className="space-y-3 w-full bg-black/10 rounded-2xl p-4">
           {isEditing ? (
             <Editable
               id="reception.name"
               value={data.reception?.name || 'Local de Fiesta'}
               isEditing={isEditing}
               onUpdate={onUpdate}
               className="block text-white drop-shadow-md font-black text-xl"
               as="p"
             />
           ) : (
             <p className="text-white drop-shadow-md font-black text-xl">
               Local: "{data.reception?.name || data.ceremony?.name || 'Tu Fiesta Divertida'}"
             </p>
           )}
           
           {isEditing ? (
             <Editable
               id="reception.address"
               value={data.reception?.address || ''}
               isEditing={isEditing}
               onUpdate={onUpdate}
               className="block text-sm text-black/80 font-bold"
               as="p"
             />
           ) : (
             <p className="text-sm text-black/80 font-bold">
               {data.reception?.address || data.ceremony?.address}
             </p>
           )}

           {(data.reception?.mapUrl || data.ceremony?.mapUrl) && (
              <a 
                href={data.reception?.mapUrl || data.ceremony?.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white text-sky-500 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
              >
                <MapPin className="w-5 h-5" />
                VER EN EL MAPA
              </a>
           )}
        </div>
        
        {/* Dress Code & Gifts */}
        {(data.dressCode || (data as any).giftRegistry) && (
          <div className="w-full space-y-4 pt-4 border-t-2 border-white/40">
            {data.dressCode && (
              <div className="bg-white/80 rounded-2xl p-4 text-zinc-800">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500 block mb-1">Dress Code</span>
                <span className="font-bold text-lg">{data.dressCode.style}</span>
              </div>
            )}
            {(data as any).giftRegistry && (
              <div className="bg-white/80 rounded-2xl p-4 text-zinc-800">
                <Gift className="w-6 h-6 mx-auto mb-2 text-rose-400" />
                <span className="font-bold block">{(data as any).giftRegistry.message}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RSVP Section */}
      <div className="z-20 w-full max-w-md px-4 mt-8">
        <InteractiveRSVP data={data} theme={theme as any} />
      </div>

      {/* Music Player */}
      {data.musicUrl && (
        <MusicPlayer url={data.musicUrl} theme={theme as any} />
      )}
      
      {/* Decorative bottom */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-[20%] pointer-events-none z-10 opacity-90 drop-shadow-2xl">
         {theme.characterImage && <img src={theme.characterImage} alt="Character" className="h-56 md:h-72 object-contain" />}
      </div>

      <div className="z-20 w-full mt-4 pb-24">
        <AdBanner className="bg-white/50 backdrop-blur-sm rounded-lg" />
      </div>
    </div>
  );
}

