import type { Metadata } from "next";
import { Suspense } from "react";
import { EsqueletoPantalla } from "@/components/estados";
import { ResiduoRecibido } from "./residuo-recibido";

export const metadata: Metadata = { title: "Residuo recibido" };

export default function Page({ params }: PageProps<"/residuo/[id]">) {
  return (
    <Suspense fallback={<EsqueletoPantalla />}>
      {params.then(({ id }) => (
        <ResiduoRecibido id={decodeURIComponent(id)} />
      ))}
    </Suspense>
  );
}
