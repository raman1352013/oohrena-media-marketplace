import { verify } from "@/lib/jwt";
import type { Request } from "@hono/node-server"; // generic request type

export interface AuthPayload {
  sub: string;
  role: "admin" | "vendor-bm" | "vendor-go" | "client" | "finance" | "partner";
  iat: number;
  exp: number;
  iss: string;
}

/** Extract JWT from Authorization header and verify it */
export function getAuthPayload(req: Request): AuthPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  const token = parts[1];
  const payload = verify(token) as AuthPayload | null;
  return payload;
}

/** Simple role guard – throws if role not allowed */
export function requireRole(req: Request, allowed: AuthPayload["role"][]): AuthPayload {
  const payload = getAuthPayload(req);
  if (!payload) throw new Error("Unauthenticated");
  if (!allowed.includes(payload.role)) throw new Error("Forbidden: insufficient role");
  return payload;
}
