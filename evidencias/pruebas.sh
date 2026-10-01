#!/usr/bin/env bash
# Pruebas del paso 17. Uso: bash evidencias/pruebas.sh > evidencias/pruebas.txt
API=http://localhost:3001/api/tareas
run() { echo "\$ $*"; eval "$@" | tr -d '\r'; echo; echo; }

echo "## 17.1"
run curl -s http://localhost:3001/api
run curl -si http://localhost:3001/inicio
echo "## 17.2"
run curl -si \$API
echo "## 17.3"
run curl -s "\"\$API?completada=false\""
run curl -s "\"\$API?prioridad=alta\""
run curl -s "\"\$API?completada=false&prioridad=alta\""
echo "## 17.4"
run curl -s \$API/resumen
echo "## 17.5"
run curl -s \$API/2
echo "## 17.6"
run curl -si -X POST \$API -H "\"Content-Type: application/json\"" -d "'{\"titulo\":\"Repasar middlewares\",\"prioridad\":\"alta\"}'"
echo "## 17.7"
run curl -s -X PUT \$API/4 -H "\"Content-Type: application/json\"" -d "'{\"titulo\":\"Repasar middlewares y rutas\",\"prioridad\":\"media\",\"completada\":false}'"
echo "## 17.8"
run curl -s -X PATCH \$API/4/completar
echo "## 17.9"
run curl -si -X DELETE \$API/4
run curl -si -X DELETE \$API/4 -H "\"x-api-key: 12345\""
run curl -si -X DELETE \$API/4 -H "\"x-api-key: express2026\""
echo "## 17.10"
run curl -si \$API/99
run curl -si \$API/abc
run curl -si -X POST \$API -H "\"Content-Type: application/json\"" -d "'{\"prioridad\":\"alta\"}'"
run curl -si -X POST \$API -H "\"Content-Type: application/json\"" -d "'{\"titulo\":\"Prueba\",\"prioridad\":\"urgente\"}'"
run curl -si -X POST \$API -H "\"Content-Type: application/json\"" -d "'{\"titulo\":'"
run curl -si http://localhost:3001/otra-ruta
run curl -si http://localhost:3001/api/error
