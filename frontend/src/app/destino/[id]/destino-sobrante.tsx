"use client";

import { useState } from "react";
import { EsqueletoPantalla, EstadoVacio } from "@/components/estados";
import { LoteNoEncontrado, useLote } from "@/components/lote";
import { GrupoOpciones } from "@/components/opciones";
import { EncabezadoActor, Pantalla } from "@/components/pantalla";
import { Boton, Entrada, Enlace, Etiqueta, IconoPasskey, MensajeError, Selector, clasesBoton } from "@/components/ui";
import { actorDeRol, receptoresPorDestino } from "@/data/actores";
import type { Destino } from "@/data/tipos";
import { fechaHora } from "@/lib/fechas";
import { useOrigen } from "@/lib/store";
import { useFirmar } from "@/lib/use-firmar";

const OPCIONES: { valor: Destino; titulo: string; texto: string }[] = [
  { valor: "vendido", titulo: "Vendido", texto: "Salió a la venta con descuento o a otro comercio" },
  { valor: "donado", titulo: "Donado", texto: "Entregado a un comedor o banco de alimentos" },
  { valor: "compostaje", titulo: "Compostaje", texto: "Enviado a un gestor de residuos orgánicos" },
];

const RESUMEN: Record<Destino, string> = {
  vendido: "vendidos",
  donado: "donados",
  compostaje: "enviados a compostaje",
};

export function DestinoSobrante({ id }: { id: string }) {
  const { lote, eventos, sello, cargando } = useLote(id);
  const { actor } = useOrigen();
  const { firmar, firmando } = useFirmar();
  const [kg, setKg] = useState("");
  const [destino, setDestino] = useState<Destino | null>(null);
  const [receptor, setReceptor] = useState("");
  const [errores, setErrores] = useState<{ kg?: string; destino?: string }>({});

  if (cargando) return <EsqueletoPantalla />;
  if (!lote) return <LoteNoEncontrado id={id} />;

  const comerciante = actor(actorDeRol.comerciante);
  const encabezado = (
    <EncabezadoActor rol={`Comerciante · ${comerciante?.nombre} · ${lote.id}`} titulo="¿Qué pasó con lo que sobró?" />
  );
  const recibido = sello.etapas.some((e) => e.clave === "tienda" && e.eventos.length > 0);
  const registrado = eventos.find((e) => e.tipo === "destino");

  if (!recibido) {
    return (
      <Pantalla>
        {encabezado}
        <EstadoVacio
          titulo="Primero recibe el lote"
          texto="El destino del sobrante se registra después de firmar la recepción en la tienda."
          accion={
            <Enlace href={`/recepcion/${lote.id}`} className={clasesBoton("primario", "mediano")}>
              Ir a la recepción
            </Enlace>
          }
        />
      </Pantalla>
    );
  }

  if (registrado?.destino) {
    const siguiente =
      registrado.destino === "compostaje"
        ? { href: `/residuo/${lote.id}`, texto: "Ver la llegada a la compostera" }
        : { href: `/v/${lote.id}?vista=comerciante`, texto: "Ver lo que verá el cliente" };
    return (
      <Pantalla>
        {encabezado}
        <div className="mx-5 mt-2 rounded-2xl bg-hoja-clara p-4 text-hoja-oscura">
          <p className="text-[17px] font-bold">
            {registrado.kg} kg {RESUMEN[registrado.destino]}
          </p>
          <p className="mt-1 text-[13px]">
            {registrado.receptor} · firmado {fechaHora(registrado.fecha)}
          </p>
        </div>
        <div className="flex-1" />
        <div className="px-5 pt-4 pb-7">
          <Enlace href={siguiente.href} className={`${clasesBoton()} w-full`}>
            {siguiente.texto}
          </Enlace>
        </div>
      </Pantalla>
    );
  }

  const receptores = destino ? receptoresPorDestino[destino] : [];
  const receptorElegido = receptores.includes(receptor as never) ? receptor : (receptores[0] ?? "");

  async function firmarDestino() {
    const cantidad = Number(kg.replace(",", "."));
    const nuevos: typeof errores = {};
    if (!kg.trim() || !Number.isFinite(cantidad) || cantidad <= 0) nuevos.kg = "Escribe cuántos kilos sobraron.";
    else if (cantidad > lote!.kg) nuevos.kg = `No puede sobrar más que el lote completo (${lote!.kg} kg).`;
    if (!destino) nuevos.destino = "Elige a dónde fue el sobrante.";
    setErrores(nuevos);
    if (nuevos.kg) document.getElementById("kg")?.focus();
    if (nuevos.kg || nuevos.destino || !destino) return;

    await firmar(
      {
        loteId: lote!.id,
        tipo: "destino",
        actorId: comerciante!.id,
        rol: "comerciante",
        destino,
        kg: cantidad,
        receptor: receptorElegido,
      },
      `Firmaste el destino: ${cantidad} kg ${RESUMEN[destino]}.`,
    );
  }

  return (
    <Pantalla>
      {encabezado}

      <div className="mx-5 mt-1 flex flex-col gap-1.5">
        <Etiqueta htmlFor="kg">Cantidad sobrante (kg)</Etiqueta>
        <Entrada
          id="kg"
          inputMode="decimal"
          placeholder="24"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          aria-invalid={errores.kg ? true : undefined}
          aria-describedby={errores.kg ? "kg-error" : undefined}
        />
        {errores.kg && <MensajeError id="kg-error">{errores.kg}</MensajeError>}
      </div>

      <div className="mx-5 mt-5">
        <GrupoOpciones leyenda="Destino final" opciones={OPCIONES} valor={destino} onCambio={setDestino} />
        {errores.destino && (
          <div className="mt-2">
            <MensajeError id="destino-error">{errores.destino}</MensajeError>
          </div>
        )}
      </div>

      <div className="mx-5 mt-4 flex flex-col gap-1.5">
        <Etiqueta htmlFor="receptor">¿Quién lo recibe?</Etiqueta>
        <Selector
          id="receptor"
          value={receptorElegido}
          onChange={(e) => setReceptor(e.target.value)}
          disabled={!destino}
        >
          {destino ? receptores.map((r) => <option key={r}>{r}</option>) : <option value="">Primero elige el destino</option>}
        </Selector>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 bg-gradient-to-t from-fondo from-70% to-fondo/0 px-5 pt-5 pb-7">
        <Boton className="w-full" onClick={firmarDestino} cargando={firmando && "Firmando…"}>
          <IconoPasskey />
          Firmar destino
        </Boton>
      </div>
    </Pantalla>
  );
}
