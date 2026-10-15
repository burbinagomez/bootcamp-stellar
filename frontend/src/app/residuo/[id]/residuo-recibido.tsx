"use client";

import { useState } from "react";
import { EsqueletoPantalla, EstadoVacio } from "@/components/estados";
import { LoteNoEncontrado, useLote } from "@/components/lote";
import { GrupoOpciones } from "@/components/opciones";
import { EncabezadoActor, Pantalla } from "@/components/pantalla";
import { AreaTexto, Boton, Enlace, Etiqueta, IconoPasskey, MensajeError, clasesBoton } from "@/components/ui";
import { actorDeRol } from "@/data/actores";
import { fechaHora } from "@/lib/fechas";
import { useOrigen } from "@/lib/store";
import { useFirmar } from "@/lib/use-firmar";

type Aptitud = "apto" | "no-apto";

const OPCIONES: { valor: Aptitud; titulo: string; icono: React.ReactNode }[] = [
  {
    valor: "apto",
    titulo: "Apto",
    icono: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="var(--color-hoja-oscura)" strokeWidth="2" aria-hidden="true">
        <circle cx="13" cy="13" r="11" />
        <path d="M8.5 13.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    valor: "no-apto",
    titulo: "No apto",
    icono: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="var(--color-terracota-oscura)" strokeWidth="2" aria-hidden="true">
        <circle cx="13" cy="13" r="11" />
        <path d="M9 9l8 8M17 9l-8 8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function ResiduoRecibido({ id }: { id: string }) {
  const { lote, eventos, sello, cargando } = useLote(id);
  const { actor } = useOrigen();
  const { firmar, firmando } = useFirmar();
  const [aptitud, setAptitud] = useState<Aptitud | null>(null);
  const [nota, setNota] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (cargando) return <EsqueletoPantalla />;
  if (!lote) return <LoteNoEncontrado id={id} />;

  const gestor = actor(actorDeRol.gestor);
  const envio = eventos.find((e) => e.tipo === "destino" && e.destino === "compostaje");
  const cierre = eventos.find((e) => e.tipo === "residuo");
  const encabezado = (
    <EncabezadoActor rol={`Gestor de residuos · ${gestor?.nombre}`} titulo={cierre ? "Ciclo cerrado" : "Residuo recibido"} />
  );

  if (!envio) {
    return (
      <Pantalla>
        {encabezado}
        <EstadoVacio
          titulo={`Aún no llega residuo del lote ${lote.id}`}
          texto="Cuando la tienda envíe el sobrante a compostaje, aparecerá aquí para que lo revises."
          accion={
            <Enlace href={`/v/${lote.id}`} className={clasesBoton("secundario", "mediano")}>
              Ver el historial del lote
            </Enlace>
          }
        />
      </Pantalla>
    );
  }

  const enviadoPor = actor(envio.actorId)?.nombre;
  const historialSano = !sello.salto;

  async function cerrarCiclo() {
    if (!aptitud) {
      setError("Indica si el material sirve para compostaje.");
      return;
    }
    setError(null);
    await firmar(
      {
        loteId: lote!.id,
        tipo: "residuo",
        actorId: gestor!.id,
        rol: "gestor",
        apto: aptitud === "apto",
        kg: envio!.kg,
        nota: nota.trim() || undefined,
      },
      aptitud === "apto"
        ? `Cerraste el ciclo del lote ${lote!.id}: ${envio!.kg} kg aptos para abono.`
        : `Cerraste el ciclo del lote ${lote!.id}: residuo marcado como no apto.`,
    );
  }

  return (
    <Pantalla>
      {encabezado}

      <div className="mx-5 flex flex-col gap-3 rounded-2xl border border-linea bg-papel p-4 shadow-tarjeta">
        <div className="flex items-center justify-between gap-3">
          <span className="text-base font-semibold">
            {lote.producto} · {envio.kg} kg
          </span>
          <span className="font-mono text-xs text-tinta-suave">{lote.id}</span>
        </div>
        <dl className="grid grid-cols-2 gap-2.5 text-[13px]">
          <div className="flex flex-col gap-0.5">
            <dt className="text-tinta-suave">Origen</dt>
            <dd className="font-medium">{lote.finca}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-tinta-suave">Enviado por</dt>
            <dd className="font-medium">{enviadoPor}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-tinta-suave">Historial del lote</dt>
            <dd className={`font-semibold ${historialSano ? "text-hoja-oscura" : "text-terracota-oscura"}`}>
              {historialSano ? "Completo" : "Con salto"}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-tinta-suave">Llegada</dt>
            <dd className="font-medium">{fechaHora(envio.fecha)}</dd>
          </div>
        </dl>
      </div>

      {cierre ? (
        <>
          <div
            className={`mx-5 mt-5 rounded-2xl p-4 ${
              cierre.apto ? "bg-hoja-clara text-hoja-oscura" : "bg-terracota-clara text-terracota-oscura"
            }`}
          >
            <p className="text-[17px] font-bold">{cierre.apto ? "Apto para compostaje" : "No apto para compostaje"}</p>
            <p className="mt-1 text-[13px]">
              Firmado {fechaHora(cierre.fecha)}
              {cierre.nota ? ` · ${cierre.nota}` : ""}
            </p>
          </div>
          <div className="flex-1" />
          <div className="px-5 pt-4 pb-7">
            <Enlace href={`/v/${lote.id}`} className={`${clasesBoton()} w-full`}>
              Ver el historial completo
            </Enlace>
          </div>
        </>
      ) : (
        <>
          <div className="mx-5 mt-5">
            <GrupoOpciones
              leyenda="¿Es apto para compostaje?"
              opciones={OPCIONES}
              valor={aptitud}
              onCambio={(v) => {
                setAptitud(v);
                setError(null);
              }}
              columnas={2}
              forma="bloque"
            />
            {error && (
              <div className="mt-2">
                <MensajeError id="aptitud-error">{error}</MensajeError>
              </div>
            )}
          </div>

          <div className="mx-5 mt-4 flex flex-col gap-1.5">
            <Etiqueta htmlFor="observaciones">Observaciones (opcional)</Etiqueta>
            <AreaTexto
              id="observaciones"
              rows={3}
              placeholder="Ej.: material limpio, sin plásticos"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>

          <div className="flex-1" />
          <div className="sticky bottom-0 bg-gradient-to-t from-fondo from-70% to-fondo/0 px-5 pt-5 pb-7">
            <Boton className="w-full" onClick={cerrarCiclo} cargando={firmando && "Firmando…"}>
              <IconoPasskey />
              Firmar y cerrar ciclo
            </Boton>
          </div>
        </>
      )}
    </Pantalla>
  );
}
