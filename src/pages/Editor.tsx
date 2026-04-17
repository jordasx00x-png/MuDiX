import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { InvitationData, defaultInvitation, SectionStyle } from '../lib/types';
import InvitationTemplate from '../components/invitation/TemplateSwitcher';
import { getTheme } from '../components/invitation/InvitationTemplate';
import QRShare from '../components/invitation/QRShare';
import { Save, Eye, LayoutTemplate, Settings, MapPin, Gift, List, Image as ImageIcon, Instagram, Upload, Share2, Copy, Check, ArrowLeft, Users, Plus, Trash2, Loader2, Palette, Type, Sparkles } from 'lucide-react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'sonner';
import { db, doc, getDoc, setDoc, updateDoc, handleFirestoreError, OperationType } from '../firebase';

const TEMPLATE_DATA: Record<string, Partial<InvitationData>> = {
  wedding: {
    theme: 'boda_clasica',
    title: 'Nuestra Boda',
    name: 'Ana & Carlos',
    primaryColor: '#1e293b', // slate-800
    accentColor: '#94a3b8', // slate-400
    coverImage: 'https://picsum.photos/seed/wedding/800/1200',
    instagramHashtag: '#BodaAnaYCarlos',
  },
  quinceanera: {
    theme: 'bosque',
    title: 'Mis XV Años',
    name: 'Alejandra',
    primaryColor: '#064e3b',
    accentColor: '#6ee7b7',
    coverImage: 'https://picsum.photos/seed/quinceanera/800/1200',
    instagramHashtag: '#MisXVAlejandra',
  },
  birthday: {
    theme: 'cumpleanos_infantil',
    title: '¡Mi Cumpleaños!',
    name: 'Mateo',
    primaryColor: '#0369a1', // sky-700
    accentColor: '#7dd3fc', // sky-300
    coverImage: 'https://picsum.photos/seed/birthday/800/1200',
    instagramHashtag: '#CumpleMateo',
  },
  kids_birthday: {
    theme: 'superheroe',
    title: '¡Mi Súper Fiesta!',
    name: 'Mateo',
    primaryColor: '#1d4ed8', // blue-700
    accentColor: '#facc15', // yellow-400
    coverImage: 'https://picsum.photos/seed/superhero/800/1200',
    instagramHashtag: '#SuperMateo',
  },
  baby_shower: {
    theme: 'baby_shower',
    title: 'Baby Shower',
    name: 'Bebé en camino',
    primaryColor: '#134e4a', // teal-900
    accentColor: '#99f6e4', // teal-200
    coverImage: 'https://picsum.photos/seed/babyshower/800/1200',
    instagramHashtag: '#BabyShower',
  },
  graduation: {
    theme: 'graduacion',
    title: 'Mi Graduación',
    name: 'Generación 2024',
    primaryColor: '#0f172a', // slate-900
    accentColor: '#cbd5e1', // slate-300
    coverImage: 'https://picsum.photos/seed/graduation/800/1200',
    instagramHashtag: '#Graduacion2024',
  },
  baptism: {
    theme: 'bautizo',
    title: 'Mi Bautizo',
    name: 'Sofía',
    primaryColor: '#0369a1', // sky-700
    accentColor: '#bae6fd', // sky-200
    coverImage: 'https://picsum.photos/seed/baptism/800/1200',
    instagramHashtag: '#BautizoSofia',
  },
  anniversary: {
    theme: 'aniversario',
    title: 'Aniversario',
    name: 'Laura & Jorge',
    primaryColor: '#881337', // rose-900
    accentColor: '#fda4af', // rose-300
    coverImage: 'https://picsum.photos/seed/anniversary/800/1200',
    instagramHashtag: '#AniversarioLauraYJorge',
  },
  bluey: {
    theme: 'bluey',
    title: '¡Mi Fiesta de Bluey!',
    name: 'Mateo',
    primaryColor: '#38bdf8', // sky-400
    accentColor: '#fb923c', // orange-400
    coverImage: 'https://picsum.photos/seed/bluey/800/1200',
    instagramHashtag: '#FiestaBluey',
  },
  mario: {
    theme: 'mario',
    title: '¡Súper Fiesta de Mario!',
    name: 'Mateo',
    primaryColor: '#dc2626', // red-600
    accentColor: '#facc15', // yellow-400
    coverImage: 'https://picsum.photos/seed/mario/800/1200',
    instagramHashtag: '#SuperMarioFiesta',
  },
  minecraft: {
    theme: 'minecraft',
    title: '¡Mi Mundo Minecraft!',
    name: 'Mateo',
    primaryColor: '#064e3b', // emerald-900
    accentColor: '#a8a29e', // stone-400
    coverImage: 'https://picsum.photos/seed/minecraft/800/1200',
    instagramHashtag: '#MinecraftParty',
  },
  roblox: {
    theme: 'roblox',
    title: '¡Fiesta Roblox!',
    name: 'Mateo',
    primaryColor: '#0f172a', // slate-900
    accentColor: '#dc2626', // red-600
    coverImage: 'https://picsum.photos/seed/roblox/800/1200',
    instagramHashtag: '#RobloxParty',
  },
  sonic: {
    theme: 'sonic',
    title: '¡Fiesta a Toda Velocidad!',
    name: 'Mateo',
    primaryColor: '#1e40af', // blue-800
    accentColor: '#dc2626', // red-600
    coverImage: 'https://picsum.photos/seed/sonic/800/1200',
    instagramHashtag: '#SonicParty',
  }
};

