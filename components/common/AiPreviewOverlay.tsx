// components/AiPreviewOverlay.tsx
"use client";

import React from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Button } from "@templates/template-boilerplate/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getFileUrl, templateUrl } from "@templates/template-boilerplate/lib/utils";

const scope = { React, Button, Image, Link, getFileUrl, templateUrl };

export default function AiPreviewOverlay({
  jsxCode, // AI JSX fragment (only the inside of return(...))
  section, // your section JSON
  height, // px – match hero height
  onPublish,
  onClose,
}: {
  jsxCode: string;
  section: any;
  height: number;
  onPublish: (code: string) => Promise<void> | void;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40">
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-end gap-2 p-2">
        <Button size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" onClick={() => onPublish(jsxCode)}>
          Publish
        </Button>
      </div>

      {/* Live preview area, height matches hero */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden bg-transparent"
        style={{ height }}
      >
        <LiveProvider
          code={jsxCode}
          scope={{ ...scope, section }}
          language="tsx"
        >
          <LivePreview className="h-full w-full" />
          {/* Optional: show errors unobtrusively */}
          <LiveError className="absolute bottom-2 left-2 right-2 z-50 rounded-md bg-red-600/90 px-3 py-2 text-xs text-white shadow" />
        </LiveProvider>
      </div>

      {/* Dim the original hero slightly so users know it’s a preview */}
      <div className="absolute inset-0 z-30 bg-black/10 pointer-events-none" />
    </div>
  );
}
