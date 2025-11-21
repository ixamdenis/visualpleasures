import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, token } = useAuth();
    const location = useLocation();

    // 1. Si no hay token ni usuario, mandar al Login
    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Si se requieren roles específicos y el usuario no lo tiene
    // (Ejemplo: Si la ruta es solo para MODEL y el usuario es MEMBER)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // 3. Si pasa los controles, mostrar el contenido
    return children;
}