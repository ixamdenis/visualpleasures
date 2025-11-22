const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- CREAR (Solo Modelos) ---
exports.createGallery = async (req, res) => {
    try {
        const { title, description, price, coverImage, assets } = req.body;
        const { userId, role } = req.user;

        if (role !== 'MODEL') return res.status(403).json({ error: 'Acceso denegado' });

        let modelProfile = await prisma.modelProfile.findUnique({ where: { userId } });
        if (!modelProfile) {
            modelProfile = await prisma.modelProfile.create({ data: { userId, bio: 'Nueva artista' } });
        }

        const newGallery = await prisma.gallery.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                coverImage,
                modelId: modelProfile.id,
                status: 'PENDING',
                assets: {
                    create: assets.map(asset => ({
                        url: asset.url,
                        type: asset.type,
                        isPreview: asset.isPreview
                    }))
                }
            }
        });
        res.status(201).json(newGallery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear galería' });
    }
};

// --- OBTENER PÚBLICAS (Solo PUBLISHED) ---
exports.getGalleries = async (req, res) => {
    try {
        const galleries = await prisma.gallery.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                model: { include: { user: { select: { name: true } } } },
                assets: true
            }
        });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener galerías' });
    }
};

// --- NUEVO: OBTENER MIS GALERÍAS (Panel Modelo) ---
exports.getMyGalleries = async (req, res) => {
    try {
        const { userId } = req.user;

        // 1. Buscar el perfil de modelo de este usuario
        const modelProfile = await prisma.modelProfile.findUnique({ where: { userId } });

        if (!modelProfile) return res.json([]); // Si no tiene perfil, no tiene galerías

        // 2. Buscar todas las galerías asociadas a este perfil
        const galleries = await prisma.gallery.findMany({
            where: { modelId: modelProfile.id },
            orderBy: { createdAt: 'desc' },
            include: { assets: true }
        });

        res.json(galleries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar mis galerías' });
    }
};

// --- ADMIN: PENDIENTES ---
exports.getPendingGalleries = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERADMIN') return res.status(403).json({ error: 'No autorizado' });

        const galleries = await prisma.gallery.findMany({
            where: { status: 'PENDING' },
            include: {
                model: { include: { user: { select: { name: true } } } },
                assets: true
            }
        });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar pendientes' });
    }
};

// --- ADMIN: TODAS ---
exports.getAllAdminGalleries = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERADMIN') return res.status(403).json({ error: 'No autorizado' });

        const galleries = await prisma.gallery.findMany({
            include: {
                model: { include: { user: { select: { name: true } } } },
                assets: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar listado' });
    }
};

// --- ADMIN: CAMBIAR ESTADO ---
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body;
        const { role } = req.user;

        if (role !== 'ADMIN' && role !== 'SUPERADMIN') return res.status(403).json({ error: 'No autorizado' });

        const updated = await prisma.gallery.update({
            where: { id: parseInt(id) },
            data: { status, adminFeedback: feedback || null }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// --- ELIMINAR GALERÍA (Modificado para que la Modelo también pueda) ---
exports.deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, userId } = req.user;

        const gallery = await prisma.gallery.findUnique({
            where: { id: parseInt(id) },
            include: { model: true }
        });

        if (!gallery) return res.status(404).json({ error: 'Galería no encontrada' });

        // Verificación de permiso: 
        // ¿Es Admin? O ¿Es la dueña de la galería?
        const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';
        const isOwner = gallery.model.userId === userId;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar esto' });
        }

        await prisma.asset.deleteMany({ where: { galleryId: parseInt(id) } });
        await prisma.gallery.delete({ where: { id: parseInt(id) } });

        res.json({ message: 'Galería eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar galería' });
    }
};