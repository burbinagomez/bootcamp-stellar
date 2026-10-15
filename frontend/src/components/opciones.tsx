"use client";

import { motion } from "motion/react";
import { useId } from "react";

export interface Opcion<V extends string> {
  valor: V;
  titulo: string;
  texto?: string;
  icono?: React.ReactNode;
}

interface GrupoOpcionesProps<V extends string> {
  leyenda: string;
  opciones: Opcion<V>[];
  valor: V | null;
  onCambio: (valor: V) => void;
  columnas?: 1 | 2 | 3;
  /** "fila" for short labels, "tarjeta" for title + description, "bloque" for big icon choices. */
  forma?: "fila" | "tarjeta" | "bloque";
}

/**
 * Single choice as real radio inputs styled as cards. The selected outline glides
 * between options (shared layout), so the choice reads as one moving marker.
 */
export function GrupoOpciones<V extends string>({
  leyenda,
  opciones,
  valor,
  onCambio,
  columnas = 1,
  forma = "tarjeta",
}: GrupoOpcionesProps<V>) {
  const nombre = useId();
  const grid = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" }[columnas];

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-medium">{leyenda}</legend>
      <div className={`grid gap-2.5 ${grid}`}>
        {opciones.map((opcion) => {
          const activa = opcion.valor === valor;
          return (
            <label
              key={opcion.valor}
              className={`relative flex cursor-pointer rounded-[14px] border bg-papel transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-hoja ${
                activa ? "border-transparent" : "border-linea-fuerte hover:bg-fondo"
              } ${
                forma === "fila"
                  ? "min-h-12 items-center justify-center px-2 text-center text-sm"
                  : forma === "bloque"
                    ? "min-h-24 flex-col items-center justify-center gap-1.5"
                    : "min-h-[76px] flex-col justify-center gap-0.5 px-4 py-3.5"
              }`}
            >
              <input
                type="radio"
                name={nombre}
                value={opcion.valor}
                checked={activa}
                onChange={() => onCambio(opcion.valor)}
                className="sr-only"
              />
              {activa && (
                <motion.span
                  layoutId={`marca-${nombre}`}
                  aria-hidden="true"
                  className="absolute -inset-px rounded-[14px] border-2 border-hoja bg-hoja-clara"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className={`relative flex ${forma === "tarjeta" ? "flex-col gap-0.5" : "flex-col items-center gap-1.5"}`}>
                {opcion.icono}
                <span
                  className={`${forma === "bloque" ? "text-base font-bold" : forma === "fila" ? "" : "text-base font-semibold"} ${
                    activa ? "font-semibold text-hoja-oscura" : ""
                  }`}
                >
                  {opcion.titulo}
                </span>
                {opcion.texto && <span className="text-[13px] text-tinta-suave">{opcion.texto}</span>}
              </span>
              {activa && forma === "tarjeta" && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  aria-hidden="true"
                  className="absolute top-3.5 right-3.5"
                >
                  <circle cx="11" cy="11" r="10" fill="var(--color-hoja)" />
                  <path d="M6.5 11.5l3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
