"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export function useInstitutions() {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: () => fetchJson<any>("/api/plaid/institutions"),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useRecurring() {
  return useQuery({
    queryKey: ["recurring"],
    queryFn: () => fetchJson<any>("/api/data/recurring"),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useRoundups() {
  return useQuery({
    queryKey: ["roundups"],
    queryFn: () => fetchJson<any>("/api/data/roundups"),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePodsLive() {
  return useQuery({
    queryKey: ["pods-live"],
    queryFn: () => fetchJson<any>("/api/pods"),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useLinkedCounts() {
  return useQuery({
    queryKey: ["linked-counts"],
    queryFn: () => fetchJson<{ items: number; accounts: number }>("/api/plaid/linked"),
    refetchInterval: typeof document !== "undefined" && document.visibilityState === "visible" ? 30000 : false,
    refetchOnWindowFocus: false,
  })
}


