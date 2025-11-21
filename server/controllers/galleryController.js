const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createGallery = async (req, res) => {
    try {
        const { title, description, price, coverImage, assets } = req.body;
        const { userId, role } = req.user;

        // 1. RESTRICCIÓN DE ROL: Solo Modelos pueden subir contenido
        if (role !== 'MODEL') {
            return res.status(403).json({ error: 'Solo las modelos pueden subir contenido.' });
        }

        // 2. Verificar perfil de modelo
        let modelProfile = await prisma.modelProfile.findUnique({
            where: { userId: userId }
        });

        if (!modelProfile) {
            // Si es la primera vez, creamos el perfil automáticamente
            modelProfile = await prisma.modelProfile.create({
                data: { userId: userId, bio: 'Nueva artista' }
            });
        }

        // 3. Crear la galería CON sus archivos (Nested Write)
        // Nota: isPublished por defecto es false (definido en el Schema), 
        // así que nace oculta hasta que un Admin la apruebe.
        const newGallery = await prisma.gallery.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                coverImage,
                modelId: modelProfile.id,
                isPublished: false, // <--- IMPORTANTE: Requiere aprobación
                assets: {
                    create: assets.map(asset => ({
                        url: asset.url,
                        type: asset.type,      // "IMAGE" o "VIDEO"
                        isPreview: asset.isPreview // Boolean
                    }))
                }
            }
        });

        res.status(201).json(newGallery);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la galería' });
    }
};

exports.getGalleries = async (req, res) => {
    try {
        // Aquí mostraremos solo las publicadas, O si eres Admin, todas.
        // Por ahora, dejamos la vista pública estándar.
        const galleries = await prisma.gallery.findMany({
            where: { isPublished: true },
            include: { model: true }
        });
        res.json(galleries);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener galerías' });
    }
};