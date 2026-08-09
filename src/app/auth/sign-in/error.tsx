"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Sign-in unavailable</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Something went wrong loading the sign-in page. If you are deploying to
        Vercel, ensure <span className="font-mono">AUTH_SECRET</span> is set in
        your project environment variables.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
