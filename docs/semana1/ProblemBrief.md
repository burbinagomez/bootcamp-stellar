# Problem Brief

## Decisión del problema

### Problema elegido

Los alimentos, sus excedentes y los residuos orgánicos que generan no pueden verificarse a lo largo de la cadena, desde el campo hasta el consumidor final o el compostaje: nadie puede comprobar de dónde vienen, por qué manos pasaron ni a dónde fueron a parar. Lo tomé de una de las propuestas individuales del equipo y le sumé el enfoque de excedentes y desperdicio de alimentos de otra.

### Por qué elegimos este

Lo elegí porque dos de las tres propuestas individuales apuntaban al mismo flujo: alimentos cuyo origen y destino no se pueden demostrar. Al unirlas, el problema cubre la cadena completa, desde la cosecha hasta el excedente y el abono. Además cumple dos criterios de la Sesión 1: varias partes que no confían entre sí (productor, transportista, distribuidor, comerciante, restaurante o comedor, consumidor y gestor de residuos) necesitan compartir un mismo registro, y el historial de cada lote no debería poder alterarse. Tiene también un impacto económico y ambiental medible: en Colombia se pierde o desperdicia cerca de una de cada tres toneladas de alimentos disponibles.

### Propuestas descartadas

- **Historial de vehículos usados en Colombia.** Se descartó porque una parte del historial ya la cubre el RUNT (propietarios, SOAT, revisión técnico-mecánica) y el resto depende de que talleres y aseguradoras, que hoy no tienen incentivo para hacerlo, registren su información. Esas eran justamente las dos dudas que la propia propuesta dejaba por validar.
- **Trazabilidad del desperdicio de alimentos.** No se descartó: se integró al problema elegido como la parte de excedentes, donaciones y residuos de los servicios de alimentación.

### Cómo tomamos la decisión

Cada integrante planteó un problema en su propuesta individual. Yo las comparé y vi que dos de ellas describían el mismo problema desde las dos puntas de la cadena: el origen del producto y el destino de lo que sobra. Decidí unirlas en un solo problema y dejar de lado la propuesta de vehículos, que no se conectaba con las otras dos y que en parte ya cubre el RUNT.

---

## Problem Brief

### Encabezado

Origen. Cuando los alimentos, sus excedentes y los residuos orgánicos no pueden verificarse desde el campo hasta el consumidor final o el compostaje, se pierde confianza, queda espacio para el fraude y se desperdicia valor económico y ambiental.

### Equipo y roles

El equipo tiene tres integrantes. Cada uno planteó un problema en su propuesta individual, que está en `docs/semana1/`:

- Trazabilidad de productos y residuos orgánicos desde el campo hasta el consumidor final (base del problema elegido).
- Trazabilidad del desperdicio de alimentos en servicios de alimentación (integrada al problema elegido).
- Historial de vehículos usados en Colombia (descartada).

A partir de esas propuestas, yo elegí el problema, elaboré este Problem Brief y diseñé la propuesta escogida.

Canal de coordinación: el repositorio y el tablero Kanban en GitHub.

### Problema y evidencia

Los alimentos que salen del campo, sus excedentes y los residuos orgánicos que generan no pueden verificarse a lo largo de la cadena logística. En cada cambio de manos (de la finca al transporte, al centro de acopio, al distribuidor y al comerciante o al restaurante) el origen, la calidad y la identidad del lote quedan anotados de forma parcial, en registros que cada actor guarda a su manera. Lo mismo pasa al final: nadie puede demostrar cuánto alimento sobró, si se vendió, se donó o terminó en la basura, ni si un residuo orgánico viene de un origen limpio y sirve para compostaje. Es un problema diario, porque ocurre con cada lote que se mueve, y alcanza a toda la cadena de alimentos frescos.

Evidencia:

