const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware'); // ¡Necesitamos crear esto!

// Rutas
// POST /api/galleries (Crear - Protegida)
router.post('/', authMiddleware, galleryController.createGallery);

// GET /api/galleries (Ver todas - Pública)
router.get('/', galleryController.getGalleries);

module.exports = router;