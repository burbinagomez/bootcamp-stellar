import type { Metadata } from "next";
import { Ingreso } from "./ingreso";

export const metadata: Metadata = { title: "Ingresar" };

export default function Page() {
  return <Ingreso />;
}
