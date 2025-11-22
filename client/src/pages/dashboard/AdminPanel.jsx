import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import GalleryModal from '../../components/GalleryModal';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function AdminPanel() {
    const { token, user } = useAuth();
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGallery, setSelectedGallery] = useState(null);

    // Estado para el Modal de Confirmación
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '', // 'APPROVE' o 'REJECT'
        galleryId: null,
        title: '',
        message: '',
        isDanger: false,
        showInput: false
    });

    const fetchPending = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/galleries/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setGalleries(data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchPending(); }, []);

    // 1. ABRIR MODAL (En vez de window.confirm)
    const openConfirm = (id, type) => {
        if (type === 'APPROVE') {
            setModalConfig({
                isOpen: true,
                type: 'APPROVE',
                galleryId: id,
                title: '¿Publicar Galería?',
                message: 'La galería será visible públicamente de inmediato en el sitio.',
                isDanger: false,
                showInput: false
            });
        } else {
            setModalConfig({
                isOpen: true,
                type: 'REJECT',
                galleryId: id,
                title: 'Rechazar Contenido',
                message: 'Por favor indica el motivo del rechazo para que la modelo pueda corregirlo:',
                isDanger: true,
                showInput: true // Esto activa el campo de texto en el modal
            });
        }
    };

    // 2. EJECUTAR ACCIÓN (Se llama desde el Modal)
    const handleConfirmAction = async (inputValue) => {
        const { galleryId, type } = modalConfig;
        const newStatus = type === 'APPROVE' ? 'PUBLISHED' : 'REJECTED';

        if (type === 'REJECT' && !inputValue) {
            toast.error("Debes escribir un motivo.");
            return;
        }

        const promise = fetch(`http://localhost:3001/api/galleries/${galleryId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus, feedback: inputValue })
        });

        toast.promise(promise, {
            loading: 'Procesando...',
            success: type === 'APPROVE' ? 'Galería Publicada' : 'Galería Rechazada',
            error: 'Error al conectar'
        });

        try {
            const res = await promise;
            if (res.ok) {
                setGalleries(galleries.filter(g => g.id !== galleryId));
                setModalConfig({ ...modalConfig, isOpen: false });
            }
        } catch (error) { console.error(error); }
    };

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') return <div>Acceso Denegado</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-gold rounded-full text-black"><AlertTriangle size={24} /></div>
                <div>
                    <h1 className="text-3xl font-slab text-white">Centro de Moderación</h1>
                    <p className="text-gray-400 text-sm">Tienes {galleries.length} solicitudes pendientes.</p>
                </div>
            </div>

            {loading ? <p className="text-white">Cargando...</p> : galleries.length === 0 ? (
                <div className="p-10 bg-brand-surface/30 border border-white/10 rounded-xl text-center">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-white font-bold text-xl">Todo al día</h3>
                </div>
            ) : (
                <div className="grid gap-6">
                    {galleries.map((gallery) => (
                        <div key={gallery.id} className="bg-brand-surface border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black">
                                <img src={gallery.coverImage} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white">{gallery.title}</h3>
                                <p className="text-sm text-gray-400 mb-2">Por: <span className="text-white font-bold">{gallery.model?.user?.name}</span></p>
                                <div className="flex gap-2 text-xs text-gray-500">
                                    <span className="bg-black/30 px-2 py-1 rounded text-white"><Eye size={12} className="inline mr-1" /> {gallery.assets.length} Archivos</span>
                                </div>
                            </div>
                            <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-40">
                                <button onClick={() => setSelectedGallery(gallery)} className="flex-1 bg-brand-surface border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2">
                                    <Eye size={16} /> Revisar
                                </button>
                                {/* Botones conectados a openConfirm */}
                                <button onClick={() => openConfirm(gallery.id, 'APPROVE')} className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
                                    <CheckCircle size={16} /> Aprobar
                                </button>
                                <button onClick={() => openConfirm(gallery.id, 'REJECT')} className="flex-1 border border-red-500 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2">
                                    <XCircle size={16} /> Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modales */}
            {selectedGallery && <GalleryModal gallery={selectedGallery} onClose={() => setSelectedGallery(null)} allowAllAccess={true} />}

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleConfirmAction}
                title={modalConfig.title}
                message={modalConfig.message}
                isDanger={modalConfig.isDanger}
                showInput={modalConfig.showInput}
            />
        </div>
    );
}