import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GalleryGrid from './components/GalleryGrid';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateGallery from './pages/dashboard/CreateGallery';

// Layouts y Páginas del Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';

function HomePage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-black">
      <Navbar />
      <Hero />
      <GalleryGrid />
      <div className="h-24"></div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Privadas (El Dashboard) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        {/* Sub-rutas del dashboard */}
        <Route index element={<DashboardHome />} />

        {/* Aquí agregaremos pronto: */}
        <Route path="crear" element={<CreateGallery />} />
        <Route path="galerias" element={<div className="text-white">Lista de mis galerías</div>} />
        <Route path="compras" element={<div className="text-white">Mis compras</div>} />
      </Route>

    </Routes>
  );
}

export default App;