const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Función para registrarse
exports.register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // 1. Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        // 2. Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Crear el usuario en la base de datos
        // Nota: Por seguridad, si alguien intenta registrarse como ADMIN directo, lo forzamos a MEMBER
        // Luego tú manualmente cambiarás los roles en la base de datos.
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'MEMBER', // Por defecto todos son miembros
            },
        });

        // 4. Crear el token (el pase digital)
        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ message: 'Usuario creado', token, user: { id: newUser.id, email: newUser.email, role: newUser.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al registrarse' });
    }
};

// Función para iniciar sesión (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar al usuario
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 2. Comparar contraseñas
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Generar Token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ message: 'Login exitoso', token, user: { id: user.id, name: user.name, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};