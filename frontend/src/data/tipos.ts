export type Rol = "productor" | "transportista" | "acopio" | "comerciante" | "gestor" | "receptor";

export interface Actor {
  id: string;
  nombre: string;
  rol: Rol;
  lugar: string;
  /** Short Stellar address; null while the passkey is not activated. */
  billetera: string | null;
  estado: "activo" | "pendiente";
}

export interface Lote {
  id: string;
  producto: string;
  kg: number;
  /** Harvest day, YYYY-MM-DD (Bogotá). */
  cosecha: string;
  finca: string;
  municipio: string;
  productorId: string;
  /** SHA-256 of the photo; the photo itself stays off-chain. */
  huellaFoto?: string;
}

export type TipoEvento = "registro" | "entrega" | "recepcion" | "destino" | "residuo";
export type EstadoRecepcion = "bueno" | "danos" | "incompleto";
export type Destino = "vendido" | "donado" | "compostaje";

export interface Evento {
  id: string;
  loteId: string;
  tipo: TipoEvento;
  actorId: string;
  rol: Rol;
  /** ISO 8601 with offset. */
  fecha: string;
  /** Transaction hash (simulated until the Stellar integration). */
  tx: string;
  estado?: EstadoRecepcion;
  destino?: Destino;
  kg?: number;
  receptor?: string;
  apto?: boolean;
  nota?: string;
}

export type NuevoEvento = Omit<Evento, "id" | "fecha" | "tx">;
