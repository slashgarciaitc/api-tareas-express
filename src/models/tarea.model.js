// Modelo: única capa que sabe dónde están los datos.
// Actividad 3: los datos se guardan en SQLite (archivo data/tareas.db) usando el
// módulo node:sqlite que ya trae Node, en lugar del arreglo en memoria.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const RUTA_BD = process.env.DB_PATH || 'data/tareas.db';
mkdirSync(dirname(RUTA_BD), { recursive: true });
const db = new DatabaseSync(RUTA_BD);

db.exec(`
  CREATE TABLE IF NOT EXISTS tareas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo     TEXT    NOT NULL,
    prioridad  TEXT    NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
    completada INTEGER NOT NULL DEFAULT 0 CHECK (completada IN (0, 1))
  )
`);

// Datos iniciales: solo la primera vez, cuando la tabla está vacía
if (db.prepare('SELECT COUNT(*) AS n FROM tareas').get().n === 0) {
  const insertar = db.prepare('INSERT INTO tareas (titulo, prioridad, completada) VALUES (?, ?, ?)');
  insertar.run('Estudiar Express', 'alta', 0);
  insertar.run('Preparar la exposición', 'alta', 1);
  insertar.run('Subir la práctica a GitHub', 'media', 0);
}

// SQLite no tiene tipo booleano: completada se guarda como 0/1 y se convierte al leer
function aTarea(fila) {
  if (!fila) return null;
  return { id: fila.id, titulo: fila.titulo, prioridad: fila.prioridad, completada: fila.completada === 1 };
}

export function obtenerTodas() {
  return db.prepare('SELECT * FROM tareas ORDER BY id').all().map(aTarea);
}

export function obtenerPorId(id) {
  return aTarea(db.prepare('SELECT * FROM tareas WHERE id = ?').get(id));
}

export function crear({ titulo, prioridad, completada }) {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO tareas (titulo, prioridad, completada) VALUES (?, ?, ?)')
    .run(titulo, prioridad, completada ? 1 : 0);
  return obtenerPorId(Number(lastInsertRowid));
}

export function actualizar(id, datos) {
  const tarea = obtenerPorId(id);
  if (!tarea) return null;

  // Se combinan los datos actuales con los nuevos; los campos no enviados se conservan
  for (const campo of ['titulo', 'prioridad', 'completada']) {
    if (datos[campo] !== undefined) tarea[campo] = datos[campo];
  }
  db.prepare('UPDATE tareas SET titulo = ?, prioridad = ?, completada = ? WHERE id = ?')
    .run(tarea.titulo, tarea.prioridad, tarea.completada ? 1 : 0, id);
  return tarea;
}

export function eliminar(id) {
  return db.prepare('DELETE FROM tareas WHERE id = ?').run(id).changes > 0;
}
