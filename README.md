# Habitat Home

Demostración técnica de un catálogo digital para tiendas de muebles. La marca, los productos, sus especificaciones y los precios son ficticios. Las fotografías ilustran el tipo de producto.

## Recorrido de la demo

- Selecciona una colección para abrir el catálogo filtrado.
- Combina categorías, búsqueda por nombre, categoría o material, y orden por precio.
- Guarda productos con el corazón. El botón del encabezado abre la vista de favoritos, que se guarda en este navegador.
- Abre una ficha para consultar dimensiones, materiales y precio en pesos colombianos. **Cotizar por WhatsApp (demo)** muestra una vista previa del mensaje dentro de la ficha.

El proyecto usa React, Vite, CSS y Lucide. Se sirve como aplicación estática y el flujo de cotización funciona localmente, sin destinatario, pagos, backend, credenciales ni variables de entorno.

## Ejecutar y verificar

Requisitos: Node.js 22.12+ de la rama 22 o Node.js 24, y npm.

```bash
npm ci
npm run dev
```

En PowerShell, si la política de ejecución bloquea `npm.ps1`, usa `npm.cmd ci` y `npm.cmd run dev`.

```bash
npm test
npm run build
npm run preview
```

## Desplegar con Vercel

Importa el repositorio como proyecto Vite. La configuración incluida ejecuta `npm ci` y `npm run build`, y sirve el contenido de `dist/`. Usa Node.js 22.x o 24.x. El plan Hobby se limita al uso personal no comercial. Para promocionar servicios freelance o captar clientes, usa un plan que permita ese uso. [Planes de Vercel](https://vercel.com/docs/plans) · [Condiciones de Vercel](https://vercel.com/legal/terms).

## Créditos

Fotografías alojadas con el proyecto en WebP y con tamaños adaptados a la pantalla. Consulta [orígenes y licencias](./ASSETS.md). Las fuentes DM Sans y Playfair Display se distribuyen con sus avisos SIL Open Font License en [public/fonts](./public/fonts).
