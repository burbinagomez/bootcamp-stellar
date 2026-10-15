import type { Metadata } from "next";
import { RegistrarLote } from "./registrar-lote";

export const metadata: Metadata = { title: "Registrar lote" };

export default function Page() {
  return <RegistrarLote />;
}
