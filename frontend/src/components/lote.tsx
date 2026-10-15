"use client";

import { useMemo } from "react";
import { nombreRol } from "@/data/actores";
import type { Actor, Evento } from "@/data/tipos";
import { fechaHora } from "@/lib/fechas";
import { calcularSello, describirSalto, type ClaveEtapa, type Sello } from "@/lib/sello";
import { useOrigen } from "@/lib/store";
import { EstadoVacio } from "./estados";
import { Pantalla } from "./pantalla";
import type { PasoTallo } from "./tallo-custodia";

/** Lot + its events + seal. `cargando` is true only while an unknown id may still come from storage. */
export function useLote(id: string, hasta?: ClaveEtapa) {
  const { lote, eventosDe, hidratado } = useOrigen();
  const encontrado = lote(id);
  const eventos = useMemo(() => eventosDe(id), [eventosDe, id]);
  const sello = useMemo(() => calcularSello(eventos, hasta), [eventos, hasta]);
  return { lote: encontrado, eventos, sello, cargando: !encontrado && !hidratado };
}

export function LoteNoEncontrado({ id, accion }: { id: string; accion?: React.ReactNode }) {
  return (
    <Pantalla>
      <EstadoVacio
        marchita
        titulo={`No encontramos el lote ${id}`}
        texto="Revisa el código impreso en la etiqueta o escanea de nuevo el QR del empaque."
        accion={accion}
      />
    </Pantalla>
  );
}

const ESTADO_RECEPCION = { bueno: "estado bueno", danos: "con daños", incompleto: "incompleto" };

/** Timeline steps for the people in the chain (who signed, when, in what state). */
export function pasosParaActores(
  sello: Sello,
  actor: (id: string) => Actor | undefined,
  pendiente?: { clave: ClaveEtapa; quien: string },
): PasoTallo[] {
  return sello.etapas.map((etapa) => {
    const ultima: Evento | undefined = etapa.eventos.at(-1);
    const quienFirmo = ultima ? `${actor(ultima.actorId)?.nombre ?? "Actor"} · ${nombreRol[ultima.rol]}` : undefined;

    if (etapa.estado === "salto") {
      return { clave: etapa.clave, titulo: etapa.titulo, quien: quienFirmo, cuando: describirSalto(etapa), estado: "salto" };
    }
    if (etapa.estado === "pendiente") {
      const esMia = pendiente?.clave === etapa.clave;
      return {
        clave: etapa.clave,
        titulo: etapa.titulo,
        quien: esMia ? pendiente.quien : quienFirmo,
        cuando: esMia ? "pendiente de tu firma" : "pendiente",
        estado: "pendiente",
      };
    }
    const detalle = ultima?.estado ? ` · ${ESTADO_RECEPCION[ultima.estado]}` : "";
    return {
      clave: etapa.clave,
      titulo: `${etapa.titulo}${detalle}`,
      quien: quienFirmo,
      cuando: ultima ? fechaHora(ultima.fecha) : undefined,
      estado: "firmada",
    };
  });
}
