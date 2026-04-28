export interface Guest {
  id: string;
  name: string;
  tickets: number;
  tableNumber?: string;
}

export interface SectionStyle {
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface InvitationData {
  id: string;
  layoutMode?: 'traditional' | 'stories' | 'interactive_card';
  theme: 'bosque' | 'bridgerton' | 'princesa' | 'elegancia' | 'floral' | 'estrellas' | 'dorado' | 'rose_gold' | 'noche_magica' | 'esmeralda_plata' | 'minimalista' | 'rojo_pasion' | 'vino_tinto' | 'carmesi' | 'mariposa_azul' | 'vintage_sepia' | 'neon_party' | 'invierno_magico' | 'atardecer_tropical' | 'boda_clasica' | 'boda_rustica' | 'cumpleanos_infantil' | 'baby_shower' | 'graduacion' | 'bautizo' | 'aniversario' | 'superheroe' | 'dinosaurio' | 'unicornio' | 'espacio' | 'bluey' | 'mario' | 'minecraft' | 'roblox' | 'sonic';
  title: string;
  titleSize?: 'pequeño' | 'mediano' | 'grande';
  name: string;
  nameSize?: 'pequeño' | 'mediano' | 'grande';
  date: string; // ISO string
  coverImage?: string;
  coverFrame?: 'none' | 'arch' | 'circle' | 'diamond' | 'flower' | 'vintage';
  instagramHashtag?: string;
  galleryImages?: string[];
  rsvpPhone?: string;
  ceremony: {
    name: string;
    address: string;
    time: string;
    mapUrl: string;
  };
  reception: {
    name: string;
    address: string;
    time: string;
    mapUrl: string;
  };
  dressCode?: {
    style: string;
    colors: string[];
  };
  musicUrl?: string;
  gifts: {
    envelope: boolean;
    traditional?: boolean;
    storeName: string;
    storeCode: string;
    storeUrl: string;
  };
  itinerary: {
    time: string;
    event: string;
  }[];
  guestName?: string;
  guestCount?: number;
  guests?: Guest[];
  primaryColor?: string;
  accentColor?: string;
  titleFont?: string;
  nameFont?: string;
  bodyFont?: string;
  gratitudeWords?: string;
  parentsNames?: {
    mother: string;
    father: string;
  };
  styles?: Record<string, SectionStyle>;
  ownerId?: string;
  isPublic?: boolean;
  createdAt?: string;
}

export const defaultInvitation: InvitationData = {
  id: '1',
  layoutMode: 'traditional',
  theme: 'bosque',
  primaryColor: '#064e3b', // emerald-900
  accentColor: '#6ee7b7', // emerald-300
  title: 'Mis XV Años',
  titleSize: 'mediano',
  name: 'Alejandra',
  nameSize: 'grande',
  date: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
  coverImage: 'https://picsum.photos/seed/quinceanera/800/1200',
  instagramHashtag: '#MisXVAlejandra',
  galleryImages: [
    'https://picsum.photos/seed/gal1/800/800',
    'https://picsum.photos/seed/gal2/800/800',
    'https://picsum.photos/seed/gal3/800/800',
    'https://picsum.photos/seed/gal4/800/800',
  ],
  rsvpPhone: '521234567890',
  ceremony: {
    name: 'Catedral Metropolitana',
    address: 'Plaza de la Constitución S/N, Centro Histórico',
    time: '18:00',
    mapUrl: 'https://maps.google.com',
  },
  reception: {
    name: 'Salón Foresta',
    address: 'Av Constituyentes 800, Bosque de Chapultepec',
    time: '20:00',
    mapUrl: 'https://maps.google.com',
  },
  dressCode: {
    style: 'Formal',
    colors: ['#000000', '#ffffff', '#ffd700'],
  },
  gifts: {
    envelope: true,
    storeName: 'Liverpool',
    storeCode: '51654700',
    storeUrl: 'https://mesaderegalos.liverpool.com.mx/',
  },
  itinerary: [
    { time: '18:00', event: 'Ceremonia Religiosa' },
    { time: '20:00', event: 'Recepción de Invitados' },
    { time: '21:00', event: 'Vals' },
    { time: '22:00', event: 'Cena' },
    { time: '23:00', event: 'Apertura de Pista' },
  ],
  titleFont: '',
  nameFont: '',
  bodyFont: '',
  gratitudeWords: '',
  parentsNames: {
    mother: '',
    father: '',
  },
};
