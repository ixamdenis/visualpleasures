const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');

// Públicas / Generales
router.get('/', galleryController.getGalleries);

// Rutas Modelo
router.post('/', authMiddleware, galleryController.createGallery);
router.get('/mine', authMiddleware, galleryController.getMyGalleries); // <--- NUEVA

// Rutas Admin
router.get('/pending', authMiddleware, galleryController.getPendingGalleries);
router.get('/admin/all', authMiddleware, galleryController.getAllAdminGalleries);
router.put('/:id/status', authMiddleware, galleryController.updateStatus);

// Común (Eliminar propia o admin)
router.delete('/:id', authMiddleware, galleryController.deleteGallery);

module.exports = router;