import type { NuevoEvento } from "@/data/tipos";
import { ahoraIso } from "@/lib/fechas";
import { red, simulada } from "./config";

export { red, simulada, comisionEstimadaXlm } from "./config";

export interface ResultadoFirma {
  tx: string;
  fecha: string;
}

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

/**
 * Signs one lot event with the actor's passkey and sends it to the `RegistroLotes` contract,
 * with the platform paying the fee (fee-bump).
 * shortcut: simulated signature with a random hash; replace with the Soroban call in week 4.
 */
export async function firmarEvento(evento: NuevoEvento): Promise<ResultadoFirma> {
  void evento;
  await esperar(1100);
  return { tx: hashAleatorio(), fecha: ahoraIso() };
}

/**
 * Signs in with the passkey stored on the phone and returns the actor id.
 * shortcut: always resolves to the demo producer; replace with the smart-wallet login in week 4.
 */
export async function conectarPasskey(identificador: string): Promise<{ actorId: string }> {
  await esperar(900);
  void identificador;
  return { actorId: "maria" };
}

/** Explorer link for a transaction, or null while signatures are simulated. */
export function urlTransaccion(tx: string): string | null {
  return simulada ? null : `${red.explorador}/tx/${tx}`;
}

export function hashCorto(tx: string): string {
  return `${tx.slice(0, 4)}…${tx.slice(-4)}`;
}

/** Deterministic 64-hex string for seed data (FNV-1a, not cryptographic). */
export function hashSimulado(semilla: string): string {
  let salida = "";
  let h = 0x811c9dc5;
  for (let ronda = 0; salida.length < 64; ronda++) {
    for (const c of `${semilla}#${ronda}`) {
      h ^= c.charCodeAt(0);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    salida += h.toString(16).padStart(8, "0");
  }
  return salida.slice(0, 64);
}

function hashAleatorio(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
