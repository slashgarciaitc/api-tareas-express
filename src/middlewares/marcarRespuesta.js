// Middleware global (Actividad 1): agrega el encabezado X-Equipo a todas las respuestas.
export function marcarRespuesta(req, res, next) {
  res.set('X-Equipo', 'Saul Garcia Hernandez');
  next();
}
