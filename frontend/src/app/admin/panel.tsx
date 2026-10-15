"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { EstadoVacio } from "@/components/estados";
import { Marca, PantallaEscritorio } from "@/components/pantalla";
import { EscenaPanel } from "@/components/plantas";
import { useRetroalimentacion } from "@/components/retroalimentacion";
import { Boton, Enlace, Entrada, Etiqueta, Insignia, MensajeError, Selector } from "@/components/ui";
import { nombreRol } from "@/data/actores";
import type { Rol } from "@/data/tipos";
import { fechaCorta } from "@/lib/fechas";
import { calcularSello, describirSalto, type Sello } from "@/lib/sello";
import { comisionEstimadaXlm, red } from "@/lib/stellar";
import { useOrigen } from "@/lib/store";

type Seccion = "actores" | "lotes" | "saltos" | "comisiones";

const SECCIONES: { clave: Seccion; titulo: string; subtitulo: string }[] = [
  { clave: "actores", titulo: "Actores y roles", subtitulo: "Cada actor firma solo los pasos que le permite su rol." },
  { clave: "lotes", titulo: "Lotes", subtitulo: "Todos los lotes registrados y el estado de su cadena." },
  { clave: "saltos", titulo: "Saltos en la cadena", subtitulo: "Lotes donde falta una firma o el orden no cuadra." },
  { clave: "comisiones", titulo: "Comisiones patrocinadas", subtitulo: "La plataforma paga la comisión de cada firma." },
];

const INSIGNIA_SELLO: Record<Sello["estado"], { tono: "ok" | "transito" | "salto"; texto: string }> = {
  completo: { tono: "ok", texto: "Completo" },
  "en-transito": { tono: "transito", texto: "En tránsito" },
  salto: { tono: "salto", texto: "Con salto" },
};

const ROLES_ALTA: Rol[] = ["productor", "transportista", "acopio", "comerciante", "gestor", "receptor"];

