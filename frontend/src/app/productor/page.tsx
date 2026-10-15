import type { Metadata } from "next";
import { MisLotes } from "./mis-lotes";

export const metadata: Metadata = { title: "Mis lotes" };

export default function Page() {
  return <MisLotes />;
}
