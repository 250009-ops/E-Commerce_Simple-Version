import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export const metadata = {
  title: "Sign In — Storefront",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
