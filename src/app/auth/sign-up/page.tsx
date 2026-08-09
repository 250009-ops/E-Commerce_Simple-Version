"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/app/actions/orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await signUp(formData)) ?? null;
    },
    null
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Create account</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-medium text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Full Name
          </label>
          <Input name="fullName" required autoComplete="name" />
        </div>
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
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
