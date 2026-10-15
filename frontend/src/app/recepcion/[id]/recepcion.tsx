"use client";

import { motion } from "motion/react";
import { EsqueletoPantalla } from "@/components/estados";
import { LoteNoEncontrado, pasosParaActores, useLote } from "@/components/lote";
import { EncabezadoActor, Pantalla } from "@/components/pantalla";
import { useRetroalimentacion } from "@/components/retroalimentacion";
import { TalloCustodia } from "@/components/tallo-custodia";
import { Boton, Enlace, IconoPasskey, clasesBoton } from "@/components/ui";
import { actorDeRol } from "@/data/actores";
import { describirSalto } from "@/lib/sello";
import { useOrigen } from "@/lib/store";
import { useFirmar } from "@/lib/use-firmar";

export function Recepcion({ id }: { id: string }) {
  // The store signs last, so everything before "tienda" must already be signed.
  const { lote, sello, cargando } = useLote(id, "tienda");
  const { actor } = useOrigen();
  const { firmar, firmando } = useFirmar();
  const { avisar } = useRetroalimentacion();

  if (cargando) return <EsqueletoPantalla />;
  if (!lote) return <LoteNoEncontrado id={id} />;

  const comerciante = actor(actorDeRol.comerciante);
  const yaRecibido = sello.etapas.find((e) => e.clave === "tienda")?.estado === "firmada";
  const pasos = pasosParaActores(
    { ...sello, etapas: sello.etapas.filter((e) => ["origen", "transporte", "acopio", "tienda"].includes(e.clave)) },
    actor,
    { clave: "tienda", quien: "Tú · Comerciante" },
  );

  async function recibir() {
    await firmar(
      { loteId: lote!.id, tipo: "recepcion", actorId: comerciante!.id, rol: "comerciante", estado: "bueno" },
      `Firmaste la recepción del lote ${lote!.id}.`,
    );
  }

  return (
    <Pantalla>
      <EncabezadoActor
        rol={`Comerciante · ${comerciante?.nombre}`}
        titulo={yaRecibido ? `Recibiste el lote ${lote.id}` : `¿Recibes el lote ${lote.id}?`}
      />

      <motion.div
        key={sello.salto ? "salto" : "completo"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`mx-5 flex items-center gap-3 rounded-2xl p-4 ${
          sello.salto ? "bg-terracota-clara text-terracota-oscura" : "bg-hoja-clara text-hoja-oscura"
        }`}
      >
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0">
          <path d="M17 3l11 4v9c0 7-5 12-11 15C11 28 6 23 6 16V7z" />
          {sello.salto ? (
            <path d="M17 11v7M17 22v1" strokeLinecap="round" />
          ) : (
            <path d="M12 17l3.5 3.5L22 13" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
        <div className="flex flex-col gap-0.5">
          <span className="text-[17px] font-bold">{sello.salto ? "Historial con un salto" : "Historial completo"}</span>
          <span className="text-[13px]">
            {sello.salto ? describirSalto(sello.salto) : "Todos los pasos están firmados y en orden."}
          </span>
        </div>
      </motion.div>

      <h2 className="mx-5 mt-6 mb-3 text-base font-semibold">Recorrido firmado</h2>
      <div className="mx-5">
        <TalloCustodia pasos={pasos} />
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 bg-gradient-to-t from-fondo from-70% to-fondo/0 px-5 pt-4 pb-7">
        {yaRecibido ? (
          <div className="flex flex-col gap-3">
            <Enlace href={`/v/${lote.id}?vista=comerciante`} className={`${clasesBoton()} w-full`}>
              Ver lo que verá el cliente
            </Enlace>
            <Enlace href={`/destino/${lote.id}`} className={`${clasesBoton("secundario")} w-full`}>
              Registrar lo que sobró
            </Enlace>
          </div>
        ) : (
          <div className="flex gap-3">
            <Boton
              variante="secundario"
              className="w-[120px] shrink-0"
              onClick={() =>
                avisar(`Rechazaste el lote ${lote.id}. El acopio recibe el aviso para revisarlo.`, "info")
              }
              disabled={firmando}
            >
              Rechazar
            </Boton>
            <Boton className="flex-1" onClick={recibir} cargando={firmando && "Firmando…"}>
              <IconoPasskey />
              Firmar recepción
            </Boton>
          </div>
        )}
      </div>
    </Pantalla>
  );
}
