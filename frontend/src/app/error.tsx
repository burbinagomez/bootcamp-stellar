"use client";

import { useEffect } from "react";
import { EstadoVacio } from "@/components/estados";
import { Pantalla } from "@/components/pantalla";
import { Boton } from "@/components/ui";

export default function ErrorDePantalla({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Pantalla>
      <EstadoVacio
        marchita
        titulo="Esta pantalla no cargó"
        texto="Tus firmas están a salvo: quedan registradas aunque la pantalla falle. Vuelve a cargarla para continuar."
        accion={
          <Boton variante="secundario" tamano="mediano" onClick={() => retry()}>
            Volver a cargar
          </Boton>
        }
      />
    </Pantalla>
  );
}
