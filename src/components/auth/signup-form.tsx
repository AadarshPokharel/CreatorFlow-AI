"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { signUpAction } from "@/app/(auth)/actions";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/validations/auth";

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    setIsPending(true);
    setServerError(null);
    setServerMessage(null);

    startTransition(async () => {
      const result = await signUpAction(values);

      if (!result.success) {
        setServerError(result.error);
        setIsPending(false);
        return;
      }

      setServerMessage(result.message);
      form.reset();
      setIsPending(false);
    });
  });

  return (
    <AuthFormShell
      title="Start your creator system"
      description="Set up a secure workspace for original short-form content creation, planning, and organization."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/78">Full name</label>
          <Input placeholder="Aadarsh Pokharel" {...form.register("fullName")} />
          {form.formState.errors.fullName ? (
            <p className="text-sm text-danger">{form.formState.errors.fullName.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/78">Email</label>
          <Input type="email" placeholder="creator@creatorflow.ai" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/78">Password</label>
          <Input type="password" placeholder="Create a strong password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <p className="text-sm text-danger">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}
        {serverMessage ? <p className="text-sm text-success">{serverMessage}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
