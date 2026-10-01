// Servicio: contiene la lógica de negocio.
// No usa req ni res, por lo que no depende de Express ni de HTTP.
import * as Tarea from '../models/tarea.model.js';
import { HttpError } from '../utils/HttpError.js';

export function listar({ completada, prioridad }) {
  let tareas = Tarea.obtenerTodas();

  if (completada !== undefined) {
    const valor = completada === 'true';
    tareas = tareas.filter((tarea) => tarea.completada === valor);
  }
  if (prioridad) {
    tareas = tareas.filter((tarea) => tarea.prioridad === prioridad);
  }
  return tareas;
}

export function resumen() {
  const tareas = Tarea.obtenerTodas();
  const completadas = tareas.filter((tarea) => tarea.completada).length;
  return {
    total: tareas.length,
    completadas,
    pendientes: tareas.length - completadas,
  };
}

// Actividad 2: búsqueda por texto en el título, sin distinguir mayúsculas
export function buscar(texto) {
  if (typeof texto !== 'string' || !texto.trim()) {
    throw new HttpError(400, 'El parámetro texto es obligatorio');
  }
  const busqueda = texto.trim().toLowerCase();
  return Tarea.obtenerTodas().filter((tarea) => tarea.titulo.toLowerCase().includes(busqueda));
}

export function obtener(id) {
  const tarea = Tarea.obtenerPorId(id);
  if (!tarea) throw new HttpError(404, `No existe la tarea con id ${id}`);
  return tarea;
}

export function crear({ titulo, prioridad = 'media' }) {
  return Tarea.crear({ titulo, prioridad, completada: false });
}

export function reemplazar(id, { titulo, prioridad, completada }) {
  const tarea = Tarea.actualizar(id, { titulo, prioridad, completada: Boolean(completada) });
  if (!tarea) throw new HttpError(404, `No existe la tarea con id ${id}`);
  return tarea;
}

export function completar(id) {
  const tarea = Tarea.actualizar(id, { completada: true });
  if (!tarea) throw new HttpError(404, `No existe la tarea con id ${id}`);
  return tarea;
}

export function eliminar(id) {
  const eliminada = Tarea.eliminar(id);
  if (!eliminada) throw new HttpError(404, `No existe la tarea con id ${id}`);
}
