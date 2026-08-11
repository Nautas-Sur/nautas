# Relevamiento — panel `/admin` (Decap CMS legado)

Fecha: 2026-08-10/11. Branch: `relevamiento-admin-decap`, creada desde
`main` (post-merge de PR #47, commit `4b925e3`). Cero cambios de código —
solo lectura, verificación contra build local, contra el deploy real de
Vercel (MCP, team `team_oodnsMKxrjpNc90x3QkeGiBe`) y contra producción HTTP.

## 1. Inventario de archivos

```
public/admin/config.yml
public/admin/index.html
api/auth.js
api/callback.js
```

`package.json` y `package-lock.json`: **sin ninguna dependencia** de
`decap-cms` ni `netlify-cms` (`grep -in "decap\|netlify-cms"` sobre ambos,
cero resultados). El panel no es un paquete npm instalado — `index.html`
carga `decap-cms.js` directo desde unpkg vía `<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js">`.
No hay `netlify.toml` ni ningún otro archivo de configuración de Netlify en
la raíz del repo.

También vive una referencia compartida en `vercel.json` (raíz del repo, NO
dentro de `public/admin/`):

```json
{
  "rewrites": [
    { "source": "/admin", "destination": "/admin/index.html" },
    { "source": "/admin/:path*", "destination": "/admin/:path*" }
  ]
}
```

## 2. Contenido íntegro

### `api/auth.js`

```js
export default function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'repo,user',
    redirect_uri: 'https://project-43ure.vercel.app/api/callback',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
```

### `api/callback.js`

```js
export default async function handler(req, res) {
  const { code } = req.query;

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  res.setHeader('Content-Type', 'text/html');

  if (data.error || !data.access_token) {
    const errMsg = JSON.stringify({ error: data.error_description || data.error || 'Unknown error' });
    res.send(`<!DOCTYPE html><html><body><script>
(function(){function r(e){window.opener.postMessage('authorization:github:error:${errMsg}',e.origin);}
window.addEventListener("message",r,false);window.opener.postMessage("authorizing:github","*");})();
<\/script></body></html>`);
    return;
  }

  const tokenJson = JSON.stringify(data.access_token);
  res.send(`<!DOCTYPE html><html><body><script>
(function(){
var t=${tokenJson};
var msg='authorization:github:success:'+JSON.stringify({token:t,provider:'github'});
function r(e){window.opener.postMessage(msg,e.origin);}
window.addEventListener("message",r,false);
window.opener.postMessage("authorizing:github","*");
})();
<\/script></body></html>`);
}
```

`public/admin/index.html` (17 líneas) y `public/admin/config.yml` (338
líneas) — no se pegan enteros acá por extensión; `config.yml` define el
backend GitHub (`base_url: https://project-43ure.vercel.app`,
`auth_endpoint: api/auth`) y 6 colecciones (`pages_es`, `pages_en`,
`projects`, `team`, más las páginas fijas), cada una apuntando a archivos
`.md` o carpetas de `.md`.

## 3. ¿`api/auth.js` se despliega como función serverless?

**Sí, confirmado — no por inferencia.**

**Build local** (`astro build`, `dist/`): `.vercel/output/functions/`
contiene únicamente `_render.func` (la función SSR de Astro que sirve
`/keystatic`, `/api/keystatic`, `/_image`, etc.). No aparece ninguna función
separada para `api/auth.js` ni `api/callback.js`. Esto es engañoso si se
mira solo el build local: **`astro build` no es lo que corre en Vercel.**

**Deploy real** (Vercel MCP): el deployment de producción actual
(`dpl_HVqUDXVWSpoFTfS4WuiUy3Q4NXAh`, commit `4b925e3`, alias
`nautas.org.ar`) corre `vercel build` (no `astro build` directo) — el log
de build lo muestra explícitamente (`Running "vercel build"` → adentro
corre `npm run build`). `vercel build` tiene su propia detección
zero-config de `api/**/*.js` como Serverless Functions, **por fuera** de lo
que produce el adaptador de Astro. El metadato del deployment confirma
`"lambdaRuntimeStats": "{\"nodejs\":3}"` — 3 lambdas Node.js: `_render`,
`api/auth` y `api/callback`.

**Verificación directa contra producción** (vía
`web_fetch_vercel_url`, HOY):

- `GET https://nautas.org.ar/api/auth` → **307**, `Location:
  https://github.com/login/oauth/authorize?client_id=Ov23linoBnGUKNDCaul0&scope=repo%2Cuser&redirect_uri=https%3A%2F%2Fproject-43ure.vercel.app%2Fapi%2Fcallback`
- `GET https://nautas.org.ar/api/callback` → **200**, devuelve el HTML con
  `postMessage` de error (`"The code passed is incorrect or expired"` — el
  handler llegó a pegarle a la API real de GitHub y GitHub respondió con un
  rechazo de `code` inválido, no con un error de credenciales faltantes).

Ambas funciones están **vivas y operativas** en producción.

## 4. Estado en producción HOY

| Ruta | Código | Qué devuelve |
|---|---|---|
| `https://nautas.org.ar/admin/` | **200** | El shell HTML completo de Decap CMS (`decap-cms.js` desde unpkg). `noindex` en meta, pero servido sin ninguna barrera de acceso. |
| `https://nautas.org.ar/admin/config.yml` | **200** | El archivo de configuración completo (338 líneas), incluida la lista completa de 6 colecciones y todos sus campos — **público, legible por cualquiera**. |
| `https://nautas.org.ar/api/auth` | **307** | Redirect a GitHub OAuth con `client_id` real (`Ov23linoBnGUKNDCaul0`) y `scope=repo,user` — **el flujo de login funciona**. |
| `https://nautas.org.ar/api/callback` | **200** (con `code` ausente/inválido) | HTML de error controlado, no un crash — confirma que el handler ejecuta y llega a GitHub. |

No hay `robots.txt` en el repo (se verificó en `RELEVAMIENTO-DOMINIO.md`,
punto 5) que bloquee `/admin`, y `get_project_deployment_protection` (Vercel
MCP) muestra `ssoProtection.deploymentType: "all_except_custom_domains"` —
es decir, la protección SSO de Vercel (si estuviera configurada) **no
aplica al dominio custom** `nautas.org.ar`. Todo lo anterior queda expuesto
sin ninguna barrera: cualquiera que conozca o adivine la URL puede abrir el
panel, ver la config completa, e iniciar el flujo de OAuth con GitHub.

**Lo que NO queda expuesto:** el `access_token` de GitHub nunca se filtra a
través de esta cadena a un tercero no autorizado — lo recibe la propia
persona que completa el login OAuth, autorizando **su propia cuenta** de
GitHub (scope `repo,user` sobre lo que esa cuenta ya puede acceder). No es
una puerta trasera hacia la cuenta de Santos ni hacia el repo si quien la
usa no tiene ya permisos de escritura sobre `Nautas-Sur/nautas`. El riesgo
real no es "cualquiera puede escribir en el repo", es: superficie de
phishing/confusión (una URL de login de GitHub que parece legítima),
un OAuth App de GitHub registrado y con secreto activo sin monitoreo, y
consumo de lambda por tráfico no controlado.

## 5. Variables de entorno requeridas

El propio commit que introdujo el proxy OAuth (`459079b`, 2026-05-11) lo
documenta en su mensaje: *"Requiere env vars `GITHUB_CLIENT_ID` y
`GITHUB_CLIENT_SECRET` en Vercel."*

Verificado que **están configuradas y activas** en producción (no se puede
leer su valor vía la API de Vercel — los secretos no se exponen — pero su
efecto se verificó por comportamiento real):

- `GITHUB_CLIENT_ID`: confirmado — aparece poblado (`Ov23linoBnGUKNDCaul0`)
  en la URL de redirect real de `/api/auth`. Si la env var no existiera,
  `client_id` habría salido como `undefined` en el querystring.
- `GITHUB_CLIENT_SECRET`: no se puede confirmar por lectura directa, pero
  `/api/callback` con un `code` inválido devolvió el error específico de
  GitHub *"the code passed is incorrect or expired"* — ese es el error que
  GitHub da cuando `client_id`/`client_secret` son válidos y solo el `code`
  falla. Si `client_secret` faltara o fuera incorrecto, GitHub típicamente
  responde con un error de credenciales de cliente, no de código. Evidencia
  fuerte (no 100% concluyente sin ver el secret) de que también está
  configurada.

## 6. Origen — `git log --diff-filter=A`

Todo entró en una sola sesión, el **2026-05-11**, con bastante vaivén
(agregar → borrar → re-agregar) el mismo día:

| Hora | Commit | Mensaje |
|---|---|---|
| 11:11 | `dec45de5` | Agregar Decap CMS y configuración OAuth *(crea `config.yml`, `index.html`, primer `vercel.json`)* |
| 12:51 | `8b753a4a` | Agregar auth.js y corregir vercel.json *(primera versión de `api/auth.js`, con `auth_type: implicit/pkce` contra `api.netlify.com`)* |
| 14:57 | `bc27a5ad` | Eliminar configuración OAuth *(borra `api/auth.js` y el rewrite de `vercel.json`)* |
| 15:33 | `c840b17f` | Agregar rewrite para /admin *(re-agrega el rewrite en `vercel.json`)* |
| 17:38 | `459079b6` | Agregar proxy OAuth propio para Decap CMS en Vercel *(re-crea `api/auth.js` y agrega `api/callback.js`, ahora con proxy propio en vez de `api.netlify.com`; mensaje documenta las env vars requeridas; co-autoría de Claude)* |

Todos los commits, autor `santos480 <numero170@gmail.com>`. Ningún commit
posterior a esa fecha tocó estos archivos hasta la Fase B de
`dominio-propio-site` (`903b07c`, cambio de dominio) y su reversión
(`7219bce`).

## 7. Plan de borrado (NO ejecutado en esta branch)

Archivos a eliminar por completo:

```
public/admin/config.yml
public/admin/index.html
api/auth.js
api/callback.js
```

(elimina también la carpeta `public/admin/` y `api/` enteras, porque no
tienen ningún otro contenido — confirmado en el inventario del punto 1.)

Entrada a eliminar de `vercel.json`:

```json
"rewrites": [
  { "source": "/admin", "destination": "/admin/index.html" },
  { "source": "/admin/:path*", "destination": "/admin/:path*" }
]
```

Si esas son las únicas dos reglas del archivo (lo son, hoy), `vercel.json`
queda con un `{ "rewrites": [] }` vacío o se puede borrar el archivo entero
— a decidir en el momento del borrado, no es parte de este relevamiento.

`package.json` / `package-lock.json`: **nada que tocar** — no hay ninguna
dependencia de Decap/Netlify CMS instalada (punto 1).

`astro.config.mjs`: nada que referencie `/admin` ni `api/` — confirmado en
el punto 8.

Después de borrar, hay que dar de baja (fuera del repo, en GitHub) el OAuth
App con `client_id=Ov23linoBnGUKNDCaul0` y las env vars `GITHUB_CLIENT_ID` /
`GITHUB_CLIENT_SECRET` en el dashboard de Vercel — el borrado del código deja
esas dos cosas huérfanas pero activas si no se limpian aparte.

## 8. Nada compartido entre `/admin` + `api/` y el sitio vivo

`grep -rn` en ambas direcciones, sin resultados en ninguna:

```
src/ → public/admin/, api/, "decap"     → sin coincidencias
astro.config.mjs, keystatic.config.mjs
  → admin, api/auth, api/callback, decap → sin coincidencias
public/admin/, api/ → imports de src/    → sin coincidencias
```

Único punto de contacto real: `vercel.json`, que sí tiene las dos reglas de
rewrite para `/admin` (listadas en el punto 1 y en el plan de borrado del
punto 7). No es código compartido — es routing de infraestructura — así que
no amerita un PARÁ, pero queda documentado porque hay que tocarlo en el
borrado.

**Hallazgo adicional relevante para la urgencia:** `config.yml` define sus
6 colecciones apuntando a archivos `.md` (`src/content/pages/inicio.md`,
etc.) que **ya no existen** — la migración a Keystatic movió todo el
contenido a `.yaml` (`src/content/pages/inicio.yaml`, etc., confirmado con
`ls`). Y `src/content.config.ts` define los loaders de las 4 colecciones
como `glob({ pattern: '**/*.yaml', ... })` — **solo** reconoce `.yaml`.
Es decir: aunque alguien con acceso de escritura al repo completara el login
de Decap y grabara un cambio, el archivo `.md` que Decap generaría sería
invisible para Astro. El panel no solo está en desuso — está estructuralmente
roto para editar contenido real del sitio actual.

## 9. Clasificación de urgencia

**Prioritario, no limpieza normal.**

Según el propio criterio del pedido (punto 9): el endpoint de auth responde
(sí, 307 con redirect funcional) **y** tiene secretos configurados (sí,
`GITHUB_CLIENT_ID` confirmado en vivo, `GITHUB_CLIENT_SECRET` con evidencia
fuerte). No está inerte — está completamente vivo y operativo en el dominio
de producción, sin ninguna barrera de acceso (ni auth, ni robots.txt, ni
protección de Vercel en el dominio custom).

Que esté "vivo" no significa que sea explotable para escribir en el repo
sin permisos previos (punto 4) ni que pueda usarse para publicar contenido
real (punto 8, roto por el mismatch `.md`/`.yaml`) — pero es superficie
pública innecesaria: un panel de administración completo, con su config
expuesta campo por campo, y un flujo de OAuth activo con un GitHub OAuth
App real detrás, que nadie está monitoreando y que no cumple ninguna
función desde que existe Keystatic.

## Aclaración — discrepancia 24 vs. 25 páginas

El reporte de `dominio-propio-site` habla de **24** páginas de contenido; el
proyecto viene citando **25** desde el 07/08 (`AVANCES-2026-08-07.md`,
entrada de la deuda de `og:image`: *"ninguna de las 25 páginas del sitio
tenía imagen al compartirse"*).

**El número correcto es 24.** Verificado dos veces, por dos caminos
independientes:

- La lista de rutas que imprime `astro build` al prerenderizar (`dist/`):
  12 en español (`index`, `institucional`, `proyectos`, 7 detalles de
  proyecto, `archivo`, `contacto`) + 12 en inglés (las mismas, bajo `/en`) =
  **24**.
- El conteo de `RELEVAMIENTO-DOMINIO.md` (punto 6): 24 archivos `.html` con
  los 5 tags que dependen de `Astro.site` (`canonical`, 3× `hreflang`,
  `og:image`).

El **25** de `AVANCES-2026-08-07.md` cuenta un archivo de más: `dist/`
efectivamente contiene 25 archivos `.html` en total, pero el 25° es
`admin/index.html` — el shell de Decap CMS relevado en este documento, que
**no pasa por `BaseLayout.astro`** y por lo tanto **nunca tuvo `og:image`,
`canonical` ni ningún otro tag de SEO** (verificado: cero coincidencias de
esos tags en `admin/index.html`, tanto antes como después de la Fase B).
La entrada de la deuda de `og:image` contó "todos los `.html` de `dist/`"
en vez de "todas las páginas que Astro renderiza con `BaseLayout`", y de
ahí el 25 en vez de 24. El fix de `og:image` en sí (`d050d5c0`, PR #43) no
se ve afectado por esto — el conteo equivocado es solo descriptivo, no
cambia lo que se corrigió.
