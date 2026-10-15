"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { hora } from "@/lib/fechas";

/**
 * Rubber stamp that lands on screen when a signature is confirmed.
 * Green ink with slightly rough edges (displacement filter) so it reads as ink, not as a badge.
 */
export function SelloFirma({ fecha }: { fecha: string }) {
  const id = useId().replace(/:/g, "");

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <motion.div
        className="absolute size-64 rounded-full bg-fondo/80 blur-2xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="absolute size-44 rounded-full border-[6px] border-hoja/30"
        initial={{ opacity: 0.6, scale: 0.9 }}
        animate={{ opacity: 0, scale: 1.45 }}
        transition={{ delay: 0.12, duration: 0.6, ease: "easeOut" }}
      />
      <motion.svg
        width="184"
        height="184"
        viewBox="0 0 184 184"
        className="relative mix-blend-multiply"
        initial={{ opacity: 0, scale: 1.9, rotate: -22 }}
        animate={{ opacity: 0.94, scale: 1, rotate: -9 }}
        transition={{ type: "spring", stiffness: 620, damping: 26, mass: 0.9 }}
      >
        <defs>
          <filter id={`tinta-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="2.4" />
          </filter>
          <path id={`arco-${id}`} d="M92 92m-68 0a68 68 0 1 1 136 0a68 68 0 1 1-136 0" />
        </defs>
        <g filter={`url(#tinta-${id})`} fill="none" stroke="var(--color-hoja)">
          <circle cx="92" cy="92" r="86" strokeWidth="5" />
          <circle cx="92" cy="92" r="54" strokeWidth="2" />
          <text fill="var(--color-hoja)" stroke="none" fontFamily="var(--font-mono)" fontSize="13" fontWeight="500">
            {/* textLength stretches the phrase to exactly one turn of the ring (2π·68 ≈ 427). */}
            <textPath href={`#arco-${id}`} textLength="420" lengthAdjust="spacing">
              FIRMADO · INALTERABLE · STELLAR ·
            </textPath>
          </text>
          <g transform="translate(92 92)" strokeWidth="3" strokeLinecap="round">
            <path d="M0 22V-4" />
            <path d="M0 0c0-12 9-21 23-21 0 14-9 21-23 21z" fill="var(--color-hoja)" />
            <path d="M0 9c0-9-7-16-20-16 0 11 7 16 20 16z" />
          </g>
          <text
            x="92"
            y="132"
            textAnchor="middle"
            fill="var(--color-hoja)"
            stroke="none"
            fontFamily="var(--font-display)"
            fontSize="17"
            fontWeight="700"
          >
            {hora(fecha)}
          </text>
        </g>
      </motion.svg>
    </motion.div>
  );
}
