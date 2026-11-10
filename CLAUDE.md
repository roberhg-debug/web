# Web de Eina Nova Studio
Sitio estático (carpeta dist/). Empresa matriz de las apps Míster Cantera, Turno Vial, EV Bitácora y Mi Cesta.
Origen: copia del PC (repo eina-nova-codex, último commit 2026-11-04). Aún sin repo remoto en GitHub: pendiente crear `web` privado.
Incluye googledbf4fee6d2a16be0.html (verificación de Google Search Console): no borrar.
Hay un .openai/hosting.json de cuando se publicaba desde Codex: revisar dónde está alojada hoy.
Reglas: no force push, no tocar main sin avisar, no subir secretos.

## Estructura verificada (2026-11-09)
- Sin build ni dependencias: HTML estático. `dist/index.html` (una sola página, ~25 KB, título "Aplicaciones a medida en Mallorca | Eina Nova Studio"), `robots.txt`, `sitemap.xml`, `assets/` (6 imágenes/SVG).
- Dominio en sitemap/robots: https://www.eina-nova.es/
- Previsualizar: `cd dist && python3 -m http.server 8000` (requiere Command Line Tools) o abrir index.html.
- `.openai/hosting.json` (project_id de Codex, directorio `dist`) es histórico; no es config de despliegue actual.

## Hosting verificado (2026-11-10)
- DNS en Dinahosting; `www.eina-nova.es` → CNAME `custom-domains.chatgpt.site` (Cloudflare). La web SE SIGUE PUBLICANDO desde el alojamiento de Codex/OpenAI: `.openai/hosting.json` NO es un resto muerto, no tocar hasta migrar. Coste/renovación del dominio: pendiente de mirar en el panel de Dinahosting.
- Informe de auditoría: `../auditoria/web.md`; correcciones fase 1: `../auditoria/web-correcciones.md`.

## Rama `seguridad-2026-11` (fase 1, solo local, SIN publicar)
- Fuentes DM Sans y Manrope autoalojadas en `dist/assets/fonts/` (+ licencias OFL) y `dist/assets/fonts.css`; ya no hay referencias a Google Fonts.
- Nuevas: `dist/aviso-legal.html`, `privacidad.html`, `cookies.html` (estilo en `dist/assets/legal.css`), enlazadas desde el pie. Tienen marcadores `[COMPLETAR: …]` (NIF, titular, domicilio, etc.): NO publicar hasta que Roberto los rellene. No inventar datos legales.
- `dist/sitemap.xml` incluye las páginas nuevas. `googledbf4fee6d2a16be0.html` intacto.
- `propuestas/_headers`: cabeceras de seguridad propuestas (no activas; dependen del hosting).
- Previsualizar: `cd dist && python3 -m http.server 8000`.
- Pendiente (decide Roberto): completar marcadores, crear repo privado `web`, publicar, migrar hosting.
