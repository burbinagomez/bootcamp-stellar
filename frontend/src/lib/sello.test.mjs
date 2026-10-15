import assert from "node:assert/strict";
import { test } from "node:test";
import { calcularSello, describirSalto } from "./sello.ts";

const firma = (tipo, rol, fecha, extra = {}) => ({
  id: `${tipo}-${rol}`,
  loteId: "LT-0001",
  tipo,
  rol,
  actorId: rol,
  fecha,
  tx: "0".repeat(64),
  ...extra,
});

const cadena = [
  firma("registro", "productor", "2026-10-01T16:00:00-05:00"),
  firma("entrega", "productor", "2026-10-02T06:00:00-05:00"),
  firma("recepcion", "transportista", "2026-10-02T06:05:00-05:00"),
  firma("entrega", "transportista", "2026-10-02T10:00:00-05:00"),
  firma("recepcion", "acopio", "2026-10-02T10:10:00-05:00"),
  firma("recepcion", "comerciante", "2026-10-03T08:00:00-05:00"),
];

test("una cadena firmada hasta la tienda es completa", () => {
  assert.equal(calcularSello(cadena).estado, "completo");
});

test("una entrega a medio firmar es tránsito, no salto", () => {
  const sello = calcularSello(cadena.slice(0, 2));
  assert.equal(sello.estado, "en-transito");
  assert.equal(sello.salto, null);
});

test("si la tienda firmó pero el acopio no, hay salto", () => {
  const sello = calcularSello(cadena.filter((e) => e.rol !== "acopio"));
  assert.equal(sello.estado, "salto");
  assert.equal(describirSalto(sello.salto), "Falta la firma de recepción en el acopio.");
});

test("antes de recibir en tienda se exige todo lo anterior", () => {
  assert.equal(calcularSello(cadena.slice(0, 4), "tienda").estado, "salto");
  assert.equal(calcularSello(cadena.slice(0, 5), "tienda").salto, null);
});

test("las firmas fuera de orden cuentan como salto", () => {
  const desordenada = cadena.map((e) =>
    e.rol === "acopio" ? { ...e, fecha: "2026-10-01T09:00:00-05:00" } : e,
  );
  const sello = calcularSello(desordenada);
  assert.equal(sello.estado, "salto");
  assert.equal(sello.salto.clave, "acopio");
});

test("el residuo solo es un paso cuando el sobrante va a compostaje", () => {
  const donado = [...cadena, firma("destino", "comerciante", "2026-10-04T12:00:00-05:00", { destino: "donado" })];
  assert.ok(!calcularSello(donado).etapas.some((e) => e.clave === "residuo"));

  const compost = [...cadena, firma("destino", "comerciante", "2026-10-04T12:00:00-05:00", { destino: "compostaje" })];
  const residuo = calcularSello(compost).etapas.find((e) => e.clave === "residuo");
  assert.equal(residuo.estado, "pendiente");
});
