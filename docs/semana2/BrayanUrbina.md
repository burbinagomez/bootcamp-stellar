# Historias de usuario individuales

**Nombre:** Brayan Urbina

**Usuario de GitHub:** burbinagomez

---

## Mis historias de usuario

1. Como **productor agrícola** quiero crear mi cuenta y que una entidad de confianza (cooperativa o asociación) valide que soy productor real, para que los lotes que registre tengan respaldo y no cualquiera pueda hacerse pasar por mí.
2. Como **comerciante** quiero ver en cada lote un sello que indique si su historial está completo o tiene saltos entre actores, para decidir rápido si lo compro o si pido más información al proveedor.
3. Como **distribuidor** quiero firmar digitalmente la recepción de un lote y que esa firma no pueda modificarse después, para tener evidencia en caso de una disputa con el proveedor o con el cliente.
4. Como **consumidor final** quiero reportar desde la página del lote un producto que me parezca adulterado o en mal estado, para alertar a la cadena y que el reporte quede asociado al historial del lote.
5. Como **productor agrícola** quiero ver qué tiendas recibieron mis lotes y cuántas veces los consumidores escanearon su código, para demostrarles a mis compradores que mi producto genera confianza.
6. Como **gestor de residuos orgánicos** quiero emitir un certificado de que el residuo recibido fue convertido en compostaje, ligado a su lote de origen, para que el generador del residuo pueda demostrar que lo aprovechó correctamente.
7. Como **administrador de la plataforma** quiero asignar a cada usuario su rol (productor, transportista, distribuidor, comerciante, gestor de residuos), para que cada actor solo pueda registrar los eventos que le corresponden.

## La más importante y por qué

| Orden de importancia | Historia # | Por qué |
| :---: | :---: | --- |
| 1 (la más importante) | 3 | La firma de recepción que nadie puede cambiar es el corazón del producto: es lo que hace que el historial sirva como evidencia entre actores que no confían entre sí. |
| 2 | 7 | Sin roles cualquiera podría registrar cualquier evento y el historial perdería credibilidad. Es una base técnica de las demás historias. |
| 3 | 1 | Si la identidad del productor no está respaldada, el origen del lote, que es el primer dato de la cadena, no vale nada. |
| 4 | 2 | Convierte el historial en una decisión simple para el comerciante, que es quien filtra lo que llega al consumidor. |
| 5 | 6 | Cubre la parte de residuos del problema elegido y le da valor ambiental al producto, pero depende de que el flujo del lote ya funcione. |
| 6 | 4 | Suma la voz del consumidor al historial, aunque al inicio el volumen de reportes será bajo. |
| 7 (la menos importante) | 5 | Es un incentivo útil para que el productor adopte la plataforma, pero no es necesario para que la trazabilidad funcione. |
