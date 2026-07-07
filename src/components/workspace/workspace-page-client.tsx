"use client";

import type { ReactNode } from "react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Film, Music4, Sparkles, UploadCloud, WandSparkles } from "lucide-react";
import type { z } from "zod";

import { generateContentAction, queueExportAction } from "@/app/(app)/workspace/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { durations, niches, platforms, tones } from "@/lib/constants";
import { useCreatorFlowStore } from "@/store/creator-flow-store";
import { workspaceGenerationSchema } from "@/lib/validations/workspace";

type GenerationValues = z.infer<typeof workspaceGenerationSchema>;

type LocalAsset = {
  id: string;
  name: string;
  type: string;
  source: "user-upload" | "ai-generated" | "licensed";
};

export function WorkspacePageClient() {
  const generatedDraft = useCreatorFlowStore((state) => state.generatedDraft);
  const projectId = useCreatorFlowStore((state) => state.projectId);
  const setGeneratedDraft = useCreatorFlowStore((state) => state.setGeneratedDraft);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const form = useForm<GenerationValues>({
    resolver: zodResolver(workspaceGenerationSchema),
    defaultValues: {
      platform: "instagram",
      niche: "ai",
      tone: "educational",
      durationSeconds: 30,
      customNiche: "",
      notes: ""
    }
  });
  const selectedNiche = form.watch("niche");

  const handleSubmit = form.handleSubmit((values) => {
    setMessage(null);
    setError(null);
    setIsPending(true);

    startTransition(async () => {
      const result = await generateContentAction(values);

      if (!result.success) {
        setError(result.error);
        setIsPending(false);
        return;
      }

      setGeneratedDraft(result.generated, result.projectId);
      setMessage("Original draft created and saved to the library.");
      setIsPending(false);
    });
  });

  const handleLocalAssetSelect = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const nextAssets = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "application/octet-stream",
      source: file.type.startsWith("audio/") ? "licensed" : "user-upload"
    })) satisfies LocalAsset[];

    setAssets((current) => [...current, ...nextAssets]);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="AI Workspace"
        title="Generate original content, then stage assets for export."
        description="Choose the platform, niche, tone, and duration. CreatorFlow AI will assemble an original idea, hook, script, captions, hashtags, and thumbnail direction without scraping or copying platform content."
      />

      <div className="grid gap-4 xl:grid-cols-[440px_minmax(0,1fr)]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Original draft builder</CardTitle>
              <CardDescription className="mt-2 leading-6">
                This generator is designed for fresh ideas only. It avoids reposting, scraping, or reusing other creators’ protected content.
              </CardDescription>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Platform">
              <Select {...form.register("platform")}>
                {platforms.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Niche">
              <Select {...form.register("niche")}>
                {niches.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            {selectedNiche === "custom" ? (
              <Field label="Custom niche">
                <Input
                  placeholder="Personal finance for freelance designers"
                  {...form.register("customNiche")}
                />
              </Field>
            ) : null}

            <Field label="Tone">
              <Select {...form.register("tone")}>
                {tones.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Duration">
              <Select
                {...form.register("durationSeconds", { valueAsNumber: true })}
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} seconds
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Notes">
              <Textarea
                placeholder="Add creator-specific context, product angles, or filming constraints."
                {...form.register("notes")}
              />
            </Field>

            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {message ? <p className="text-sm text-success">{message}</p> : null}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Generating..." : "Generate Original Draft"}
            </Button>
          </form>
        </Card>

        <div className="grid gap-4">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Generated output</CardTitle>
                <CardDescription className="mt-2">
                  Your latest script package appears here.
                </CardDescription>
              </div>
              <WandSparkles className="h-5 w-5 text-secondary" />
            </div>

            {generatedDraft ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <ContentBlock title="Video idea" content={generatedDraft.idea} />
                <ContentBlock title="Hook" content={generatedDraft.hook} />
                <ContentBlock title="Script" content={generatedDraft.script} />
                <ContentBlock
                  title="Voiceover script"
                  content={generatedDraft.voiceoverScript}
                />
                <ContentBlock
                  title="Shot list"
                  content={generatedDraft.shotList.join("\n")}
                />
                <ContentBlock title="CTA" content={generatedDraft.cta} />
                <ContentBlock title="Caption" content={generatedDraft.caption} />
                <ContentBlock title="SEO title" content={generatedDraft.seoTitle} />
                <ContentBlock
                  title="Hashtags"
                  content={generatedDraft.hashtags.join(" ")}
                />
                <ContentBlock
                  title="Thumbnail idea"
                  content={generatedDraft.thumbnailIdea}
                />
                <div className="rounded-[24px] border border-accent/20 bg-accent/10 p-4 lg:col-span-2">
                  <p className="text-sm font-semibold text-accent">Compliance note</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/72">
                    {generatedDraft.complianceNote}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <Button
                    variant="secondary"
                    disabled={!projectId || isExporting}
                    onClick={() => {
                      if (!projectId) {
                        return;
                      }

                      setIsExporting(true);
                      startTransition(async () => {
                        const result = await queueExportAction(projectId);
                        setMessage(result.message);
                        setIsExporting(false);
                      });
                    }}
                  >
                    {isExporting ? "Queueing export..." : "Queue Export"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-white/12 bg-white/4 p-10 text-center">
                <p className="font-medium">No draft yet</p>
                <p className="mt-2 text-sm leading-6 text-foreground/62">
                  Generate an original short-form concept to see the full output bundle here.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Video generator staging</CardTitle>
                <CardDescription className="mt-2 leading-6">
                  Upload creator-owned media, licensed music, subtitle files, and overlays to prepare a future export pipeline.
                </CardDescription>
              </div>
              <Film className="h-5 w-5 text-foreground/52" />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-[24px] border border-dashed border-white/12 bg-white/4 p-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-white/6 px-5 py-10 text-center">
                  <UploadCloud className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Upload media</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/62">
                      Creator-owned footage, AI-generated assets, subtitle files, and licensed/user-provided audio.
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,video/*,audio/*,.srt,.vtt"
                    onChange={(event) => handleLocalAssetSelect(event.target.files)}
                  />
                </label>

                <div className="mt-4 space-y-3">
                  {assets.length ? (
                    assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-foreground/55">{asset.type}</p>
                        </div>
                        <Badge>{asset.source}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/55">
                      No local assets staged yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <InfoCard
                  icon={<Music4 className="h-5 w-5 text-secondary" />}
                  title="Audio policy"
                  body="Only use licensed tracks or music you own."
                />
                <InfoCard
                  icon={<Film className="h-5 w-5 text-primary" />}
                  title="Overlay support"
                  body="Plan subtitles, text overlays, and progress bars before exporting."
                />
                <InfoCard
                  icon={<Sparkles className="h-5 w-5 text-accent" />}
                  title="Future ready"
                  body="Cloud rendering, AI voice, avatars, and API integrations can plug into this workflow later."
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
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

function ContentBlock({
  title,
  content
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground/70">
        {content}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
      <div className="inline-flex rounded-2xl border border-white/10 bg-white/8 p-3">
        {icon}
      </div>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-foreground/66">{body}</p>
    </div>
  );
}
