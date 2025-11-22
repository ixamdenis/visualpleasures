const express = require('express');
const cors = require('cors');
const path = require('path'); // NUEVO
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // NUEVO

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- SERVIR IMÁGENES ESTÁTICAS ---
// Esto permite que http://localhost:3001/uploads/foto.jpg muestre la imagen
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/upload', uploadRoutes); // NUEVO

app.get('/', (req, res) => {
    res.send('Backend de Visual Pleasures funcionando correctamente 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});