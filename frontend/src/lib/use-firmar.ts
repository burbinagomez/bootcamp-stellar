"use client";

import { useState } from "react";
import { useRetroalimentacion } from "@/components/retroalimentacion";
import type { Evento, NuevoEvento } from "@/data/tipos";
import { firmarEvento } from "@/lib/stellar";
import { useOrigen } from "@/lib/store";

/** Signs an event, stores it, and plays the stamp + toast. Returns the signed event or null. */
export function useFirmar() {
  const { agregarEvento } = useOrigen();
  const { avisar, sellar } = useRetroalimentacion();
  const [firmando, setFirmando] = useState(false);

  async function firmar(nuevo: NuevoEvento, mensaje: string, conSello = true): Promise<Evento | null> {
    setFirmando(true);
    try {
      const { tx, fecha } = await firmarEvento(nuevo);
      const evento: Evento = { ...nuevo, id: `ev-${tx.slice(0, 10)}`, tx, fecha };
      agregarEvento(evento);
      if (conSello) sellar(fecha);
      avisar(mensaje);
      return evento;
    } catch {
      avisar("No se pudo firmar. Revisa tu conexión e inténtalo de nuevo.", "error");
      return null;
    } finally {
      setFirmando(false);
    }
  }

  return { firmar, firmando };
}
