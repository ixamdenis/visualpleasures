import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isDanger = false, showInput = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            {/* Fondo oscuro */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md bg-[#1a1a20] border border-white/10 rounded-xl p-6 shadow-2xl"
            >
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${isDanger ? 'bg-red-500/20 text-red-500' : 'bg-brand-gold/20 text-brand-gold'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{message}</p>

                        {/* Input opcional para Feedback */}
                        {showInput && (
                            <textarea
                                id="confirm-input"
                                rows="3"
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-brand-primary outline-none mb-4"
                                placeholder="Escribe el motivo aquí..."
                            />
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    const inputVal = showInput ? document.getElementById('confirm-input').value : null;
                                    onConfirm(inputVal);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors
                            ${isDanger ? 'bg-red-600 hover:bg-red-500' : 'bg-brand-primary hover:bg-white text-black'}
                        `}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}