import { Suspense } from "react";
import { isDemoModeActive } from "@/app/actions/auth";
import { getDefaultAdminEmail, getDefaultAdminPassword } from "@/lib/auth";
import { SignInForm } from "./sign-in-form";

export const metadata = {
  title: "Staff Sign In — Warehouse Control Panel",
};

export default async function SignInPage() {
  const demoMode = await isDemoModeActive();

  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
      <SignInForm
        demoMode={demoMode}
        demoEmail={getDefaultAdminEmail()}
        demoPassword={getDefaultAdminPassword()}
      />
    </Suspense>
  );
}
