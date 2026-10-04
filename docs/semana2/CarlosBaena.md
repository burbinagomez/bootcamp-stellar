# Historias de usuario individuales

**Nombre:** Carlos Andrés Baena Moncada

**Usuario de GitHub:** 1PcodeP1

---

## Mis historias de usuario

1. Como **consumidor final** quiero escanear el código QR de un producto en la tienda y ver su origen, la finca, la fecha de cosecha y por qué manos pasó, para saber si lo que estoy comprando es auténtico antes de pagar.
2. Como **productor agrícola** quiero registrar cada lote al momento de la cosecha (origen, fecha, cantidad y fotos) y obtener un código único para ese lote, para demostrar de dónde viene mi producto y diferenciarlo de los que no tienen origen comprobable.
3. Como **transportista o centro de acopio** quiero confirmar desde el celular cada vez que recibo o entrego un lote, dejando constancia de quién lo entrega, quién lo recibe y en qué condiciones llega, para que la cadena de custodia quede registrada sin depender de papeles que se pierden.
4. Como **tienda o distribuidor** quiero revisar el historial completo de un lote antes de aceptarlo de un proveedor, para no recibir ni revender producto adulterado o de origen dudoso.
5. Como **gestor de residuos orgánicos** quiero registrar los residuos que recibo vinculados al lote del que provienen y marcarlos como aptos o no aptos para compostaje, para garantizar que el abono que produzco viene de material limpio.
6. Como **agricultor que compra abono orgánico** quiero verificar de qué residuos se produjo el abono y cómo fue tratado, para confiar en que no voy a contaminar mi cultivo.
7. Como **inspector de calidad o auditor** quiero consultar en un solo lugar todos los eventos registrados de un lote cuando hay una queja o sospecha de contaminación, para reconstruir lo que pasó en minutos y no en semanas.

## La más importante y por qué

| Orden de importancia | Historia # | Por qué |
| :---: | :---: | --- |
| 1 (la más importante) | 2 | Es el punto de partida de toda la cadena: si el lote no se registra en el origen, ninguna verificación posterior tiene sobre qué apoyarse. Sin esta historia el producto no existe. |
| 2 | 3 | Es donde hoy se rompe la trazabilidad según el Problem Brief (pasos 2 y 4): cada cambio de manos queda en registros separados. Registrar la custodia entre actores que no confían entre sí es lo que justifica un registro compartido. |
| 3 | 1 | Es el valor visible para el usuario principal del Problem Brief. Depende de que las historias 2 y 3 existan, pero es la que convierte la trazabilidad en confianza a la hora de comprar. |
| 4 | 4 | Le da al distribuidor una razón concreta para usar la plataforma: filtrar proveedores y evitar pérdidas. Ayuda a la adopción, que es el primer riesgo identificado en el Problem Brief. |
| 5 | 7 | Resuelve la segunda fricción del Problem Brief (reconstruir el historial ante un problema), pero es un caso de uso ocasional y se apoya en los mismos datos de las historias 2 y 3. |
| 6 | 5 | Extiende la trazabilidad a los residuos orgánicos, que es parte del problema elegido, pero suma un actor y un flujo nuevo; tiene sentido una vez el flujo del producto funcione. |
| 7 (la menos importante) | 6 | Es el último eslabón del ciclo de residuos y depende de que la historia 5 esté funcionando. Aporta valor, pero puede quedar para una versión posterior. |
