"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { signInAction } from "@/app/(auth)/actions";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validations/auth";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    setIsPending(true);
    setServerError(null);

    startTransition(async () => {
      const result = await signInAction(values, next);

      if (!result.success) {
        setServerError(result.error);
        setIsPending(false);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
      setIsPending(false);
    });
  });

  return (
    <AuthFormShell
      title="Welcome back"
      description="Log in to review drafts, schedule content, and keep your creator workflow moving."
      footer={
        <>
          No account yet?{" "}
          <Link href="/signup" className="text-primary">
            Create one
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground/78">Password</label>
            <Link href="/forgot-password" className="text-sm text-primary">
              Forgot password?
            </Link>
          </div>
          <Input type="password" placeholder="Enter your password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <p className="text-sm text-danger">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
