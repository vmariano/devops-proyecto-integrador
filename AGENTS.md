# AGENTS.md

Guía breve para asistentes/LLMs sobre este proyecto. Proporciona el contexto mínimo para entender, navegar y modificar el repo con seguridad.

Fecha de referencia: 2025-11-09 14:18 (local)

## 1) Resumen del proyecto
- Nombre: TechStore
- Tipo: Aplicación Next.js 14 (App Router) con una tienda simple protegida por un login simulado en el cliente.
- Objetivo: Demostrar un flujo básico de autenticación, listado y filtrado de productos, y exponer métricas Prometheus vía API.

## 2) Stack principal
- Framework: Next.js 14.2.16 (App Router). Algunas rutas conviven en `pages/` (API).
- Lenguaje: TypeScript, React 18.
- UI: Radix UI + Tailwind CSS + componentes locales (Shadcn style).
- Métricas: `prom-client` en `/pages/api/metrics`.
- Tests: Vitest + React Testing Library (unit/integración/API) y Playwright (E2E).
- Infra opcional: Docker, docker-compose, Prometheus.

## 3) Estructura de carpetas relevante
- `app/`
  - `page.tsx`: pantalla de Login (ruta `/`).
  - `login/page.tsx`: pantalla de Login alternativa (ruta `/login`).
  - `shop/page.tsx`: tienda protegida (ruta `/shop`).
- `components/`
  - `product-card.tsx`: tarjeta de producto.
  - `shop-sidebar.tsx`: barra lateral con búsqueda y categorías.
  - `ui/*`: primitivas de UI.
- `lib/`
  - `products.ts`: tipos, categorías y datos mock de productos.
- `pages/api/metrics/index.ts`: endpoint Prometheus (ruta `/api/metrics`).
- `tests/` y `__tests__/`: configuración y suites de pruebas (Vitest).
- `e2e/` + `playwright.config.ts`: pruebas E2E.
- `prometheus/`, `Dockerfile`, `docker-compose.yml`: observabilidad y contenedores.
- Configuración: `vitest.config.ts`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`.

## 4) Comandos npm clave
- `npm run dev`: desarrollo en `http://localhost:3000`.
- `npm run build` / `npm start`: producción local.
- `npm run test`: Vitest (unit/integración/API).
- `npm run test:coverage`: cobertura con Vitest.
- `npm run test:e2e`: Playwright (requiere la app corriendo).
- `npm run test:e2e:headed`: E2E en modo interactivo.

## 5) Navegación y flujo de autenticación (simulado)
- Login (en `app/page.tsx` y `app/login/page.tsx`):
  - Credenciales válidas: `admin` / `admin`.
  - Al loguear: `localStorage.setItem('isLoggedIn', 'true')` y `router.push('/shop')` tras 500ms de delay.
  - Credenciales inválidas: muestra error y mantiene la pantalla.
- Protección de `/shop` (`app/shop/page.tsx`):
  - En `useEffect`, si `localStorage.isLoggedIn !== 'true'` → `router.push('/login')`.
  - Botón “Cerrar sesión” borra `localStorage.isLoggedIn` y navega a `/login`.

## 6) Tienda, filtros y datos
- Fuente de datos: `lib/products.ts` con un array `products: Product[]` y `categories`.
- Filtros en `app/shop/page.tsx`:
  - Categoría (`selectedCategory`): si ≠ `all`, filtra por `product.category`.
  - Búsqueda (`searchQuery`): `name.toLowerCase().includes(query)`.
  - Contador de resultados muestra `X producto(s) encontrados`.
- Sidebar (`components/shop-sidebar.tsx`):
  - Propaga cambios mediante `onCategoryChange` y `onSearchChange`.
- ProductCard (`components/product-card.tsx`):
  - Muestra imagen (Next Image con `unoptimized`), nombre, descripción y precio formateado con `toFixed(2)`.

## 7) API de métricas (Prometheus)
- Ruta: `GET /api/metrics` (`pages/api/metrics/index.ts`).
- Implementación:
  - Usa `prom-client` con `collectDefaultMetrics({ prefix: 'TechStore_' })`.
  - Se asegura de registrarlo solo una vez con `globalThis.metricsRegistered`.
  - `Content-Type` = `register.contentType`.
