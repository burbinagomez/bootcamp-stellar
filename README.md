## Requisitos

- Node.js 22.18 o superior (las pruebas usan `node --test` directo sobre TypeScript).
- npm 10 o superior.
- Un navegador reciente (Chrome, Edge, Safari o Firefox). Las transiciones entre pantallas usan View Transitions; si el navegador no las soporta, la app funciona igual sin animarlas.

## Instalación

```bash
git clone https://github.com/burbinagomez/bootcamp-stellar.git
cd bootcamp-stellar/frontend
npm install
```

## Cómo correrlo

```bash
npm run dev
```

Abre http://localhost:3000 y entra con el correo que ya viene escrito. El recorrido completo es: mis lotes → registrar lote → QR → custodia → recepción → verificación pública → destino → residuo. El panel del administrador está en http://localhost:3000/admin.

Para escanear el QR con el celular, abre la app desde la dirección `Network` que imprime `npm run dev` (el computador y el celular deben estar en la misma red Wi-Fi): el QR apunta al host desde el que se abrió la app. Los lotes de ejemplo (LT-0398 a LT-0412) se ven en cualquier dispositivo; un lote nuevo solo existe en el navegador donde se registró.

Los datos son de prueba y se guardan en el navegador. Para volver al estado inicial, usa "Restablecer datos de prueba" en `/admin`. Las firmas son simuladas hasta la integración con Stellar (`frontend/src/lib/stellar/`).

Otros comandos, dentro de `frontend/`:

```bash
npm run build && npm start   # versión de producción
npm test                     # pruebas del cálculo del sello
npm run lint
```
