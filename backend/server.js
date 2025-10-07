// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // ✅ Usamos el pool compartido del archivo db.js

const app = express();
app.use(cors());
app.use(express.json());

// ============================
// IMPORTAR Y REGISTRAR RUTAS
// ============================

// Auth
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Rutas de autenticación cargadas');
} catch (err) {
  console.error('❌ Error cargando rutas de autenticación:', err.message);
}

// Pedidos
try {
  const pedidosRoutes = require('./routes/pedidos');
  app.use('/api/pedidos', pedidosRoutes);
  console.log('✅ Rutas de pedidos cargadas');
} catch (err) {
  console.error('❌ Error cargando rutas de pedidos:', err.message);
}

// ============================
// ENDPOINT DE PRUEBA DB
// ============================
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ api: 'ok', db: rows[0].ok === 1 ? 'ok' : 'fail' });
  } catch (err) {
    res.status(500).json({ api: 'ok', db: 'fail', error: err.message });
  }
});

// ============================
// ENDPOINT RAÍZ
// ============================
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando 🚀');
});

// ============================
// INICIO DEL SERVIDOR
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