- **Fuentes consultadas.** Según un estudio del DNP, en Colombia se pierden o desperdician 9,76 millones de toneladas de alimentos al año, el 34 % de la oferta disponible ([Semana](https://www.semana.com/pais/articulo/colombianos-desperdician-9-millones-de-toneladas-de-comida/221786/)). La FAO estima que cerca del 60 % de esa pérdida y desperdicio ocurre antes del consumo, en producción, transporte y almacenamiento ([Tetra Pak, citando a la FAO](https://www.tetrapak.com/es-co/about-tetra-pak/news-and-events/newsarchive/colombia-pierde-9-76-millones-de-toneladas-de-alimentos-al-ano--)), justo los tramos donde hoy no queda un registro compartido.
- **Propuestas individuales.** Una de las propuestas individuales describe que cada actor maneja su propia información y que, cuando surge una duda sobre el origen o el manejo de un producto, no existe una evidencia común que resuelva el conflicto. Otra señala que los servicios de alimentación no tienen datos de cuánto alimento se bota o se dona.
- **Pendiente.** Validar el problema con conversaciones directas con productores, comerciantes y comedores comunitarios (ver supuestos).

### Usuario y actores

El usuario principal es la persona que compra alimentos o productos agrícolas y quiere confiar en que lo que recibe es auténtico, seguro y viene de donde dice. Junto a ella sufren el problema los actores que necesitan demostrar algo: el productor honesto, que no puede probar el origen de su cosecha, y los restaurantes, comedores comunitarios y comerciantes, que no pueden demostrar a dónde fue a parar el alimento que les sobró.

Hoy lo resuelven con facturas y remisiones en papel, cuadernos, hojas de cálculo y mensajes de WhatsApp que cada uno guarda a su manera. Eso cuesta tiempo para confirmar datos, aumenta los errores y hace casi imposible demostrar autenticidad cuando surge una disputa. Cuesta dinero, porque se paga igual por un producto dudoso que por uno auténtico y se pierden lotes completos ante una queja que no se puede aclarar. Y cuesta valor ambiental, porque sin datos de cuánto sobra ni en qué estado, el excedente termina en la basura en lugar de donarse o convertirse en abono.

Actores que intervienen:

- **Productor:** cosecha y arma el lote; necesita demostrar su origen.
- **Transportista:** lleva el lote entre la finca, el acopio y la distribución.
- **Centro de acopio o distribuidor:** almacena, clasifica y vende a comerciantes y restaurantes.
- **Comerciante:** necesita confirmar la calidad y el origen de lo que ofrece.
- **Restaurante o comedor comunitario:** prepara alimentos y decide si el excedente se vende, se dona (por ejemplo, a un banco de alimentos) o va a compostaje.
- **Consumidor final:** quiere saber qué está comprando.
- **Gestor de residuos orgánicos:** convierte los residuos en compostaje o abono y necesita verificar que el material es limpio.

### Flujo actual de valor

1. El productor cosecha y arma el lote en la finca.
2. La información del lote (origen, fecha, cantidad, calidad) se registra de forma parcial, en papel, Excel o mensajes, y se queda con el productor.
3. El transportista lleva el lote al centro de acopio o al distribuidor, con una remisión o factura en papel como único respaldo.
4. En el acopio y la distribución el lote se inspecciona, se clasifica y cambia de manos. Cada actor anota en sus propios registros y la trazabilidad no queda integrada. *Obligación normativa:* las inspecciones de calidad e inocuidad responden a la normativa sanitaria de alimentos.
5. El distribuidor vende al comerciante o al restaurante, y estos al consumidor final, sin poder comprobar el origen exacto del lote.
6. Lo que sobra en comerciantes, restaurantes y comedores se vende, se dona o se entrega como residuo orgánico al gestor de residuos para compostaje o abono, sin evidencia de su lote de origen, su cantidad ni su manejo. *Obligación normativa:* la [Ley 1990 de 2019](https://alertas.directoriolegislativo.org/wp-content/uploads/2019/08/LEY-1990-DE-2019.pdf) fija un orden de prioridad para el alimento que sobra: primero reducir la pérdida, luego destinarlo al consumo humano, por ejemplo con donaciones, y solo después aprovecharlo como residuo orgánico.
7. Cuando surge una queja, contaminación, fraude o diferencia de calidad, la cadena de evidencia es difícil de reconstruir.

Intermediarios entre el productor y el consumidor final: transportista, centro de acopio o distribuidor, y comerciante o restaurante. Para lo que sobra intervienen además los bancos de alimentos y los gestores de residuos. Ninguno de ellos concentra la información: cada uno guarda solo su parte del recorrido.

### Fricciones identificadas

**Fricción 1 (pasos 2 y 4): no hay un registro compartido y verificable del lote.** Cada actor anota el origen, la calidad y la entrega en sus propios registros, que no se comparten y se pueden perder o alterar. Afecta al productor, que no puede probar el origen de su cosecha; al comerciante y al consumidor, que no pueden verificar lo que compran, y al gestor de residuos, que no sabe de qué lote viene el material.

**Fricción 2 (paso 7): el historial no se puede reconstruir cuando hay un problema.** Ante una queja, una contaminación o una sospecha de fraude hay que perseguir papeles y mensajes entre varios actores. Esto provoca retrasos, disputas, devoluciones de lotes completos y daño a la reputación. Afecta sobre todo al distribuidor y al comerciante, y al productor honesto, que termina pagando por la duda.

**Fricción 3 (paso 6): no se sabe a dónde va lo que sobra.** Nadie registra cuánto excedente hubo ni si se vendió, se donó o se botó, y sin el lote de origen no se puede saber si un residuo es apto para compostaje. Afecta a los restaurantes y comedores, que no pueden demostrar que aprovechan sus excedentes; al gestor de residuos, que no puede garantizar un abono limpio, y a quien compra ese abono.

Las tres fricciones tienen la misma raíz: falta una trazabilidad compartida y verificable que acompañe al lote desde la finca hasta el consumidor final o el compostaje.

### Oportunidad e hipótesis

Prioricé la **fricción 1 (pasos 2 y 4)**: la falta de una trazabilidad compartida y verificable del lote. La elegí porque es la raíz de las otras dos. Si el origen y cada cambio de manos quedan registrados desde la finca, el historial se puede reconstruir en minutos cuando hay una queja (fricción 2) y el excedente o el residuo se puede ligar a su lote de origen (fricción 3). Sin ese registro, ninguna de las otras dos tiene solución.

La hipótesis es que un registro en blockchain, compartido por todos los actores, permitiría que cada uno firme su propio evento (cosecha, entrega, recepción, destino del excedente) en un historial que ninguno controla por sí solo y que nadie puede editar después. Para los usuarios cambiaría lo siguiente:

- El consumidor final podría escanear un código y ver de qué finca viene el lote y por qué manos pasó antes de comprarlo.
- El comerciante podría decidir si acepta un lote mirando si su historial está completo o tiene saltos.
- El productor honesto podría diferenciar su producto con evidencia y no solo con su palabra.
- El restaurante o comedor podría demostrar a dónde fue cada excedente, y el gestor de residuos, que su abono viene de material limpio.

### Criterio de pertinencia

Este caso se apoya en dos criterios de la Sesión 1.

**Varias partes que no confían entre sí necesitan compartir un mismo registro.** Productor, transportista, centro de acopio, distribuidor, comerciante, restaurante o comedor, consumidor y gestor de residuos tienen intereses distintos: quien vende quiere vender caro y quien compra quiere pagar por lo que realmente recibe. Hoy la información no está centralizada en nadie: cada actor guarda su parte. Una base de datos tradicional obligaría a que uno de ellos, o una empresa nueva, controle el registro, y los demás tendrían que confiar en que no lo modifique a su favor. Integrar los sistemas existentes tampoco sirve, porque la mayoría de estos actores no tiene sistemas: usa papel, Excel y WhatsApp.

**El histórico no puede alterarse.** El valor del registro está en que sirva como evidencia cuando hay una reclamación, una diferencia de calidad o una sospecha de fraude. Si un actor pudiera borrar o cambiar un evento pasado, como la fecha de una entrega o el estado en que llegó un lote, el historial dejaría de servir justo cuando más se necesita. Un registro distribuido, donde cada evento queda firmado por quien lo hizo y no se puede editar, permite que todos validen una historia común sin depender de un intermediario que la custodie.

### Supuestos y riesgos

**Supuesto 1:** los actores de la cadena están dispuestos a registrar cada evento del lote. Lo invalidaría que no vean una ventaja concreta, por ejemplo, que el comerciante no prefiera ni pague mejor un lote con historial completo.

**Supuesto 2:** es posible capturar información confiable desde el origen, incluso en la finca y con conectividad limitada. Lo invalidaría que los datos iniciales se registren incompletos o falsos: un registro inalterable de un dato falso no aporta confianza.

**Supuesto 3:** existe una demanda real por verificar el origen y el destino de los alimentos. Lo invalidaría que el consumidor no escanee el código o no cambie su decisión de compra al ver el historial, o que los restaurantes y comedores no necesiten demostrar el destino de sus excedentes.

Los riesgos principales son la baja adopción por parte de productores y distribuidores, la falta de estandarización de los datos entre actores y la dificultad de registrar eventos desde el campo. Si alguno de los supuestos falla, la solución no mejoraría la trazabilidad de los alimentos ni el aprovechamiento de sus excedentes y residuos, aunque la tecnología funcione.
