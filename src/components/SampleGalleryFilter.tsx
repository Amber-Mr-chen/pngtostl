"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { sampleWorkflows } from "@/lib/tools";

type SampleWorkflow = (typeof sampleWorkflows)[number];

type FilterKey = "all" | SampleWorkflow["category"];

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All examples" },
  { key: "relief", label: "Relief" },
  { key: "logo", label: "Logo badge" },
  { key: "lithophane", label: "Lithophane" },
  { key: "heightmap", label: "Heightmap" },
];

export function SampleGalleryFilter({ samples }: { samples: SampleWorkflow[] }) {
  const [active, setActive] = useState<FilterKey>("all");
  const visibleSamples = useMemo(
    () => active === "all" ? samples : samples.filter((sample) => sample.category === active),
    [active, samples],
  );

  return (
    <section className="sampleGalleryBlock" aria-labelledby="sample-gallery-title">
      <div className="sampleFilterBar">
        <div>
          <p className="pill">Workflow filter</p>
          <h2 id="sample-gallery-title">Choose the sample closest to your print goal.</h2>
        </div>
        <div className="sampleFilterTabs" role="tablist" aria-label="Filter image to STL examples">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              role="tab"
              aria-selected={active === filter.key}
              className={active === filter.key ? "active" : undefined}
              onClick={() => setActive(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sampleGallery" aria-live="polite">
        {visibleSamples.map((sample) => (
          <article className="sampleCard proSampleCard" key={sample.title}>
            <div className={`sampleArt proSampleArt realSampleArt ${sample.route.replace('/', '')}`} aria-hidden="true">
              <div className="sampleImageFrame sourceFrame">
                <span>Source</span>
                <Image src={sample.sourceImage} alt="" width={180} height={180} loading="lazy" />
              </div>
              <span className="sampleTransformArrow">→</span>
              <div className="sampleImageFrame previewFrame">
                <span>Generated STL preview</span>
                <Image src={sample.previewImage} alt="" width={360} height={240} loading="lazy" />
              </div>
            </div>
            <div className="sampleCopy">
              <div className="sampleMetaLine">
                <span>{sample.categoryLabel}</span>
                <span>{sample.metrics}</span>
                <span>{sample.fileSizeLabel}</span>
              </div>
              <h2>{sample.title}</h2>
              <p><strong>Input:</strong> {sample.input}</p>
              <p><strong>Output:</strong> {sample.output}</p>
              <div className="sampleEvidence">
                <p><strong>Source preview:</strong> {sample.sourcePreview}</p>
                <p><strong>Generated result:</strong> {sample.resultPreview}</p>
                <p><strong>Expected metrics:</strong> {sample.metrics}</p>
              </div>
              <ul>
                {sample.settings.map((setting) => <li key={setting}>{setting}</li>)}
              </ul>
              <p><strong>Best for:</strong> {sample.bestFor}</p>
              <p><strong>Avoid:</strong> {sample.avoid}</p>
              <div className="sampleActions">
                <Link className="btnSecondary" href={sample.route}>Open workflow</Link>
                <a className="sampleDownload" href={sample.stlPath} download>
                  Download sample STL <span>{sample.fileSizeLabel}</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
