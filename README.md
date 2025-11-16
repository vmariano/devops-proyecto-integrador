# DevOps Proyecto Integrador — tech-store

Aplicación demo con Next.js 14 (React 18 + TypeScript), TailwindCSS 4 y componentes shadcn/ui. Integrada con monitoreo vía Prometheus y Grafana usando Docker Compose. Incluye pruebas unitarias (Vitest) y end‑to‑end (Playwright), linting y CI con GitHub Actions.

## Requisitos
- Node.js 20.x y npm
- Opcional: Docker y Docker Compose v2

## Comandos principales (package.json)
- `npm run dev` — arranca el entorno de desarrollo en http://localhost:3000
- `npm run build` — compila la app para producción
- `npm start` — ejecuta la app compilada
- `npm run lint` — ejecuta ESLint
- `npm run test` / `npm run test:unit` — pruebas unitarias con Vitest
- `npm run test:coverage` — cobertura con Vitest
- `npm run test:e2e` — pruebas E2E con Playwright (headless)
- `npm run test:e2e:headed` — pruebas E2E en modo visual

## Ejecutar localmente
- Desarrollo: `npm ci && npm run dev` → http://localhost:3000
- Producción (sin Docker): `npm ci && npm run build && npm start`

## Autenticación (demo)
- Credenciales de prueba: usuario `admin` / contraseña `admin`.
- Al iniciar sesión exitosamente, navega a `/shop` tras ~500ms (estado: “Iniciando sesión...” mientras tanto).
- Si intentas acceder a `/shop` sin sesión, serás redirigido a `/` (pantalla de login).
- Desde la tienda, “Cerrar sesión” limpia la sesión y vuelve a `/`.

## Contenedores
### Dockerfile (producción)
Multi‑stage con Node 20 Alpine: construye con `npm ci` y copia artefactos al runtime. Puerto expuesto: 3000.

Ejemplo build/run manual:
```bash
# Crear imagen
docker build -t tech-store:latest .
# Ejecutar contenedor
docker run --rm -p 3000:3000 tech-store:latest
```

### Docker Compose (app + monitoreo)
Servicios:
- `frontend` — Next.js en 3000
- `prometheus` — Prometheus en 9090 (lee métricas del frontend)
- `grafana` — Grafana en 9500 (provisionado con Prometheus por defecto)

Comandos útiles:
- Levantar: `docker compose up -d`
- Ver logs: `docker compose logs -f`
- Detener: `docker compose down`

Puertos:
- App: 3000 → http://localhost:3000
- Prometheus: 9090 → http://localhost:9090
- Grafana: 9500 → http://localhost:9500 (user/pass: admin/admin)

## Observabilidad
- Endpoint de métricas: `GET /api/metrics` (usa `prom-client` con métricas por defecto)
- Config Prometheus: `prometheus/prometheus.yml`
  - Job: `TechStore`
  - Target por defecto: `host.docker.internal:3000` (apunta al frontend local). Ajusta si despliegas en Linux sin `host.docker.internal`.
- Grafana: provisioning automático desde `./provisioning` y volumen persistente `grafana-data`.

## Integración continua (GitHub Actions)
Workflow: `.github/workflows/test.yml`
- Ejecuta en push y PR: Node 20, `npm ci`, `npm run test:coverage`, `npm run lint`.

## Notas
- El proyecto usa npm (no hay bloqueo con pnpm). El Dockerfile y CI usan `npm ci` para instalaciones reproducibles.
- Añadir LICENSE si aplica.

