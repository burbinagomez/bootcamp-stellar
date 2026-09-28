# Propuesta individual — Carlos Andrés Baena Moncada (@1PcodeP1)

## El problema

Quien compra un carro usado en Colombia no tiene forma confiable de saber el estado real del vehículo a lo largo de su vida: kilometraje, mantenimientos, choques y reparaciones.

## ¿Quién lo sufre?

- **El comprador de un vehículo usado**, sobre todo el particular que compra a otro particular o en un concesionario de usados. Lo vive en el momento de la negociación: le toca creerle al vendedor sobre cuántos kilómetros tiene el carro, si ha sido chocado o si se le hicieron los mantenimientos.
- **El vendedor honesto**, que no tiene cómo demostrar que su carro está bien cuidado y termina vendiendo al mismo precio que alguien que le bajó el kilometraje o escondió un choque.

La situación típica: el comprador ve un carro con pocos kilómetros y buen aspecto, paga, y semanas después un taller le dice que el odómetro fue manipulado o que el vehículo tuvo una reparación estructural que nadie mencionó.

## ¿Cómo se resuelve hoy y qué cuesta?

Hoy el estado del vehículo está regado entre varias partes que no comparten información:

- **RUNT / tránsito:** registra propietarios, SOAT, revisión técnico-mecánica y comparendos, pero no el historial de mantenimientos ni reparaciones.
- **Talleres y concesionarios:** cada uno guarda sus propios registros (o ninguno), en papel o en su sistema interno.
- **Aseguradoras:** conocen los siniestros reclamados, pero esa información no está disponible para el comprador.
- **Peritajes privados:** el comprador paga un peritaje antes de comprar para revisar el estado físico del carro.

**Lo que le cuesta al usuario:**

- **Dinero:** el peritaje (un costo adicional en cada carro que evalúa) y, si lo engañan, reparaciones inesperadas o pagar de más por un carro que vale menos.
- **Tiempo:** llevar el carro a peritaje, pedir facturas al vendedor, consultar en varias fuentes distintas.
- **Esfuerzo y riesgo:** aun con peritaje, el kilometraje adulterado o una reparación bien disimulada pueden pasar desapercibidos, porque el peritaje ve el estado actual, no la historia.

## ¿Por qué creo que blockchain podría aportar?

**Hipótesis (no certeza):** si cada cambio de estado del vehículo (lectura de kilometraje en un mantenimiento, reparación, siniestro, traspaso) quedara registrado por quien lo realiza en un registro compartido, el comprador podría consultar la historia completa del carro antes de pagar.

Criterios de la Sesión 1 que la apoyan:

1. **Partes que no confían entre sí comparten un registro:** talleres, aseguradoras, concesionarios, vendedores y compradores tienen intereses distintos (el vendedor quiere vender caro, el taller no quiere perder clientes), y hoy ninguno tiene incentivo para confiar en la base de datos del otro.
2. **Histórico inalterable:** el problema de fondo es que el estado del vehículo se puede "reescribir" (bajar el kilometraje, perder facturas, ocultar un choque). Un registro donde las lecturas pasadas no se puedan modificar haría evidente cualquier kilometraje que baje en lugar de subir.

Lo que queda por validar: si talleres y aseguradoras estarían dispuestos a registrar la información, y qué parte del problema ya cubre el RUNT.
