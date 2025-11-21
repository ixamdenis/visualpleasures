import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

// Datos de las diapositivas
const SLIDES = [
    {
        id: 1,
        title: "Neon Dreams",
        model: "Katarina B.",
        desc: "Luces de neón y sombras profundas.",
        img: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1920&auto=format&fit=crop",
        rating: "4.9"
    },
    {
        id: 2,
        title: "Golden Hour",
        model: "Ana Helins",
        desc: "Desnudo artístico en exteriores.",
        img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1920&auto=format&fit=crop",
        rating: "5.0"
    },
    {
        id: 3,
        title: "Velvet Noir",
        model: "Sarah J.",
        desc: "Elegancia en blanco y negro.",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1920&auto=format&fit=crop",
        rating: "4.8"
    }
];

export default function Hero() {
    const [activeId, setActiveId] = useState(1);

    return (
        <section className="relative pt-32 pb-12 px-6 min-h-screen flex items-center overflow-hidden bg-brand-dark">

            {/* ELEMENTOS DE FONDO (Glows) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">

                {/* --- COLUMNA IZQUIERDA (TEXTO - 1/3) --- */}
                <div className="col-span-12 lg:col-span-4 flex flex-col justify-center z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[2px] w-10 bg-brand-gold"></div>
                            <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold">
                                Colección Mensual
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-slab font-bold text-white leading-[1] mb-6">
                            Visual <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-soft italic">
                                Pleasures.
                            </span>
                        </h1>

                        <p className="text-gray-400 text-lg font-light mb-8 leading-relaxed">
                            Una plataforma curada para el erotismo artístico.
                            Conecta directamente con musas y colecciona contenido exclusivo.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="group bg-white text-black px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-brand-primary transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                Explorar
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link to="/login" className="px-8 py-3 rounded-full border border-white/20 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/5 transition-all hover:border-brand-primary/50">
                                Crear Cuenta
                            </Link>
                        </div>

                        {/* Stats pequeñas */}
                        <div className="mt-12 flex gap-8 border-t border-white/10 pt-6">
                            <div>
                                <p className="text-2xl font-bold text-white">2.5k+</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Galerías</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">150+</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Modelos</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- COLUMNA DERECHA (ACORDEÓN - 2/3) --- */}
                <div className="col-span-12 lg:col-span-8 h-[500px] md:h-[600px] flex gap-3 md:gap-4">
                    {SLIDES.map((slide) => {
                        const isActive = activeId === slide.id;
                        return (
                            <motion.div
                                key={slide.id}
                                layout
                                onClick={() => setActiveId(slide.id)}
                                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out shadow-2xl border border-white/10
                            ${isActive ? 'flex-[4]' : 'flex-[1]'} 
                            h-full group
                        `}
                            >
                                {/* IMAGEN */}
                                <img
                                    src={slide.img}
                                    alt={slide.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* GRADIENTE */}
                                <div className={`absolute inset-0 transition-colors duration-300 
                            ${isActive ? 'bg-gradient-to-t from-brand-dark via-transparent to-transparent' : 'bg-black/60 group-hover:bg-black/40'}`}
                                />

                                {/* CONTENIDO TEXTO DENTRO DEL SLIDE */}
                                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">

                                    {/* Si está activo: Mostramos detalles */}
                                    {isActive ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center text-brand-gold text-xs gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                                                    <Star size={10} fill="#E0CA3C" />
                                                    <span>{slide.rating}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-slab font-bold text-white mb-1 leading-none">
                                                {slide.title}
                                            </h3>
                                            <p className="text-brand-primary text-sm font-bold mb-2">{slide.model}</p>
                                            <p className="text-gray-300 text-xs md:text-sm max-w-xs line-clamp-2">
                                                {slide.desc}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        /* Si NO está activo: Texto vertical */
                                        <div className="hidden md:flex absolute inset-0 items-center justify-center">
                                            <h3 className="text-white font-bold text-xl tracking-[0.2em] uppercase -rotate-90 whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity group-hover:text-brand-primary">
                                                {slide.title}
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}