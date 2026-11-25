// In‑memory OTP store – for demo only (replace with Redis / DB in prod)
import type { Request } from "express"; // using node's Request type for typings only

interface OtpEntry {
  code: string;
  expiresAt: number; // epoch ms
}

const store = new Map<string, OtpEntry>();

export function generateOtp(key: string, ttlSec = 300): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6‑digit
  store.set(key, { code, expiresAt: Date.now() + ttlSec * 1000 });
  return code;
}

export function verifyOtp(key: string, code: string): boolean {
  const entry = store.get(key);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    return false;
  }
  const ok = entry.code === code;
  if (ok) store.delete(key);
  return ok;
}
