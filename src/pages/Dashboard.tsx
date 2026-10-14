import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Eye, Trash2, LogIn, Sparkles, Calendar, Layout, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { db, collection, query, where, getDocs, deleteDoc, doc, handleFirestoreError, OperationType } from '../firebase';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteInvitation = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta invitación? Esta acción no se puede deshacer.')) {
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#af9462]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-[#af9462]/25 p-8 text-center"
          >
            <div className="w-16 h-16 bg-[#af9462]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#af9462]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-light text-[#2c2c2b] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Inicia Sesión</h2>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              Inicia sesión para crear y gestionar tus invitaciones digitales personalizadas.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/auth"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2c2c2b] text-white font-medium rounded-xl hover:bg-[#3c3c3a] transition-all shadow-md transform active:scale-95"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <Navbar />
      <div className="pt-28 pb-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-gradient-to-r from-white via-white to-[#f7f3ec] p-8 rounded-3xl border border-[#af9462]/20 shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-[0.25em] text-[#af9462] mb-1">
                <Sparkles className="w-4 h-4" /> Panel de Control
              </div>
              <h1 className="text-4xl font-light text-[#2c2c2b]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Mis Invitaciones
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Crea, edita y comparte tus celebraciones con estilo único.
              </p>
            </div>
            <Link
              to="/select-template"
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#af9462] text-white font-medium rounded-2xl hover:bg-[#9d8353] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Invitación</span>
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#af9462]"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {invitations.map((inv, index) => {
                const data = inv.data || {};
                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white rounded-3xl border border-[#af9462]/20 shadow-md overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    <div className="aspect-video bg-gray-900 relative overflow-hidden">
                      <img
                        src={data.coverImage || `https://picsum.photos/seed/${data.theme || 'bosque'}/800/450?blur=2`}
                        alt={data.theme || 'bosque'}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                        <h3 className="text-2xl font-serif text-white font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {data.name || 'Sin nombre'}
                        </h3>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-gray-800 shadow-sm">
                        {data.layoutMode === 'stories' ? 'Modo Historias' : 'Tradicional'}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#af9462] bg-[#af9462]/10 px-3 py-1 rounded-full">
                            {String(data.theme || 'bosque').replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#af9462]" />
                            {(() => {
                              try {
                                const d = new Date(data.date || new Date());
                                if (isNaN(d.getTime())) return 'Por definir';
                                return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                              } catch (e) {
                                return 'Por definir';
                              }
                            })()}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-[#2c2c2b] mb-2">{data.title || 'Sin título'}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2 border-t border-gray-100 pt-5 mt-4">
                        <Link
                          to={`/editor/${inv.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-[#af9462] hover:text-white transition-all shadow-sm group/btn"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500 group-hover/btn:text-white transition-colors" />
                          <span>Editar</span>
                        </Link>
                        <Link
                          to={`/invitation/${inv.id}`}
                          target="_blank"
                          className="p-2.5 text-gray-500 hover:text-white hover:bg-[#af9462] rounded-xl transition-all shadow-sm"
                          title="Ver invitación"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => deleteInvitation(inv.id)}
                          className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-red-500 transition-all shadow-sm"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Create New Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: invitations.length * 0.08 }}
              >
                <Link
                  to="/select-template"
                  className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-white via-[#fdfbf7] to-[#f7f3ec] rounded-3xl border-2 border-dashed border-[#af9462]/40 p-8 text-gray-500 hover:text-[#af9462] hover:border-[#af9462] hover:shadow-xl transition-all group min-h-[360px]"
                >
                  <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#af9462] group-hover:text-white transition-all duration-300 text-[#af9462]">
                    <Plus className="w-10 h-10" />
                  </div>
                  <span className="font-serif text-xl font-medium text-[#2c2c2b] group-hover:text-[#af9462] transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Crear nueva invitación
                  </span>
                  <p className="text-xs text-gray-500 text-center max-w-[200px]">
                    Elige una plantilla y personaliza cada detalle en segundos.
                  </p>
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
