# Guía de configuración — FootFisio + NocoDB Cloud Free

## 1. Crear la base

1. Inicia sesión en [NocoDB Cloud](https://app.nocodb.com).
2. Crea una base llamada `FootFisio`.
3. Crea una tabla llamada `FootFisioDatos`.
4. Conserva la columna primaria `Id` que NocoDB crea automáticamente.
5. Agrega dos columnas:
   - `tipo` — SingleLineText / Texto de una línea.
   - `datos_json` — LongText / Texto largo.
6. No cambies los nombres de esas dos columnas: el frontend los usa literalmente.

La aplicación guarda seis filas en esta tabla, una por módulo: `appointments`, `patients`, `payments`, `history`, `users` y `sequences`. Cada fila contiene el arreglo del módulo en formato JSON dentro de `datos_json`.

## 2. Crear el token API

1. Abre el menú de usuario y entra a **Account Settings**.
2. Abre **API Tokens** y elige **Create New API Token**.
3. Nombre sugerido: `FootFisio frontend demo`.
4. Limita el acceso al proyecto/base `FootFisio`.
5. Permisos: `Records` → `Read & write`. Deja las demás categorías en `None`.
6. Establece una expiración corta si la opción está disponible.
7. Crea el token y cópialo inmediatamente. NocoDB lo muestra una sola vez.

Documentación oficial: https://nocodb.com/docs/product/account-settings/api-tokens

## 3. Obtener Base ID y Table ID

1. Abre la tabla `FootFisioDatos`.
2. Mira la URL del navegador.
3. Copia el identificador de la base, que comienza con `p`.
4. Copia el identificador de la tabla, que comienza con `m`.

No copies el nombre de la base o tabla: se necesitan los identificadores.

## 4. Configurar Cloudflare Pages

1. Sube el código fuente a un repositorio privado de GitHub.
2. En Cloudflare Pages crea un proyecto conectado a ese repositorio.
3. Configura:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. En **Settings → Environment variables**, agrega:
   - `VITE_NOCODB_URL` = `https://app.nocodb.com`
   - `VITE_NOCODB_BASE_ID` = tu Base ID `p...`
   - `VITE_NOCODB_TABLE_ID` = tu Table ID `m...`
   - `VITE_NOCODB_API_TOKEN` = el token generado
5. Guarda y ejecuta un nuevo despliegue.

No necesitas instalar Node.js ni npm en tu computadora para esta ruta: Cloudflare realiza la compilación en sus servidores. El proceso de compilación remoto sí utiliza Node.js porque el proyecto original está hecho con React/Vite.

## 5. Comprobar que funciona

1. Abre la URL que Cloudflare entrega.
2. Entra con una cuenta de demostración (las credenciales ficticias aparecen en `README.md`).
3. Crea o modifica un paciente de prueba.
4. Abre NocoDB → `FootFisioDatos` y revisa que la fila `patients` haya cambiado.
5. Prueba también una cita, un pago y un registro de historial.

El indicador de estado de la aplicación muestra si falta configurar NocoDB, si está conectado o si hubo un error al guardar.

## 6. Qué incluye y qué no incluye esta adaptación

**Incluye:** persistencia remota para los seis módulos indicados, carga al iniciar, guardado automático al cambiar el estado, uso de la API REST v3 y eliminación del backend Node/Express y del esquema MySQL local.

**No equivale a un sistema clínico de producción:** la autenticación y los roles existentes son de demostración y se ejecutan en el navegador. El token `VITE_NOCODB_API_TOKEN` también termina en el código descargado por el navegador. Por ello, no ingreses nombres, DNI, teléfonos, diagnósticos, historias clínicas ni otros datos reales. Para producción se necesitaría un servicio intermediario seguro y autenticación/autorización del lado del servidor, lo que contradice el requisito de no tener backend.

## 7. Límites del plan gratuito

El plan gratuito publicado por NocoDB indica límites de registros por espacio de trabajo y llamadas API mensuales. Revisa los límites vigentes en https://nocodb.com/pricing antes de usarlo con muchos registros. Esta adaptación reduce el número de filas a seis, pero cada guardado de módulo consume una llamada API.
