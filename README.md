# Quiniela del Tri — Mundial 2026

Sitio web para capturar las predicciones de cualquier número de participantes
sobre el desempeño de México en el Mundial 2026, con dashboard de supervisor.

## Qué incluye
- `public/index.html` — formulario público para capturar boletos (sin límite de participantes).
- `public/admin.html` — dashboard privado: captura resultados reales y muestra el ranking.
- `netlify/functions/` — funciones serverless que guardan todo en Netlify Blobs (base de datos incluida, gratis).

## Cómo publicarlo en Netlify (dos formas)

### Opción A — La más fácil (sin terminal)
1. Ve a https://app.netlify.com y crea una cuenta gratis (o inicia sesión).
2. Sube este proyecto a un repositorio de GitHub (crea uno nuevo y arrastra estos archivos).
   - Esto es necesario porque las funciones serverless requieren que Netlify "compile" el proyecto;
     el drag-and-drop simple solo sirve para sitios estáticos sin funciones.
3. En Netlify: "Add new site" → "Import an existing project" → conecta tu repo de GitHub.
4. Netlify detecta automáticamente `netlify.toml`. Dale clic a "Deploy site".
5. Cuando termine, tu sitio queda en una URL tipo `https://algo-al-azar.netlify.app`.

### Opción B — Con Netlify CLI (si tienes terminal)
```bash
npm install -g netlify-cli
cd quiniela-mundial
npm install
netlify deploy --prod
```
Sigue las instrucciones en pantalla (te pedirá iniciar sesión y elegir/crear un sitio).

## Cambiar la clave del organizador
Por default la clave es `AZTECA2026` (definida en `netlify/functions/admin-data.js`
y `set-results.js`). Para cambiarla sin tocar el código:
1. En el dashboard de Netlify, ve a tu sitio → "Site configuration" → "Environment variables".
2. Agrega una variable llamada `ADMIN_PASSWORD` con la clave que quieras.
3. Vuelve a desplegar el sitio (o espera al siguiente deploy automático).

## Una vez publicado
- Comparte el link principal (`tusitio.netlify.app`) con los participantes.
- Tú entras a `tusitio.netlify.app/admin.html` con la clave para capturar resultados
  reales conforme avancen los partidos y ver el ranking actualizado al momento.

## Sistema de puntos (ya programado)
- Marcador exacto de un partido de México: 5 pts
- Solo acierta el resultado (gana/pierde/empata): 2 pts
- Acertar la fase final que alcanza México: 1 a 15 pts según la ronda
- Acertar al goleador del Tri: 3 pts
