import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Image,
    UploadCloud,
    ShieldCheck,
    LogOut,
    ShoppingBag
} from 'lucide-react';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    // --- CONFIGURACIÓN DEL MENÚ SEGÚN ROL ---

    // 1. Menú Base (Todos lo ven)
    const menuItems = [
        { icon: LayoutDashboard, label: 'Resumen', path: '/dashboard' },
        { icon: ShoppingBag, label: 'Mis Compras', path: '/dashboard/compras' },
    ];

    // 2. Si es MODELO: Agregamos herramientas de creación
    if (user?.role === 'MODEL') {
        // Insertamos estas opciones después de "Resumen" (índice 1)
        menuItems.splice(1, 0,
            { icon: Image, label: 'Mis Galerías', path: '/dashboard/galerias' },
            { icon: UploadCloud, label: 'Subir Contenido', path: '/dashboard/crear' }
        );
    }

    // 3. Si es ADMIN: Agregamos herramientas de moderación
    if (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
        menuItems.push(
            { icon: ShieldCheck, label: 'Moderación', path: '/dashboard/admin' },
            { icon: LayoutDashboard, label: 'Gestión Global', path: '/dashboard/admin/all' } // <--- NUEVO
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark flex">

            {/* SIDEBAR IZQUIERDO (Fijo en Desktop) */}
            <aside className="w-64 border-r border-white/10 bg-brand-surface/50 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">

                {/* Header del Sidebar */}
                <div className="p-8">
                    <Link to="/" className="text-2xl font-slab font-bold text-white">
                        VP<span className="text-brand-primary">.</span> <span className="text-xs text-gray-500 ml-2 uppercase tracking-wider">Panel</span>
                    </Link>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
                            ${isActive
                                        ? 'bg-brand-primary text-black font-bold shadow-[0_0_15px_rgba(255,155,133,0.4)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                        `}
                            >
                                <item.icon size={20} className={isActive ? 'text-black' : 'text-gray-400 group-hover:text-brand-primary transition-colors'} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer del Sidebar (Perfil) */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-orange-600 flex items-center justify-center text-black font-bold shadow-lg">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm text-white font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider bg-brand-primary/10 px-1 rounded w-fit mt-0.5">
                                {user?.role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-brand-alert hover:bg-brand-alert/10 rounded-lg w-full transition-all text-sm font-bold"
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
                {/* Fondo decorativo sutil para el área de trabajo */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-primary/5 to-transparent -z-10 pointer-events-none"></div>

                {/* Renderiza aquí la sub-página seleccionada */}
                <Outlet />
            </main>
        </div>
    );
}