export function Panel() {
  const { actores, lotes, eventos, reiniciar } = useOrigen();
  const { avisar } = useRetroalimentacion();
  const [seccion, setSeccion] = useState<Seccion>("actores");
  const dialogo = useRef<HTMLDialogElement>(null);

  const conSello = useMemo(
    () =>
      lotes
        .map((lote) => {
          const propios = eventos.filter((e) => e.loteId === lote.id);
          return { lote, firmas: propios.length, sello: calcularSello(propios) };
        })
        .sort((a, b) => b.lote.id.localeCompare(a.lote.id)),
    [lotes, eventos],
  );
  const firmasPorActor = useMemo(() => {
    const cuenta = new Map<string, number>();
    eventos.forEach((e) => cuenta.set(e.actorId, (cuenta.get(e.actorId) ?? 0) + 1));
    return cuenta;
  }, [eventos]);

  const conSalto = conSello.filter((l) => l.sello.estado === "salto");
  const actual = SECCIONES.find((s) => s.clave === seccion)!;
  const indicadores = [
    { valor: actores.filter((a) => a.estado === "activo").length, etiqueta: "Actores activos" },
    { valor: lotes.length, etiqueta: "Lotes en la red" },
    { valor: eventos.length, etiqueta: "Firmas registradas" },
    { valor: conSalto.length, etiqueta: "Lotes con salto", alerta: conSalto.length > 0 },
  ];

  return (
    <PantallaEscritorio>
      <nav
        aria-label="Principal"
        className="tono-noche relative isolate flex max-w-full flex-[1_1_220px] flex-col gap-1.5 overflow-hidden bg-tinta px-[18px] py-7 text-fondo lg:min-h-dvh"
      >
        <EscenaPanel className="pointer-events-none absolute bottom-0 left-0 -z-10" />
        <div className="px-2.5 pb-5">
          <Marca tamano={20} oscura />
        </div>
        {SECCIONES.map((s) => (
          <button
            key={s.clave}
            type="button"
            onClick={() => setSeccion(s.clave)}
            aria-current={seccion === s.clave ? "page" : undefined}
            className={`relative min-h-11 rounded-[10px] px-3 py-3 text-left text-[15px] transition-colors ${
              seccion === s.clave ? "font-semibold text-tinta" : "text-[#DCE3DE] hover:bg-white/5"
            }`}
          >
            {seccion === s.clave && (
              <motion.span
                layoutId="seccion-activa"
                className="absolute inset-0 -z-10 rounded-[10px] bg-menta"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            {s.titulo}
            {s.clave === "saltos" && conSalto.length > 0 && (
              <span className="ml-2 rounded-full bg-terracota px-1.5 py-0.5 text-xs font-semibold text-white">
                {conSalto.length}
              </span>
            )}
          </button>
        ))}
        <div className="min-h-40 flex-1" />
        {/* Small dark card so the footer stays readable over the garden. */}
        <div className="flex flex-col gap-1 rounded-xl bg-[#0f1813]/90 p-3 backdrop-blur-[2px]">
          <p className="font-mono text-xs leading-relaxed text-noche-texto">
            Stellar {red.nombre}
            <br />
            contrato RegistroLotes
          </p>
          <button
            type="button"
            onClick={() => {
              reiniciar();
              avisar("Restableciste los datos de prueba.", "info");
            }}
            className="min-h-11 self-start text-left text-[13px] text-fondo underline underline-offset-4 hover:text-menta"
          >
            Restablecer datos de prueba
          </button>
        </div>
      </nav>

      <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 px-5 py-9 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-[34px] font-bold tracking-[-0.02em]">{actual.titulo}</h1>
            <p className="text-[15px] text-tinta-suave">{actual.subtitulo}</p>
          </div>
          {seccion === "actores" && (
            <Boton tamano="mediano" onClick={() => dialogo.current?.showModal()}>
              Dar de alta actor
            </Boton>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          {indicadores.map((k, i) => (
            <motion.div
              key={k.etiqueta}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex flex-col gap-1 rounded-[14px] border border-linea bg-papel p-[18px] shadow-tarjeta"
            >
              <span className={`font-display text-[32px] leading-none font-bold ${k.alerta ? "text-terracota-oscura" : ""}`}>
                {k.valor}
              </span>
              <span className="text-sm text-tinta-suave">{k.etiqueta}</span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={seccion}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            aria-label={actual.titulo}
          >
            {seccion === "actores" && (
              <Tabla
                columnas={["Actor", "Rol", "Billetera (passkey)", "Firmas", "Estado"]}
                filas={actores.map((a) => [
                  <span key="n" className="flex flex-col gap-0.5">
                    <span className="font-semibold">{a.nombre}</span>
                    <span className="text-[13px] text-tinta-suave">{a.lugar}</span>
                  </span>,
                  nombreRol[a.rol],
                  <span key="b" className="font-mono text-[13px]">
                    {a.billetera ?? "—"}
                  </span>,
                  firmasPorActor.get(a.id) ?? 0,
                  a.estado === "activo" ? (
                    <Insignia key="e" tono="ok">
                      Activo
                    </Insignia>
                  ) : (
                    <Insignia key="e" tono="salto">
                      Pendiente passkey
                    </Insignia>
                  ),
                ])}
              />
            )}

            {seccion === "lotes" && (
              <Tabla
                columnas={["Lote", "Producto", "Cosecha", "Firmas", "Cadena", ""]}
                filas={conSello.map(({ lote, firmas, sello }) => [
                  <span key="i" className="font-mono">
                    {lote.id}
                  </span>,
                  `${lote.producto} · ${lote.kg} kg`,
                  fechaCorta(lote.cosecha),
                  firmas,
                  <Insignia key="s" tono={INSIGNIA_SELLO[sello.estado].tono}>
                    {INSIGNIA_SELLO[sello.estado].texto}
                  </Insignia>,
                  <Enlace key="v" href={`/v/${lote.id}`} className="inline-flex min-h-11 items-center font-semibold text-hoja underline underline-offset-4">
                    Ver historial
                  </Enlace>,
                ])}
              />
            )}

            {seccion === "saltos" &&
              (conSalto.length === 0 ? (
                <div className="rounded-2xl border border-linea bg-papel shadow-tarjeta">
                  <EstadoVacio
                    titulo="Ninguna cadena tiene saltos"
                    texto="Todos los lotes tienen sus firmas completas y en orden. Si falta una, aparecerá aquí."
                  />
                </div>
              ) : (
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
                  {conSalto.map(({ lote, sello }) => (
                    <li key={lote.id} className="flex flex-col gap-2 rounded-2xl border border-linea bg-papel p-5 shadow-tarjeta">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold">
                          {lote.producto} · {lote.kg} kg
                        </span>
                        <span className="font-mono text-[13px] text-tinta-suave">{lote.id}</span>
                      </span>
                      <span className="text-sm text-terracota-oscura">{sello.salto && describirSalto(sello.salto)}</span>
                      <span className="text-[13px] text-tinta-suave">
                        Responsable del tramo: {sello.salto?.faltantes[0] ? nombreRol[sello.salto.faltantes[0].rol] : "revisar orden de firmas"}
                      </span>
                      <Enlace href={`/v/${lote.id}`} className="inline-flex min-h-11 items-center self-start text-sm font-semibold text-hoja underline underline-offset-4">
                        Ver historial del lote
                      </Enlace>
                    </li>
                  ))}
                </ul>
              ))}

            {seccion === "comisiones" && (
              <Tabla
                columnas={["Actor", "Rol", "Firmas patrocinadas", "Comisión estimada"]}
                filas={actores
                  .filter((a) => firmasPorActor.has(a.id))
                  .map((a) => {
                    const firmas = firmasPorActor.get(a.id) ?? 0;
                    return [
                      <span key="n" className="font-semibold">
                        {a.nombre}
                      </span>,
                      nombreRol[a.rol],
                      firmas,
                      <span key="c" className="font-mono text-[13px]">
                        {(firmas * comisionEstimadaXlm).toFixed(4)} XLM
                      </span>,
                    ];
                  })}
                pie={[
                  "Total",
                  "",
                  eventos.length,
                  <span key="t" className="font-mono text-[13px] font-semibold">
                    {(eventos.length * comisionEstimadaXlm).toFixed(4)} XLM
                  </span>,
                ]}
              />
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      <DialogoAlta
        dialogo={dialogo}
        onAlta={(nombre) => avisar(`Diste de alta a ${nombre}. Le llegará la invitación para crear su passkey.`)}
      />
    </PantallaEscritorio>
  );
}

function Tabla({
  columnas,
  filas,
  pie,
}: {
  columnas: string[];
  filas: React.ReactNode[][];
  pie?: React.ReactNode[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-linea bg-papel shadow-tarjeta">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-linea text-left text-tinta-suave">
            {columnas.map((c, i) => (
              <th key={i} scope="col" className="px-5 py-3.5 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i} className="border-b border-[#E6EAE4] last:border-0 hover:bg-fondo/60">
              {fila.map((celda, j) => (
                <td key={j} className="px-5 py-3.5">
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {pie && (
          <tfoot>
            <tr className="border-t border-linea bg-fondo/60 font-semibold">
              {pie.map((celda, j) => (
                <td key={j} className="px-5 py-3.5">
                  {celda}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

function DialogoAlta({
  dialogo,
  onAlta,
}: {
  dialogo: React.RefObject<HTMLDialogElement | null>;
  onAlta: (nombre: string) => void;
}) {
  const { agregarActor, actores } = useOrigen();
  const [nombre, setNombre] = useState("");
  const [lugar, setLugar] = useState("");
  const [rol, setRol] = useState<Rol>("productor");
  const [error, setError] = useState<string | null>(null);

  function cerrar() {
    dialogo.current?.close();
    setNombre("");
    setLugar("");
    setRol("productor");
    setError(null);
  }

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) {
      setError("Escribe el nombre de la persona o la organización.");
      return;
    }
    let id = limpio.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
    if (actores.some((a) => a.id === id)) id = `${id}-${actores.length + 1}`;
    agregarActor({ id, nombre: limpio, rol, lugar: lugar.trim() || "Sin ubicación", billetera: null, estado: "pendiente" });
    onAlta(limpio);
    cerrar();
  }

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="titulo-alta"
      onClose={cerrar}
      className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-3xl bg-fondo p-0 text-tinta shadow-elevada backdrop:bg-tinta/50 backdrop:backdrop-blur-[2px]"
    >
      <form onSubmit={enviar} noValidate className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h2 id="titulo-alta" className="font-display text-2xl font-bold tracking-[-0.02em]">
            Dar de alta actor
          </h2>
          <p className="text-sm text-tinta-suave">
            Recibe una invitación para crear su passkey. Hasta entonces no puede firmar.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Etiqueta htmlFor="alta-nombre">Nombre</Etiqueta>
          <Entrada
            id="alta-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "alta-error" : undefined}
            autoFocus
          />
          {error && <MensajeError id="alta-error">{error}</MensajeError>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Etiqueta htmlFor="alta-lugar">Lugar u organización</Etiqueta>
          <Entrada id="alta-lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Ej.: Vereda La Clara, Urrao" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Etiqueta htmlFor="alta-rol">Rol</Etiqueta>
          <Selector id="alta-rol" value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
            {ROLES_ALTA.map((r) => (
              <option key={r} value={r}>
                {nombreRol[r]}
              </option>
            ))}
          </Selector>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <Boton variante="secundario" tamano="mediano" onClick={cerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" tamano="mediano">
            Dar de alta
          </Boton>
        </div>
      </form>
    </dialog>
  );
}
