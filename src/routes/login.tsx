import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Btn } from "@/components/app/kit";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otp, setOtp] = useState("");

  const requestOtp = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request-otp", email }),
    });
    const data = await res.json();
    if (data.ok) {
      toast.success("OTP generated (dev mode). Your OTP: " + data.otp);
      setStep("verify");
    } else {
      toast.error(data.error ?? "Failed to request OTP");
    }
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify-otp", email, code: otp }),
    });
    const data = await res.json();
    if (data.ok) {
      toast.success("Logged in as " + data.user.email);
      // Store token in localStorage for later use
      localStorage.setItem("auth_token", data.token);
      // Redirect to home
      window.location.href = "/";
    } else {
      toast.error(data.error ?? "Invalid OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-card border border-line rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">OOHRENA Login (Demo)</h2>
      <div className="mb-4">
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {step === "request" ? (
        <Btn onClick={requestOtp}>Request OTP</Btn>
      ) : (
        <>
          <div className="mb-4">
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <Btn onClick={verifyOtp}>Verify & Login</Btn>
        </>
      )}
    </div>
  );
}
