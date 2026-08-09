import { isDemoMode } from "@/lib/db";
import {
  getDefaultAdminEmail,
  getDefaultAdminPassword,
  getAuthSetupMessage,
} from "@/lib/auth";
import { SignInForm } from "./sign-in-form";

export function SignInContent() {
  const demoMode = isDemoMode();
  const authSetupMessage = getAuthSetupMessage();

  return (
    <SignInForm
      demoMode={demoMode}
      demoEmail={getDefaultAdminEmail()}
      demoPassword={getDefaultAdminPassword()}
      authSetupMessage={authSetupMessage}
    />
  );
}
