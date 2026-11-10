# Web Eina Nova — mapa de pantallas y procedimientos (10-nov-2026)

Sitio estático (`dist/`), una página principal más tres páginas legales. Servida hoy desde el alojamiento de Codex (CNAME `custom-domains.chatgpt.site`).

| Página | Archivo | Estado |
|---|---|---|
| Inicio: héroe, demo interactiva de agenda (ficticia), proyectos, qué hacemos, cómo trabajamos, contacto | `index.html` | ✅ revisada en escritorio y móvil (375 px): sin desbordes, 1 `h1`, `lang=es`, sin imágenes rotas, sin imágenes sin `alt` |
| Aviso legal | `aviso-legal.html` | 🔴 con marcadores `[COMPLETAR]` (NIF, titular, domicilio, fecha, fuero) |
| Privacidad | `privacidad.html` | 🔴 con marcadores (NIF, domicilio, plazo, proveedor) |
| Cookies | `cookies.html` | 🔴 con marcadores (confirmar con el proveedor, fecha) |

Enlaces comprobados del inicio: anclas internas, un `mailto:` por proyecto, Instagram y las tres páginas legales. Contacto: `einanovastudio@gmail.com`.
No hay modo oscuro (la web es solo clara, por diseño) y no hay imagen para Mi Cesta (tarjeta con texto).

## Corregido
La web llamaba «Mi Compra» al proyecto que en la app se llama **Mi Cesta** (3 apariciones, incluido el asunto del correo). Cambiado a «Mi Cesta» en `dist/index.html`, solo local, sin publicar.

## Pendientes de Roberto
Rellenar los marcadores legales (no se inventan datos); crear repo privado `web`; publicar; migrar el hosting; coste y renovación del dominio en Dinahosting; página de privacidad pública de EV Bitácora (`evbitacora-legal`, ya legible en móvil) y su limpieza de historial.
