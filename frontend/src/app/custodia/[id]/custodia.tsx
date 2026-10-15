"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { EsqueletoPantalla, EstadoVacio } from "@/components/estados";
import { LoteNoEncontrado, useLote } from "@/components/lote";
import { GrupoOpciones } from "@/components/opciones";
import { EncabezadoActor, Pantalla } from "@/components/pantalla";
import { Boton, Enlace, IconoPasskey, clasesBoton, useNavegar } from "@/components/ui";
import { actorDeRol, nombreRol } from "@/data/actores";
import type { EstadoRecepcion, Rol } from "@/data/tipos";
import { ahoraIso, fechaHora, hora } from "@/lib/fechas";
import { useOrigen } from "@/lib/store";
import { useFirmar } from "@/lib/use-firmar";
import { useMontado } from "@/lib/use-montado";

/** Each custody handover: who hands the lot over and who receives it. */
const TRAMOS = {
  transporte: { entrega: "productor", recibe: "transportista", verbo: "Recoger" },
  acopio: { entrega: "transportista", recibe: "acopio", verbo: "Recibir" },
} as const satisfies Record<string, { entrega: Rol; recibe: Rol; verbo: string }>;

type Tramo = keyof typeof TRAMOS;

const ESTADOS: { valor: EstadoRecepcion; titulo: string }[] = [
  { valor: "bueno", titulo: "Bueno" },
  { valor: "danos", titulo: "Con daños" },
  { valor: "incompleto", titulo: "Incompleto" },
];

