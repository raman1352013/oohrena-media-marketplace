import { createFileRoute } from "@tanstack/react-router";
import { generateOtp, verifyOtp } from "@/lib/otp";
import { sign } from "@/lib/jwt";

// Simple in‑memory user store for demo – replace with real DB later
interface User {
  id: string;
  email: string;
  role: "admin" | "vendor-bm" | "vendor-go" | "client" | "finance" | "partner";
}

const users: Record<string, User> = {
  "admin@oohrena.com": { id: "U-ADMIN", email: "admin@oohrena.com", role: "admin" },
  // add more demo users if needed
};

export const Route = createFileRoute("/api/auth")({
  // POST /api/auth/request-otp
  // body: { email: string }
  // Returns { ok: true, otp?: string } – in prod otp would be emailed/SMS'd
  server: {
    handlers: {
      async POST({ request }) {
        const { action, email } = await request.json();
        if (!email) return new Response(JSON.stringify({ error: "email required" }), { status: 400, headers: { "Content-Type": "application/json" } });

        if (action === "request-otp") {
          const otp = generateOtp(email);
          // In a real system, send OTP via email/SMS. Here we just echo it.
          return new Response(JSON.stringify({ ok: true, otp }), { headers: { "Content-Type": "application/json" } });
        }

        if (action === "verify-otp") {
          const { code } = await request.json();
          const ok = verifyOtp(email, code);
          if (!ok) return new Response(JSON.stringify({ ok: false, error: "invalid otp" }), { status: 401, headers: { "Content-Type": "application/json" } });
          const user = users[email] ?? { id: `U-${Date.now()}`, email, role: "client" };
          const token = sign({ sub: user.id, role: user.role });
          return new Response(JSON.stringify({ ok: true, token, user }), { headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ error: "unknown action" }), { status: 400, headers: { "Content-Type": "application/json" } });
      },
    },
  },
});
