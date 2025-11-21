import { Heart, Lock } from 'lucide-react';

// Datos falsos para visualizar el diseño
const MOCK_GALLERIES = [
    { id: 1, title: "Neon Nights", author: "Alice V.", price: "15.00", type: "video", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop", height: "h-96" },
    { id: 2, title: "Velvet Skin", author: "Sarah J.", price: "20.00", type: "image", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop", height: "h-64" },
    { id: 3, title: "Golden Hour", author: "Elena R.", price: "12.50", type: "image", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop", height: "h-80" },
    { id: 4, title: "Noir Series", author: "Alice V.", price: "30.00", type: "set", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop", height: "h-72" },
    { id: 5, title: "Blue Mood", author: "Vicky K.", price: "18.00", type: "image", img: "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=1000&auto=format&fit=crop", height: "h-96" },
    { id: 6, title: "Abstract Body", author: "Sarah J.", price: "25.00", type: "video", img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop", height: "h-64" },
];

export default function GalleryGrid() {
    return (
        <div className="px-4 md:px-8 py-10">
            <h3 className="text-white font-slab text-3xl mb-8 border-l-4 border-brand-primary pl-4">
                Últimas <span className="text-brand-primary">Adquisiciones</span>
            </h3>

            {/* Layout estilo Masonry (Columnas) */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">

                {MOCK_GALLERIES.map((item) => (
                    <div key={item.id} className="relative group break-inside-avoid cursor-pointer overflow-hidden rounded-xl bg-brand-surface/50">

                        {/* Imagen */}
                        <div className={`w-full ${item.height} overflow-hidden relative`}>
                            {/* Overlay oscuro por defecto */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />

                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover image-hover-zoom"
                            />

                            {/* Badge de Precio (Flotante) */}
                            <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-brand-gold flex items-center gap-1">
                                <Lock size={12} />
                                ${item.price}
                            </div>
                        </div>

                        {/* Info al hacer Hover (Slide Up) */}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-brand-dark via-brand-dark/90 to-transparent translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <h4 className="text-xl font-slab font-bold text-white">{item.title}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-gray-400 font-light">by {item.author}</p>
                                <button className="text-brand-primary hover:text-white transition-colors">
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}