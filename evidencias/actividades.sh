#!/usr/bin/env bash
# Pruebas de las actividades del paso 18. Uso: bash evidencias/actividades.sh
API=http://localhost:3001/api/tareas
run() { echo "\$ $*"; eval "$@" | tr -d '\r'; echo; echo; }
reiniciar() { pkill -f "node src/server.js"; sleep 0.5; (npm start >> evidencias/servidor-actividades.log 2>&1 &); sleep 1.5; }

case "$1" in
1)
  run curl -si http://localhost:3001/api
  run "curl -si $API/99 | grep -E '^(HTTP|X-Equipo)'"
  ;;
2)
  run curl -s "\"$API/buscar?texto=express\""
  run curl -s "\"$API/buscar?texto=GITHUB\""
  run curl -s "\"$API/buscar?texto=zzz\""
  run curl -si "\"$API/buscar\""
  ;;
3)
  run curl -s -X POST $API -H "\"Content-Type: application/json\"" -d "'{\"titulo\":\"Probar la base de datos\",\"prioridad\":\"baja\"}'"
  run curl -s -X PATCH $API/1/completar
  echo "\$ # reinicio del servidor (Ctrl+C y npm start)"; reiniciar; echo
  run curl -s $API
  run curl -s $API/resumen
  run "sqlite3 -header -column data/tareas.db 'SELECT * FROM tareas;'"
  ;;
esac
