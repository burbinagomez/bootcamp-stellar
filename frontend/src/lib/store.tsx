"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { actores as actoresIniciales } from "@/data/actores";
import { eventos as eventosIniciales, lotes as lotesIniciales } from "@/data/lotes";
import type { Actor, Evento, Lote } from "@/data/tipos";

interface Datos {
  lotes: Lote[];
  eventos: Evento[];
  actores: Actor[];
}

interface Origen extends Datos {
  /** False until browser storage has been read; screens show skeletons for unknown lots meanwhile. */
  hidratado: boolean;
  lote: (id: string) => Lote | undefined;
  eventosDe: (loteId: string) => Evento[];
  actor: (id: string) => Actor | undefined;
  siguienteIdLote: () => string;
  agregarLote: (lote: Lote) => void;
  agregarEvento: (evento: Evento) => void;
  agregarActor: (actor: Actor) => void;
  reiniciar: () => void;
}

const iniciales: Datos = { lotes: lotesIniciales, eventos: eventosIniciales, actores: actoresIniciales };
// shortcut: mock data lives in this browser's localStorage; replace with contract reads (Stellar RPC) in week 4.
const CLAVE = "origen-demo-v1";

const Contexto = createContext<Origen | null>(null);

export function OrigenProvider({ children }: { children: React.ReactNode }) {
  const [datos, setDatos] = useState<Datos>(iniciales);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      // Reading external storage once after mount is the point of this effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (guardado) setDatos(JSON.parse(guardado) as Datos);
    } catch {
      // Private mode or corrupt data: keep the seed data.
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datos));
    } catch {
      // Storage full or blocked: the demo keeps working in memory.
    }
  }, [datos, hidratado]);

  const lote = useCallback((id: string) => datos.lotes.find((l) => l.id === id), [datos.lotes]);
  const eventosDe = useCallback(
    (loteId: string) =>
      datos.eventos.filter((e) => e.loteId === loteId).sort((a, b) => Date.parse(a.fecha) - Date.parse(b.fecha)),
    [datos.eventos],
  );
  const actor = useCallback((id: string) => datos.actores.find((a) => a.id === id), [datos.actores]);

  const siguienteIdLote = useCallback(() => {
    const mayor = Math.max(0, ...datos.lotes.map((l) => Number(l.id.replace(/\D/g, ""))));
    return `LT-${String(mayor + 1).padStart(4, "0")}`;
  }, [datos.lotes]);

  const agregarLote = useCallback((nuevo: Lote) => setDatos((d) => ({ ...d, lotes: [...d.lotes, nuevo] })), []);
  const agregarEvento = useCallback(
    (nuevo: Evento) => setDatos((d) => ({ ...d, eventos: [...d.eventos, nuevo] })),
    [],
  );
  const agregarActor = useCallback(
    (nuevo: Actor) => setDatos((d) => ({ ...d, actores: [...d.actores, nuevo] })),
    [],
  );
  const reiniciar = useCallback(() => setDatos(iniciales), []);

  const valor = useMemo(
    () => ({
      ...datos,
      hidratado,
      lote,
      eventosDe,
      actor,
      siguienteIdLote,
      agregarLote,
      agregarEvento,
      agregarActor,
      reiniciar,
    }),
    [datos, hidratado, lote, eventosDe, actor, siguienteIdLote, agregarLote, agregarEvento, agregarActor, reiniciar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useOrigen(): Origen {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useOrigen must be used inside <OrigenProvider>");
  return valor;
}
