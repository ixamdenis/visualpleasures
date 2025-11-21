import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-6 pointer-events-none">
            <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/50 pointer-events-auto">

                {/* LOGO */}
                <Link to="/" className="text-2xl font-slab font-bold text-white tracking-wider">
                    VP<span className="text-brand-primary">.</span>
                </Link>

                {/* MENU CENTRO */}
                <div className="hidden md:flex space-x-8">
                    {['Inicio', 'Modelos', 'Galerías', 'Membresías'].map((item) => (
                        <Link key={item} to="/" className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors font-bold">
                            {item}
                        </Link>
                    ))}
                </div>

                {/* ICONOS DERECHA */}
                <div className="flex items-center gap-5 text-white/80">
                    <Search size={18} className="cursor-pointer hover:text-brand-primary transition-colors" />

                    {user && (
                        <div className="relative cursor-pointer hover:text-brand-primary transition-colors">
                            <ShoppingBag size={18} />
                            <span className="absolute -top-2 -right-2 bg-brand-primary text-[10px] text-black font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </div>
                    )}

                    {user ? (
                        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-white/10">
                            {/* NUEVO: Botón al Dashboard */}
                            <Link to="/dashboard" className="flex items-center gap-2 bg-white/10 hover:bg-brand-primary hover:text-black text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider group">
                                <LayoutDashboard size={14} />
                                <span>Panel</span>
                            </Link>

                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Hola</p>
                                <p className="text-xs font-bold text-brand-gold">{user.name}</p>
                            </div>
                            <button onClick={logout} className="text-gray-400 hover:text-brand-alert transition-colors" title="Cerrar Sesión">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden md:block pl-4 border-l border-white/10">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-brand-gold transition-colors">
                                <User size={16} />
                                <span>Login</span>
                            </div>
                        </Link>
                    )}

                    {/* Botón Móvil */}
                    <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* MOVIL MENU */}
            {isOpen && (
                <div className="absolute top-24 left-6 right-6 bg-[#1a1a20] border border-white/10 rounded-xl p-4 md:hidden pointer-events-auto">
                    <div className="flex flex-col space-y-4 text-center">
                        <Link to="/" className="text-gray-300 py-2">Inicio</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-white bg-brand-surface py-2 rounded font-bold">Ir a mi Panel</Link>
                                <button onClick={logout} className="text-brand-alert py-2 font-bold">Cerrar Sesión</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-brand-gold py-2 font-bold">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}