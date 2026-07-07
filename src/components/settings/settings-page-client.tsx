"use client";

import type { ReactNode } from "react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Upload } from "lucide-react";
import type { z } from "zod";

import {
  savePreferencesAction,
  saveProfileAction,
  uploadAvatarAction
} from "@/app/(app)/settings/actions";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/ui/section-heading";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { durations, tones } from "@/lib/constants";
import { profileSchema } from "@/lib/validations/auth";
import { settingsPreferencesSchema } from "@/lib/validations/settings";

type ProfileValues = z.infer<typeof profileSchema>;
type PreferencesValues = z.infer<typeof settingsPreferencesSchema>;

export function SettingsPageClient({
  snapshot
}: {
  snapshot: Awaited<
    ReturnType<typeof import("@/lib/server/content").getSettingsSnapshot>
  >;
}) {
  const [profileMessage, setProfileMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [preferencesMessage, setPreferencesMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [avatarMessage, setAvatarMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(snapshot.avatarUrl);
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: snapshot.profile
  });
  const preferencesForm = useForm<PreferencesValues>({
    resolver: zodResolver(settingsPreferencesSchema),
    defaultValues: {
      defaultTone: snapshot.aiPreferences.defaultTone,
      preferredDuration: snapshot.aiPreferences.preferredDuration,
      originalityGuardrails: snapshot.aiPreferences.originalityGuardrails,
      email: snapshot.notifications.email,
      inApp: snapshot.notifications.inApp,
      weeklySummary: snapshot.notifications.weeklySummary
    }
  });

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Settings"
        title="Profile, AI preferences, notifications, storage, and API readiness."
        description="Use settings to shape your creator workflow, manage your profile picture, and prepare future integrations without changing the rest of the app architecture."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardTitle>Profile</CardTitle>
          <CardDescription className="mt-2">
            Update your name, email, bio, and profile photo.
          </CardDescription>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={snapshot.profile.fullName} src={avatarUrl} size="lg" />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium">
              <Upload className="h-4 w-4" />
              Upload profile picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  const formData = new FormData();
                  formData.append("avatar", file);

                  startTransition(async () => {
                    const result = await uploadAvatarAction(formData);
                    setAvatarMessage({
                      kind: result.success ? "success" : "error",
                      text: result.success ? result.message : result.error
                    });
                    if (result.success && result.url) {
                      setAvatarUrl(result.url);
                    }
                  });
                }}
              />
            </label>
          </div>
          {avatarMessage ? (
            <p
              className={`mt-3 text-sm ${
                avatarMessage.kind === "success" ? "text-success" : "text-danger"
              }`}
            >
              {avatarMessage.text}
            </p>
          ) : null}

          <form
            onSubmit={profileForm.handleSubmit((values) => {
              startTransition(async () => {
                const result = await saveProfileAction(values);
                setProfileMessage({
                  kind: result.success ? "success" : "error",
                  text: result.success ? result.message : result.error
                });
              });
            })}
            className="mt-6 space-y-4"
          >
            <Field label="Full name">
              <Input {...profileForm.register("fullName")} />
            </Field>
            <Field label="Email">
              <Input type="email" {...profileForm.register("email")} />
            </Field>
            <Field label="Bio">
              <Textarea {...profileForm.register("bio")} />
            </Field>
            {profileMessage ? (
              <p
                className={`text-sm ${
                  profileMessage.kind === "success" ? "text-success" : "text-danger"
                }`}
              >
                {profileMessage.text}
              </p>
            ) : null}
            <Button type="submit">Save Profile</Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardTitle>Storage usage</CardTitle>
            <CardDescription className="mt-2">
              Track how much room your media pipeline is using.
            </CardDescription>
            <div className="mt-6 space-y-3">
              <Progress
                value={(snapshot.storageUsage.usedMb / snapshot.storageUsage.totalMb) * 100}
              />
              <p className="text-sm text-foreground/62">
                {snapshot.storageUsage.usedMb} MB of {snapshot.storageUsage.totalMb} MB used
              </p>
            </div>
          </Card>

          <Card>
            <CardTitle>Import / export data</CardTitle>
            <CardDescription className="mt-2">
              Prepare backups or future migration workflows for your creator system.
            </CardDescription>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary">Export data</Button>
              <Button variant="ghost">Import data</Button>
            </div>
          </Card>

          <Card>
            <CardTitle>API keys</CardTitle>
            <CardDescription className="mt-2">
              Modular integrations can be connected later without reshaping the UI.
            </CardDescription>
            <div className="mt-6 space-y-3">
              {snapshot.apiKeys.map((item) => (
                <div
                  key={item.provider}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-4 w-4 text-foreground/52" />
                    <span className="text-sm font-medium">{item.provider}</span>
                  </div>
                  <Badge>{item.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardTitle>AI + notifications</CardTitle>
        <CardDescription className="mt-2">
          Decide how the system defaults when generating drafts and sending reminders.
        </CardDescription>
        <form
          onSubmit={preferencesForm.handleSubmit((values) => {
            startTransition(async () => {
              const result = await savePreferencesAction(values);
              setPreferencesMessage({
                kind: result.success ? "success" : "error",
                text: result.success ? result.message : result.error
              });
            });
          })}
          className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Default tone">
              <Select {...preferencesForm.register("defaultTone")}>
                {tones.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Preferred duration">
              <Select
                {...preferencesForm.register("preferredDuration", {
                  valueAsNumber: true
                })}
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} seconds
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Originality guardrails">
              <Select {...preferencesForm.register("originalityGuardrails")}>
                <option value="strict">Strict</option>
                <option value="balanced">Balanced</option>
              </Select>
            </Field>
          </div>

          <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/6 p-5">
            <ToggleRow
              label="Email notifications"
              checked={preferencesForm.watch("email")}
              onChange={(checked) => preferencesForm.setValue("email", checked)}
            />
            <ToggleRow
              label="In-app notifications"
              checked={preferencesForm.watch("inApp")}
              onChange={(checked) => preferencesForm.setValue("inApp", checked)}
            />
            <ToggleRow
              label="Weekly summary"
              checked={preferencesForm.watch("weeklySummary")}
              onChange={(checked) => preferencesForm.setValue("weeklySummary", checked)}
            />
            {preferencesMessage ? (
              <p
                className={`text-sm ${
                  preferencesMessage.kind === "success"
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {preferencesMessage.text}
              </p>
            ) : null}
            <Button type="submit">Save Preferences</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/78">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-medium">{label}</p>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
