import type { Actor, Rol } from "./tipos";

export const actores: Actor[] = [
  {
    id: "maria",
    nombre: "María Restrepo",
    rol: "productor",
    lugar: "Finca El Retiro, Urrao",
    billetera: "GBX4…Q7LM",
    estado: "activo",
  },
  {
    id: "juan",
    nombre: "Juan Pérez",
    rol: "transportista",
    lugar: "Transportes Andinos",
    billetera: "GD2K…9PZA",
    estado: "activo",
  },
  {
    id: "acopio-medellin",
    nombre: "Centro de Acopio Medellín",
    rol: "acopio",
    lugar: "Guayabal, Medellín",
    billetera: "GCQ8…T3VE",
    estado: "activo",
  },
  {
    id: "fruver-70",
    nombre: "Fruver La 70",
    rol: "comerciante",
    lugar: "Laureles, Medellín",
    billetera: "GA7N…H2RC",
    estado: "activo",
  },
  {
    id: "verde-valle",
    nombre: "Compostera Verde Valle",
    rol: "gestor",
    lugar: "Rionegro",
    billetera: "GDV3…K8WN",
    estado: "activo",
  },
  {
    id: "comedor-manrique",
    nombre: "Comedor Comunitario Manrique",
    rol: "receptor",
    lugar: "Manrique, Medellín",
    billetera: null,
    estado: "pendiente",
  },
];

/** Who acts on each screen while there is no real session per role. */
export const actorDeRol: Record<Exclude<Rol, "receptor">, string> = {
  productor: "maria",
  transportista: "juan",
  acopio: "acopio-medellin",
  comerciante: "fruver-70",
  gestor: "verde-valle",
};

export const nombreRol: Record<Rol, string> = {
  productor: "Productor",
  transportista: "Transportista",
  acopio: "Acopio",
  comerciante: "Comerciante",
  gestor: "Gestor de residuos",
  receptor: "Receptor de donaciones",
};

export const receptoresPorDestino = {
  vendido: ["Venta con descuento en la tienda", "Otro comercio del barrio"],
  donado: ["Comedor Comunitario Manrique", "Banco de Alimentos del Valle de Aburrá"],
  compostaje: ["Compostera Verde Valle"],
} as const;

export const productos = [
  "Aguacate Hass",
  "Mora de Castilla",
  "Lulo",
  "Tomate de árbol",
  "Café pergamino",
  "Plátano hartón",
];
