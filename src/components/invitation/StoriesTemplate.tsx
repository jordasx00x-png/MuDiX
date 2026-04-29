import React, { useState, useEffect } from 'react';
import { InvitationData, SectionStyle } from '../../lib/types';
import { getTheme, Countdown, FloatingParticles, Confetti, FloatingBalloons, FloatingIcons, WobblyText, KIDS_THEMES, CharacterSticker, DecorativeFrame, XVDecoration, PhotoGallery, GlassCard, RevealText } from './InvitationTemplate';
import { cn } from '../../lib/utils';
import { MapPin, Clock, Gift, Mail, CheckCircle2, Heart, Instagram, Package } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import InteractiveRSVP from './InteractiveRSVP';
import MusicPlayer from './MusicPlayer';
import DressCode from './DressCode';
import { Editable } from './Editable';
import QRShare from './QRShare';
import { ElegantBorder } from './DynamicEffects';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function StoriesTemplate({ data, isEditing, onUpdate }: { data: InvitationData, isEditing?: boolean, onUpdate?: (id: string, value: string, style?: SectionStyle) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = getTheme(data);
  const eventDate = data.date ? new Date(data.date) : new Date();
  const isValidDate = !isNaN(eventDate.getTime());
  const isKidsBirthday = KIDS_THEMES.includes(data.theme);
  const isXV = data.title?.toLowerCase().includes('xv') || data.theme === 'princesa' || data.theme === 'elegancia' || data.theme === 'rose_gold' || data.theme === 'noche_magica' || data.theme === 'esmeralda_plata';

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

  // Define valid slides based on available data
  const slides = [
    'cover',
    data.guestName ? 'guest' : null,
    'locations',
    data.dressCode ? 'dressCode' : null,
    data.itinerary?.length ? 'itinerary' : null,
    (data.galleryImages?.length || data.instagramHashtag) ? 'gallery' : null,
    (data.gifts?.envelope || data.gifts?.storeName || data.gifts?.traditional) ? 'gifts' : null,
    'rsvp'
  ].filter(Boolean) as string[];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(c => c + 1);
      }
    }, 10000); // 10 seconds per slide
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const width = e.currentTarget.offsetWidth;
    if (x < width / 3) {
      if (currentSlide > 0) setCurrentSlide(c => c - 1);
    } else {
      if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
    }
  };

  const renderSlide = () => {
    const slide = slides[currentSlide];
    switch (slide) {
      case 'cover':
        const isWedding = data.theme === 'boda_clasica' || data.theme === 'boda_rustica';
        return (
          <motion.div 
            key="cover" 
            initial={{ opacity: 0, x: 100, filter: "blur(4px)" }} 
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} 
            exit={{ opacity: 0, x: -100, filter: "blur(4px)" }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full flex flex-col items-center justify-center text-center p-6 overflow-hidden"
          >
            {isWedding && data.coverImage ? (
              <>
                <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                  src={data.coverImage} 
                  alt={data.name} 
                  className="absolute inset-0 w-full h-full object-cover z-0" 
                  referrerPolicy="no-referrer" 
                />
                {/* Gradient Fade to Background Color */}
                <div 
                  className="absolute inset-0 z-10"
                  style={{ 
                    background: `linear-gradient(to bottom, transparent 0%, transparent 40%, ${theme.primaryColor || (data.theme === 'boda_rustica' ? '#f5f5f4' : '#f8fafc')} 95%)` 
                  }}
                />
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative z-20 flex flex-col items-center justify-center space-y-4"
                >
                  <motion.div variants={itemVariants}>
                    <Editable
                      id="title"
                      value={data.title}
                      isEditing={isEditing}
                      onUpdate={onUpdate}
                      style={{ ...data.styles?.title, fontFamily: data.styles?.title?.fontFamily || theme.titleFont || undefined }}
                      className={cn("block tracking-[0.3em] uppercase opacity-70", titleSizeClass[data.titleSize || 'mediano'])}
                      as="h2"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Editable
                      id="name"
                      value={data.name}
                      isEditing={isEditing}
                      onUpdate={onUpdate}
                      style={{ ...data.styles?.name, fontFamily: data.styles?.name?.fontFamily || theme.nameFont || undefined }}
                      className={cn("block font-bold", nameSizeClass[data.nameSize || 'mediano'])}
                      as="h1"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 opacity-90 mt-4 w-full">
                    <p className="text-[10px] md:text-sm uppercase tracking-[0.4em] font-light">Invitan a su Boda</p>
                    <div className="flex items-center justify-center w-full gap-4 max-w-[80%] mx-auto">
                      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-current opacity-40"></div>
                      <p className={cn("font-serif px-2 drop-shadow-md", dateSizeClass[data.dateSize || 'mediano'], data.dateUppercase && "uppercase")}>
                        {isValidDate ? format(eventDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : 'Fecha por confirmar'}
                      </p>
                      <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-current opacity-40"></div>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Countdown targetDate={data.date} />
                  </motion.div>
                  {(data.parentsNames?.mother || data.parentsNames?.father) && (
                    <motion.div variants={itemVariants} className="mt-8 space-y-4">
                      <div className="space-y-4">
                        <p className="text-[9px] uppercase tracking-[0.3em] opacity-50">Con la bendición de nuestros padres</p>
                        <div className="flex flex-col gap-2 items-center justify-center pt-1 opacity-90">
                          {data.parentsNames?.mother && <span className="font-serif">{data.parentsNames.mother}</span>}
                          {data.parentsNames?.father && <span className="font-serif">{data.parentsNames.father}</span>}
                        </div>
                      </div>
                      {data.gratitudeWords && (
                        <div className="max-w-[220px] mx-auto italic leading-relaxed border-t border-white/10 pt-4 font-serif text-sm opacity-80">
                          <Editable
                            id="gratitudeWords"
                            value={data.gratitudeWords}
                            isEditing={isEditing}
                            onUpdate={onUpdate}
                            style={data.styles?.gratitudeWords}
                            multiline
                            className="text-[11px] italic opacity-70"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </>
            ) : (
              <>
                <CharacterSticker theme={theme} />
                {isXV && <DecorativeFrame theme={theme} />}
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
                    className={cn("block tracking-[0.3em] uppercase mb-4 opacity-80", titleSizeClass[data.titleSize || 'mediano'], !theme.accentColor && theme.accent)}
                    as="h2"
                  />
                )}
                {data.coverImage && (
                  <div 
                    className="relative w-72 h-96 md:w-96 md:h-[32rem] mx-auto mb-8 rounded-[2.5rem] overflow-hidden border-4 shadow-2xl" 
                    style={{ borderColor: theme.accentColor || 'currentColor' }}
                  >
                    <motion.img 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      src={data.coverImage} 
                      alt={data.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                )}
                {KIDS_THEMES.includes(data.theme) ? (
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

                {(data.parentsNames?.mother || data.parentsNames?.father) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-4 space-y-3"
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Con la bendición de mis padres</p>
                      <div className="flex flex-col gap-1 text-sm font-medium opacity-90">
                        {data.parentsNames?.mother && <span>{data.parentsNames.mother}</span>}
                        {data.parentsNames?.father && <span>{data.parentsNames.father}</span>}
                      </div>
                    </div>
                    {data.gratitudeWords && (
                      <div className="max-w-[200px] mx-auto leading-relaxed border-t border-white/10 pt-2">
                         <Editable
                          id="gratitudeWords"
                          value={data.gratitudeWords}
                          isEditing={isEditing}
                          onUpdate={onUpdate}
                          style={data.styles?.gratitudeWords}
                          multiline
                          className="text-[11px] italic opacity-70"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
                <p className={cn("opacity-90 mb-4", dateSizeClass[data.dateSize || 'mediano'], data.dateUppercase && "uppercase")}>
                  {isValidDate ? format(eventDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) : 'Fecha por confirmar'}
                </p>
                <Countdown targetDate={data.date} />
              </>
            )}
          </motion.div>
        );
      case 'guest':
        return (
          <motion.div 
            key="guest"
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full text-center p-8"
          >
            <GlassCard theme={theme} className="w-full max-w-sm">
              <RevealText 
                text="Invitación Especial Para"
                className="text-sm uppercase tracking-[0.3em] opacity-70 mb-6 font-medium"
              />
              <p 
                className={cn("text-3xl md:text-4xl font-serif font-bold mb-8", !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { color: theme.accentColor } : {}}
              >
                {data.guestName}
              </p>
              
              <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <span className="text-sm uppercase tracking-wider opacity-80">Pases:</span>
                <span 
                  className={cn("text-xl font-bold", !theme.accentColor && theme.accent)}
                  style={theme.accentColor ? { color: theme.accentColor } : {}}
                >
                  {data.guestCount}
                </span>
                <span className="text-sm uppercase tracking-wider opacity-80">{data.guestCount === 1 ? 'Persona' : 'Personas'}</span>
              </div>
            </GlassCard>
          </motion.div>
        );
      case 'locations':
        return (
          <motion.div 
            key="locations" 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full w-full p-6 space-y-8"
          >
            <GlassCard theme={theme} className={cn("w-full max-w-sm", isWedding && "py-8 border-[1px] rounded-[2rem]")}>
              <RevealText 
                text="Recepción"
                className={cn(isWedding ? "text-3xl font-serif font-light mb-4 tracking-widest" : "text-2xl font-bold mb-4", !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { color: theme.accentColor } : {}}
              />
              <h4 className={cn("mb-2", isWedding ? "text-xl font-serif font-medium" : "text-xl font-bold")}>{data.reception.name}</h4>
              <p className={cn("opacity-80 text-sm", isWedding ? "mb-4 font-light leading-relaxed px-4" : "mb-6")}>{data.reception.address}</p>
              <div className={cn("flex items-center justify-center gap-3 mb-8 opacity-90", isWedding && "font-serif tracking-widest text-lg")}>
                {!isWedding && <Clock className="w-4 h-4" />}
                {isWedding && <div className="w-4 h-px bg-current opacity-40"></div>}
                <span>{data.reception.time}</span>
                {isWedding && <div className="w-4 h-px bg-current opacity-40"></div>}
              </div>
              <a 
                href={data.reception.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={cn(
                  "inline-flex items-center gap-2 transition-all relative z-50 pointer-events-auto", 
                  isWedding ? "px-6 py-2 border-b border-current font-medium uppercase tracking-widest text-[10px] hover:opacity-70" : "px-6 py-3 rounded-full border hover:bg-white/10",
                  !theme.accentColor && theme.border
                )} 
                style={theme.accentColor && !isWedding ? { borderColor: theme.accentColor, color: theme.accentColor } : (isWedding && theme.accentColor ? { color: theme.accentColor } : {})}
                onClick={e => e.stopPropagation()}
              >
                {!isWedding && <MapPin className="w-4 h-4" />}
                <span className={cn(isWedding ? "" : "font-bold uppercase tracking-wider text-xs")}>Ver Ubicación</span>
              </a>
            </GlassCard>

            <GlassCard theme={theme} delay={0.2} className={cn("w-full max-w-sm", isWedding && "py-8 border-[1px] rounded-[2rem]")}>
              <RevealText 
                text="Ceremonia"
                className={cn(isWedding ? "text-3xl font-serif font-light mb-4 tracking-widest" : "text-2xl font-bold mb-4", !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { color: theme.accentColor } : {}}
              />
              <h4 className={cn("mb-2", isWedding ? "text-xl font-serif font-medium" : "text-xl font-bold")}>{data.ceremony.name}</h4>
              <p className={cn("opacity-80 text-sm", isWedding ? "mb-4 font-light leading-relaxed px-4" : "mb-6")}>{data.ceremony.address}</p>
              <div className={cn("flex items-center justify-center gap-3 mb-8 opacity-90", isWedding && "font-serif tracking-widest text-lg")}>
                {!isWedding && <Clock className="w-4 h-4" />}
                {isWedding && <div className="w-4 h-px bg-current opacity-40"></div>}
                <span>{data.ceremony.time}</span>
                {isWedding && <div className="w-4 h-px bg-current opacity-40"></div>}
              </div>
              <a 
                href={data.ceremony.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={cn(
                  "inline-flex items-center gap-2 transition-all relative z-50 pointer-events-auto", 
                  isWedding ? "px-6 py-2 border-b border-current font-medium uppercase tracking-widest text-[10px] hover:opacity-70" : "px-6 py-3 rounded-full border hover:bg-white/10",
                  !theme.accentColor && theme.border
                )} 
                style={theme.accentColor && !isWedding ? { borderColor: theme.accentColor, color: theme.accentColor } : (isWedding && theme.accentColor ? { color: theme.accentColor } : {})}
                onClick={e => e.stopPropagation()}
              >
                {!isWedding && <MapPin className="w-4 h-4" />}
                <span className={cn(isWedding ? "" : "font-bold uppercase tracking-wider text-xs")}>Ver Ubicación</span>
              </a>
            </GlassCard>
          </motion.div>
        );
      case 'dressCode':
        return (
          <motion.div 
            key="dressCode" 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full w-full p-6"
          >
            <DressCode data={data} theme={theme} isWedding={isWedding} />
          </motion.div>
        );
      case 'itinerary':
        return (
          <motion.div 
            key="itinerary" 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full w-full p-6"
          >
            <GlassCard theme={theme} className="w-full max-w-sm">
              <RevealText 
                text="Itinerario"
                className={cn("text-2xl font-bold mb-8", !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { color: theme.accentColor } : {}}
              />
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar"
              >
                {(data.itinerary || []).map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="flex flex-col gap-2 items-center group"
                  >
                    <div 
                      className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-transform group-hover:scale-110 shadow-xl", !theme.accentColor && theme.border, !theme.accentColor && theme.accent)}
                      style={theme.accentColor ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
                    >
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <p 
                        className={cn("font-mono font-bold text-sm", !theme.accentColor && theme.accent)}
                        style={theme.accentColor ? { color: theme.accentColor } : {}}
                      >
                        {item.time}
                      </p>
                      <p className="font-medium text-sm">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </GlassCard>
          </motion.div>
        );
      case 'gallery':
        return (
          <motion.div 
            key="gallery" 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full w-full p-6"
          >
            <div 
              className={cn("p-6 rounded-2xl backdrop-blur-sm border text-center w-full max-w-sm", !theme.primaryColor && theme.accentBg, !theme.accentColor && theme.border)}
              style={{
                backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 50%)` : undefined,
                borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 50%)` : undefined,
              }}
            >
              <h3 
                className={cn("text-3xl mb-6", !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { color: theme.accentColor } : {}}
              >
                Galería
              </h3>
              {data.instagramHashtag && (
                <div className="mb-6">
                  <p className="opacity-80 mb-4 text-sm">Comparte tus fotos con nosotros:</p>
                  <a 
                    href={`https://www.instagram.com/explore/tags/${data.instagramHashtag.replace('#', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:bg-white/10 relative z-50 pointer-events-auto", !theme.accentColor && theme.border, !theme.accentColor && theme.accent)} 
                    style={theme.accentColor ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
                    onClick={e => e.stopPropagation()}
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="text-lg font-bold">{data.instagramHashtag}</span>
                  </a>
                </div>
              )}
              {data.galleryImages && data.galleryImages.length > 0 && (
                <PhotoGallery images={data.galleryImages} theme={theme} />
              )}
            </div>
          </motion.div>
        );
      case 'gifts':
        return (
          <motion.div 
            key="gifts" 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full w-full p-6"
          >
            <div 
              className={cn("p-6 rounded-2xl backdrop-blur-sm border text-center w-full max-w-sm", !theme.primaryColor && theme.accentBg, !theme.accentColor && theme.border)}
              style={{
                backgroundColor: theme.primaryColor ? `color-mix(in srgb, ${theme.primaryColor}, transparent 50%)` : undefined,
                borderColor: theme.accentColor ? `color-mix(in srgb, ${theme.accentColor}, transparent 50%)` : undefined,
              }}
            >
              <h3 
                className={cn("text-3xl mb-4", !theme.accentColor && theme.accent)}
                style={theme.accentColor ? { color: theme.accentColor } : {}}
              >
                Regalos
              </h3>
              <p className="opacity-80 mb-6 text-sm">Tu presencia es mi mayor regalo, pero si deseas tener un detalle conmigo:</p>
              <div className="space-y-4">
                {data.gifts.envelope && (
                  <div 
                    className={cn("p-4 rounded-xl border bg-black/20", !theme.accentColor && theme.border)}
                    style={theme.accentColor ? { borderColor: theme.accentColor } : {}}
                  >
                    <Mail 
                      className={cn("w-6 h-6 mx-auto mb-2", !theme.accentColor && theme.accent)} 
                      style={theme.accentColor ? { color: theme.accentColor } : {}}
                    />
                    <h4 className="font-bold mb-1">Lluvia de sobres</h4>
                    <p className="text-xs opacity-70">Es la tradición de regalar dinero en efectivo a la festejada dentro de un sobre el día del evento.</p>
                  </div>
                )}
                {data.gifts.traditional && (
                  <div 
                    className={cn("p-4 rounded-xl border bg-black/20", !theme.accentColor && theme.border)}
                    style={theme.accentColor ? { borderColor: theme.accentColor } : {}}
                  >
                    <Package 
                      className={cn("w-6 h-6 mx-auto mb-2", !theme.accentColor && theme.accent)} 
                      style={theme.accentColor ? { color: theme.accentColor } : {}}
                    />
                    <h4 className="font-bold mb-1">Regalo Tradicional</h4>
                    <p className="text-xs opacity-70">Puedes traer tu regalo el día del evento. Habrá un espacio especial para recibirlo con mucho cariño.</p>
                  </div>
                )}
                {data.gifts.storeName && (
                  <div 
                    className={cn("p-4 rounded-xl border bg-black/20", !theme.accentColor && theme.border)}
                    style={theme.accentColor ? { borderColor: theme.accentColor } : {}}
                  >
                    <Gift 
                      className={cn("w-6 h-6 mx-auto mb-2", !theme.accentColor && theme.accent)} 
                      style={theme.accentColor ? { color: theme.accentColor } : {}}
                    />
                    <h4 className="font-bold mb-1">{data.gifts.storeName}</h4>
                    <p className="text-xs opacity-70 mb-3">Mesa: {data.gifts.storeCode}</p>
                    <a 
                      href={data.gifts.storeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={cn("inline-block px-4 py-2 rounded-full border text-sm transition-colors hover:bg-white/10 relative z-50 pointer-events-auto", !theme.accentColor && theme.border)} 
                      style={theme.accentColor ? { borderColor: theme.accentColor, color: theme.accentColor } : {}}
                      onClick={e => e.stopPropagation()}
                    >
                      Ver regalos
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 'rsvp':
        return (
          <motion.div 
            key="rsvp" 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-full w-full p-6 text-center"
          >
            {isWedding ? (
              <div className="w-full max-w-[90%] mx-auto relative z-10 flex flex-col items-center">
                <h3 
                  className={cn("text-4xl md:text-5xl font-serif font-light mb-8 tracking-widest", !theme.accentColor && theme.accent)}
                  style={theme.accentColor ? { color: theme.accentColor } : {}}
                >
                  RSVP
                </h3>
                <ElegantBorder className="w-full" glowColor={theme.accentColor || 'rgba(255,255,255,0.3)'}>
                  <div className="p-8 pb-10">
                    <p className="opacity-80 mb-2 font-light">Por favor confirma tu asistencia.</p>
                    {data.date && (
                      <p className={cn("text-xs font-serif italic mb-8 opacity-70")}
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
                    <InteractiveRSVP data={data} theme={theme} />
                  </div>
                </ElegantBorder>
              </div>
            ) : (
              <>
                <h3 
                  className={cn("text-4xl mb-4", !theme.accentColor && theme.accent)}
                  style={theme.accentColor ? { color: theme.accentColor } : {}}
                >
                  RSVP
                </h3>
                <p className="opacity-80 mb-2">Por favor confirma tu asistencia.</p>
                {data.date && (
                  <p className={cn("text-xs font-bold uppercase tracking-widest mb-8", !theme.accentColor && theme.accent)}
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
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn("fixed inset-0 overflow-hidden select-none", !theme.primaryColor && theme.bg, theme.text, !theme.bodyFont && theme.font)}
        style={{
          backgroundColor: theme.primaryColor || undefined,
          fontFamily: theme.bodyFont || undefined
        }}
      >
      {data.musicUrl && <MusicPlayer url={data.musicUrl} theme={theme} />}
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={data.coverImage || theme.image} 
          alt="Background" 
          className="w-full h-full object-cover mix-blend-overlay blur-sm" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
        <FloatingParticles theme={data.theme} />
        {isXV && <XVDecoration theme={theme} />}
        {KIDS_THEMES.includes(data.theme) && (
          <>
            <Confetti />
            <FloatingBalloons />
            <FloatingIcons theme={data.theme} />
          </>
        )}
      </div>

      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-4">
        {slides.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: idx < currentSlide ? '100%' : '0%' }}
              animate={{ width: idx < currentSlide ? '100%' : idx === currentSlide ? '100%' : '0%' }}
              transition={{ duration: idx === currentSlide ? 10 : 0, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      {/* Tap Zones */}
      <div className="absolute inset-0 z-10 flex" onClick={handleTap}>
        <div className="w-1/3 h-full" />
        <div className="w-2/3 h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full pointer-events-none">
        {data.musicUrl && <MusicPlayer url={data.musicUrl} theme={theme} />}
        <AnimatePresence mode="wait">
          {renderSlide()}
        </AnimatePresence>
      </div>
    </div>
  );
}
