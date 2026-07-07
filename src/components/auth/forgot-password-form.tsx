"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { forgotPasswordAction } from "@/app/(auth)/actions";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/validations/auth";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    setIsPending(true);
    setServerError(null);
    setServerMessage(null);

    startTransition(async () => {
      const result = await forgotPasswordAction(values);

      if (!result.success) {
        setServerError(result.error);
        setIsPending(false);
        return;
      }

      setServerMessage(result.message);
      setIsPending(false);
    });
  });

  return (
    <AuthFormShell
      title="Reset your password"
      description="We’ll send a secure reset link so you can get back to your content pipeline."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-primary">
            Back to login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/78">Email</label>
          <Input type="email" placeholder="creator@creatorflow.ai" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}
        {serverMessage ? <p className="text-sm text-success">{serverMessage}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending reset link..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
