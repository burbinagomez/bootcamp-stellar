"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Pantalla } from "@/components/pantalla";
import { EscenaFoto } from "@/components/plantas";
import {
  Boton,
  BotonVolver,
  Entrada,
  Etiqueta,
  IconoPasskey,
  MensajeError,
  Nota,
  Selector,
  useNavegar,
} from "@/components/ui";
import { actorDeRol, productos } from "@/data/actores";
import { hoy } from "@/lib/fechas";
import { hashCorto } from "@/lib/stellar";
import { useOrigen } from "@/lib/store";
import { useFirmar } from "@/lib/use-firmar";
import { useMontado } from "@/lib/use-montado";

type Errores = Partial<Record<"cantidad" | "fecha" | "finca", string>>;

export function RegistrarLote() {
  const navegar = useNavegar();
  const montado = useMontado();
  const { siguienteIdLote, agregarLote, actor } = useOrigen();
  const { firmar, firmando } = useFirmar();
  const productor = actor(actorDeRol.productor);

  const [producto, setProducto] = useState(productos[0]);
  const [cantidad, setCantidad] = useState("");
  const [fechaElegida, setFecha] = useState<string | null>(null);
  const [finca, setFinca] = useState("Finca El Retiro · Urrao, Antioquia");
  const [foto, setFoto] = useState<{ url: string; huella: string } | null>(null);
  const [errores, setErrores] = useState<Errores>({});

  const hoyBogota = montado ? hoy() : "";
  const fecha = fechaElegida ?? hoyBogota;

  useEffect(() => {
    if (!foto) return;
    return () => URL.revokeObjectURL(foto.url);
  }, [foto]);

  async function elegirFoto(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    const digest = await crypto.subtle.digest("SHA-256", await archivo.arrayBuffer());
    const huella = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
    setFoto({ url: URL.createObjectURL(archivo), huella });
  }

  function validar(): Errores {
    const nuevos: Errores = {};
    const kg = Number(cantidad.replace(",", "."));
    if (!cantidad.trim() || !Number.isFinite(kg) || kg <= 0) nuevos.cantidad = "Escribe los kilos del lote, por ejemplo 320.";
    else if (kg > 100000) nuevos.cantidad = "Ese peso es demasiado alto para un lote. Revisa la cifra.";
    if (!fecha) nuevos.fecha = "Elige el día de la cosecha.";
    else if (hoyBogota && fecha > hoyBogota) nuevos.fecha = "La cosecha no puede tener fecha futura.";
    if (!finca.trim()) nuevos.finca = "Escribe la finca de donde sale el lote.";
    return nuevos;
  }

  async function registrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    const primero = Object.keys(nuevos)[0];
    if (primero) {
      document.getElementById(primero)?.focus();
      return;
    }

    const id = siguienteIdLote();
    const firmado = await firmar(
      { loteId: id, tipo: "registro", actorId: actorDeRol.productor, rol: "productor" },
      `Firmaste el lote ${id}. Su QR está listo.`,
    );
    if (!firmado) return;

    const [nombreFinca, municipio = ""] = finca.split("·").map((parte) => parte.trim());
    agregarLote({
      id,
      producto,
      kg: Number(cantidad.replace(",", ".")),
      cosecha: fecha,
      finca: nombreFinca,
      municipio,
      productorId: productor?.id ?? actorDeRol.productor,
      huellaFoto: foto?.huella,
    });
    navegar(`/lotes/${id}/qr`);
    // The route stays mounted (hidden) after navigating, so clear it for the next lot.
    setCantidad("");
    setFecha(null);
    setFoto(null);
  }

  return (
    <Pantalla>
      <header className="flex items-center gap-1 px-3 pt-6 pb-2">
        <BotonVolver href="/productor" etiqueta="Volver a mis lotes" />
        <h1 className="font-display text-2xl font-bold tracking-[-0.02em]">Registrar lote</h1>
      </header>

      <form onSubmit={registrar} noValidate className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4 px-5 py-2">
          <label
            htmlFor="foto"
            className="relative isolate flex h-[150px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-linea-fuerte bg-papel text-center text-tinta-suave shadow-tarjeta transition-colors hover:border-hoja has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-hoja"
          >
            <EscenaFoto className="absolute inset-0 -z-10 size-full" />
            <AnimatePresence>
              {foto && (
                <motion.img
                  key={foto.url}
                  src={foto.url}
                  alt="Foto del lote"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 -z-10 size-full object-cover"
                />
              )}
            </AnimatePresence>
            {foto ? (
              <span className="mt-auto mb-3 rounded-full bg-tinta/80 px-3 py-1.5 font-mono text-xs text-fondo">
                Huella {hashCorto(foto.huella)} · toca para cambiarla
              </span>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--color-hoja)" strokeWidth="1.8" aria-hidden="true">
                  <rect x="4" y="9" width="24" height="17" rx="3" />
                  <path d="M11 9l2-3h6l2 3" />
                  <circle cx="16" cy="17.5" r="4.5" />
                </svg>
                <span className="text-[15px] font-medium text-tinta">Tomar foto del lote</span>
                <span className="max-w-[30ch] text-xs">La foto se guarda fuera de la red y su huella queda en Stellar</span>
              </>
            )}
            <input id="foto" type="file" accept="image/*" capture="environment" onChange={elegirFoto} className="sr-only" />
          </label>

          <div className="flex flex-col gap-1.5">
            <Etiqueta htmlFor="producto">Producto</Etiqueta>
            <Selector id="producto" value={producto} onChange={(e) => setProducto(e.target.value)}>
              {productos.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Selector>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Etiqueta htmlFor="cantidad">Cantidad (kg)</Etiqueta>
              <Entrada
                id="cantidad"
                inputMode="decimal"
                placeholder="320"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                aria-invalid={errores.cantidad ? true : undefined}
                aria-describedby={errores.cantidad ? "cantidad-error" : undefined}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Etiqueta htmlFor="fecha">Fecha de cosecha</Etiqueta>
              <Entrada
                id="fecha"
                type="date"
                value={fecha}
                max={hoyBogota || undefined}
                onChange={(e) => setFecha(e.target.value)}
                aria-invalid={errores.fecha ? true : undefined}
                aria-describedby={errores.fecha ? "fecha-error" : undefined}
              />
            </div>
          </div>
          {errores.cantidad && <MensajeError id="cantidad-error">{errores.cantidad}</MensajeError>}
          {errores.fecha && <MensajeError id="fecha-error">{errores.fecha}</MensajeError>}

          <div className="flex flex-col gap-1.5">
            <Etiqueta htmlFor="finca">Finca de origen</Etiqueta>
            <Entrada
              id="finca"
              value={finca}
              onChange={(e) => setFinca(e.target.value)}
              aria-invalid={errores.finca ? true : undefined}
              aria-describedby={errores.finca ? "finca-error" : undefined}
            />
            {errores.finca && <MensajeError id="finca-error">{errores.finca}</MensajeError>}
          </div>

          <Nota>
            Al firmar, el registro queda en la red con tu nombre, rol y fecha. Después no se puede editar. La comisión la
            paga la plataforma.
          </Nota>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-fondo from-70% to-fondo/0 px-5 pt-5 pb-7">
          <Boton type="submit" className="w-full" cargando={firmando && "Firmando con tu passkey…"}>
            <IconoPasskey />
            Firmar y generar QR
          </Boton>
        </div>
      </form>
    </Pantalla>
  );
}
