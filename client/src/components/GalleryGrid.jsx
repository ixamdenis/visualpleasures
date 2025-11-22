import { useState, useEffect } from 'react';
import { Star, Lock, Image as ImageIcon, Video } from 'lucide-react';
import GalleryModal from './GalleryModal';

export default function GalleryGrid() {
    const [galleries, setGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/galleries')
            .then(res => {
                if (!res.ok) throw new Error('Error al conectar con el servidor');
                return res.json();
            })
            .then(data => {
                // Aseguramos que data sea un array
                setGalleries(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando galerías:", err);
                setError("No se pudieron cargar las galerías.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center text-white py-20">Cargando arte...</div>;
    if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

    return (
        <>
            <div className="px-4 md:px-8 py-10 max-w-[1600px] mx-auto"> {/* Aumenté el max-w para que entren 4 cómodas */}
                <h3 className="text-white font-slab text-3xl mb-8 border-l-4 border-brand-primary pl-4">
                    Explorar <span className="text-brand-primary">Galerías</span>
                </h3>

                {galleries.length === 0 ? (
                    <div className="text-center py-10 border border-white/10 rounded-xl bg-brand-surface/20">
                        <p className="text-gray-400 mb-2">Aún no hay galerías disponibles.</p>
                        <p className="text-xs text-gray-600">Sé la primera modelo en subir contenido.</p>
                    </div>
                ) : (
                    /* AQUI ESTÁ EL CAMBIO: lg:columns-4 (antes era 3) */
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        {galleries.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedGallery(item)}
                                className="relative group break-inside-avoid cursor-pointer overflow-hidden rounded-xl bg-brand-surface/50 border border-white/5 hover:border-brand-primary/50 transition-colors"
                            >

                                {/* Imagen */}
                                <div className="w-full overflow-hidden relative aspect-[3/4]">
                                    {/* Overlay oscuro */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />

                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=No+Image'; }} // Fallback
                                    />

                                    {/* Icono de Tipo (Video/Foto) */}
                                    <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm p-1.5 rounded text-white">
                                        {item.assets?.some(a => a.type === 'VIDEO') ? <Video size={14} /> : <ImageIcon size={14} />}
                                    </div>

                                    {/* Badge de Precio */}
                                    <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-brand-gold flex items-center gap-1">
                                        <Lock size={12} />
                                        ${item.price}
                                    </div>
                                </div>

                                {/* Info al hacer Hover */}
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-brand-dark via-brand-dark/90 to-transparent z-20">
                                    <h4 className="text-xl font-slab font-bold text-white truncate">{item.title}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-gray-400 font-light flex items-center gap-1">
                                            by <span className="text-brand-primary font-bold">{item.model?.user?.name || 'Modelo'}</span>
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-white font-bold flex items-center gap-1">
                                                <Star size={10} className="text-brand-gold" fill="#E0CA3C" /> {item.rating || 5}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                )}
            </div>

            {/* RENDERIZADO DEL MODAL */}
            {selectedGallery && (
                <GalleryModal
                    gallery={selectedGallery}
                    onClose={() => setSelectedGallery(null)}
                />
            )}
        </>
    );
}