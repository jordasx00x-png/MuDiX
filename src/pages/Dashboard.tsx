import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  LogIn, 
  Sparkles, 
  Calendar, 
  Search, 
  Copy, 
  Check, 
  Share2, 
  Filter,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { db, collection, query, where, getDocs, deleteDoc, doc, handleFirestoreError, OperationType } from '../firebase';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'invitations'), where('ownerId', '==', user.id));
      getDocs(q)
        .then(snapshot => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }));
          setInvitations(docs);
        })
        .catch(error => {
          handleFirestoreError(error, OperationType.LIST, 'invitations');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const deleteInvitation = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la invitación "${name || 'Sin título'}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'invitations', id));
      setInvitations(invs => invs.filter(inv => inv.id !== id));
      toast.success('Invitación eliminada correctamente');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast.error('No se pudo eliminar la invitación. Inténtalo de nuevo.');
      try {
        handleFirestoreError(error, OperationType.DELETE, `invitations/${id}`);
      } catch (err) {
        // Suppress thrown error
      }
    } finally {
      setLoading(false);
    }
  };

  const copyInvitationLink = (id: string) => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}invitation/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('¡Enlace de invitación copiado al portapapeles!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter invitations by search query and category
  const filteredInvitations = useMemo(() => {
    return invitations.filter(inv => {
      const data = inv.data || {};
      const matchesSearch = 
        (data.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (data.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (data.theme || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'wedding') return (data.theme || '').includes('boda');
      if (selectedCategory === 'quinceanera') return (data.theme || '').includes('bosque') || (data.title || '').toLowerCase().includes('xv');
      if (selectedCategory === 'birthday') return (data.theme || '').includes('cumpleanos') || (data.theme || '').includes('superheroe');
      return true;
    });
  }, [invitations, searchQuery, selectedCategory]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = invitations.length;
    const storiesCount = invitations.filter(inv => inv.data?.layoutMode === 'stories').length;
    const traditionalCount = total - storiesCount;

    // Nearest upcoming date
    const sortedUpcoming = [...invitations]
      .filter(inv => inv.data?.date)
      .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());
    const nextEvent = sortedUpcoming[0]?.data;

    return { total, storiesCount, traditionalCount, nextEvent };
  }, [invitations]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-medium">Cargando panel de control...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 pt-24">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200/80 p-8 text-center"
          >
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-pink-100">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Inicia Sesión</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Ingresa a tu cuenta para crear, administrar y compartir tus invitaciones interactivas.
            </p>
            <Link
              to="/auth"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-medium rounded-xl hover:bg-pink-700 transition-colors shadow-sm"
            >
              <LogIn className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Top Header Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-200/70">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-600 mb-1">
                <span>Panel de Gestión</span>
                <span aria-hidden="true">·</span>
                <span className="text-gray-500 font-normal">MuDiX Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 tracking-tight">
                Mis Invitaciones
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                Crea, personaliza en tiempo real y comparte tus invitaciones digitales con tus invitados.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/select-template"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-98 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Invitación</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs">
              <p className="text-xs text-gray-500">Total Creadas</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs">
              <p className="text-xs text-gray-500">Modo Historias</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-pink-600 mt-1">
                {stats.storiesCount}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs">
              <p className="text-xs text-gray-500">Modo Tradicional</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-gray-700 mt-1">
                {stats.traditionalCount}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs truncate">
              <p className="text-xs text-gray-500">Próximo Evento</p>
              <p className="text-sm font-semibold text-gray-900 mt-1.5 truncate">
                {stats.nextEvent ? (
                  <span>
                    {stats.nextEvent.name || stats.nextEvent.title}
                  </span>
                ) : (
                  <span className="text-gray-400 font-normal">Sin eventos próximos</span>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, anfitrión o título..."
              className="w-full pl-10 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs (Interactive Filters) */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todas ({invitations.length})
            </button>
            <button
              onClick={() => setSelectedCategory('wedding')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'wedding'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bodas
            </button>
            <button
              onClick={() => setSelectedCategory('quinceanera')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'quinceanera'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              XV Años
            </button>
            <button
              onClick={() => setSelectedCategory('birthday')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === 'birthday'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cumpleaños
            </button>
          </div>
        </section>

        {/* Invitations Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200/80 p-5 animate-pulse flex flex-col gap-4">
                <div className="aspect-video bg-gray-100 rounded-xl" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-6 bg-gray-100 rounded w-2/3" />
                <div className="h-10 bg-gray-100 rounded-lg mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredInvitations.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron invitaciones' : 'Aún no tienes invitaciones creadas'}
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {searchQuery
                ? 'Prueba buscando con otro término o limpia los filtros para ver todos tus eventos.'
                : 'Comienza diseñando tu primera invitación interactiva a partir de nuestras plantillas profesionales.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Limpiar búsqueda
              </button>
            ) : (
              <Link
                to="/select-template"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-xl hover:bg-pink-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Crear mi primera invitación</span>
              </Link>
            )}
          </div>
        ) : (
          /* Populated Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredInvitations.map((inv) => {
                const data = inv.data || {};
                const isCopied = copiedId === inv.id;
                
                // Formatted date
                let formattedDate = 'Fecha por definir';
                if (data.date) {
                  try {
                    const parsed = new Date(data.date);
                    if (!isNaN(parsed.getTime())) {
                      formattedDate = parsed.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      });
                    }
                  } catch (e) {
                    // Ignore date parsing failure
                  }
                }

                return (
                  <motion.article
                    key={inv.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Visual Media Header with Scrim */}
                    <div className="aspect-[16/10] bg-gray-950 relative overflow-hidden">
                      <img
                        src={data.coverImage || `https://picsum.photos/seed/${data.theme || 'boda'}/800/500?blur=1`}
                        alt={data.name || 'Invitación'}
                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient Scrim for WCAG contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent flex flex-col justify-between p-5">
                        <div className="flex justify-end">
                          <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                            {data.layoutMode === 'stories' ? 'Historias' : 'Tradicional'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-serif text-white font-medium tracking-wide drop-shadow-sm">
                            {data.name || 'Sin nombre'}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Unboxed Metadata Line with typographic separators (Zero-Pill discipline) */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span className="capitalize text-gray-700 font-medium">
                            {String(data.theme || 'Evento').replace('_', ' ')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{formattedDate}</span>
                        </div>

                        <h4 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1">
                          {data.title || 'Invitación Digital'}
                        </h4>
                      </div>

                      {/* Functional Interactive Actions Strip */}
                      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                        <Link
                          to={`/editor/${inv.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-pink-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </Link>

                        <Link
                          to={`/invitation/${inv.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Abrir vista previa en nueva pestaña"
                          aria-label="Ver invitación"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => copyInvitationLink(inv.id)}
                          className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          title="Copiar enlace para compartir"
                          aria-label="Copiar enlace"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => deleteInvitation(inv.id, data.name || data.title)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar invitación"
                          aria-label="Eliminar invitación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {/* Create New Invitation Card */}
            <Link
              to="/select-template"
              className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-pink-300 bg-white hover:bg-pink-50/20 text-gray-500 hover:text-pink-600 transition-all duration-300 min-h-[300px] text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-serif font-bold text-gray-900 text-lg group-hover:text-pink-600 transition-colors">
                Crear nueva invitación
              </span>
              <p className="text-xs text-gray-500 max-w-[220px] leading-relaxed">
                Elige entre nuestras plantillas interactivas para bodas, XV años, cumpleaños y más.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 mt-2 group-hover:translate-x-1 transition-transform">
                <span>Explorar plantillas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
