import type { Metadata } from "next";
import { Suspense } from "react";
import { EsqueletoPantalla } from "@/components/estados";
import { Verificacion } from "./verificacion";

export const metadata: Metadata = { title: "Verificar lote" };

export default function Page({ params, searchParams }: PageProps<"/v/[id]">) {
  return (
    <Suspense fallback={<EsqueletoPantalla etiqueta="Cargando el historial del lote" />}>
      {Promise.all([params, searchParams]).then(([{ id }, busqueda]) => (
        <Verificacion id={decodeURIComponent(id)} vistaPrevia={busqueda.vista === "comerciante"} />
      ))}
    </Suspense>
  );
}
