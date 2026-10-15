import "server-only";

import type { SaleTerm } from "@prisma/client";

export interface SaleTermRecord {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function saleTermToRecord(st: SaleTerm): SaleTermRecord {
  return {
    id: st.id.toString(),
    title: st.title,
    description: st.description,
    image: st.image,
    isActive: st.isActive,
    createdAt: st.createdAt.toISOString(),
    updatedAt: st.updatedAt.toISOString(),
  };
}
