import type { Metadata } from "next";
import { Suspense } from "react";
import { EsqueletoPantalla } from "@/components/estados";
import { Recepcion } from "./recepcion";

export const metadata: Metadata = { title: "Recepción en tienda" };

export default function Page({ params }: PageProps<"/recepcion/[id]">) {
  return (
    <Suspense fallback={<EsqueletoPantalla />}>
      {params.then(({ id }) => (
        <Recepcion id={decodeURIComponent(id)} />
      ))}
    </Suspense>
  );
}
