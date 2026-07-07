"use server";

import { env, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  signUpSchema
} from "@/lib/validations/auth";

export async function signInAction(
  payload: unknown,
  next = "/dashboard"
) {
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid login details." };
  }

  if (!hasSupabaseEnv) {
    return { success: true as const, redirectTo: next };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { success: false as const, error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const, redirectTo: next };
}

export async function signUpAction(payload: unknown) {
  const parsed = signUpSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid sign-up details." };
  }

  if (!hasSupabaseEnv) {
    return {
      success: true as const,
      message:
        "Demo mode enabled. Add Supabase credentials to activate real sign-up and email verification."
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { success: false as const, error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName
      },
      emailRedirectTo: `${env.appUrl}/auth/callback`
    }
  });

  if (error) {
    return { success: false as const, error: error.message };
  }

  return {
    success: true as const,
    message: "Check your email to verify your account, then come back to log in."
  };
}

export async function forgotPasswordAction(payload: unknown) {
  const parsed = forgotPasswordSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid email address." };
  }

  if (!hasSupabaseEnv) {
    return {
      success: true as const,
      message:
        "Demo mode enabled. Add Supabase credentials to send real password reset emails."
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { success: false as const, error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.appUrl}/login`
  });

  if (error) {
    return { success: false as const, error: error.message };
  }

  return {
    success: true as const,
    message: "Reset link sent. Check your inbox for the next step."
  };
}

export async function signOutAction() {
  if (!hasSupabaseEnv) {
    return { success: true as const };
  }

  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  return { success: true as const };
}
