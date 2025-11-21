import { useAuth } from '../../context/AuthContext';

export default function DashboardHome() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-slab text-white mb-2">Hola, <span className="text-brand-primary">{user?.name}</span></h1>
            <p className="text-gray-400 mb-8">Bienvenido a tu panel de control personal.</p>

            {/* Stats Cards (Ejemplo visual) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-surface border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2">Membresía</h3>
                    <p className="text-2xl text-brand-gold font-bold">{user?.role}</p>
                </div>

                <div className="bg-brand-surface border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2">Galerías Adquiridas</h3>
                    <p className="text-2xl text-white font-bold">0</p>
                </div>

                <div className="bg-brand-surface border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2">Mensajes</h3>
                    <p className="text-2xl text-white font-bold">0</p>
                </div>
            </div>
        </div>
    );
}