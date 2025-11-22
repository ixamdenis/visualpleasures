const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// CONFIGURACIÓN DE ALMACENAMIENTO
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aseguramos que la carpeta exista
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // SEGURIDAD: Generamos un nombre único (Timestamp + Random) + Extensión original
        // Ej: 176376588-48392.jpg (Imposible de adivinar)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// FILTRO DE ARCHIVOS (Solo aceptamos imágenes y videos)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no soportado'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// RUTA POST: /api/upload
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        // Devolvemos la URL completa para que el frontend la pueda usar
        // Nota: req.protocol + '://' + req.get('host') construye "http://localhost:3001"
        const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({ url: fullUrl, type: req.file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE' });

    } catch (error) {
        res.status(500).json({ error: 'Error al subir archivo' });
    }
});

module.exports = router;