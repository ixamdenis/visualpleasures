import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Trash2, ExternalLink, Shield } from 'lucide-react';
import GalleryModal from '../../components/GalleryModal';
import ConfirmModal from '../../components/ConfirmModal'; // <--- IMPORTAR
import toast from 'react-hot-toast';

export default function AdminGalleries() {
    const { token } = useAuth();
    const [galleries, setGalleries] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGallery, setSelectedGallery] = useState(null);

    // Estado Modal
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    useEffect(() => {
        fetch('http://localhost:3001/api/galleries/admin/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setGalleries(data);
                    setFiltered(data);
                }
            });
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const result = galleries.filter(g =>
            g.title.toLowerCase().includes(lowerSearch) ||
            g.model?.user?.name.toLowerCase().includes(lowerSearch)
        );
        setFiltered(result);
    }, [search, galleries]);

    // 1. ABRIR MODAL
    const requestDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    // 2. CONFIRMAR ELIMINACIÓN
    const confirmDelete = async () => {
        const id = deleteModal.id;
        const promise = fetch(`http://localhost:3001/api/galleries/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.promise(promise, {
            loading: 'Eliminando...',
            success: 'Galería eliminada permanentemente',
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

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500 rounded-full text-white">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-slab text-white">Gestión Global</h1>
                    <p className="text-gray-400 text-sm">Control total sobre todas las galerías.</p>
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por título o nombre de modelo..."
                    className="w-full bg-brand-surface border border-white/10 rounded-xl py-3 pl-12 text-white focus:border-brand-primary outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-brand-surface/30 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/30 text-white uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Portada</th>
                            <th className="p-4">Título</th>
                            <th className="p-4">Modelo</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map(gallery => (
                            <tr key={gallery.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <img src={gallery.coverImage} className="w-12 h-12 rounded object-cover bg-black" />
                                </td>
                                <td className="p-4 font-bold text-white">{gallery.title}</td>
                                <td className="p-4 text-brand-primary">{gallery.model?.user?.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                    ${gallery.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' :
                                            gallery.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}
                                `}>
                                        {gallery.status}
                                    </span>
                                </td>
                                <td className="p-4">${gallery.price}</td>
                                <td className="p-4 text-right flex justify-end gap-2 items-center pt-6">
                                    <button onClick={() => setSelectedGallery(gallery)} className="text-gray-400 hover:text-white" title="Ver">
                                        <ExternalLink size={18} />
                                    </button>
                                    <button onClick={() => requestDelete(gallery.id)} className="text-red-500 hover:bg-red-500/20 p-2 rounded transition-colors" title="Eliminar">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="p-8 text-center">No se encontraron resultados.</div>}
            </div>

            {selectedGallery && (
                <GalleryModal gallery={selectedGallery} onClose={() => setSelectedGallery(null)} allowAllAccess={true} />
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="¿Eliminar Galería Permanentemente?"
                message="Esta acción borrará la galería y todos sus archivos de la base de datos. No se puede deshacer."
                isDanger={true}
            />
        </div>
    );
}