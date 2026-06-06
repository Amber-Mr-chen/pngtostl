"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

const samples = [
  {
    id: "logo",
    label: "Logo relief",
    title: "Clean logo relief",
    href: "/logo-to-stl",
    before: "Flat logo image",
    after: "Raised STL preview",
    accent: "#1769ff",
    mode: "logo",
    sourceImage: "/samples/logo-badge-source.png",
    previewImage: "/samples/logo-badge-preview.png",
  },
  {
    id: "photo",
    label: "Lithophane",
    title: "Photo to lithophane",
    href: "/lithophane-generator",
    before: "Photo input",
    after: "Backlit depth map",
    accent: "#f59e0b",
    mode: "litho",
    sourceImage: "/samples/lithophane-panel-source.png",
    previewImage: "/samples/lithophane-panel-preview.png",
  },
  {
    id: "heightmap",
    label: "Heightmap",
    title: "Heightmap surface",
    href: "/heightmap-to-stl",
    before: "Brightness map",
    after: "Terrain relief",
    accent: "#14b8a6",
    mode: "terrain",
    sourceImage: "/samples/heightmap-surface-source.png",
    previewImage: "/samples/heightmap-surface-preview.png",
  },
];

type Sample = (typeof samples)[number];

const stageCopy = [
  { label: "Source image", kind: "before" as const },
  { label: "Relief mesh", kind: "mesh" as const },
  { label: "Print preview", kind: "print" as const },
  { label: "Workflow options", kind: "grid" as const },
];

function DemoArt({ sample, side }: { sample: Sample; side: "before" | "after" }) {
  const isAfter = side === "after";
  const imageSrc = isAfter ? sample.previewImage : sample.sourceImage;

  return (
    <div className={`demoArt realDemoArt ${isAfter ? "isAfter" : "isBefore"}`}>
      <Image
        className="demoArtImage"
        src={imageSrc}
        alt=""
        width={isAfter ? 720 : 360}
        height={isAfter ? 492 : 360}
        loading="lazy"
      />
    </div>
  );
}

function WorkflowStageArt({ sample, kind }: { sample: Sample; kind: (typeof stageCopy)[number]["kind"] }) {
  if (kind === "grid") {
    return (
      <div className="stageGridArt">
        <DemoArt sample={sample} side="before" />
        <DemoArt sample={sample} side="after" />
        <DemoArt sample={{ ...sample, accent: "#14b8a6" }} side="after" />
        <DemoArt sample={{ ...sample, accent: "#f59e0b" }} side="after" />
      </div>
    );
  }

  if (kind === "print") {
    return (
      <div className="stagePrintArt">
        <DemoArt sample={sample} side="after" />
        <span />
      </div>
    );
  }

  return <DemoArt sample={sample} side={kind === "before" ? "before" : "after"} />;
}

export function ShowcaseDemo() {
  const [activeId, setActiveId] = useState(samples[0].id);
  const [split, setSplit] = useState(52);
  const active = useMemo(() => samples.find((sample) => sample.id === activeId) || samples[0], [activeId]);

  return (
    <section className="showcaseBlock" aria-label="Interactive STL workflow examples">
      <div className="showcaseHeader">
        <p className="homeKicker">Live-style examples</p>
        <h2>See what each tool is meant to make.</h2>
        <p>
          Preview the idea before opening a converter: clean reliefs for logos, thickness maps for lithophanes, and surface depth for heightmaps.
        </p>
      </div>

      <div className="sampleTabs" role="tablist" aria-label="Example categories">
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            role="tab"
            aria-selected={sample.id === active.id}
            className={sample.id === active.id ? "active" : ""}
            onClick={() => setActiveId(sample.id)}
          >
            {sample.label}
          </button>
        ))}
      </div>

      <div className="workflowStages" aria-label={`${active.title} workflow stages`}>
        {stageCopy.map((stage) => (
          <figure key={stage.label} className="workflowStage">
            <div className={`stageArt stage-${stage.kind}`} style={{ "--sample-accent": active.accent } as CSSProperties}>
              <WorkflowStageArt sample={active} kind={stage.kind} />
            </div>
            <figcaption>{stage.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="compareFrame" style={{ "--sample-accent": active.accent } as CSSProperties}>
        <div className="compareLabels" aria-hidden="true">
          <span>{active.before}</span>
          <span>{active.after}</span>
        </div>
        <DemoArt sample={active} side="before" />
        <div className="compareAfter" style={{ width: `${100 - split}%` }}>
          <DemoArt sample={active} side="after" />
        </div>
        <div className="compareDivider" style={{ left: `${split}%` }} aria-hidden="true">
          <span>‹ ›</span>
        </div>
        <input
          aria-label={`Compare ${active.title}`}
          className="compareRange"
          type="range"
          min="18"
          max="82"
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
        />
      </div>

      <div className="showcaseFooter">
        <div>
          <strong>{active.title}</strong>
          <span>Generated outputs include mesh metrics, downloadable STL, and an on-page preview.</span>
        </div>
        <Link href={active.href}>Open this tool</Link>
      </div>
    </section>
  );
}

const miniExamples = {
  relief: [18, 42, 68, 34, 82, 58, 28, 74],
  litho: [72, 44, 30, 62, 84, 56, 38, 66],
  plan: [36, 54, 76, 48, 62, 30, 70, 52],
};

export function MiniToolExample({ type }: { type: keyof typeof miniExamples }) {
  const bars = miniExamples[type];
  return (
    <div className={`miniExample ${type}`} aria-hidden="true">
      {bars.map((height, index) => (
        <span key={`${type}-${index}`} style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />
      ))}
    </div>
  );
}
