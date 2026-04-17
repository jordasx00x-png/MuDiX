import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Eye, Trash2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { db, collection, query, where, getDocs, deleteDoc, doc, handleFirestoreError, OperationType } from '../firebase';
import Navbar from '../components/Navbar';

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
    try {
      if (!window.confirm('¿Estás seguro de que deseas eliminar esta invitación?')) return;
      
      await deleteDoc(doc(db, 'invitations', id));
      setInvitations(invs => invs.filter(inv => inv.id !== id));
      toast.success('Invitación eliminada correctamente');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `invitations/${id}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Inicia Sesión</h2>
            <p className="text-gray-600 mb-8">
              Inicia sesión para crear y guardar tus invitaciones digitales.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/auth"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Invitaciones</h1>
              <p className="text-gray-600">Gestiona y crea nuevas invitaciones digitales.</p>
            </div>
            <Link
              to="/select-template"
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Crear Invitación
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((inv) => {
                const data = inv.data || {};
                return (
                <div key={inv.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <img
                      src={data.coverImage || `https://picsum.photos/seed/${data.theme || 'bosque'}/800/450?blur=2`}
                      alt={data.theme || 'bosque'}
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-2xl font-serif text-white font-bold">{data.name || 'Sin nombre'}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {String(data.theme || 'bosque').replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {(() => {
                          try {
                            const d = new Date(data.date || new Date());
                            if (isNaN(d.getTime())) return 'Fecha por definir';
                            return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                          } catch (e) {
                            return 'Fecha por definir';
                          }
                        })()}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{data.title || 'Sin título'}</h4>
                    <p className="text-sm text-gray-600 mb-6">Modo: {data.layoutMode === 'stories' ? 'Historias' : 'Tradicional'}</p>
                    
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                      <Link
                        to={`/editor/${inv.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </Link>
                      <Link
                        to={`/invitation/${inv.id}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Ver invitación"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => deleteInvitation(inv.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )})}

              {/* Create New Card */}
              <Link
                to="/select-template"
                className="flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all group min-h-[320px]"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-medium text-lg">Crear nueva invitación</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
