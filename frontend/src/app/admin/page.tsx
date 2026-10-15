import type { Metadata } from "next";
import { Panel } from "./panel";

export const metadata: Metadata = { title: "Administración" };

export default function Page() {
  return <Panel />;
}
