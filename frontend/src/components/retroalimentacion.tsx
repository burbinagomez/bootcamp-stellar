"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SelloFirma } from "./sello-firma";

type Tono = "exito" | "error" | "info";

interface Aviso {
  id: number;
  texto: string;
  tono: Tono;
}

interface Retroalimentacion {
  avisar: (texto: string, tono?: Tono) => void;
  /** Plays the signature stamp; `fecha` is the signed instant shown inside it. */
  sellar: (fecha: string) => void;
}

const Contexto = createContext<Retroalimentacion | null>(null);

export function RetroalimentacionProvider({ children }: { children: React.ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [sello, setSello] = useState<{ id: number; fecha: string } | null>(null);
  const contador = useRef(0);

  const avisar = useCallback((texto: string, tono: Tono = "exito") => {
    contador.current += 1;
    setAviso({ id: contador.current, texto, tono });
  }, []);

  const sellar = useCallback((fecha: string) => {
    contador.current += 1;
    setSello({ id: contador.current, fecha });
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), aviso.tono === "error" ? 6000 : 4200);
    return () => clearTimeout(t);
  }, [aviso]);

  useEffect(() => {
    if (!sello) return;
    const t = setTimeout(() => setSello(null), 1500);
    return () => clearTimeout(t);
  }, [sello]);

  return (
    <Contexto.Provider value={{ avisar, sellar }}>
      {children}
      <AnimatePresence>{sello && <SelloFirma key={sello.id} fecha={sello.fecha} />}</AnimatePresence>
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[430px] justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      >
        <AnimatePresence mode="popLayout">
          {aviso && (
            <motion.div
              key={aviso.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl px-4 py-3.5 text-[15px] leading-snug shadow-elevada ${
                aviso.tono === "error" ? "bg-terracota-oscura text-white" : "bg-tinta text-fondo"
              }`}
            >
              <IconoAviso tono={aviso.tono} />
              <span className="flex-1">{aviso.texto}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Contexto.Provider>
  );
}

function IconoAviso({ tono }: { tono: Tono }) {
  const color = tono === "error" ? "#ffffff" : "var(--color-menta)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="2" aria-hidden="true" className="mt-px shrink-0">
      {tono === "error" ? (
        <>
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6v5M10 14v.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M10 18V9" strokeLinecap="round" />
          <path d="M10 10c0-4.5 3-7.5 7.5-7.5 0 5-3 7.5-7.5 7.5z" fill={color} />
          <path d="M10 13c0-3.5-2.5-6-7-6 0 4 2.5 6 7 6z" />
        </>
      )}
    </svg>
  );
}

export function useRetroalimentacion(): Retroalimentacion {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useRetroalimentacion must be used inside <RetroalimentacionProvider>");
  return valor;
}
