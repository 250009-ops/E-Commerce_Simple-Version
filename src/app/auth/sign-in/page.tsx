import { Suspense } from "react";
import { SignInContent } from "./sign-in-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Staff Sign In — Warehouse Control Panel",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
