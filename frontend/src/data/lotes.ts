import { hashSimulado } from "@/lib/stellar";
import type { Evento, Lote, NuevoEvento } from "./tipos";

const finca = { finca: "Finca El Retiro", municipio: "Urrao, Antioquia", productorId: "maria" };

export const lotes: Lote[] = [
  { id: "LT-0398", producto: "Aguacate Hass", kg: 290, cosecha: "2026-10-07", ...finca },
  { id: "LT-0405", producto: "Lulo", kg: 140, cosecha: "2026-10-10", ...finca },
  { id: "LT-0409", producto: "Mora de Castilla", kg: 85, cosecha: "2026-10-12", ...finca },
  { id: "LT-0410", producto: "Tomate de árbol", kg: 210, cosecha: "2026-10-13", ...finca },
  { id: "LT-0412", producto: "Aguacate Hass", kg: 320, cosecha: "2026-10-14", ...finca },
];

type Semilla = NuevoEvento & { fecha: string };

const semillas: Semilla[] = [
  // LT-0398: full chain to the store, surplus sent to compost, waiting for the compost manager.
  { loteId: "LT-0398", tipo: "registro", actorId: "maria", rol: "productor", fecha: "2026-10-07T15:30:00-05:00" },
  { loteId: "LT-0398", tipo: "entrega", actorId: "maria", rol: "productor", fecha: "2026-10-08T06:10:00-05:00" },
  { loteId: "LT-0398", tipo: "recepcion", actorId: "juan", rol: "transportista", fecha: "2026-10-08T06:12:00-05:00", estado: "bueno" },
  { loteId: "LT-0398", tipo: "entrega", actorId: "juan", rol: "transportista", fecha: "2026-10-08T10:40:00-05:00" },
  { loteId: "LT-0398", tipo: "recepcion", actorId: "acopio-medellin", rol: "acopio", fecha: "2026-10-08T10:52:00-05:00", estado: "bueno" },
  { loteId: "LT-0398", tipo: "recepcion", actorId: "fruver-70", rol: "comerciante", fecha: "2026-10-09T08:15:00-05:00", estado: "bueno" },
  { loteId: "LT-0398", tipo: "destino", actorId: "fruver-70", rol: "comerciante", fecha: "2026-10-15T14:05:00-05:00", destino: "compostaje", kg: 18, receptor: "Compostera Verde Valle" },

  // LT-0405: the collection center never signed its reception -> gap.
  { loteId: "LT-0405", tipo: "registro", actorId: "maria", rol: "productor", fecha: "2026-10-10T16:00:00-05:00" },
  { loteId: "LT-0405", tipo: "entrega", actorId: "maria", rol: "productor", fecha: "2026-10-11T06:30:00-05:00" },
  { loteId: "LT-0405", tipo: "recepcion", actorId: "juan", rol: "transportista", fecha: "2026-10-11T06:31:00-05:00", estado: "bueno" },
  { loteId: "LT-0405", tipo: "entrega", actorId: "juan", rol: "transportista", fecha: "2026-10-11T11:05:00-05:00" },
  { loteId: "LT-0405", tipo: "recepcion", actorId: "fruver-70", rol: "comerciante", fecha: "2026-10-12T09:00:00-05:00", estado: "bueno" },

  // LT-0409: complete up to the store; the surplus is still unregistered.
  { loteId: "LT-0409", tipo: "registro", actorId: "maria", rol: "productor", fecha: "2026-10-12T15:45:00-05:00" },
  { loteId: "LT-0409", tipo: "entrega", actorId: "maria", rol: "productor", fecha: "2026-10-13T06:20:00-05:00" },
  { loteId: "LT-0409", tipo: "recepcion", actorId: "juan", rol: "transportista", fecha: "2026-10-13T06:22:00-05:00", estado: "bueno" },
  { loteId: "LT-0409", tipo: "entrega", actorId: "juan", rol: "transportista", fecha: "2026-10-13T10:30:00-05:00" },
  { loteId: "LT-0409", tipo: "recepcion", actorId: "acopio-medellin", rol: "acopio", fecha: "2026-10-13T10:41:00-05:00", estado: "bueno" },
  { loteId: "LT-0409", tipo: "recepcion", actorId: "fruver-70", rol: "comerciante", fecha: "2026-10-14T08:05:00-05:00", estado: "bueno" },

  // LT-0410: signed through the collection center, waiting for the store.
  { loteId: "LT-0410", tipo: "registro", actorId: "maria", rol: "productor", fecha: "2026-10-13T16:10:00-05:00" },
  { loteId: "LT-0410", tipo: "entrega", actorId: "maria", rol: "productor", fecha: "2026-10-14T06:44:00-05:00" },
  { loteId: "LT-0410", tipo: "recepcion", actorId: "juan", rol: "transportista", fecha: "2026-10-14T06:46:00-05:00", estado: "bueno" },
  { loteId: "LT-0410", tipo: "entrega", actorId: "juan", rol: "transportista", fecha: "2026-10-14T11:08:00-05:00" },
  { loteId: "LT-0410", tipo: "recepcion", actorId: "acopio-medellin", rol: "acopio", fecha: "2026-10-14T11:20:00-05:00", estado: "bueno" },

  // LT-0412: the producer already signed the handover, the driver has not.
  { loteId: "LT-0412", tipo: "registro", actorId: "maria", rol: "productor", fecha: "2026-10-14T16:10:00-05:00" },
  { loteId: "LT-0412", tipo: "entrega", actorId: "maria", rol: "productor", fecha: "2026-10-15T06:44:00-05:00" },
];

export const eventos: Evento[] = semillas.map((s, i) => ({
  ...s,
  id: `ev-${i + 1}`,
  tx: hashSimulado(`${s.loteId}:${s.tipo}:${s.rol}:${s.fecha}`),
}));
