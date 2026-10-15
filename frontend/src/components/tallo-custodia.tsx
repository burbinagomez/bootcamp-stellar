"use client";

import { motion } from "motion/react";
import type { EstadoEtapa } from "@/lib/sello";

export interface PasoTallo {
  clave: string;
  titulo: string;
  quien?: string;
  cuando?: string;
  estado: EstadoEtapa;
}

const textoEstado: Record<EstadoEtapa, string> = {
  firmada: "firmado",
  pendiente: "pendiente",
  salto: "falta una firma",
};

const HOJA = "M0 0C-9-12-10-30 0-46C10-30 9-12 0 0Z";

/**
 * The custody timeline drawn as a growing stem: each signed step sprouts a leaf,
 * a pending step is a closed bud, and a gap cuts the stem and leaves a wilted leaf.
 */
export function TalloCustodia({ pasos, sobre = "fondo" }: { pasos: PasoTallo[]; sobre?: "fondo" | "papel" }) {
  return (
    <ol className="flex flex-col">
      {pasos.map((paso, i) => {
        const siguiente = pasos[i + 1];
        const retraso = 0.12 + i * 0.2;
        return (
          <li key={paso.clave} className="relative grid grid-cols-[34px_1fr] gap-x-2.5">
            <div className="relative" aria-hidden="true">
              {siguiente && <Segmento hacia={siguiente.estado} desde={paso.estado} retraso={retraso + 0.08} />}
              <Nodo estado={paso.estado} izquierda={i % 2 === 1} retraso={retraso} sobre={sobre} />
            </div>
            <div className="flex flex-col gap-0.5 pb-5">
              <p className="text-[15px] leading-snug font-semibold">
                {paso.titulo}
                <span className="sr-only">, {textoEstado[paso.estado]}</span>
              </p>
              {paso.quien && <p className="text-[13px] text-tinta-suave">{paso.quien}</p>}
              {paso.cuando && (
                <p
                  className={
                    paso.estado === "salto"
                      ? "text-[13px] font-medium text-terracota-oscura"
                      : "font-mono text-xs text-tinta-suave"
                  }
                >
                  {paso.cuando}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Segmento({ desde, hacia, retraso }: { desde: EstadoEtapa; hacia: EstadoEtapa; retraso: number }) {
  const roto = hacia === "salto" || desde === "salto";
  const vivo = desde === "firmada" && hacia === "firmada";
  const fondo = roto
    ? "repeating-linear-gradient(to bottom, var(--color-terracota) 0 4px, transparent 4px 9px)"
    : vivo
      ? "var(--color-hoja)"
      : "var(--color-niebla)";

  return (
    <motion.span
      className="absolute top-[19px] -bottom-[5px] left-[12px] w-[2.5px] rounded-full"
      style={{ background: fondo, originY: 0 }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ delay: retraso, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function Nodo({
  estado,
  izquierda,
  retraso,
  sobre,
}: {
  estado: EstadoEtapa;
  izquierda: boolean;
  retraso: number;
  sobre: "fondo" | "papel";
}) {
  const relleno = sobre === "papel" ? "var(--color-papel)" : "var(--color-fondo)";

  return (
    <svg width="34" height="28" viewBox="0 0 34 28" className="absolute top-0 left-0 overflow-visible">
      {estado === "firmada" && (
        <>
          <g transform={`translate(13.25 12) rotate(${izquierda ? -52 : 52}) scale(0.36)`}>
            <motion.path
              d={HOJA}
              fill="#3F7D57"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: retraso + 0.18, type: "spring", stiffness: 260, damping: 15 }}
              style={{ originX: 0.5, originY: 1 }}
            />
          </g>
          <motion.circle
            cx="13.25"
            cy="12"
            r="6.5"
            fill="var(--color-hoja)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: retraso, type: "spring", stiffness: 500, damping: 24 }}
          />
          <path d="M10.4 12.2l2 2 3.6-4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {estado === "pendiente" && (
        <motion.circle
          cx="13.25"
          cy="12"
          r="6.5"
          fill={relleno}
          stroke="var(--color-tinta-suave)"
          strokeWidth="2"
          strokeDasharray="2.6 2.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: retraso }}
        />
      )}
      {estado === "salto" && (
        <>
          <g transform={`translate(13.25 12) rotate(${izquierda ? -128 : 128}) scale(0.3)`}>
            <motion.path
              d={HOJA}
              fill="var(--color-terracota)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: retraso + 0.2, type: "spring", stiffness: 200, damping: 14 }}
              style={{ originX: 0.5, originY: 1 }}
            />
          </g>
          <motion.circle
            cx="13.25"
            cy="12"
            r="6.5"
            fill={relleno}
            stroke="var(--color-terracota-oscura)"
            strokeWidth="2.2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: retraso, type: "spring", stiffness: 500, damping: 24 }}
          />
          <path d="M13.25 8.8v3.6M13.25 14.8v.3" stroke="var(--color-terracota-oscura)" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
