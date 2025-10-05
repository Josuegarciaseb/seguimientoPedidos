const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

// ✅ REGISTRO DE USUARIO
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Debe ser un email válido.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { email, password, nombre } = req.body;

    try {
      // Verificar si el correo ya existe
      const [existing] = await pool.query('SELECT id FROM usuario WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ msg: 'Este correo ya está registrado.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO usuario (email, password_hash, nombre, rol, esta_activo) VALUES (?, ?, ?, "cliente", 1)',
        [email, hashedPassword, nombre]
      );

      res.json({ msg: 'Usuario registrado correctamente ✅' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Error del servidor. Inténtalo más tarde.' });
    }
  }
);

// ✅ LOGIN
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe ser un email válido.'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(400).json({ msg: 'No existe una cuenta con ese correo electrónico.' });
      }

      const user = rows[0];
      const validPass = await bcrypt.compare(password, user.password_hash);

      if (!validPass) {
        return res.status(400).json({ msg: 'Contraseña incorrecta. Intenta de nuevo.' });
      }

      res.json({
        msg: 'Login exitoso ✅',
        user: { id: user.id, nombre: user.nombre, rol: user.rol }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Error en el servidor.' });
    }
  }
);

module.exports = router;