- Uso: Integrable con Prometheus; ver `prometheus/prometheus.yml` y `docker-compose.yml`.

## 8) Testing
- Unit/Integración/API (Vitest):
  - Config: `vitest.config.ts` (environment `jsdom`, setup en `tests/setup/vitest.setup.ts`).
  - Mocks globales en setup: `next/image` → `img`; `useRouter` básico.
  - Ejemplos:
    - `__tests__/unit/components.product-card.test.tsx`
    - `__tests__/integration/app.page.login.test.tsx`
    - `__tests__/integration/app.shop.page.test.tsx`
    - `__tests__/api/metrics.test.ts`
- E2E (Playwright):
  - Config: `playwright.config.ts` (Chromium desktop y móvil).
  - Ejemplo: `e2e/login.spec.ts` (login → shop → logout).
  - Requiere `npm run dev` en otra terminal.

## 9) Conventions & configuración
- TypeScript: `strict: true` (no emit), target ES6, module `esnext`.
- Alias de paths: `@/*` → raíz del proyecto (configurado en `tsconfig.json` y `vitest.config.ts`).
- Estilos: Tailwind CSS (v4) + utilidades; mantener clases existentes.
- Componentes: patrón Shadcn/Radix; respetar props existentes y variantes (`variant="secondary"`, etc.).

## 10) Docker / Compose / Prometheus (alto nivel)
- `Dockerfile`: imagen de la app.
- `docker-compose.yml`: puede orquestar la app y servicios de monitoreo (revisar puertos y servicios actuales antes de cambios).
- `prometheus/prometheus.yml`: scrape del endpoint `/api/metrics`.

## 11) Rutas relevantes
- Web:
  - `/` y `/login`: pantallas de login.
  - `/shop`: tienda (protegida por verificación de `localStorage`).
- API:
  - `/api/metrics`: métricas Prometheus.

## 12) Tareas típicas para un LLM (cómo proceder con seguridad)
- Agregar campo/validación al login:
  1. Editar `app/page.tsx` (y/o `app/login/page.tsx`).
  2. Sincronizar tests en `__tests__/integration/app.page.login.test.tsx`.
- Cambiar lógica de filtrado:
  1. Modificar `app/shop/page.tsx` y, si aplica, `components/shop-sidebar.tsx`.
  2. Ajustar pruebas en `__tests__/integration/app.shop.page.test.tsx`.
- Añadir métrica custom:
  1. Editar `pages/api/metrics/index.ts` (usar `Counter`, `Gauge`, etc., del `prom-client`).
  2. Mantener el `prefix: 'TechStore_'` y el registro único.
  3. Extender tests en `__tests__/api/metrics.test.ts`.
- UI/Accesibilidad:
  - Mantener labels y roles accesibles; tests usan `getByLabelText`, `getByRole`.

## 13) Consideraciones y gotchas
- El “auth” es solo `localStorage`; no hay backend real ni cookies.
- `setTimeout` de 500ms en el login; los tests usan timers falsos (`vi.useFakeTimers()`).
- En JSDOM, `next/image` está mockeado como `img`; no usar sus internals en tests.
- En integración, si necesitas afirmar navegación, mockea `useRouter` explícitamente.

## 14) Cómo ejecutar rápidamente
1. `npm i`
2. Desarrollo: `npm run dev` → abrir `http://localhost:3000`
3. Unit/Integración/API: `npm run test` o `npm run test:coverage`
4. E2E: en otra terminal `npx playwright install --with-deps && npm run test:e2e`

## 15) Extensiones futuras sugeridas
- Sustituir auth local por JWT/sesiones en API Routes o Route Handlers.
- Carrito persistente y checkout.
- Métricas custom por evento de UI (p. ej., contador de clicks en “Agregar al carrito”).
- CI con GitHub Actions para `test` y `test:e2e` con cobertura.

---

Si eres un LLM: antes de cambios, revisa este archivo, los tests existentes y respeta el estilo/convenciones. Realiza modificaciones mínimas y actualiza/crea pruebas cuando corresponda.
