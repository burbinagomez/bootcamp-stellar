import type { Metadata } from "next";
import { Suspense } from "react";
import { EsqueletoPantalla } from "@/components/estados";
import { Custodia } from "./custodia";

export const metadata: Metadata = { title: "Entrega del lote" };

export default function Page({ params }: PageProps<"/custodia/[id]">) {
  return (
    <Suspense fallback={<EsqueletoPantalla />}>
      {params.then(({ id }) => (
        <Custodia id={decodeURIComponent(id)} />
      ))}
    </Suspense>
  );
}
