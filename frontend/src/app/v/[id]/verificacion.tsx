"use client";

import { motion } from "motion/react";
import { EsqueletoPantalla } from "@/components/estados";
import { LoteNoEncontrado, useLote } from "@/components/lote";
import { Marca, Pantalla } from "@/components/pantalla";
import { EscenaVerificacion } from "@/components/plantas";
import { TalloCustodia, type PasoTallo } from "@/components/tallo-custodia";
import { Enlace, Nota } from "@/components/ui";
import { nombreRol } from "@/data/actores";
import type { Evento } from "@/data/tipos";
import { fechaCorta, fechaHora, fechaLarga } from "@/lib/fechas";
import { describirSalto, type EtapaEvaluada, type Sello } from "@/lib/sello";
import { hashCorto, simulada, urlTransaccion } from "@/lib/stellar";
import { useOrigen } from "@/lib/store";

const INSIGNIA: Record<Sello["estado"], { texto: string; clase: string }> = {
  completo: { texto: "Auténtico · historial completo", clase: "bg-hoja text-white" },
  "en-transito": { texto: "Historial al día · en camino", clase: "bg-cielo text-white" },
  salto: { texto: "Historial con un salto", clase: "bg-terracota-oscura text-white" },
};

const DESTINO = { vendido: "Sobrante vendido", donado: "Sobrante donado", compostaje: "Sobrante enviado a compostaje" };

export function Verificacion({ id, vistaPrevia }: { id: string; vistaPrevia: boolean }) {
  const { lote, eventos, sello, cargando } = useLote(id);
  const { actor } = useOrigen();

  if (cargando) return <EsqueletoPantalla etiqueta="Cargando el historial del lote" />;
  if (!lote) return <LoteNoEncontrado id={id} />;

  const productor = actor(lote.productorId);
  const insignia = INSIGNIA[sello.estado];
  const nombreDe = (evento?: Evento) => (evento ? actor(evento.actorId)?.nombre : undefined);

  function tituloPublico(etapa: EtapaEvaluada) {
    const ultimo = etapa.eventos.at(-1);
    if (etapa.clave === "destino" && ultimo?.destino) return `${DESTINO[ultimo.destino]} · ${ultimo.kg} kg`;
    if (etapa.clave === "residuo" && ultimo) return ultimo.apto ? "Convertido en abono" : "Residuo no apto para abono";
    return etapa.publico;
  }

  // Consumers see what was signed, the gaps, and (while it travels) the next custody step.
  const primeraPendiente = sello.etapas.findIndex((e) => e.estado === "pendiente");
  const enCustodia = primeraPendiente !== -1 && primeraPendiente <= sello.etapas.findIndex((e) => e.clave === "tienda");
  const pasos: PasoTallo[] = sello.etapas
    .filter((e, i) => e.estado !== "pendiente" || (i === primeraPendiente && enCustodia))
    .map((etapa) => {
      if (etapa.estado === "pendiente") {
        return { clave: etapa.clave, titulo: `Próximo paso: ${etapa.publico.toLowerCase()}`, cuando: "en camino", estado: etapa.estado };
      }
      if (etapa.estado === "salto") {
        return {
          clave: etapa.clave,
          titulo: `Sin comprobar: ${etapa.publico.toLowerCase()}`,
          cuando: "Falta una firma en este tramo",
          estado: etapa.estado,
        };
      }
      return {
        clave: etapa.clave,
        titulo: tituloPublico(etapa),
        quien: etapa.clave === "destino" ? etapa.eventos[0]?.receptor : nombreDe(etapa.eventos.at(-1)),
        cuando: fechaCorta(etapa.eventos.at(-1)!.fecha),
        estado: etapa.estado,
      };
    });

  return (
    <Pantalla tono="blanco">
      {vistaPrevia && (
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-tinta px-4 py-2 text-fondo">
          <span className="text-[13px]">Vista previa: así lo ve quien escanea el QR</span>
          <Enlace
            href={`/destino/${lote.id}`}
            className="inline-flex min-h-11 shrink-0 items-center text-[13px] font-semibold text-menta underline underline-offset-4"
          >
            Registrar sobrante
          </Enlace>
        </div>
      )}

      <section className="relative isolate flex h-[210px] items-end overflow-hidden bg-[#E7EFE6] p-5">
        <EscenaVerificacion className="absolute inset-0 -z-10 size-full" />
        <div className="absolute top-5 left-5">
          <Marca tamano={17} />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 380, damping: 24 }}
          className={`flex items-center gap-2 rounded-full py-2 pr-3.5 pl-2.5 text-sm font-semibold shadow-elevada ${insignia.clase}`}
        >
          <svg width="20" height="20" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
            <path d="M17 3l11 4v9c0 7-5 12-11 15C11 28 6 23 6 16V7z" />
            {sello.estado === "salto" ? (
              <path d="M17 11v7M17 22v1" strokeLinecap="round" />
            ) : (
              <path d="M12 17l3.5 3.5L22 13" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
          {insignia.texto}
        </motion.p>
      </section>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[30px] leading-tight font-bold tracking-[-0.02em]">{lote.producto}</h1>
          <p className="text-[15px] text-tinta-suave">Cosechado el {fechaLarga(lote.cosecha)}</p>
        </div>

        {sello.salto && (
          <Nota tono="salto">
            {describirSalto(sello.salto)} Cuando falta una firma no se puede comprobar quién tuvo el lote en ese tramo.
          </Nota>
        )}

        <div className="flex flex-col gap-1 rounded-2xl bg-fondo p-4">
          <span className="text-xs font-semibold tracking-[0.06em] text-tinta-suave uppercase">Viene de</span>
          <span className="text-[17px] font-semibold">
            {lote.finca} · {lote.municipio}
          </span>
          <span className="text-sm text-tinta-suave">Lo cultivó {productor?.nombre}</span>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Su recorrido hasta aquí</h2>
          <TalloCustodia pasos={pasos} sobre="papel" />
        </section>

        <div className="flex-1" />

        <footer className="flex flex-col gap-2 border-t border-linea pt-3.5 text-[13px] leading-[1.45] text-tinta-suave">
          <p>
            Cada paso fue firmado por quien lo hizo y quedó registrado en la red Stellar, donde nadie lo puede editar.
            {simulada && " En esta versión de prueba las firmas son simuladas."}
          </p>
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 font-semibold text-hoja marker:hidden">
              Ver las firmas en la red
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="transition-transform group-open:rotate-180">
                <path d="M3 5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <ul className="mt-1 flex flex-col divide-y divide-linea rounded-xl border border-linea">
              {eventos.map((evento) => {
                const url = urlTransaccion(evento.tx);
                return (
                  <li key={evento.id} className="flex flex-col gap-0.5 px-3.5 py-2.5">
                    <span className="font-medium text-tinta">
                      {nombreDe(evento)} · {nombreRol[evento.rol]}
                    </span>
                    <span className="flex justify-between gap-2 font-mono text-xs">
                      <span>{fechaHora(evento.fecha)}</span>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" className="text-hoja underline">
                          {hashCorto(evento.tx)}
                        </a>
                      ) : (
                        <span>{hashCorto(evento.tx)}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </details>
        </footer>
      </div>
    </Pantalla>
  );
}
