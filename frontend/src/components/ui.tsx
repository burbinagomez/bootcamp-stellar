"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { clasesBoton, type Tamano, type Variante } from "./clases-boton";

export { clasesBoton };

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamano?: Tamano;
  /** Shows the sprout spinner and this text while an action runs. */
  cargando?: string | false;
}

export const Boton = forwardRef<HTMLButtonElement, BotonProps>(function Boton(
  { variante = "primario", tamano = "grande", cargando, className = "", children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || Boolean(cargando)}
      aria-busy={cargando ? true : undefined}
      className={`${clasesBoton(variante, tamano)} ${className}`}
      {...props}
    >
      {cargando ? (
        <>
          <Brote />
          {cargando}
        </>
      ) : (
        children
      )}
    </button>
  );
});

/** Link that slides forward (or back) with the route view transition. */
export function Enlace({
  atras,
  ...props
}: React.ComponentProps<typeof Link> & { atras?: boolean }) {
  return <Link transitionTypes={[atras ? "nav-back" : "nav-forward"]} {...props} />;
}

export function useNavegar() {
  const router = useRouter();
  return (href: string, atras = false) => router.push(href, { transitionTypes: [atras ? "nav-back" : "nav-forward"] });
}

export function BotonVolver({ href, etiqueta = "Volver" }: { href: string; etiqueta?: string }) {
  return (
    <Enlace
      href={href}
      atras
      aria-label={etiqueta}
      className="-ml-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-tinta transition-colors hover:bg-tinta/5"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 4l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Enlace>
  );
}

/** Small sprout that pulses while something is being signed. */
export function Brote({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={`motion-safe:animate-respirar ${className}`}
    >
      <path d="M10 18V9" strokeLinecap="round" />
      <path d="M10 10c0-4.5 3-7.5 7.5-7.5 0 5-3 7.5-7.5 7.5z" fill="currentColor" />
      <path d="M10 13c0-3.5-2.5-6-7-6 0 4 2.5 6 7 6z" />
    </svg>
  );
}

export function IconoPasskey({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M12 11v3" strokeLinecap="round" />
      <path d="M8 8.5a4 4 0 0 1 8 0V12" strokeLinecap="round" />
      <path d="M5 10a7 7 0 0 1 14 0v3" strokeLinecap="round" />
      <path d="M8 13v2a4 4 0 0 0 5 3.9" strokeLinecap="round" />
      <path d="M16 15a8 8 0 0 1-1 3.5" strokeLinecap="round" />
    </svg>
  );
}

const campo =
  "w-full rounded-xl border border-linea-fuerte bg-papel px-4 text-base text-tinta shadow-[inset_0_1px_2px_rgb(21_81_58/0.06)] transition-[border-color,box-shadow] placeholder:text-tinta-suave/80 hover:border-tinta-suave focus:border-hoja focus:shadow-[0_0_0_3px_rgb(30_107_71/0.18)] focus:outline-none aria-[invalid=true]:border-terracota-oscura";

export function Etiqueta({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  );
}

export const Entrada = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Entrada({ className = "", ...props }, ref) {
    return <input ref={ref} className={`h-13 ${campo} ${className}`} {...props} />;
  },
);

export function Selector({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={`h-13 appearance-none pr-11 ${campo} ${className}`} {...props}>
        {children}
      </select>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-tinta-suave"
      >
        <path d="M4.5 7l4.5 4.5L13.5 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function AreaTexto({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`resize-none py-3 ${campo} ${className}`} {...props} />;
}

export function MensajeError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-[13px] font-medium text-terracota-oscura">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="7" cy="7" r="6" />
        <path d="M7 4v3.5M7 9.8v.2" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

type TonoInsignia = "ok" | "transito" | "salto" | "neutro";

const tonosInsignia: Record<TonoInsignia, string> = {
  ok: "bg-hoja-clara text-hoja-oscura",
  transito: "bg-cielo-claro text-cielo",
  salto: "bg-terracota-clara text-terracota-oscura",
  neutro: "bg-fondo text-tinta-suave",
};

export function Insignia({ tono, children }: { tono: TonoInsignia; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${tonosInsignia[tono]}`}>
      {children}
    </span>
  );
}

export function Nota({ children, tono = "ok" }: { children: React.ReactNode; tono?: "ok" | "salto" }) {
  const color = tono === "ok" ? "bg-hoja-clara text-hoja-oscura" : "bg-terracota-clara text-terracota-oscura";
  return (
    <div className={`flex gap-2.5 rounded-xl px-3.5 py-3 text-[13px] leading-[1.45] ${color}`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-px shrink-0" aria-hidden="true">
        <circle cx="9" cy="9" r="7" />
        <path d="M9 8v4M9 5.5v.5" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
