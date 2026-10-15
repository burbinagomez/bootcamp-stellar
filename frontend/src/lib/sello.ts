// Type-only imports: this file runs as-is under `node --test` (see sello.test.mjs).
import type { Evento, Rol, TipoEvento } from "../data/tipos";

export type ClaveEtapa = "origen" | "transporte" | "acopio" | "tienda" | "destino" | "residuo";

interface DefinicionEtapa {
  clave: ClaveEtapa;
  /** Wording for the people in the chain. */
  titulo: string;
  /** Wording for the public verification page. */
  publico: string;
  firmas: { tipo: TipoEvento; rol: Rol }[];
}

/** Custody steps in order. Handovers between actors need both signatures. */
export const ETAPAS: DefinicionEtapa[] = [
  {
    clave: "origen",
    titulo: "Lote registrado en origen",
    publico: "Cosecha en la finca",
    firmas: [{ tipo: "registro", rol: "productor" }],
  },
  {
    clave: "transporte",
    titulo: "Entregado al transportista",
    publico: "Recogido por el transportista",
    firmas: [
      { tipo: "entrega", rol: "productor" },
      { tipo: "recepcion", rol: "transportista" },
    ],
  },
  {
    clave: "acopio",
    titulo: "Recibido en acopio",
    publico: "Pasó por el centro de acopio",
    firmas: [
      { tipo: "entrega", rol: "transportista" },
      { tipo: "recepcion", rol: "acopio" },
    ],
  },
  {
    clave: "tienda",
    titulo: "Recibido en tienda",
    publico: "Llegó a la tienda",
    firmas: [{ tipo: "recepcion", rol: "comerciante" }],
  },
  {
    clave: "destino",
    titulo: "Destino del sobrante",
    publico: "Destino de lo que sobró",
    firmas: [{ tipo: "destino", rol: "comerciante" }],
  },
  {
    clave: "residuo",
    titulo: "Residuo recibido en compostaje",
    publico: "Convertido en abono",
    firmas: [{ tipo: "residuo", rol: "gestor" }],
  },
];

export type EstadoEtapa = "firmada" | "pendiente" | "salto";

export interface EtapaEvaluada extends DefinicionEtapa {
  estado: EstadoEtapa;
  eventos: Evento[];
  faltantes: { tipo: TipoEvento; rol: Rol }[];
  fueraDeOrden: boolean;
}

export interface Sello {
  /** completo: signed and in order up to the store. en-transito: no gaps, still moving. */
  estado: "completo" | "en-transito" | "salto";
  etapas: EtapaEvaluada[];
  salto: EtapaEvaluada | null;
}

/**
 * Computes the completeness seal from the signed events of one lot.
 * A step is a gap when it is incomplete but a later step already has signatures,
 * or when `hasta` says the actor about to sign needs everything before it.
 */
export function calcularSello(eventos: Evento[], hasta?: ClaveEtapa): Sello {
  const destino = eventos.find((e) => e.tipo === "destino")?.destino;
  const definiciones = ETAPAS.filter((d) => d.clave !== "residuo" || destino === "compostaje");
  const encontradas = definiciones.map((d) =>
    d.firmas.map((f) => eventos.find((e) => e.tipo === f.tipo && e.rol === f.rol)),
  );

  let ultimaConFirma = -1;
  encontradas.forEach((firmas, i) => {
    if (firmas.some(Boolean)) ultimaConFirma = i;
  });
  const indiceHasta = hasta ? definiciones.findIndex((d) => d.clave === hasta) : -1;

  let finAnterior = -Infinity;
  const etapas = definiciones.map((definicion, i): EtapaEvaluada => {
    const firmas = encontradas[i];
    const presentes = firmas.filter((e): e is Evento => e !== undefined);
    const faltantes = definicion.firmas.filter((_, j) => firmas[j] === undefined);
    let fueraDeOrden = false;

    if (faltantes.length === 0) {
      const tiempos = presentes.map((e) => Date.parse(e.fecha));
      fueraDeOrden = Math.min(...tiempos) < finAnterior;
      finAnterior = Math.max(finAnterior, ...tiempos);
    }

    const debiaEstarFirmada = i < ultimaConFirma || i < indiceHasta;
    const estado: EstadoEtapa =
      faltantes.length === 0
        ? fueraDeOrden
          ? "salto"
          : "firmada"
        : debiaEstarFirmada
          ? "salto"
          : "pendiente";

    return { ...definicion, estado, eventos: presentes, faltantes, fueraDeOrden };
  });

  const salto = etapas.find((e) => e.estado === "salto") ?? null;
  const enTienda = etapas.some((e) => e.clave === "tienda" && e.estado === "firmada");
  return { estado: salto ? "salto" : enTienda ? "completo" : "en-transito", etapas, salto };
}

const ACCION: Record<TipoEvento, string> = {
  registro: "registro",
  entrega: "entrega",
  recepcion: "recepción",
  destino: "destino",
  residuo: "recepción del residuo",
};

const LUGAR: Record<Rol, string> = {
  productor: "del productor",
  transportista: "del transportista",
  acopio: "en el acopio",
  comerciante: "en la tienda",
  gestor: "del gestor de residuos",
  receptor: "del receptor",
};

/** One-line reason for a gap, e.g. "Falta la firma de recepción en el acopio." */
export function describirSalto(etapa: EtapaEvaluada): string {
  if (etapa.fueraDeOrden) return `Las firmas de "${etapa.titulo.toLowerCase()}" están fuera de orden.`;
  const { tipo, rol } = etapa.faltantes[0];
  return `Falta la firma de ${ACCION[tipo]} ${LUGAR[rol]}.`;
}
