"use client";

import { useEffect } from "react";
import { registerVisitor } from "@/lib/siteMetrics";

export function VisitorTracker() {
  useEffect(() => {
    void registerVisitor();
  }, []);

  return null;
}
