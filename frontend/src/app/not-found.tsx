import { clasesBoton } from "@/components/clases-boton";
import { EstadoVacio } from "@/components/estados";
import { Pantalla } from "@/components/pantalla";
import { Enlace } from "@/components/ui";

export default function NoEncontrada() {
  return (
    <Pantalla>
      <EstadoVacio
        titulo="Esta página no existe"
        texto="Revisa la dirección o vuelve al inicio para seguir el recorrido de tus lotes."
        accion={
          <Enlace href="/" atras className={clasesBoton("secundario", "mediano")}>
            Ir al inicio
          </Enlace>
        }
      />
    </Pantalla>
  );
}
