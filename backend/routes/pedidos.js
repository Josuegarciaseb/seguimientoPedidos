// backend/routes/pedidos.js
const express = require('express');
const pool = require('../db'); // usamos tu pool del reto 3
const router = express.Router();

/**
 * GET /api/pedidos
 * Lee todos los pedidos (con el nombre del cliente)
 */
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         p.id,
         p.titulo,
         p.descripcion,
         p.estado_actual,
         p.fecha_promesa,
         p.creado_en,
         u.nombre AS cliente
       FROM pedido p
       JOIN usuario u ON u.id = p.usuario_id
       ORDER BY p.creado_en DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error obteniendo pedidos' });
  }
});

/**
 * (Opcional) GET /api/pedidos/:id
 * Lee un pedido por id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT 
         p.id,
         p.titulo,
         p.descripcion,
         p.estado_actual,
         p.fecha_promesa,
         p.creado_en,
         u.nombre AS cliente
       FROM pedido p
       JOIN usuario u ON u.id = p.usuario_id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Pedido no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error obteniendo pedido' });
  }
});

module.exports = router;
