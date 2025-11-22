import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, User, Star, ChevronLeft, ChevronRight, PlayCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Agregamos la prop 'allowAllAccess' (por defecto false)
export default function GalleryModal({ gallery, onClose, allowAllAccess = false }) {
    if (!gallery) return null;

    // LÓGICA DE FILTRADO:
    // Si es Admin (allowAllAccess), mostramos TODO.
    // Si es usuario normal, solo mostramos lo que tiene isPreview = true.
    const visibleAssets = allowAllAccess
        ? gallery.assets
        : gallery.assets?.filter(a => a.isPreview);

    // Si no hay assets disponibles, usamos la portada como fallback
    const slides = visibleAssets?.length > 0
        ? visibleAssets
        : [{ url: gallery.coverImage, type: 'IMAGE' }];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Funciones para pasar fotos
    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

    const currentAsset = slides[currentIndex];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

            {/* Fondo Oscuro con Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Tarjeta del Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-5xl bg-[#1a1a20] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
            >

                {/* Botón Cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-brand-alert transition-colors"
                >
                    <X size={20} />
                </button>

                {/* --- COLUMNA IZQUIERDA: VISOR MEDIA --- */}
                <div className="w-full md:w-2/3 bg-black relative flex items-center justify-center">

                    {/* Aviso si estamos en modo Admin */}
                    {allowAllAccess && (
                        <div className="absolute top-4 left-4 z-20 bg-brand-primary text-black px-3 py-1 rounded font-bold text-xs flex items-center gap-2 uppercase tracking-wider shadow-lg">
                            <ShieldCheck size={14} /> Vista de Moderador (Todo visible)
                        </div>
                    )}

                    {/* Visor */}
                    <div className="relative w-full h-[40vh] md:h-[70vh] flex items-center justify-center bg-[#111]">
                        {currentAsset?.type === 'VIDEO' ? (
                            <video
                                src={currentAsset.url}
                                controls
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <img
                                src={currentAsset?.url || gallery.coverImage}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    {/* Flechas de navegación */}
                    {slides.length > 1 && (
                        <>
                            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-brand-primary hover:text-black transition-colors z-20">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-brand-primary hover:text-black transition-colors z-20">
                                <ChevronRight size={24} />
                            </button>

                            {/* Indicador */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-brand-primary w-4' : 'bg-white/30'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* --- COLUMNA DERECHA: INFO --- */}
                <div className="w-full md:w-1/3 p-8 bg-[#1E1E24] flex flex-col overflow-y-auto">

                    {/* Header Info */}
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                                {allowAllAccess ? 'Revisión' : 'Colección'}
                            </span>
                            <div className="flex items-center gap-1 text-brand-gold text-sm font-bold">
                                <Star size={14} fill="#E0CA3C" />
                                <span>{gallery.rating || 'New'}</span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-slab font-bold text-white mb-2 leading-tight">
                            {gallery.title}
                        </h2>

                        <div className="flex items-center gap-2 border-b border-white/10 pb-6">
                            <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                                <div className="w-full h-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                                    {gallery.model?.user?.name?.[0]}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Creado por</p>
                                <p className="text-sm font-bold text-white">{gallery.model?.user?.name || 'Modelo'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="flex-1 mb-6">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {gallery.description}
                        </p>
                        <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 border-t border-white/5 pt-4">
                            <div className="flex justify-between">
                                <span>Total Archivos:</span>
                                <span className="text-white">{gallery.assets?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Videos:</span>
                                <span className="text-white">{gallery.assets?.filter(a => a.type === 'VIDEO').length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Fotos:</span>
                                <span className="text-white">{gallery.assets?.filter(a => a.type === 'IMAGE').length || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto space-y-3">
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-bold text-white">${gallery.price}</span>
                            <span className="text-gray-500 text-sm mb-1">USD</span>
                        </div>

                        {!allowAllAccess && (
                            <button className="w-full bg-brand-primary text-black font-bold py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,155,133,0.2)]">
                                <ShoppingCart size={18} />
                                Agregar al Carrito
                            </button>
                        )}

                        {allowAllAccess ? (
                            <button
                                onClick={onClose}
                                className="w-full border border-white/20 text-white font-bold py-3 rounded-lg hover:bg-white/5 transition-all"
                            >
                                Cerrar Revisión
                            </button>
                        ) : (
                            <Link to={`/profile/${gallery.modelId}`} className="block w-full">
                                <button className="w-full border border-white/20 text-white font-bold py-3 rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                    <User size={18} />
                                    Ver Perfil de Modelo
                                </button>
                            </Link>
                        )}
                    </div>

                </div>

            </motion.div>
        </div>
    );
}