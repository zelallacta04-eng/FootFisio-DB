# FootFisio — versión conectada a NocoDB Cloud

Aplicación web académica para la gestión de pacientes, agenda, historial clínico, pagos, usuarios, secuencias y reportes.

## Arquitectura de esta versión

- Interfaz: React + TypeScript + Vite.
- Persistencia: NocoDB Cloud mediante su API REST v3.
- No utiliza backend propio, Express ni MySQL local.
- Los datos de los seis módulos se guardan en una tabla central `FootFisioDatos`, en seis registros (uno por módulo).

## Configuración de NocoDB Cloud

1. Crea una cuenta gratuita en https://app.nocodb.com.
2. Crea un proyecto/base llamado `FootFisio`.
3. Dentro de la base crea una tabla llamada `FootFisioDatos`.
4. Crea estos campos (respeta los nombres):
   - `Id`: campo primario autonumérico (NocoDB lo crea normalmente).
   - `tipo`: texto de una línea. Marca como único si la opción está disponible.
   - `datos_json`: texto largo.
5. Abre la tabla y copia el identificador de la base (`p...`) y el identificador de la tabla (`m...`) desde la URL.
6. En NocoDB entra a **Account Settings → API Tokens → Create New API Token**. Crea un token de solo el proyecto FootFisio, con permiso **Records: Read & write** y sin permisos de administración de tablas/campos. Copia el token al crearlo; NocoDB solo lo muestra una vez.
7. En Cloudflare Pages abre **Settings → Environment variables** y agrega estas cuatro variables:
   - `VITE_NOCODB_URL` = `https://app.nocodb.com`
   - `VITE_NOCODB_BASE_ID` = identificador `p...` de la base
   - `VITE_NOCODB_TABLE_ID` = identificador `m...` de la tabla
   - `VITE_NOCODB_API_TOKEN` = token que acabas de crear
8. Guarda y vuelve a desplegar el proyecto. Vite incorpora estas variables al frontend durante la compilación.
9. Para pruebas locales, puedes copiar `.env.example` como `.env.local` y completar los valores, pero ejecutar Vite localmente requiere Node.js.

La aplicación usa la API `https://app.nocodb.com/api/v3/data/{baseId}/{tableId}/records`. El primer acceso carga los registros existentes; si la tabla está vacía, conserva los datos de demostración iniciales y los guarda en NocoDB.

## Publicar sin instalar Node.js en tu PC

Esta versión no necesita un servidor Node.js ejecutándose en tu computadora. Para publicarla como sitio estático:

1. Sube la carpeta del proyecto a un repositorio privado de GitHub.
2. Entra a https://pages.cloudflare.com/ y crea un proyecto conectado a ese repositorio.
3. Configura el build:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Pulsa Deploy. Cloudflare compila el frontend en sus servidores y publica la web; no necesitas instalar Node.js en tu PC.

**Importante:** el proceso de compilación de Cloudflare sí utiliza Node.js en sus servidores, pero no necesitas instalarlo ni ejecutar comandos Node/npm localmente. Si por “sin Node.js” también quieres prohibir Node.js incluso durante la compilación remota, React + Vite no cumple esa condición: habría que reescribir la interfaz completa como HTML/CSS/JavaScript puro.

## Cómo funciona la persistencia

Se guardan estos módulos en NocoDB:
- `appointments`: citas y agenda.
- `patients`: pacientes.
- `history`: historial clínico.
- `payments`: pagos.
- `users`: usuarios mostrados por el módulo de administración.
- `sequences`: secuencias de tratamiento.

Cada módulo se guarda como JSON en `datos_json`. Esto mantiene la estructura actual de la interfaz sin reconstruir todas las pantallas.

## Acceso de demostración

La pantalla de inicio conserva las cuentas ficticias incluidas en el prototipo:
- Administrador: `admin@footfisio.com` / `admin123`
- Terapeuta: `e.ruiz@footfisio.com` / `elena123`
- Recepción: `c.lopez@footfisio.com` / `carmen123`

Son credenciales de demostración. El inicio de sesión y los permisos por rol siguen siendo lógica del frontend, no autenticación segura del servidor. No se debe usar esta versión para datos reales, historias clínicas reales ni información personal sensible. **Advertencia crítica:** las variables `VITE_` se incorporan al JavaScript que recibe el navegador. Por tanto, el token de API puede ser inspeccionado por cualquier visitante; limitarlo al proyecto y a Records reduce el alcance, pero no lo vuelve secreto. Esta alternativa sin backend sirve para prototipo académico y datos ficticios, no para producción clínica.

## Límites del plan gratuito

La información pública de NocoDB indica que el plan Free tiene límites de registros y llamadas API. Revisa el plan vigente antes de cargar datos: el precio y los límites pueden cambiar. Esta versión hace llamadas a la API al cargar y al guardar cada módulo.

## Solución de problemas

- **401 Unauthorized:** revisa el token; si lo perdiste, crea otro y actualiza `src/nocodb.config.ts`.
- **403 Forbidden:** el token debe tener `Records: Read & write` y acceso a la base FootFisio.
- **404 Not Found:** revisa el Base ID y Table ID.
- **Error de CORS/red:** confirma que usas `https://app.nocodb.com` y que la URL de Cloudflare carga por HTTPS.
- **No guarda:** comprueba que los campos se llamen exactamente `tipo` y `datos_json`.

## Desarrollo local opcional

El código fuente usa Vite. Para ejecutarlo localmente se necesita Node.js y npm. Como pediste trabajar sin Node.js en tu PC, no es necesario seguir este camino: utiliza el despliegue de Cloudflare Pages indicado arriba.
