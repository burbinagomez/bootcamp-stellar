// Fixed formatting in Bogotá time (UTC-5, no DST) so server and browser render the same text.
const OFFSET_MS = -5 * 60 * 60 * 1000;
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function enBogota(fecha: string): Date {
  // Plain days (YYYY-MM-DD) are read at noon so they never slip to the previous day.
  const iso = fecha.length === 10 ? `${fecha}T12:00:00-05:00` : fecha;
  return new Date(new Date(iso).getTime() + OFFSET_MS);
}

/** "14 oct" */
export function fechaCorta(fecha: string): string {
  const d = enBogota(fecha);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}

/** "14 de octubre de 2026" */
export function fechaLarga(fecha: string): string {
  const d = enBogota(fecha);
  return `${d.getUTCDate()} de ${MESES_LARGOS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** "6:44 a. m." (non-breaking spaces so "p. m." never wraps apart) */
export function hora(fecha: string): string {
  const d = enBogota(fecha);
  const h = d.getUTCHours();
  const minutos = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h % 12 || 12}:${minutos} ${h < 12 ? "a. m." : "p. m."}`;
}

/** "15 oct · 6:44 a. m." */
export function fechaHora(fecha: string): string {
  return `${fechaCorta(fecha)} · ${hora(fecha)}`;
}

/** Current instant as ISO with the Bogotá offset. */
export function ahoraIso(): string {
  return new Date(Date.now() + OFFSET_MS).toISOString().replace(/\.\d{3}Z$/, "-05:00");
}

/** Today in Bogotá, YYYY-MM-DD. */
export function hoy(): string {
  return ahoraIso().slice(0, 10);
}
