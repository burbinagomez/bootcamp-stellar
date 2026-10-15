"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { EsqueletoPantalla } from "@/components/estados";
import { LoteNoEncontrado, useLote } from "@/components/lote";
import { Pantalla } from "@/components/pantalla";
import { EscenaNoche } from "@/components/plantas";
import { QrLote } from "@/components/qr-lote";
import { useRetroalimentacion } from "@/components/retroalimentacion";
import { Boton, Enlace, clasesBoton } from "@/components/ui";
import { fechaCorta, fechaLarga } from "@/lib/fechas";
import { hashCorto, simulada, urlTransaccion } from "@/lib/stellar";

const sinSuscripcion = () => () => {};

export function LoteQr({ id }: { id: string }) {
  const { lote, eventos, sello, cargando } = useLote(id);
  const { avisar } = useRetroalimentacion();
  // The QR points at whatever host serves the app (localhost, LAN IP or a deploy).
  const origen = useSyncExternalStore(
    sinSuscripcion,
    () => window.location.origin,
    () => null,
  );

  if (cargando) return <EsqueletoPantalla />;
  if (!lote)
    return (
      <LoteNoEncontrado
        id={id}
        accion={
          <Enlace href="/productor" atras className={clasesBoton("secundario", "mediano")}>
            Ver mis lotes
          </Enlace>
        }
      />
    );

  const registro = eventos.find((e) => e.tipo === "registro");
  const enlace = origen ? `${origen}/v/${lote.id}` : null;
  const urlTx = registro ? urlTransaccion(registro.tx) : null;
  // The lot has left once both producer and driver signed the handover.
  const salio = sello.etapas.some((e) => e.clave === "transporte" && e.estado === "firmada");
  const titulo = !salio
    ? `Lote ${lote.id} listo para salir`
    : sello.estado === "completo"
      ? `Lote ${lote.id} entregado`
      : sello.estado === "salto"
        ? `Lote ${lote.id} con un salto`
        : `Lote ${lote.id} en camino`;

  async function compartir() {
    if (!enlace) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${lote!.producto} · ${lote!.id}`, url: enlace });
        return;
      }
      await navigator.clipboard.writeText(enlace);
      avisar("Copiaste el enlace de verificación del lote.");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") avisar("No se pudo compartir. Copia el enlace a mano.", "error");
    }
  }

  return (
    <Pantalla tono="noche">
      <EscenaNoche className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[250px] w-full" />

      <div className="flex flex-1 flex-col gap-5 px-6 pt-6 pb-7">
        <Enlace
          href="/productor"
          atras
          className="-ml-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg px-2 text-sm font-medium text-noche-texto hover:text-fondo"
        >
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M14 4l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Mis lotes
        </Enlace>

        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2.5 text-sm font-semibold text-menta">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="9" />
              <path d="M7 11.5l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {simulada ? "Registro firmado · simulación de testnet" : "Registro firmado en Stellar"}
          </p>
          <h1 className="font-display text-[34px] leading-[1.05] font-bold tracking-[-0.03em] text-balance">{titulo}</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="etiqueta-imprimible flex flex-col items-center gap-3.5 rounded-[20px] bg-papel p-[22px] text-tinta shadow-[0_24px_60px_-24px_rgb(0_0_0/0.7)]"
        >
          <p className="hidden font-display text-lg font-bold print:block">
            {lote.producto} · {lote.kg} kg
          </p>
          {enlace ? (
            <QrLote texto={enlace} etiqueta={`Código QR del lote ${lote.id}: abre ${enlace}`} />
          ) : (
            <div className="size-[200px] rounded-xl bg-fondo motion-safe:animate-respirar" />
          )}
          <span className="font-mono text-[13px] text-tinta-suave">
            {enlace ? enlace.replace(/^https?:\/\//, "") : " "}
          </span>
        </motion.div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
          <div className="flex flex-col gap-0.5">
            <dt className="text-noche-texto">Producto</dt>
            <dd className="text-[15px] font-medium">
              {lote.producto} · {lote.kg} kg
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-noche-texto">Cosecha</dt>
            <dd className="text-[15px] font-medium" title={fechaLarga(lote.cosecha)}>
              {fechaCorta(lote.cosecha)} {lote.cosecha.slice(0, 4)}
            </dd>
          </div>
          {registro && (
            <div className="col-span-2 flex flex-col gap-0.5">
              <dt className="text-noche-texto">Transacción</dt>
              <dd className="font-mono text-[13px]">
                {hashCorto(registro.tx)} ·{" "}
                {urlTx ? (
                  <a href={urlTx} target="_blank" rel="noreferrer" className="text-menta underline underline-offset-2">
                    ver en Stellar Expert
                  </a>
                ) : (
                  <span className="text-noche-texto">simulada</span>
                )}
              </dd>
            </div>
          )}
        </dl>

        <div className="flex-1" />

        <div className="flex flex-col gap-2">
          {/* Above the buttons: at the very bottom the scene has mint leaves that would hide mint text. */}
          {!salio && (
            <p className="text-center text-[13px] text-noche-texto">
              ¿Llegó el transportista?{" "}
              <Enlace
                href={`/custodia/${lote.id}`}
                className="inline-flex min-h-11 items-center font-semibold text-menta underline underline-offset-4"
              >
                Firmen juntos la entrega
              </Enlace>
            </p>
          )}
          <div className="flex gap-3">
            <Boton variante="noche" className="flex-1 px-3 text-base" onClick={compartir} disabled={!enlace}>
              Compartir
            </Boton>
            <Boton variante="menta" className="flex-1 px-3 text-base whitespace-nowrap" onClick={() => window.print()}>
              Imprimir etiqueta
            </Boton>
          </div>
        </div>
      </div>
    </Pantalla>
  );
}
