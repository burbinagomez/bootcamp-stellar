// Plain module (no "use client") so Server Components can style links as buttons too.
export type Variante = "primario" | "secundario" | "noche" | "menta";
export type Tamano = "grande" | "mediano";

const base =
  "relative inline-flex select-none items-center justify-center gap-2.5 rounded-[14px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out active:translate-y-px active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60";

const variantes: Record<Variante, string> = {
  primario:
    "bg-gradient-to-b from-[#237a52] to-hoja text-white shadow-boton hover:from-[#26805a] hover:to-[#1f7049] active:shadow-none",
  secundario:
    "border border-linea-fuerte bg-papel text-tinta shadow-tarjeta hover:bg-fondo active:shadow-none",
  noche: "border border-tinta-suave bg-tinta text-fondo hover:bg-[#1c2a22]",
  menta: "bg-menta text-tinta shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.12)] hover:bg-[#9cdcb7]",
};

const tamanos: Record<Tamano, string> = {
  grande: "min-h-14 px-5 text-[17px]",
  mediano: "min-h-12 px-4 text-[15px]",
};

export function clasesBoton(variante: Variante = "primario", tamano: Tamano = "grande") {
  return `${base} ${variantes[variante]} ${tamanos[tamano]}`;
}
