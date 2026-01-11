// app/(builder)/components/HeroSectionEditable.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@templates/template-boilerplate/components/ui/button";
import { getFileUrl, templateUrl } from "@templates/template-boilerplate/lib/utils";
import AiPreviewOverlay from "@templates/template-boilerplate/components/common/AiPreviewOverlay";

type Section = {
  id?: string | number;
  config: {
    image?: { url?: string; initUrl?: string };
    title?: string;
    description?: string;
    primaryCta?: string;
    primaryCtaUrl?: string;
  };
};

function normalizeHeroHeight(jsx: string) {
  if (!jsx) return jsx;

  // Remove Tailwind min-h-screen class
  let out = jsx.replace(/\bmin-h-screen\b/g, "");

  // Inject style overrides into the outermost container
  // Find first opening tag and add style attribute for height/minHeight
  out = out.replace(/<([a-zA-Z0-9]+)([^>]*)>/, (match, tag, attrs) => {
    if (/style=/.test(attrs)) {
      // append to existing style
      return `<${tag}${attrs.replace(
        /style\s*=\s*["']([^"']*)["']/,
        (_, s) => `style="${s};height: inherit;min-height: auto;"`
      )}>`;
    }
    return `<${tag}${attrs} style={{ height: "inherit", minHeight: "auto" }}>`;
  });

  return out;
}

function extractReturnJsx(raw: string) {
  if (!raw) return raw;
  const clean = raw.replace(/\r\n/g, "\n").trim();

  // Prefer fenced block if present
  const fence = clean.match(
    /```(?:tsx|jsx|typescript|javascript)?\s*([\s\S]*?)```/i
  );
  const body = (fence?.[1] ?? clean).trim();

  // Try to extract inside return ( ... )
  const m = body.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*\}$/);
  if (m && m[1]) return m[1].trim();

  // If it looks like a component wrapper, try to strip function
  const fn = body.match(
    /^[\s\S]*?\{\s*return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*\}\s*$/
  );
  if (fn && fn[1]) return fn[1].trim();

  // Otherwise assume it's already JSX
  return body;
}

export default function HeroSectionEditable({ section }: { section: Section }) {
  const [hovered, setHovered] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [aiJsx, setAiJsx] = useState<string | null>(null);

  // measure hero height
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroH, setHeroH] = useState<number>(600);

  useEffect(() => {
    if (!heroRef.current) return;
    const el = heroRef.current;
    const ro = new ResizeObserver(() => setHeroH(el.offsetHeight));
    ro.observe(el);
    setHeroH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  async function onGenerate() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/ai-edit-hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, section }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { code } = (await res.json()) as { code: string };

      const jsxOnly = extractReturnJsx(code);
      const normalized = normalizeHeroHeight(jsxOnly);
      setAiJsx(normalized); // 👈 show preview, not code
      setOpenPrompt(false);
    } catch (e: any) {
      setErr(e?.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  async function onPublish(code: string) {
    // Persist to DB / file — adjust to your backend
    const res = await fetch(`/api/sections/${section.id}/publish-hero`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }), // code is JSX fragment; you can wrap server-side
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || `HTTP ${res.status}`);
    }
    setAiJsx(null);
  }

  return (
    <div
      className="relative group"
      ref={heroRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ORIGINAL HERO stays as before */}
      <section className="relative h-[600px]">
        {section.config.image && (
          <Image
            src={
              getFileUrl(section.config.image.url) ||
              section.config.image.initUrl ||
              ""
            }
            alt="Beautiful landscape"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{section.config.title}</h1>
            <p
              className="text-xl mb-8"
              dangerouslySetInnerHTML={{
                __html: section.config.description || "",
              }}
            />
            {section.config.primaryCtaUrl && (
              <Link href={templateUrl(section.config.primaryCtaUrl)}>
                <Button size="lg" variant="secondary">
                  {section.config.primaryCta}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Hover “Edit with AI” button */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-3 top-3 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className={`pointer-events-auto rounded-xl shadow px-3 py-1 text-sm ${
              hovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            onClick={() => setOpenPrompt((v) => !v)}
          >
            Edit with AI
          </Button>
        </div>
      </div>

      {/* Prompt popover */}
      {openPrompt && (
        <div className="absolute right-3 top-12 z-50 w-[520px] rounded-2xl border bg-background p-4 shadow-xl">
          <textarea
            className="min-h-[120px] w-full resize-y rounded-xl border p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Describe changes… e.g., 'image left, glassmorphism content card, orange CTA'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              We’ll preview the change without altering your page.
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenPrompt(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={onGenerate} disabled={loading}>
                {loading ? "Generating…" : "Generate"}
              </Button>
            </div>
          </div>
          {err && (
            <div className="mt-2 text-xs text-red-600">Failed: {err}</div>
          )}
        </div>
      )}

      {/* AI preview-only overlay — matches hero height */}
      {aiJsx && (
        <AiPreviewOverlay
          jsxCode={aiJsx}
          section={section}
          height={heroH}
          onPublish={onPublish}
          onClose={() => setAiJsx(null)}
        />
      )}
    </div>
  );
}
