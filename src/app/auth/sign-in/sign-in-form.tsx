"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SignInFormProps = {
  demoMode: boolean;
  demoEmail: string;
  demoPassword: string;
};

export function SignInForm({
  demoMode,
  demoEmail,
  demoPassword,
}: SignInFormProps) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const message = searchParams.get("message");

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      formData.set("redirect", redirect);
      return (await signIn(formData)) ?? null;
    },
    null
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Staff sign in</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Need an account?{" "}
        <Link href="/auth/sign-up" className="font-medium text-zinc-900 hover:underline">
          Register staff access
        </Link>
      </p>

      {demoMode && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium">Demo mode — no database required</p>
          <p className="mt-1">
            Sign in with <span className="font-mono">{demoEmail}</span> /{" "}
            <span className="font-mono">{demoPassword}</span> to access the warehouse
            admin panel and demo inventory.
          </p>
        </div>
      )}

      {message && !message.toLowerCase().includes("database") && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={demoMode ? demoEmail : undefined}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Password
          </label>
          <Input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
