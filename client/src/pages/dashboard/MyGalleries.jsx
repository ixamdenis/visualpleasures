import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal'; // <--- IMPORTAR
import toast from 'react-hot-toast';

export default function MyGalleries() {
    const { token } = useAuth();
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado Modal
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    useEffect(() => {
        fetch('http://localhost:3001/api/galleries/mine', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setGalleries(data);
                setLoading(false);
            });
    }, []);

    // 1. ABRIR MODAL
    const requestDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    // 2. CONFIRMAR
    const confirmDelete = async () => {
        const id = deleteModal.id;
        const promise = fetch(`http://localhost:3001/api/galleries/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.promise(promise, {
            loading: 'Eliminando...',
            success: 'Galería eliminada',
            error: 'Error al eliminar'
        });

        try {
            const res = await promise;
            if (res.ok) {
                setGalleries(galleries.filter(g => g.id !== id));
                setDeleteModal({ isOpen: false, id: null });
            }
        } catch (error) { console.error(error); }
    };

    if (loading) return <div className="text-white">Cargando tus obras...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-slab text-white">Mis Galerías</h1>
                    <p className="text-gray-400 text-sm">Gestiona el estado de tus publicaciones.</p>
                </div>
                <Link to="/dashboard/crear" className="bg-brand-primary text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors">
                    + Nueva
                </Link>
            </div>

            {galleries.length === 0 ? (
                <div className="text-center py-10 border border-white/10 rounded-xl">
                    <p className="text-gray-400">Aún no has subido contenido.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {galleries.map((gallery) => (
                        <div key={gallery.id} className="bg-brand-surface/50 border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-32 h-32 bg-black rounded-lg overflow-hidden shrink-0">
                                    <img src={gallery.coverImage} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-white mb-1">{gallery.title}</h3>
                                        <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2
                                      ${gallery.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' :
                                                gallery.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}
                                  `}>
                                            {gallery.status === 'PUBLISHED' && <><CheckCircle size={12} /> Publicada</>}
                                            {gallery.status === 'PENDING' && <><Clock size={12} /> En Revisión</>}
                                            {gallery.status === 'REJECTED' && <><XCircle size={12} /> Rechazada</>}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-400 mb-4">${gallery.price} USD • {gallery.assets.length} Archivos</p>

                                    {gallery.status === 'REJECTED' && gallery.adminFeedback && (
                                        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-4">
                                            <p className="text-red-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
                                                <AlertCircle size={12} /> Motivo del rechazo:
                                            </p>
                                            <p className="text-white text-sm">{gallery.adminFeedback}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-2">
                                        <button onClick={() => requestDelete(gallery.id)} className="text-gray-500 hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
                                            <Trash2 size={14} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="¿Eliminar Galería?"
                message="Esta acción es permanente."
                isDanger={true}
            />
        </div>
    );
}