import type { Metadata } from "next";
import { Suspense } from "react";
import { EsqueletoPantalla } from "@/components/estados";
import { LoteQr } from "./lote-qr";

export const metadata: Metadata = { title: "QR del lote" };

export default function Page({ params }: PageProps<"/lotes/[id]/qr">) {
  return (
    <Suspense fallback={<EsqueletoPantalla />}>
      {params.then(({ id }) => (
        <LoteQr id={decodeURIComponent(id)} />
      ))}
    </Suspense>
  );
}
