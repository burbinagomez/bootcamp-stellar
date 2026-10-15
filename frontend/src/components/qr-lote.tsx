"use client";

import { motion } from "motion/react";
import QRCode from "qrcode";
import { useMemo } from "react";

const BANDAS = 11;

/** Splits the QR into finder patterns (animated apart) and diagonal bands of modules. */
function construir(texto: string) {
  // High error correction leaves room for the leaf emblem in the middle.
  const { modules } = QRCode.create(texto, { errorCorrectionLevel: "H" });
  const n = modules.size;
  const logo = Math.round(n * 0.2) | 1;
  const inicioLogo = (n - logo) / 2;

  const esBuscador = (f: number, c: number) => (f < 8 && c < 8) || (f < 8 && c >= n - 8) || (f >= n - 8 && c < 8);
  const enLogo = (f: number, c: number) =>
    f >= inicioLogo - 1 && f < inicioLogo + logo + 1 && c >= inicioLogo - 1 && c < inicioLogo + logo + 1;

  const bandas: string[] = Array.from({ length: BANDAS }, () => "");
  for (let f = 0; f < n; f++) {
    for (let c = 0; c < n; c++) {
      if (!modules.get(f, c) || esBuscador(f, c) || enLogo(f, c)) continue;
      const banda = Math.min(BANDAS - 1, Math.floor(((f + c) / (2 * n - 1)) * BANDAS));
      bandas[banda] += `M${c} ${f}h1v1h-1z`;
    }
  }

  return {
    n,
    bandas,
    logo: { x: inicioLogo - 0.5, tamano: logo + 1 },
    buscadores: [
      [0, 0],
      [n - 7, 0],
      [0, n - 7],
    ] as [number, number][],
  };
}

export function QrLote({ texto, etiqueta, tamano = 200 }: { texto: string; etiqueta: string; tamano?: number }) {
  const { n, bandas, buscadores, logo } = useMemo(() => construir(texto), [texto]);
  const margen = 1;

  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox={`${-margen} ${-margen} ${n + margen * 2} ${n + margen * 2}`}
      role="img"
      aria-label={etiqueta}
      shapeRendering="crispEdges"
    >
      <rect x={-margen} y={-margen} width={n + margen * 2} height={n + margen * 2} fill="#fff" />
      {buscadores.map(([x, y], i) => (
        <motion.g
          key={`${x}-${y}`}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.09, type: "spring", stiffness: 380, damping: 20 }}
          style={{ originX: 0.5, originY: 0.5 }}
          shapeRendering="geometricPrecision"
        >
          <rect x={x} y={y} width="7" height="7" rx="1.7" fill="var(--color-tinta)" />
          <rect x={x + 1} y={y + 1} width="5" height="5" rx="1.1" fill="#fff" />
          <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.8" fill="var(--color-hoja)" />
        </motion.g>
      ))}
      {bandas.map((d, i) =>
        d ? (
          <motion.path
            key={i}
            d={d}
            fill="var(--color-tinta)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 + i * 0.05, duration: 0.28 }}
          />
        ) : null,
      )}
      <motion.g
        initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.22 + BANDAS * 0.05, type: "spring", stiffness: 300, damping: 16 }}
        style={{ originX: 0.5, originY: 0.5 }}
        shapeRendering="geometricPrecision"
      >
        <rect x={logo.x} y={logo.x} width={logo.tamano} height={logo.tamano} rx="1.4" fill="#fff" />
        <g
          transform={`translate(${logo.x + logo.tamano / 2} ${logo.x + logo.tamano / 2}) scale(${logo.tamano / 30})`}
          fill="none"
          stroke="var(--color-hoja)"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M0 11V-2" />
          <path d="M0 0c0-5 4-9 10-9 0 6-4 9-10 9z" fill="var(--color-hoja)" />
          <path d="M0 4c0-4-3-7-9-7 0 5 3 7 9 7z" />
        </g>
      </motion.g>
    </svg>
  );
}
