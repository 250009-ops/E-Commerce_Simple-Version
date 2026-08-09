"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignInForm() {
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
      <h1 className="text-3xl font-bold text-zinc-900">Sign in</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="font-medium text-zinc-900 hover:underline">
          Create one
        </Link>
      </p>

      {message && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <Input name="email" type="email" required autoComplete="email" />
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
