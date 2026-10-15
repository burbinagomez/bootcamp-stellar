import { Pantalla } from "./pantalla";

const HOJA = "M0 0C-9-12-10-30 0-46C10-30 9-12 0 0Z";

/** Loading placeholder shaped like the screens: leaves pulse where the timeline will grow. */
export function EsqueletoPantalla({ etiqueta = "Cargando el lote" }: { etiqueta?: string }) {
  return (
    <Pantalla>
      <div role="status" aria-label={etiqueta} className="flex flex-col gap-4 px-5 pt-8">
        <div className="h-3 w-40 rounded-full bg-linea motion-safe:animate-respirar" />
        <div className="h-7 w-64 rounded-full bg-linea motion-safe:animate-respirar" />
        <div className="mt-2 h-24 rounded-2xl bg-papel/70 shadow-tarjeta motion-safe:animate-respirar" />
        <div className="mt-3 flex flex-col gap-6 pl-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <svg width="26" height="30" viewBox="-13 -40 26 42" aria-hidden="true">
                <path
                  d={HOJA}
                  transform={`rotate(${i % 2 ? -30 : 30}) scale(0.8)`}
                  fill="var(--color-niebla)"
                  className="motion-safe:animate-respirar"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              </svg>
              <div className="flex flex-1 flex-col gap-2">
                <div
                  className="h-3 rounded-full bg-linea motion-safe:animate-respirar"
                  style={{ width: `${70 - i * 8}%`, animationDelay: `${i * 0.18}s` }}
                />
                <div
                  className="h-2.5 w-1/3 rounded-full bg-linea/70 motion-safe:animate-respirar"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Pantalla>
  );
}

/** Empty / not-found / error screens in the same language: a bare sprout or a wilted one. */
export function EstadoVacio({
  titulo,
  texto,
  accion,
  marchita = false,
}: {
  titulo: string;
  texto: string;
  accion?: React.ReactNode;
  marchita?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
      <svg width="120" height="110" viewBox="0 0 120 110" aria-hidden="true">
        <ellipse cx="60" cy="98" rx="44" ry="8" fill="var(--color-linea)" />
        <path d="M24 98c10-10 62-10 72 0z" fill="#B9A58A" />
        <path d="M60 94V56" stroke={marchita ? "#9AA79E" : "#3F7D57"} strokeWidth="3" strokeLinecap="round" fill="none" />
        {marchita ? (
          <>
            <path d={HOJA} transform="translate(60 66) rotate(118) scale(0.55)" fill="var(--color-terracota)" />
            <path d={HOJA} transform="translate(60 74) rotate(-132) scale(0.5)" fill="#C9B79C" />
          </>
        ) : (
          <>
            {/* CSS transforms replace the transform attribute, so the sway goes on an inner path. */}
            <g transform="translate(60 60) rotate(52) scale(0.6)">
              <path d={HOJA} fill="#3F7D57" className="mece" />
            </g>
            <g transform="translate(60 70) rotate(-58) scale(0.5)">
              <path d={HOJA} fill="#6FA884" className="mece" style={{ animationDelay: "-2s" }} />
            </g>
          </>
        )}
      </svg>
      <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-balance">{titulo}</h1>
      <p className="max-w-[32ch] text-[15px] leading-relaxed text-tinta-suave">{texto}</p>
      {accion}
    </div>
  );
}
