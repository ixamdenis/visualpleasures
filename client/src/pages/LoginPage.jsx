import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
            {/* Fondo decorativo */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px]" />
            </div>

            {/* Tarjeta de Login */}
            <div className="w-full max-w-md bg-brand-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">

                <div className="text-center mb-8">
                    <h2 className="font-slab text-3xl text-white mb-2">Bienvenido</h2>
                    <p className="text-gray-400 text-sm">Ingresa a tu cuenta para ver contenido exclusivo.</p>
                </div>

                {error && (
                    <div className="bg-brand-alert/20 border border-brand-alert/50 text-brand-alert text-sm p-3 rounded mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-brand-dark/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                placeholder="usuario@ejemplo.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-brand-dark/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        Ingresar
                        <ArrowRight size={18} />
                    </button>

                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        ¿No tienes cuenta? <a href="#" className="text-brand-gold hover:underline">Regístrate gratis</a>
                    </p>
                </div>

            </div>
        </div>
    );
}