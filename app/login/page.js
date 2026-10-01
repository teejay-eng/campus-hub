"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else if (session?.user?.role === "STUDENT") {
      router.push("/student");
    } else {
      router.push("/");
    }
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-blue-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-center text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Sign in with your email or student ID
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && <Alert type="error">{error}</Alert>}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email / Student ID
              </label>
              <input
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/" className="text-blue-600 hover:underline">
              Back to home
            </Link>
          </p>
        
        </div>
      </div>
    </div>
  );
}
