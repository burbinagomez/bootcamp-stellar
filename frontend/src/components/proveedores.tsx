"use client";

import { MotionConfig } from "motion/react";
import { OrigenProvider } from "@/lib/store";
import { RetroalimentacionProvider } from "./retroalimentacion";

export function Proveedores({ children }: { children: React.ReactNode }) {
  return (
    // "user": with reduced motion, transforms are skipped and only opacity animates.
    <MotionConfig reducedMotion="user">
      <OrigenProvider>
        <RetroalimentacionProvider>{children}</RetroalimentacionProvider>
      </OrigenProvider>
    </MotionConfig>
  );
}
