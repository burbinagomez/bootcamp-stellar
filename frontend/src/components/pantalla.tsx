import { ViewTransition } from "react";
import { RamaEsquina } from "./plantas";

const direcciones = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

const tonos = {
  claro: "bg-fondo text-tinta",
  blanco: "bg-papel text-tinta",
  noche: "tono-noche bg-tinta text-fondo",
};

/**
 * Mobile screen: a 430px column centred on wider viewports, wrapped in the
 * directional route transition. Put it in each page, not in a layout, so it can enter and exit.
 */
export function Pantalla({
  children,
  tono = "claro",
  className = "",
}: {
  children: React.ReactNode;
  tono?: keyof typeof tonos;
  className?: string;
}) {
  return (
    <ViewTransition enter={direcciones} exit={direcciones} default="none">
      <main
        className={`relative isolate mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-x-clip sm:shadow-columna ${tonos[tono]} ${className}`}
      >
        {children}
      </main>
    </ViewTransition>
  );
}

/** Desktop shell for the admin panel, same transition contract as <Pantalla>. */
export function PantallaEscritorio({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={direcciones} exit={direcciones} default="none">
      <div className="flex min-h-dvh flex-wrap bg-fondo text-tinta">{children}</div>
    </ViewTransition>
  );
}

/** Role eyebrow + title, with the hanging branch in the corner. */
export function EncabezadoActor({
  rol,
  titulo,
  volver,
}: {
  rol: string;
  titulo: React.ReactNode;
  volver?: React.ReactNode;
}) {
  return (
    <header className="relative px-5 pt-7 pb-3">
      <RamaEsquina className="pointer-events-none absolute top-0 right-0 -z-10" />
      {volver}
      <p className="text-[13px] text-tinta-suave">{rol}</p>
      <h1 className="mt-1 max-w-[16ch] font-display text-[26px] leading-[1.1] font-bold tracking-[-0.02em] text-balance">
        {titulo}
      </h1>
    </header>
  );
}

export function Marca({ tamano = 22, oscura = false }: { tamano?: number; oscura?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={tamano + 6}
        height={tamano + 6}
        viewBox="0 0 28 28"
        fill="none"
        stroke={oscura ? "var(--color-menta)" : "var(--color-hoja)"}
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M14 25V12" strokeLinecap="round" />
        <path d="M14 14c0-5 4-9 10-9 0 6-4 9-10 9z" />
        <path d="M14 18c0-4-3-7-9-7 0 5 3 7 9 7z" />
      </svg>
      <span className="font-display font-bold tracking-[-0.02em]" style={{ fontSize: tamano }}>
        Origen
      </span>
    </span>
  );
}
