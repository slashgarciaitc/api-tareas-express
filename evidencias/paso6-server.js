import express from 'express';

const app = express();

// Ruta GET a la raíz. res.send envía texto o HTML.
app.get('/', (req, res) => {
  res.send('<h1>Hola desde Express</h1>');
});

// Parámetro de ruta (:nombre) y parámetro de consulta (?curso=...)
app.get('/saludo/:nombre', (req, res) => {
  res.json({
    mensaje: `Hola ${req.params.nombre}`,
    curso: req.query.curso ?? 'sin curso',
  });
});

// res.status cambia el código de estado de la respuesta
app.get('/privado', (req, res) => {
  res.status(403).json({ error: 'No tienes permiso' });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
