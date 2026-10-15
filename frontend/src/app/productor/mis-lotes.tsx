"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { EstadoVacio } from "@/components/estados";
import { Pantalla } from "@/components/pantalla";
import { EscenaTarjeta, RamaEsquina } from "@/components/plantas";
import { Enlace, Insignia, clasesBoton } from "@/components/ui";
import { actorDeRol } from "@/data/actores";
import { fechaCorta, hoy } from "@/lib/fechas";
import { calcularSello, type Sello } from "@/lib/sello";
import { useOrigen } from "@/lib/store";
import { useMontado } from "@/lib/use-montado";

const INSIGNIA: Record<Sello["estado"], { tono: "ok" | "transito" | "salto"; texto: string }> = {
  completo: { tono: "ok", texto: "Completo" },
  "en-transito": { tono: "transito", texto: "En tránsito" },
  salto: { tono: "salto", texto: "Con salto" },
};

const RECIENTES = 4;

export function MisLotes() {
  const { lotes, eventos, actor } = useOrigen();
  const [todos, setTodos] = useState(false);
  const productor = actor(actorDeRol.productor);

  const misLotes = useMemo(
    () =>
      lotes
        .filter((l) => l.productorId === actorDeRol.productor)
        .sort((a, b) => b.cosecha.localeCompare(a.cosecha) || b.id.localeCompare(a.id))
        .map((lote) => ({ lote, sello: calcularSello(eventos.filter((e) => e.loteId === lote.id)) })),
    [lotes, eventos],
  );

  const montado = useMontado();
  const mes = montado ? hoy().slice(0, 7) : null;
  const resumen = [
    {
      valor: mes ? misLotes.filter(({ lote }) => lote.cosecha.startsWith(mes)).length : "–",
      etiqueta: "Lotes este mes",
    },
    { valor: misLotes.filter(({ sello }) => sello.estado === "completo").length, etiqueta: "Cadena completa" },
    { valor: misLotes.filter(({ sello }) => sello.estado === "en-transito").length, etiqueta: "En tránsito" },
  ];
  const visibles = todos ? misLotes : misLotes.slice(0, RECIENTES);
  const primerNombre = productor?.nombre.split(" ")[0] ?? "";

  return (
    <Pantalla>
      <RamaEsquina className="pointer-events-none absolute top-0 right-0 -z-10" />
      <header className="flex items-center justify-between px-5 pt-8 pb-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] text-tinta-suave">Productor · {productor?.lugar}</p>
          <h1 className="font-display text-[26px] font-bold tracking-[-0.02em]">Hola, {primerNombre}</h1>
        </div>
        <MenuCuenta iniciales={iniciales(productor?.nombre ?? "")} />
      </header>

      <section
        aria-label="Resumen de tus lotes"
        className="relative isolate mx-5 grid grid-cols-3 gap-2 overflow-hidden rounded-2xl bg-tinta p-4 text-fondo shadow-elevada"
      >
        <EscenaTarjeta className="absolute right-0 bottom-0 -z-10" />
        {resumen.map((dato) => (
          <div key={dato.etiqueta} className="flex flex-col gap-0.5">
            <span className="font-display text-[28px] leading-none font-bold">{dato.valor}</span>
            <span className="text-xs text-niebla">{dato.etiqueta}</span>
          </div>
        ))}
      </section>

      <div className="flex items-baseline justify-between px-5 pt-6 pb-2">
        <h2 className="text-base font-semibold">{todos ? "Todos tus lotes" : "Lotes recientes"}</h2>
        {misLotes.length > RECIENTES && (
          <button
            type="button"
            onClick={() => setTodos((t) => !t)}
            aria-expanded={todos}
            className="-mr-2 min-h-11 rounded-lg px-2 text-sm font-medium text-hoja hover:text-hoja-oscura"
          >
            {todos ? "Ver menos" : "Ver todos"}
          </button>
        )}
      </div>

      {misLotes.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no tienes lotes"
          texto="Registra tu primera cosecha y Origen le genera un QR para que cada comprador vea de dónde viene."
        />
      ) : (
        <ul className="flex flex-1 flex-col gap-2.5 px-5">
          {visibles.map(({ lote, sello }, i) => (
            <motion.li
              key={lote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * Math.min(i, 6), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Enlace
                href={`/lotes/${lote.id}/qr`}
                className="flex flex-col gap-2 rounded-[14px] border border-linea bg-papel px-4 py-3.5 shadow-tarjeta transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-elevada"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold">{lote.producto}</span>
                  <Insignia tono={INSIGNIA[sello.estado].tono}>{INSIGNIA[sello.estado].texto}</Insignia>
                </span>
                <span className="flex justify-between text-[13px] text-tinta-suave">
                  <span className="font-mono">{lote.id}</span>
                  <span>
                    {lote.kg} kg · {fechaCorta(lote.cosecha)}
                  </span>
                </span>
              </Enlace>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="sticky bottom-0 bg-gradient-to-t from-fondo from-70% to-fondo/0 px-5 pt-6 pb-7">
        <Enlace href="/productor/nuevo" className={`${clasesBoton()} w-full`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
          </svg>
          Registrar nuevo lote
        </Enlace>
      </div>
    </Pantalla>
  );
}

function MenuCuenta({ iniciales }: { iniciales: string }) {
  return (
    <>
      <button
        type="button"
        popoverTarget="menu-cuenta"
        aria-label="Mi cuenta"
        className="size-11 rounded-full border border-linea-fuerte bg-papel font-semibold shadow-tarjeta"
      >
        {iniciales}
      </button>
      <div
        id="menu-cuenta"
        popover="auto"
        className="fixed inset-auto top-20 right-[max(1.25rem,calc((100vw-430px)/2+1.25rem))] m-0 w-56 rounded-2xl border border-linea bg-papel p-2 text-tinta shadow-elevada"
      >
        <Enlace
          href="/"
          atras
          className="flex min-h-11 items-center rounded-xl px-3 text-[15px] font-medium hover:bg-fondo"
        >
          Cerrar sesión
        </Enlace>
      </div>
    </>
  );
}

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("");
}
