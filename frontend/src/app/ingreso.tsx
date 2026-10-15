"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Marca, Pantalla } from "@/components/pantalla";
import { EscenaIngreso } from "@/components/plantas";
import { Boton, Entrada, Etiqueta, IconoPasskey, MensajeError, useNavegar } from "@/components/ui";
import { conectarPasskey, red, simulada } from "@/lib/stellar";

export function Ingreso() {
  const navegar = useNavegar();
  const [cuenta, setCuenta] = useState("maria.restrepo@finca.co");
  const [error, setError] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function entrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!cuenta.trim()) {
      setError("Escribe el correo o celular con el que te dieron de alta.");
      return;
    }
    setError(null);
    setEntrando(true);
    try {
      await conectarPasskey(cuenta.trim());
      navegar("/productor");
    } catch {
      setError("No se pudo leer tu passkey. Desbloquea el celular e inténtalo de nuevo.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <Pantalla>
      <div className="flex flex-1 flex-col px-6 pt-14 pb-8">
        <Marca />

        <div className="flex flex-1 flex-col justify-center gap-4 py-6">
          <EscenaIngreso className="h-auto w-full max-w-[342px]" />
          <h1 className="font-display text-[40px] leading-[1.04] font-bold tracking-[-0.03em] text-balance">
            Cada lote con su historia,{" "}
            <span className="relative inline-block">
              firmada
              <Firma />
            </span>{" "}
            por quien lo movió.
          </h1>
          <p className="text-base leading-normal text-tinta-suave">
            Entra con la huella o el rostro de tu celular. No necesitas contraseña, frase semilla ni comprar
            criptomonedas.
          </p>
        </div>

        <form onSubmit={entrar} noValidate className="flex flex-col gap-3">
          <Etiqueta htmlFor="cuenta">Correo o celular registrado</Etiqueta>
          <Entrada
            id="cuenta"
            type="text"
            inputMode="email"
            autoComplete="username webauthn"
            value={cuenta}
            onChange={(e) => setCuenta(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "cuenta-error" : undefined}
          />
          {error && <MensajeError id="cuenta-error">{error}</MensajeError>}
          <Boton type="submit" cargando={entrando && "Esperando tu huella…"}>
            <IconoPasskey />
            Entrar con passkey
          </Boton>
          <p className="mt-1 text-center text-[13px] leading-normal text-tinta-suave">
            ¿Aún no tienes cuenta? El administrador de tu cooperativa te da de alta y te asigna tu rol.
          </p>
          <p className="mt-2 self-center rounded-full border border-linea-fuerte/60 px-3 py-1.5 font-mono text-xs text-tinta-suave">
            Red: Stellar {red.nombre}
            {simulada && " · firmas simuladas"}
          </p>
        </form>
      </div>
    </Pantalla>
  );
}

/** Hand-drawn underline that signs the word "firmada" once the page loads. */
function Firma() {
  return (
    <svg
      viewBox="0 0 160 22"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute -bottom-1.5 left-0 h-3 w-full overflow-visible"
    >
      <motion.path
        d="M3 15C30 9 62 7 92 9c22 1 44 3 65-1"
        fill="none"
        stroke="var(--color-ocre)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