export function Custodia({ id }: { id: string }) {
  const { lote, eventos, sello, cargando } = useLote(id);
  const { actor } = useOrigen();
  const { firmar, firmando } = useFirmar();
  const navegar = useNavegar();
  const montado = useMontado();
  const [estado, setEstado] = useState<EstadoRecepcion>("bueno");
  const [pidiendo, setPidiendo] = useState(false);
  const [recienFirmado, setRecienFirmado] = useState<Tramo | null>(null);
  // Time the QR was scanned = when this screen opened.
  const escaneo = useMemo(() => (montado ? ahoraIso() : null), [montado]);

  if (cargando) return <EsqueletoPantalla />;
  if (!lote) return <LoteNoEncontrado id={id} />;

  const pendiente = (["transporte", "acopio"] as const).find(
    (clave) => sello.etapas.find((e) => e.clave === clave)?.estado !== "firmada",
  );
  const tramo: Tramo | undefined = recienFirmado ?? pendiente;

  if (!tramo) {
    return (
      <Pantalla>
        <EncabezadoActor rol={`Lote ${lote.id}`} titulo="El lote ya pasó por el acopio" />
        <EstadoVacio
          titulo="No queda ninguna entrega por firmar"
          texto="Transportista y acopio ya firmaron. El siguiente paso es la recepción en la tienda."
          accion={
            <Enlace href={`/recepcion/${lote.id}`} className={clasesBoton("primario", "mediano")}>
              Ir a la recepción
            </Enlace>
          }
        />
      </Pantalla>
    );
  }

  const { entrega: rolEntrega, recibe: rolRecibe, verbo } = TRAMOS[tramo];
  const quienEntrega = actor(actorDeRol[rolEntrega]);
  const quienRecibe = actor(actorDeRol[rolRecibe]);
  const firmaEntrega = eventos.find((e) => e.tipo === "entrega" && e.rol === rolEntrega);
  const firmaRecibe = eventos.find((e) => e.tipo === "recepcion" && e.rol === rolRecibe);
  // Both handovers end at the collection center: farm → center, then driver → center.
  const destinoRuta = actor(actorDeRol.acopio)?.nombre;

  async function pedirFirma() {
    setPidiendo(true);
    await firmar(
      { loteId: lote!.id, tipo: "entrega", actorId: quienEntrega!.id, rol: rolEntrega },
      `${quienEntrega!.nombre} firmó la entrega desde su celular.`,
      false,
    );
    setPidiendo(false);
  }

  async function firmarRecepcion() {
    const firmado = await firmar(
      { loteId: lote!.id, tipo: "recepcion", actorId: quienRecibe!.id, rol: rolRecibe, estado },
      `Firmaste la recepción del lote ${lote!.id}.`,
    );
    if (firmado) setRecienFirmado(tramo!);
  }

  function continuar() {
    setRecienFirmado(null);
    setEstado("bueno");
    if (tramo === "acopio") navegar(`/recepcion/${lote!.id}`);
  }

  return (
    <Pantalla>
      <EncabezadoActor
        rol={`${nombreRol[rolRecibe]} · ${quienRecibe?.nombre}`}
        titulo={`${verbo} lote ${lote.id}`}
      />

      <div className="mx-5 flex items-center gap-3.5 rounded-2xl border border-linea bg-papel p-4 shadow-tarjeta">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#DCE5D9]">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="var(--color-hoja)" strokeWidth="1.8" aria-hidden="true">
            <ellipse cx="15" cy="17" rx="8" ry="10" />
            <circle cx="15" cy="19" r="3.5" />
            <path d="M15 7c0-2 1-4 3-5" />
          </svg>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-semibold">
            {lote.producto} · {lote.kg} kg
          </span>
          <span className="text-[13px] text-tinta-suave">
            {tramo === "transporte" ? `${lote.finca}, ${lote.municipio.split(",")[0]}` : quienEntrega?.nombre} → {destinoRuta}
          </span>
          <span className="font-mono text-xs text-tinta-suave">
            QR escaneado · {escaneo ? fechaHora(escaneo) : "ahora"}
          </span>
        </div>
      </div>

      <h2 className="mx-5 mt-6 mb-2.5 text-base font-semibold">Doble firma de la entrega</h2>
      <ol className="mx-5 flex flex-col gap-2.5">
        <li className="flex min-h-[72px] items-center gap-3 rounded-[14px] border border-linea bg-papel px-4 py-3 shadow-tarjeta">
          <MarcaFirma firmada={Boolean(firmaEntrega)} />
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[15px] font-semibold">
              {firmaEntrega ? `Entregado por ${quienEntrega?.nombre}` : `Falta la firma de ${quienEntrega?.nombre}`}
            </span>
            <span className="text-[13px] text-tinta-suave">
              {nombreRol[rolEntrega]} · {firmaEntrega ? `firmado ${hora(firmaEntrega.fecha)}` : "quien entrega firma primero"}
            </span>
          </div>
          {!firmaEntrega && (
            <Boton variante="secundario" tamano="mediano" onClick={pedirFirma} cargando={pidiendo && "Esperando…"} className="shrink-0">
              Pedir firma
            </Boton>
          )}
        </li>
        <li
          className={`flex min-h-[72px] items-center gap-3 rounded-[14px] bg-papel px-4 py-3 shadow-tarjeta ${
            firmaRecibe ? "border border-linea" : "border-2 border-hoja"
          }`}
        >
          <MarcaFirma firmada={Boolean(firmaRecibe)} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">{firmaRecibe ? `Recibido por ${quienRecibe?.nombre}` : "Recibido por ti"}</span>
            <span className="text-[13px] text-tinta-suave">
              {nombreRol[rolRecibe]} · {firmaRecibe ? `firmado ${hora(firmaRecibe.fecha)}` : "pendiente de tu firma"}
            </span>
          </div>
        </li>
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        {recienFirmado ? (
          <motion.div
            key="listo"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-5 mt-5 rounded-2xl bg-hoja-clara p-4 text-hoja-oscura"
          >
            <p className="font-semibold">La custodia quedó firmada por los dos.</p>
            <p className="mt-1 text-[13px] leading-normal">
              {tramo === "transporte"
                ? `El lote viaja hacia ${destinoRuta}. Allí firman la siguiente entrega.`
                : "El lote quedó en el acopio. La tienda revisará el historial antes de recibirlo."}
            </p>
          </motion.div>
        ) : (
          <motion.div key="estado" exit={{ opacity: 0 }} className="mx-5 mt-5">
            <GrupoOpciones
              leyenda="Estado del lote al recibir"
              opciones={ESTADOS}
              valor={estado}
              onCambio={setEstado}
              columnas={3}
              forma="fila"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1" />
      <div className="sticky bottom-0 flex flex-col gap-2 bg-gradient-to-t from-fondo from-70% to-fondo/0 px-5 pt-5 pb-7">
        {recienFirmado ? (
          <Boton className="w-full" onClick={continuar}>
            {tramo === "transporte" ? "Continuar: entrega en el acopio" : "Continuar: recepción en la tienda"}
          </Boton>
        ) : (
          <>
            {!firmaEntrega && (
              <p id="ayuda-firma" className="text-center text-[13px] text-tinta-suave">
                Firmas cuando {quienEntrega?.nombre} haya firmado la entrega.
              </p>
            )}
            <Boton
              className="w-full"
              onClick={firmarRecepcion}
              disabled={!firmaEntrega}
              aria-describedby={!firmaEntrega ? "ayuda-firma" : undefined}
              cargando={firmando && !pidiendo && "Firmando con tu passkey…"}
            >
              <IconoPasskey />
              Firmar recepción
            </Boton>
          </>
        )}
      </div>
    </Pantalla>
  );
}

function MarcaFirma({ firmada }: { firmada: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
      <AnimatePresence initial={false} mode="wait">
        {firmada ? (
          <motion.g key="si" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ originX: 0.5, originY: 0.5 }}>
            <circle cx="13" cy="13" r="11" stroke="var(--color-hoja)" strokeWidth="2" />
            <path d="M8.5 13.5l3 3 6-7" stroke="var(--color-hoja)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        ) : (
          <motion.circle key="no" cx="13" cy="13" r="11" stroke="var(--color-tinta-suave)" strokeWidth="2" strokeDasharray="3 3" exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>
    </svg>
  );
}
