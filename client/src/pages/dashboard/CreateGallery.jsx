import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Image, Video, DollarSign, Type, Link as LinkIcon, Plus, Trash2, Eye, AlertCircle } from 'lucide-react';

export default function CreateGallery() {
    const { token, user } = useAuth(); // Traemos user para verificar rol visualmente
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Datos básicos de la galería
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        coverImage: ''
    });

    // Lista dinámica de archivos
    // Iniciamos con un slot vacío
    const [assets, setAssets] = useState([
        { url: '', type: 'IMAGE', isPreview: false }
    ]);

    // --- LÓGICA DE ACTIVOS ---

    // Agregar nueva fila
    const addAssetRow = () => {
        setAssets([...assets, { url: '', type: 'IMAGE', isPreview: false }]);
    };

    // Eliminar fila
    const removeAssetRow = (index) => {
        const newAssets = assets.filter((_, i) => i !== index);
        setAssets(newAssets);
    };

    // Actualizar datos de una fila
    const updateAsset = (index, field, value) => {
        const newAssets = [...assets];

        // Lógica especial para el checkbox de "Preview"
        if (field === 'isPreview') {
            const currentPreviews = newAssets.filter(a => a.isPreview).length;
            // Si intentamos activar uno nuevo y ya hay 4, bloqueamos
            if (value === true && currentPreviews >= 4) {
                alert("Máximo 4 archivos gratuitos permitidos.");
                return;
            }
        }

        newAssets[index][field] = value;
        setAssets(newAssets);
    };

    // --- ENVÍO DEL FORMULARIO ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validación básica
        if (assets.length === 0 || !assets[0].url) {
            alert("Debes agregar al menos un archivo a la galería.");
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            assets: assets // Enviamos la lista completa
        };

        try {
            const response = await fetch('http://localhost:3001/api/galleries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Galería enviada a revisión! Un administrador la aprobará pronto.');
                navigate('/dashboard');
            } else {
                alert(data.error || 'Error al crear galería');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // Si entra un Admin por error a esta URL, le mostramos aviso (aunque el backend lo frenaría igual)
    if (user.role !== 'MODEL') {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="mx-auto text-brand-alert mb-4" size={48} />
                <h2 className="text-2xl font-bold text-white">Acceso Restringido</h2>
                <p className="text-gray-400">Solo las cuentas de MODELO pueden subir contenido.</p>
                <button onClick={() => navigate('/dashboard')} className="mt-4 text-brand-primary underline">Volver al panel</button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-slab text-white">Nueva Colección</h1>
                <p className="text-gray-400 text-sm">Sube tu contenido, configura el precio y selecciona las muestras gratis.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* SECCIÓN 1: DATOS GENERALES */}
                <div className="bg-brand-surface/50 p-6 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-brand-gold font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2 mb-4">Información Pública</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Título</label>
                            <input
                                type="text" required placeholder="Ej: Red Velvet"
                                className="w-full bg-brand-dark border border-white/10 rounded p-3 text-white focus:border-brand-primary outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Precio (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-brand-gold" size={16} />
                                <input
                                    type="number" step="0.01" required placeholder="25.00"
                                    className="w-full bg-brand-dark border border-white/10 rounded p-3 pl-9 text-white focus:border-brand-primary outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Descripción</label>
                        <textarea
                            rows="3" required placeholder="Describe qué hace especial a esta galería..."
                            className="w-full bg-brand-dark border border-white/10 rounded p-3 text-white focus:border-brand-primary outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Imagen de Portada (URL)</label>
                        <div className="flex gap-4">
                            <input
                                type="url" required placeholder="https://..."
                                className="flex-1 bg-brand-dark border border-white/10 rounded p-3 text-white focus:border-brand-primary outline-none"
                                value={formData.coverImage}
                                onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                            />
                            {formData.coverImage && (
                                <div className="w-12 h-12 rounded overflow-hidden border border-white/20">
                                    <img src={formData.coverImage} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: GESTOR DE ARCHIVOS */}
                <div className="bg-brand-surface/50 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-6">
                        <h3 className="text-brand-gold font-bold uppercase tracking-widest text-xs">Contenido de la Galería</h3>
                        <span className="text-[10px] text-gray-400">
                            Vistas previas seleccionadas: <span className="text-white font-bold">{assets.filter(a => a.isPreview).length}/4</span>
                        </span>
                    </div>

                    <div className="space-y-3">
                        {assets.map((asset, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-brand-dark/50 p-3 rounded-lg border border-white/5 hover:border-brand-primary/30 transition-colors">

                                {/* Número */}
                                <span className="text-gray-600 font-mono text-xs w-6">#{index + 1}</span>

                                {/* Tipo Selector */}
                                <select
                                    className="bg-black border border-white/10 rounded px-2 py-2 text-xs text-white focus:outline-none cursor-pointer"
                                    value={asset.type}
                                    onChange={(e) => updateAsset(index, 'type', e.target.value)}
                                >
                                    <option value="IMAGE">Imagen</option>
                                    <option value="VIDEO">Video</option>
                                </select>

                                {/* Input URL */}
                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        placeholder="Pegar URL del archivo..."
                                        className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                                        value={asset.url}
                                        onChange={(e) => updateAsset(index, 'url', e.target.value)}
                                    />
                                </div>

                                {/* Checkbox Preview */}
                                <label className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-all select-none border ${asset.isPreview ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:bg-white/5'}`}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={asset.isPreview}
                                        onChange={(e) => updateAsset(index, 'isPreview', e.target.checked)}
                                    />
                                    <Eye size={14} />
                                    <span className="text-xs font-bold">Gratis</span>
                                </label>

                                {/* Botón Eliminar */}
                                <button
                                    onClick={() => removeAssetRow(index)}
                                    className="text-gray-600 hover:text-brand-alert transition-colors p-1"
                                    title="Eliminar fila"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Botón Agregar Fila */}
                    <button
                        type="button"
                        onClick={addAssetRow}
                        className="mt-6 w-full py-3 border border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide"
                    >
                        <Plus size={18} />
                        Agregar otro archivo
                    </button>
                </div>

                {/* BOTÓN FINAL */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-primary text-black font-bold py-4 px-12 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(255,155,133,0.3)]"
                    >
                        {loading ? 'Enviando...' : 'Enviar para Aprobación'}
                    </button>
                </div>

            </form>
        </div>
    );
}