export default function Editor() {
  const { id: invitationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [data, setData] = useState<InvitationData>(() => {
    const queryParams = new URLSearchParams(location.search);
    const templateId = queryParams.get('template');
    
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('invitationData');
    } catch (e) {
      console.warn('LocalStorage access blocked:', e);
    }

    if (saved && !templateId) {
      try {
        const parsed = JSON.parse(saved);
        if (invitationId && parsed.id === invitationId) {
          return { ...parsed };
        }
        if (!invitationId) {
          return { ...parsed, id: parsed.id || crypto.randomUUID() };
        }
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
    
    const baseData = { 
      ...defaultInvitation, 
      id: invitationId || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ownerId: user?.id,
      isPublic: true
    };
    if (templateId && TEMPLATE_DATA[templateId]) {
      return { ...baseData, ...TEMPLATE_DATA[templateId] };
    }
    return baseData;
  });
  const [loadingData, setLoadingData] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareGuestId, setShareGuestId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewGuestId, setPreviewGuestId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar.');
      navigate(`/auth?redirect=/editor/${data.id}`);
      return;
    }
    
    setIsSaving(true);
    const saveToastId = toast.loading('Guardando invitación...');
    
    try {
      const invDocRef = doc(db, 'invitations', data.id);
      
      const payload = {
        ...data,
        ownerId: data.ownerId || user.id,
        updatedAt: new Date().toISOString(),
        isPublic: data.isPublic ?? true,
        createdAt: data.createdAt || new Date().toISOString()
      };

      console.log('Attempting manual save for invitation:', data.id, 'by user:', user.id);
      // Use setDoc with merge: true to handle both initial creation and updates
      await setDoc(invDocRef, payload, { merge: true });
      
      setSaveSuccess(true);
      setIsDirty(false);
      toast.success('¡Invitación guardada con éxito!', { id: saveToastId });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      handleFirestoreError(error, OperationType.WRITE, `invitations/${data.id}`);
      toast.error(`Error al guardar: ${error.message}`, { id: saveToastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section: keyof InvitationData | null, field: string, value: any) => {
    setIsDirty(true);
    setData((prev) => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...(prev[section] as any),
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSectionUpdate = (id: string, value: string, style?: SectionStyle) => {
    setIsDirty(true);
    setData(prev => {
      const newData = { ...prev };
      
      // Handle direct fields
      if (id === 'title') newData.title = value;
      else if (id === 'name') newData.name = value;
      else if (id === 'gratitudeWords') newData.gratitudeWords = value;
      else if (id === 'guestName') newData.guestName = value;
      
      // Handle nested fields
      else if (id === 'ceremonyName') newData.ceremony = { ...newData.ceremony, name: value };
      else if (id === 'ceremonyAddress') newData.ceremony = { ...newData.ceremony, address: value };
      else if (id === 'receptionName') newData.reception = { ...newData.reception, name: value };
      else if (id === 'receptionAddress') newData.reception = { ...newData.reception, address: value };
      else if (id === 'rsvpTitle') { /* Static text, only style matters */ }

      if (style) {
        newData.styles = {
          ...(newData.styles || {}),
          [id]: style
        };
      }
      return newData;
    });
  };

  const optimizeAllImages = async (ultra = false) => {
    toast.loading(ultra ? 'Optimizando imágenes al máximo...' : 'Optimizando imágenes para reducir el tamaño...', { id: 'optimize' });
    try {
      const newData = { ...data };
      const maxWidth = ultra ? 300 : 400;
      const quality = ultra ? 0.15 : 0.2;
      
      // Helper to compress with specific settings
      const compressWithSettings = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (error) => reject(error);
          };
          reader.onerror = (error) => reject(error);
        });
      };

      // Optimize cover image
      if (newData.coverImage && newData.coverImage.startsWith('data:image')) {
        const response = await fetch(newData.coverImage);
        const blob = await response.blob();
        const file = new File([blob], "cover.jpg", { type: "image/jpeg" });
        newData.coverImage = await compressWithSettings(file);
      }
      
      // Optimize gallery images
      if (newData.galleryImages) {
        const optimizedGallery = await Promise.all(
          newData.galleryImages.map(async (img) => {
            if (img && img.startsWith('data:image')) {
              const response = await fetch(img);
              const blob = await response.blob();
              const file = new File([blob], "gallery.jpg", { type: "image/jpeg" });
              return await compressWithSettings(file);
            }
            return img;
          })
        );
        newData.galleryImages = optimizedGallery;
      }
      
      setData(newData);
      setIsDirty(true);
      toast.success('Imágenes optimizadas correctamente.', { id: 'optimize' });
    } catch (error) {
      console.error('Error optimizing images:', error);
      toast.error('Error al optimizar las imágenes.', { id: 'optimize' });
    }
  };

  useEffect(() => {
    const autoSave = async () => {
      if (!user || !isDirty) return;
      try {
        const invDocRef = doc(db, 'invitations', data.id);
        const payload = {
          ...data,
          ownerId: data.ownerId || user.id,
          updatedAt: new Date().toISOString(),
          isPublic: data.isPublic ?? true,
          createdAt: data.createdAt || new Date().toISOString()
        };

        // Check payload size (Firestore limit is 1MB = 1,048,576 bytes)
        const payloadString = JSON.stringify(payload);
        const sizeInBytes = new Blob([payloadString]).size;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInBytes > 1030000) { // Safety margin before the 1,048,576 limit
          console.error(`Document too large to save: ${sizeInMB.toFixed(2)}MB`);
          toast.error(
            <div>
              <p className="font-bold">Invitación demasiado pesada ({sizeInMB.toFixed(2)}MB)</p>
              <p className="text-xs mb-2">Has superado el límite de almacenamiento. Las imágenes son muy grandes o tienes demasiados invitados.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => optimizeAllImages(true)}
                  className="text-xs bg-white text-black px-2 py-1 rounded hover:bg-gray-200 transition-colors font-bold"
                >
                  Optimización Máxima
                </button>
                {(data.guests || []).length > 50 && (
                  <button 
                    onClick={() => {
                      if (window.confirm('¿Eliminar lista de invitados para reducir tamaño?')) {
                        setData(prev => ({ ...prev, guests: [] }));
                        setIsDirty(true);
                      }
                    }}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Limpiar Invitados
                  </button>
                )}
              </div>
            </div>,
            { duration: 15000, id: 'size-error' }
          );
          return;
        }

        console.log(`Attempting auto-save for invitation: ${data.id} (Size: ${sizeInMB.toFixed(2)}MB)`);
        // Use setDoc with merge: true to handle both initial creation and updates
        await setDoc(invDocRef, payload, { merge: true });
        setIsDirty(false);
        console.log('Auto-save successful for invitation:', data.id);
      } catch (error: any) {
        console.error('Auto-save error for invitation:', data.id, error);
        // We don't use handleFirestoreError here to avoid throwing and potentially breaking the effect loop
        // but we log it clearly with more context.
        if (error.code === 'permission-denied') {
          console.error('Permission denied details:', {
            userId: user.id,
            invitationId: data.id,
            ownerIdInState: data.ownerId,
            payloadOwnerId: user.id
          });
        }
      }
    };

    const timer = setTimeout(autoSave, 15000);
    return () => clearTimeout(timer);
  }, [data, isDirty, user]);

  useEffect(() => {
    try {
      localStorage.setItem('invitationData', JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage write blocked:', e);
    }
  }, [data]);

  useEffect(() => {
    if (invitationId && user) {
      setLoadingData(true);
      const invDocRef = doc(db, 'invitations', invitationId);
      getDoc(invDocRef)
        .then(docSnap => {
          if (docSnap.exists()) {
            const invData = docSnap.data() as InvitationData;
            setData({
              ...defaultInvitation,
              ...invData,
              id: invitationId,
              ceremony: { ...defaultInvitation.ceremony, ...(invData.ceremony || {}) },
              reception: { ...defaultInvitation.reception, ...(invData.reception || {}) },
              gifts: { ...defaultInvitation.gifts, ...(invData.gifts || {}) },
              dressCode: { ...defaultInvitation.dressCode, ...(invData.dressCode || {}) },
              itinerary: invData.itinerary || defaultInvitation.itinerary,
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoadingData(false));
    }
  }, [invitationId, user]);

  const handleItineraryChange = (index: number, field: string, value: string) => {
    setIsDirty(true);
    setData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const handleGalleryChange = (index: number, value: string) => {
    setIsDirty(true);
    setData((prev) => {
      const newGallery = [...(prev.galleryImages || [])];
      newGallery[index] = value;
      return { ...prev, galleryImages: newGallery };
    });
  };

  const addGalleryImage = () => {
    // Limit gallery to 3 images
    if ((data.galleryImages || []).length >= 3) {
      toast.error('Límite de 3 imágenes en la galería alcanzado.');
      return;
    }
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), '']
    }));
  };

  const removeGalleryImage = (index: number) => {
    setIsDirty(true);
    setData((prev) => {
      const newGallery = [...(prev.galleryImages || [])];
      newGallery.splice(index, 1);
      return { ...prev, galleryImages: newGallery };
    });
  };

  const compressImage = (file: File, maxWidth = 400): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Ultra-aggressive compression to JPEG with 0.2 quality for base64 storage
          resolve(canvas.toDataURL('image/jpeg', 0.2));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size before processing (limit to 5MB for initial upload)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande. Por favor elige una de menos de 5MB.');
        return;
      }

      try {
        const result = await compressImage(file);
        
        if (isCover) {
          handleChange(null, 'coverImage', result);
        } else if (index !== undefined) {
          handleGalleryChange(index, result);
        } else {
          // Limit gallery to 3 images to stay safely under Firestore 1MB limit when using base64
          if ((data.galleryImages || []).length >= 3) {
            toast.error('Límite de 3 imágenes en la galería alcanzado para asegurar el guardado. Usa URLs externas para más fotos.');
            return;
          }
          setData((prev) => ({
            ...prev,
            galleryImages: [...(prev.galleryImages || []), result]
          }));
        }
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Error al procesar la imagen.');
      }
    }
  };

  const getDevUrl = () => {
    return `${window.location.origin}/invitation/${data.id}`;
  };

  const getPublicUrl = () => {
    const currentOrigin = window.location.origin;
    // If we are on the dev origin, try to generate the shared origin
    if (currentOrigin.includes('ais-dev')) {
      return currentOrigin.replace('ais-dev', 'ais-pre') + `/invitation/${data.id}`;
    }
    // Otherwise, just use the current origin
    return `${currentOrigin}/invitation/${data.id}`;
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewData = { ...data };
  if (previewGuestId) {
    const guest = data.guests?.find(g => g.id === previewGuestId);
    if (guest) {
      previewData.guestName = guest.name;
      previewData.guestCount = guest.tickets;
    }
  } else {
    previewData.guestName = undefined;
    previewData.guestCount = undefined;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {loadingData && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 font-medium">Cargando datos de la invitación...</p>
          </div>
        </div>
      )}
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Compartir Invitación</h3>
            
            <div className="space-y-6">
              {/* Public Link Section */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 relative overflow-hidden">
                {window.location.origin.includes('ais-dev') && (
                  <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 text-center animate-pulse">
                    ⚠️ Requiere publicar la app
                  </div>
                )}
                <h4 className={cn("font-bold text-green-900 mb-2 flex items-center gap-2", window.location.origin.includes('ais-dev') ? "mt-4" : "")}>
                  <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Para Invitados</span>
                  Enlace Público
                </h4>
                <p className="text-green-800 text-sm mb-3">
                  <strong>IMPORTANTE:</strong> Para que este enlace y validación de QR funcionen, <strong>PRIMERO debes hacer clic en el botón blanco "Publicar" o "Compartir"</strong> que está hasta arriba a la derecha de tu pantalla (fuera de la app). Si no lo haces, mandará <strong>Error 404</strong>.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={getPublicUrl()} 
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm text-gray-700 outline-none"
                  />
                  <button 
                    onClick={() => handleCopyLink(getPublicUrl())}
                    className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Dev Link Section */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Solo para ti</span>
                  Enlace de Prueba
                </h4>
                <p className="text-amber-800 text-sm mb-3">
                  <strong>⚠️ IMPORTANTE:</strong> Si abres este enlace en tu móvil y te da <strong>Error 403</strong> o pide cookies, debes iniciar sesión en Google con tu correo en el navegador de tu móvil. Tus invitados NO podrán usar este enlace.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={getDevUrl()} 
                    className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm text-gray-700 outline-none"
                  />
                  <button 
                    onClick={() => handleCopyLink(getDevUrl())}
                    className="flex items-center justify-center w-10 h-10 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Editor */}
      <div className={`${showMobilePreview ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] lg:w-[500px] flex-col bg-white border-r border-gray-200 shadow-xl z-20 h-full`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 -ml-2 text-gray-500 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowMobilePreview(true)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              Vista
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 relative"
            >
              <span className="flex items-center justify-center">
                {isSaving ? (
                  <Loader2 key="loader" className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <Check key="check" className="w-4 h-4" />
                ) : (
                  <Save key="save" className="w-4 h-4" />
                )}
              </span>
              {isDirty && !isSaving && !saveSuccess && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium disabled:opacity-50 relative ${
                isDirty 
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center justify-center">
                {isSaving ? (
                  <Loader2 key="loader" className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <Check key="check" className="w-4 h-4" />
                ) : (
                  <Save key="save" className="w-4 h-4" />
                )}
              </span>
              <span>
                {isSaving ? 'Guardando...' : saveSuccess ? 'Guardado' : 'Guardar'}
              </span>
              {isDirty && !isSaving && !saveSuccess && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/50 p-2 gap-2 hide-scrollbar">
          {[
            { id: 'general', icon: <Settings className="w-4 h-4" />, label: 'General' },
            { id: 'theme', icon: <LayoutTemplate className="w-4 h-4" />, label: 'Tema' },
            { id: 'colors', icon: <Palette className="w-4 h-4" />, label: 'Colores' },
            { id: 'typography', icon: <Type className="w-4 h-4" />, label: 'Tipografía' },
            { id: 'media', icon: <ImageIcon className="w-4 h-4" />, label: 'Fotos' },
            { id: 'locations', icon: <MapPin className="w-4 h-4" />, label: 'Ubicación' },
            { id: 'itinerary', icon: <List className="w-4 h-4" />, label: 'Itinerario' },
            { id: 'guests', icon: <Users className="w-4 h-4" />, label: 'Invitados' },
            { id: 'gifts', icon: <Gift className="w-4 h-4" />, label: 'Regalos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleChange(null, 'title', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                  <select
                    value={data.titleSize || 'mediano'}
                    onChange={(e) => handleChange(null, 'titleSize', e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                  >
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Festejada</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleChange(null, 'name', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                  <select
                    value={data.nameSize || 'grande'}
                    onChange={(e) => handleChange(null, 'nameSize', e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                  >
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora del Evento</label>
                <input
                  type="datetime-local"
                  value={data.date.slice(0, 16)}
                  onChange={(e) => handleChange(null, 'date', new Date(e.target.value).toISOString())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de WhatsApp para Confirmación (RSVP)</label>
                <input
                  type="tel"
                  value={data.rsvpPhone || ''}
                  onChange={(e) => handleChange(null, 'rsvpPhone', e.target.value)}
                  placeholder="Ej. 521234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Incluye el código de país sin el signo + (ej. 52 para México).</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Padres y Agradecimiento</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Madre</label>
                      <input
                        type="text"
                        value={data.parentsNames?.mother || ''}
                        onChange={(e) => {
                          const current = data.parentsNames || { mother: '', father: '' };
                          handleChange(null, 'parentsNames', { ...current, mother: e.target.value });
                        }}
                        placeholder="Nombre de la mamá"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Padre</label>
                      <input
                        type="text"
                        value={data.parentsNames?.father || ''}
                        onChange={(e) => {
                          const current = data.parentsNames || { mother: '', father: '' };
                          handleChange(null, 'parentsNames', { ...current, father: e.target.value });
                        }}
                        placeholder="Nombre del papá"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Palabras de Agradecimiento</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Tamaño</span>
                        <select
                          value={data.styles?.gratitudeWords?.fontSize || ''}
                          onChange={(e) => {
                            const current = data.styles?.gratitudeWords || {};
                            handleSectionUpdate('gratitudeWords', data.gratitudeWords || '', { ...current, fontSize: e.target.value });
                          }}
                          className="text-xs border border-gray-300 rounded px-1 py-0.5 outline-none"
                        >
                          <option value="">Auto</option>
                          <option value="10pt">Pequeña</option>
                          <option value="12pt">Normal</option>
                          <option value="14pt">Grande</option>
                          <option value="16pt">Muy Grande</option>
                          <option value="18pt">Extra Grande</option>
                        </select>
                      </div>
                    </div>
                    <textarea
                      value={data.gratitudeWords || ''}
                      onChange={(e) => handleChange(null, 'gratitudeWords', e.target.value)}
                      placeholder="Escribe unas palabras de agradecimiento para tus invitados..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Vista de Invitado (Opcional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Invitado</label>
                    <input
                      type="text"
                      value={data.guestName || ''}
                      onChange={(e) => handleChange(null, 'guestName', e.target.value)}
                      placeholder="Ej. Familia Pérez"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Personas</label>
                    <input
                      type="number"
                      value={data.guestCount || 0}
                      onChange={(e) => handleChange(null, 'guestCount', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'bosque', name: 'Bosque Encantado', color: 'bg-emerald-900' },
                { id: 'bridgerton', name: 'Bridgerton', color: 'bg-blue-900' },
                { id: 'princesa', name: 'Princesa y El Sapo', color: 'bg-purple-900' },
                { id: 'elegancia', name: 'Elegancia Celestial', color: 'bg-stone-900' },
                { id: 'floral', name: 'Floral Rosa', color: 'bg-rose-900' },
                { id: 'estrellas', name: 'Noche de Estrellas', color: 'bg-indigo-950' },
                { id: 'dorado', name: 'Sueño Dorado', color: 'bg-yellow-950' },
                { id: 'minimalista', name: 'Minimalista', color: 'bg-zinc-900' },
                { id: 'rojo_pasion', name: 'Rojo Pasión', color: 'bg-red-900' },
                { id: 'vino_tinto', name: 'Vino Tinto', color: 'bg-rose-950' },
                { id: 'carmesi', name: 'Carmesí', color: 'bg-red-950' },
                { id: 'mariposa_azul', name: 'Mariposa Azul', color: 'bg-cyan-950' },
                { id: 'vintage_sepia', name: 'Vintage Sepia', color: 'bg-orange-950' },
                { id: 'neon_party', name: 'Fiesta Neón', color: 'bg-fuchsia-950' },
                { id: 'invierno_magico', name: 'Invierno Mágico', color: 'bg-slate-900' },
                { id: 'atardecer_tropical', name: 'Atardecer Tropical', color: 'bg-orange-900' },
                { id: 'boda_clasica', name: 'Boda Clásica', color: 'bg-slate-50' },
                { id: 'boda_rustica', name: 'Boda Rústica', color: 'bg-stone-100' },
                { id: 'cumpleanos_infantil', name: 'Cumpleaños Infantil', color: 'bg-sky-100' },
                { id: 'baby_shower', name: 'Baby Shower', color: 'bg-teal-50' },
                { id: 'graduacion', name: 'Graduación', color: 'bg-slate-900' },
                { id: 'bautizo', name: 'Bautizo', color: 'bg-blue-50' },
                { id: 'aniversario', name: 'Aniversario', color: 'bg-rose-50' },
                { id: 'superheroe', name: 'Súper Héroe', color: 'bg-blue-700' },
                { id: 'dinosaurio', name: 'Dinosaurio', color: 'bg-lime-900' },
                { id: 'unicornio', name: 'Unicornio', color: 'bg-pink-100' },
                { id: 'espacio', name: 'Espacio Exterior', color: 'bg-slate-950' },
                { id: 'bluey', name: 'Bluey', color: 'bg-sky-400' },
                { id: 'mario', name: 'Mario Bros', color: 'bg-red-600' },
                { id: 'minecraft', name: 'Minecraft', color: 'bg-emerald-900' },
                { id: 'roblox', name: 'Roblox', color: 'bg-slate-900' },
                { id: 'sonic', name: 'Sonic', color: 'bg-blue-800' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleChange(null, 'theme', theme.id)}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    data.theme === theme.id
                      ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-500/20'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mb-3 shadow-inner ${theme.color}`} />
                  <span className="text-sm font-medium text-gray-900 text-center">{theme.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Colores de la Invitación</h3>
                {isDirty && (
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Guardar Cambios
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Color Primario</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.primaryColor || '#064e3b'}
                    onChange={(e) => handleChange(null, 'primaryColor', e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.primaryColor || '#064e3b'}
                    onChange={(e) => handleChange(null, 'primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Color de Acento</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.accentColor || '#6ee7b7'}
                    onChange={(e) => handleChange(null, 'accentColor', e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.accentColor || '#6ee7b7'}
                    onChange={(e) => handleChange(null, 'accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Colores del Código de Vestimenta</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {data.dressCode?.colors.map((color, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div className="relative group">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(data.dressCode?.colors || [])];
                              newColors[index] = e.target.value;
                              handleChange('dressCode', 'colors', newColors);
                            }}
                            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-sm"
                          />
                          <button
                            onClick={() => {
                              const newColors = [...(data.dressCode?.colors || [])];
                              newColors.splice(index, 1);
                              handleChange('dressCode', 'colors', newColors);
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newColors = [...(data.dressCode?.colors || []), '#ffffff'];
                        handleChange('dressCode', 'colors', newColors);
                      }}
                      className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Estos colores aparecerán en la sección de código de vestimenta.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Tipografía</h3>
                {isDirty && (
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Guardar Cambios
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Fuentes de Texto</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuente del Título Principal</label>
                    <select
                      value={data.titleFont || ''}
                      onChange={(e) => handleChange(null, 'titleFont', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                      <option value="">Predeterminada del tema</option>
                      <option value="'Playfair Display', serif">Playfair Display (Elegante)</option>
                      <option value="'Great Vibes', cursive">Great Vibes (Manuscrita)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Moderna)</option>
                      <option value="'Cinzel', serif">Cinzel (Clásica)</option>
                      <option value="'Dancing Script', cursive">Dancing Script (Casual)</option>
                      <option value="'Cormorant Garamond', serif">Cormorant Garamond (Refinada)</option>
                      <option value="'Alex Brush', cursive">Alex Brush (Sofisticada)</option>
                      <option value="'Pacifico', cursive">Pacifico (Divertida)</option>
                      <option value="'Satisfy', cursive">Satisfy (Elegante cursiva)</option>
                      <option value="'Marck Script', cursive">Marck Script (Artística)</option>
                      <option value="'Sacramento', cursive">Sacramento (Fina)</option>
                      <option value="'Lobster', cursive">Lobster (Gruesa)</option>
                      <option value="'Abril Fatface', serif">Abril Fatface (Impactante)</option>
                      <option value="'Bebas Neue', sans-serif">Bebas Neue (Condensada)</option>
                      <option value="'Cookie', cursive">Cookie (Dulce)</option>
                      <option value="'Parisienne', cursive">Parisienne (Romántica)</option>
                      <option value="'Rochester', cursive">Rochester (Vintage)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuente del Nombre</label>
                    <select
                      value={data.nameFont || ''}
                      onChange={(e) => handleChange(null, 'nameFont', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                      <option value="">Predeterminada del tema</option>
                      <option value="'Playfair Display', serif">Playfair Display (Elegante)</option>
                      <option value="'Great Vibes', cursive">Great Vibes (Manuscrita)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Moderna)</option>
                      <option value="'Cinzel', serif">Cinzel (Clásica)</option>
                      <option value="'Dancing Script', cursive">Dancing Script (Casual)</option>
                      <option value="'Cormorant Garamond', serif">Cormorant Garamond (Refinada)</option>
                      <option value="'Alex Brush', cursive">Alex Brush (Sofisticada)</option>
                      <option value="'Pacifico', cursive">Pacifico (Divertida)</option>
                      <option value="'Satisfy', cursive">Satisfy (Elegante cursiva)</option>
                      <option value="'Marck Script', cursive">Marck Script (Artística)</option>
                      <option value="'Sacramento', cursive">Sacramento (Fina)</option>
                      <option value="'Lobster', cursive">Lobster (Gruesa)</option>
                      <option value="'Abril Fatface', serif">Abril Fatface (Impactante)</option>
                      <option value="'Bebas Neue', sans-serif">Bebas Neue (Condensada)</option>
                      <option value="'Cookie', cursive">Cookie (Dulce)</option>
                      <option value="'Parisienne', cursive">Parisienne (Romántica)</option>
                      <option value="'Rochester', cursive">Rochester (Vintage)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuente del Cuerpo de Texto</label>
                    <select
                      value={data.bodyFont || ''}
                      onChange={(e) => handleChange(null, 'bodyFont', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                      <option value="">Predeterminada del tema</option>
                      <option value="'Inter', sans-serif">Inter (Limpia)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Moderna)</option>
                      <option value="'Lora', serif">Lora (Serif suave)</option>
                      <option value="'Open Sans', sans-serif">Open Sans (Legible)</option>
                      <option value="'Quicksand', sans-serif">Quicksand (Redondeada)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Las fuentes seleccionadas se aplicarán a toda la invitación, reemplazando las fuentes predeterminadas del tema elegido.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">Foto de Portada</h3>
                  <button
                    onClick={() => optimizeAllImages()}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    Optimizar Todo
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subir imagen o usar URL</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium whitespace-nowrap"
                    >
                      <Upload className="w-4 h-4" />
                      Subir Foto
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                    <input
                      type="url"
                      value={data.coverImage || ''}
                      onChange={(e) => handleChange(null, 'coverImage', e.target.value)}
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Recomendamos una imagen vertical (retrato).</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marco de la foto de portada</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'none', label: 'Ninguno' },
                      { id: 'arch', label: 'Arco' },
                      { id: 'circle', label: 'Círculo' },
                      { id: 'diamond', label: 'Diamante' },
                      { id: 'flower', label: 'Flor' },
                      { id: 'vintage', label: 'Vintage' },
                    ].map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => handleChange(null, 'coverFrame', frame.id)}
                        className={cn(
                          "px-3 py-2 text-sm font-medium rounded-lg border transition-all",
                          data.coverFrame === frame.id || (!data.coverFrame && frame.id === 'none')
                            ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {frame.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Instagram className="w-5 h-5" />
                  Instagram
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hashtag del evento</label>
                  <input
                    type="text"
                    value={data.instagramHashtag || ''}
                    onChange={(e) => handleChange(null, 'instagramHashtag', e.target.value)}
                    placeholder="#MisXVAlejandra"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Galería de Fotos</h3>
                <input
                  type="file"
                  ref={galleryInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                />
                {data.galleryImages?.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => handleImageUpload(e as any, false, index);
                        input.click();
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="Cambiar foto"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleGalleryChange(index, e.target.value)}
                      placeholder="URL de la imagen"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Subir Foto
                  </button>
                  <button
                    onClick={addGalleryImage}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    + Añadir URL
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Ceremonia</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                  <input
                    type="text"
                    value={data.ceremony.name}
                    onChange={(e) => handleChange('ceremony', 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={data.ceremony.address}
                    onChange={(e) => handleChange('ceremony', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input
                      type="time"
                      value={data.ceremony.time}
                      onChange={(e) => handleChange('ceremony', 'time', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps</label>
                    <input
                      type="url"
                      value={data.ceremony.mapUrl}
                      onChange={(e) => handleChange('ceremony', 'mapUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Recepción</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                  <input
                    type="text"
                    value={data.reception.name}
                    onChange={(e) => handleChange('reception', 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={data.reception.address}
                    onChange={(e) => handleChange('reception', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input
                      type="time"
                      value={data.reception.time}
                      onChange={(e) => handleChange('reception', 'time', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps</label>
                    <input
                      type="url"
                      value={data.reception.mapUrl}
                      onChange={(e) => handleChange('reception', 'mapUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              {data.itinerary.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Hora</label>
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => handleItineraryChange(index, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div className="w-2/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Evento</label>
                    <input
                      type="text"
                      value={item.event}
                      onChange={(e) => handleItineraryChange(index, 'event', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleChange(null, 'itinerary', [...data.itinerary, { time: '00:00', event: 'Nuevo Evento' }])}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                + Añadir Evento
              </button>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Lista de Invitados</h3>
                  <p className="text-sm text-gray-500">Genera enlaces únicos para cada familia o invitado.</p>
                </div>
                <div className="flex gap-2">
                  {isDirty && (
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Lista
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsDirty(true);
                      setData(prev => ({
                        ...prev,
                        guests: [...(prev.guests || []), { id: crypto.randomUUID(), name: '', tickets: 1 }]
                      }));
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Invitado
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {(!data.guests || data.guests.length === 0) ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No hay invitados en la lista.</p>
                    <p className="text-gray-400 text-xs mt-1">Añade invitados para generar enlaces personalizados.</p>
                  </div>
                ) : (
                  data.guests.map((guest, index) => (
                    <div key={guest.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre (Ej. Familia Pérez o Juan López)</label>
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) => {
                                setIsDirty(true);
                                setData(prev => {
                                  const newGuests = [...(prev.guests || [])];
                                  newGuests[index] = { ...newGuests[index], name: e.target.value };
                                  return { ...prev, guests: newGuests };
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                              placeholder="Nombre del invitado o familia"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Número de Pases</label>
                            <input
                              type="number"
                              min="1"
                              value={guest.tickets}
                              onChange={(e) => {
                                setIsDirty(true);
                                setData(prev => {
                                  const newGuests = [...(prev.guests || [])];
                                  newGuests[index] = { ...newGuests[index], tickets: parseInt(e.target.value) || 1 };
                                  return { ...prev, guests: newGuests };
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            />
                          </div>
                          
                          {/* Unique Link for this guest */}
                          <div className="pt-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Enlace Único</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                readOnly 
                                value={`${getPublicUrl()}?guest=${guest.id}`} 
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-500 outline-none"
                              />
                              <button 
                                onClick={() => handleCopyLink(`${getPublicUrl()}?guest=${guest.id}`)}
                                className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shrink-0"
                                title="Copiar enlace"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => setShareGuestId(guest.id)}
                                className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shrink-0"
                                title="Generar QR Personalizado"
                              >
                                <Sparkles className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsDirty(true);
                            setData(prev => {
                              const newGuests = [...(prev.guests || [])];
                              newGuests.splice(index, 1);
                              return { ...prev, guests: newGuests };
                            });
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Eliminar invitado"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'gifts' && (
            <div className="space-y-6">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={data.gifts.envelope}
                  onChange={(e) => handleChange('gifts', 'envelope', e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="block font-medium text-gray-900">Lluvia de Sobres</span>
                  <span className="block text-sm text-gray-500">Permitir regalos en efectivo el día del evento</span>
                </div>
              </label>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Mesa de Regalos</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tienda (Ej. Liverpool, Amazon)</label>
                  <input
                    type="text"
                    value={data.gifts.storeName}
                    onChange={(e) => handleChange('gifts', 'storeName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Mesa / Código</label>
                  <input
                    type="text"
                    value={data.gifts.storeCode}
                    onChange={(e) => handleChange('gifts', 'storeCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Mesa de Regalos</label>
                  <input
                    type="url"
                    value={data.gifts.storeUrl}
                    onChange={(e) => handleChange('gifts', 'storeUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className={`${showMobilePreview ? 'flex' : 'hidden'} md:flex flex-1 bg-gray-200 flex-col items-center justify-center relative overflow-hidden`}>
        {/* Mobile Actions */}
        <div className="md:hidden absolute top-4 left-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setShowMobilePreview(false)}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Volver
          </button>
          {data.guests && data.guests.length > 0 && (
            <select 
              className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm font-medium text-gray-700 text-sm outline-none max-w-[150px] truncate"
              value={previewGuestId || ''}
              onChange={(e) => setPreviewGuestId(e.target.value || null)}
            >
              <option value="">Vista General</option>
              {data.guests.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="md:hidden absolute top-4 right-4 z-30 flex items-center gap-2">
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm font-medium text-gray-700 hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex absolute top-4 right-4 z-20 gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
          {data.guests && data.guests.length > 0 && (
            <select 
              className="px-2 py-1.5 text-sm bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer border-r border-gray-200 mr-1 pr-3"
              value={previewGuestId || ''}
              onChange={(e) => setPreviewGuestId(e.target.value || null)}
            >
              <option value="">Vista General</option>
              {data.guests.map(g => (
                <option key={g.id} value={g.id}>Ver como: {g.name}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => setIsPreviewMobile(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isPreviewMobile ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Móvil
          </button>
          <button
            onClick={() => setIsPreviewMobile(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              !isPreviewMobile ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Escritorio
          </button>
        </div>

        <div
          className={`bg-white shadow-2xl overflow-y-auto transition-all duration-500 ease-in-out ${
            isPreviewMobile
              ? 'w-full h-full md:w-[375px] md:h-[812px] md:rounded-[3rem] md:border-[8px] md:border-gray-900 md:my-8'
              : 'w-full h-full'
          }`}
        >
          <InvitationTemplate 
            data={previewData} 
            isEditing={false}
            onUpdate={handleSectionUpdate}
          />
        </div>
      </div>

      {shareGuestId ? (
        <QRShare 
          data={previewData} 
          theme={getTheme(previewData)} 
          initialGuestId={shareGuestId} 
          onClose={() => setShareGuestId(null)}
        />
      ) : (
        <QRShare 
          data={previewData} 
          theme={getTheme(previewData)} 
        />
      )}

      {/* Floating Save Button for Mobile */}
      {isDirty && !showMobilePreview && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="flex items-center justify-center">
              {isSaving ? (
                <Loader2 key="loader" className="w-6 h-6 animate-spin" />
              ) : (
                <Save key="save" className="w-6 h-6" />
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
