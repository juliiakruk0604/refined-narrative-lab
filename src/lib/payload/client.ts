function resolvePayloadUrl(): string {
  const fromVite =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_PAYLOAD_URL
      ? String(import.meta.env.VITE_PAYLOAD_URL)
      : "";
  const fromProcess =
    process.env.PAYLOAD_URL ?? process.env.VITE_PAYLOAD_URL ?? fromVite;

  return fromProcess.replace(/\/$/, "");
}

const PAYLOAD_URL = resolvePayloadUrl();

export function isPayloadEnabled(): boolean {
  return PAYLOAD_URL.length > 0;
}

export function getPayloadUrl(): string {
  return PAYLOAD_URL;
}

type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
};

export async function payloadFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number },
): Promise<T | null> {
  if (!isPayloadEnabled()) return null;

  const { revalidate, ...fetchInit } = init ?? {};

  try {
    const res = await fetch(`${PAYLOAD_URL}${path}`, {
      ...fetchInit,
      headers: {
        "Content-Type": "application/json",
        ...fetchInit.headers,
      },
      ...(revalidate !== undefined ? { next: { revalidate } } : {}),
    });

    if (!res.ok) {
      console.warn(`[Payload] ${path} → ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn("[Payload] fetch failed:", error);
    return null;
  }
}

export type { PayloadListResponse };
