const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes'); // <--- NUEVO

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/galleries', galleryRoutes); // <--- NUEVO

app.get('/', (req, res) => {
    res.send('Backend de Visual Pleasures funcionando correctamente 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});