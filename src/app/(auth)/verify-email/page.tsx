import Link from "next/link";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { buttonVariants } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <AuthFormShell
      title="Verify your email"
      description="We sent a confirmation link to your inbox. Once it’s verified, you’ll be able to access your CreatorFlow dashboard."
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-foreground/70">
          If you do not see the email, check spam or promotions, then return here once verification is complete.
        </p>
        <Link href="/login" className={`${buttonVariants()} w-full`}>
          Back to login
        </Link>
      </div>
    </AuthFormShell>
  );
}
