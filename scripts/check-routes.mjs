import { readFile } from 'node:fs/promises';

// implementa: {etapa_1}, {observabilidad_2}
const filename = new URL('../public/manus-routes.json', import.meta.url);
const manifest = JSON.parse(await readFile(filename, 'utf8'));
if (!Array.isArray(manifest.routes) || manifest.routes.length === 0) throw new Error('El manifiesto debe contener rutas.');
const seen = new Set();
for (const route of manifest.routes) {
  if (!route || typeof route.path !== 'string' || !route.path.startsWith('/') || /[\s\u0000]/.test(route.path)) {
    throw new Error(`Ruta inválida: ${JSON.stringify(route)}`);
  }
  if (seen.has(route.path)) throw new Error(`Ruta duplicada: ${route.path}`);
  seen.add(route.path);
}
console.log(`OK: ${seen.size} rutas declaradas en public/manus-routes.json`);
