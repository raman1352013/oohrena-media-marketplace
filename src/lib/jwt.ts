// Simple JWT utilities (HS256) – replace with a proper library for production
import { createHmac } from "node:crypto";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const ISSUER = "oohrena";

export function sign(payload: Record<string, any>, expiresInSec: number = 3600): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
    iss: ISSUER,
  };
  const enc = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const data = `${enc(header)}.${enc(body)}`;
  const sig = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verify(token: string): Record<string, any> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sig] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const expectedSig = createHmac("sha256", SECRET).update(data).digest("base64url");
  if (expectedSig !== sig) return null;
  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) return null;
  return payload;
}
