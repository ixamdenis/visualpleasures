import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- IMPORTAR
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GalleryGrid from './components/GalleryGrid';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts y Páginas del Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import CreateGallery from './pages/dashboard/CreateGallery';
import AdminPanel from './pages/dashboard/AdminPanel';
import AdminGalleries from './pages/dashboard/AdminGalleries';
import MyGalleries from './pages/dashboard/MyGalleries';

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
    <>
      {/* CONFIGURACIÓN VISUAL DE LAS NOTIFICACIONES */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1E1E24',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#E0CA3C', // Dorado
              secondary: 'black',
            },
          },
          error: {
            iconTheme: {
              primary: '#E4572E', // Rojo
              secondary: 'white',
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="crear" element={<CreateGallery />} />
          <Route path="galerias" element={<MyGalleries />} />

          <Route path="admin" element={<AdminPanel />} />
          <Route path="admin/all" element={<AdminGalleries />} />

          <Route path="compras" element={<div className="text-white">Mis compras</div>} />
        </Route>

      </Routes>
    </>
  );
}

export default App;