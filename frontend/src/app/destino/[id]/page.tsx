import type { Metadata } from "next";
import { Suspense } from "react";
import { EsqueletoPantalla } from "@/components/estados";
import { DestinoSobrante } from "./destino-sobrante";

export const metadata: Metadata = { title: "Destino del sobrante" };

export default function Page({ params }: PageProps<"/destino/[id]">) {
  return (
    <Suspense fallback={<EsqueletoPantalla />}>
      {params.then(({ id }) => (
        <DestinoSobrante id={decodeURIComponent(id)} />
      ))}
    </Suspense>
  );
}
