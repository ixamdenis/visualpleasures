import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, Plus, Trash2, Eye, UploadCloud, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import toast from 'react-hot-toast'; // <--- IMPORTANTE: Notificaciones bonitas

export default function CreateGallery() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        coverImage: ''
    });

    const [assets, setAssets] = useState([]);

    // --- SUBIDA MASIVA DE ARCHIVOS ---
    const handleBatchUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingFiles(true);
        const loadingToast = toast.loading('Subiendo archivos...');

        const uploadPromises = files.map(async (file) => {
            const uploadData = new FormData();
            uploadData.append('file', file);

            try {
                const res = await fetch('http://localhost:3001/api/upload', {
                    method: 'POST',
                    body: uploadData
                });
                if (res.ok) {
                    const data = await res.json();
                    return { url: data.url, type: data.type, isPreview: false };
                }
            } catch (error) {
                console.error("Error subiendo archivo:", file.name);
                toast.error(`Error al subir ${file.name}`);
            }
            return null;
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter(r => r !== null);

        setAssets(prev => [...prev, ...successfulUploads]);
        setUploadingFiles(false);
        toast.dismiss(loadingToast);
        toast.success(`${successfulUploads.length} archivos agregados`);
    };

    // --- SUBIDA DE PORTADA ---
    const handleCoverUpload = async (file) => {
        const uploadToast = toast.loading('Subiendo portada...');
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: uploadData });
            const data = await res.json();

            if (res.ok) {
                setFormData(prev => ({ ...prev, coverImage: data.url }));
                toast.success('Portada actualizada');
            } else {
                toast.error('Error al subir portada');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            toast.dismiss(uploadToast);
        }
    };

    // --- GESTIÓN DE PREVIEWS ---
    const togglePreview = (index) => {
        const newAssets = [...assets];
        const currentPreviews = newAssets.filter(a => a.isPreview).length;

        // Si intenta activar uno nuevo y ya hay 4
        if (!newAssets[index].isPreview && currentPreviews >= 4) {
            toast.error("Máximo 4 archivos gratuitos permitidos.", {
                icon: '🚫',
                style: {
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }
        newAssets[index].isPreview = !newAssets[index].isPreview;
        setAssets(newAssets);
    };

    const removeAsset = (index) => {
        setAssets(assets.filter((_, i) => i !== index));
        toast('Archivo eliminado', { icon: '🗑️' });
    };

    // --- ENVÍO DEL FORMULARIO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validaciones
        if (!formData.coverImage) {
            toast.error("Debes subir una imagen de portada");
            setLoading(false);
            return;
        }
        if (assets.length === 0) {
            toast.error("La galería debe tener al menos un archivo");
            setLoading(false);
            return;
        }

        const payload = { ...formData, assets };

        try {
            const response = await fetch('http://localhost:3001/api/galleries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('¡Galería enviada a revisión!', { duration: 4000 });
                navigate('/dashboard/galerias');
            } else {
                const errData = await response.json();
                toast.error(errData.error || 'Error al crear galería');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'MODEL') return <div className="text-white p-10">Acceso Restringido</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-slab text-white mb-8">Nueva Colección</h1>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* SECCIÓN 1: DATOS GENERALES */}
                <div className="bg-brand-surface/50 p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Título</label>
                            <input type="text" required className="w-full bg-brand-dark border border-white/10 rounded p-3 text-white outline-none focus:border-brand-primary"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Precio (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-brand-gold" size={16} />
                                <input type="number" step="0.01" required className="w-full bg-brand-dark border border-white/10 rounded p-3 pl-9 text-white outline-none focus:border-brand-primary"
                                    value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Descripción</label>
                            <textarea rows="3" required className="w-full bg-brand-dark border border-white/10 rounded p-3 text-white outline-none focus:border-brand-primary"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>

                    {/* PORTADA */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Portada</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl bg-black/20 relative overflow-hidden group hover:border-brand-primary/50 transition-colors flex items-center justify-center h-64">
                            {formData.coverImage ? (
                                <>
                                    <img src={formData.coverImage} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-bold text-sm">Click para cambiar</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center"><UploadCloud className="mx-auto text-gray-500 mb-2" /><p className="text-gray-400 text-xs">Subir Portada</p></div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: GESTOR MASIVO */}
                <div className="bg-brand-surface/50 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-brand-gold font-bold uppercase text-xs">Archivos ({assets.length})</h3>
                        <span className="text-[10px] text-gray-400">Gratis: <span className="text-white font-bold">{assets.filter(a => a.isPreview).length}/4</span></span>
                    </div>

                    {/* Botón de Subida Múltiple */}
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-brand-primary hover:text-brand-primary transition-colors relative mb-6">
                        {uploadingFiles ? (
                            <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Subiendo archivos...</span>
                        ) : (
                            <>
                                <Plus className="mx-auto mb-2" />
                                <p className="font-bold text-sm">CLICK PARA AGREGAR FOTOS O VIDEOS</p>
                                <p className="text-xs opacity-70">Selección múltiple habilitada</p>
                            </>
                        )}
                        <input type="file" multiple accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleBatchUpload} disabled={uploadingFiles} />
                    </div>

                    {/* Lista de Archivos Cargados */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {assets.map((asset, index) => (
                            <div key={index} className="relative group aspect-square bg-black rounded-lg overflow-hidden border border-white/10">
                                {asset.type === 'IMAGE' ? (
                                    <img src={asset.url} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={asset.url} className="w-full h-full object-cover" />
                                )}

                                {/* Overlay Acciones */}
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* BOTONES TIPO BUTTON PARA NO ENVIAR FORM */}
                                    <button
                                        type="button"
                                        onClick={() => togglePreview(index)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${asset.isPreview ? 'bg-brand-primary text-black' : 'bg-white/20 text-white'}`}
                                    >
                                        <Eye size={12} /> {asset.isPreview ? 'GRATIS' : 'PAGO'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => removeAsset(index)}
                                        className="text-brand-alert bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Indicador Visual si es Gratis */}
                                {asset.isPreview && (
                                    <div className="absolute top-2 right-2 bg-brand-primary text-black text-[10px] font-bold px-2 py-0.5 rounded z-10">GRATIS</div>
                                )}
                                <div className="absolute bottom-2 left-2 text-white text-[10px] bg-black/50 px-1 rounded">{asset.type}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-brand-primary text-black font-bold py-4 px-12 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(255,155,133,0.3)]">
                        {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Procesando...</span> : 'Enviar para Aprobación'}
                    </button>
                </div>
            </form>
        </div>
    );
}