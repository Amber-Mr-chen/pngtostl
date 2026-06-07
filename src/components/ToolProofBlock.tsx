"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import type { sampleWorkflows, ToolConfig } from "@/lib/tools";

type SampleWorkflow = (typeof sampleWorkflows)[number];

type ToolProofBlockProps = {
  tool: ToolConfig;
  samples: SampleWorkflow[];
};

function proofPayload(tool: ToolConfig, sample: SampleWorkflow, index: number) {
  return {
    tool: tool.slug,
    path: typeof window === "undefined" ? `/${tool.slug}` : window.location.pathname,
    sample: sample.title,
    sample_route: sample.route,
    sample_category: sample.category,
    stl_path: sample.stlPath,
    position: index + 1,
  };
}

export function ToolProofBlock({ tool, samples }: ToolProofBlockProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const seenRef = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || seenRef.current) return;

    const emitView = () => {
      if (seenRef.current) return;
      seenRef.current = true;
      trackEvent("sample_proof_view", {
        tool: tool.slug,
        path: window.location.pathname,
        sample_count: samples.length,
        samples: samples.map((sample) => sample.title).join(" | "),
      });
    };

    if (!("IntersectionObserver" in window)) {
      emitView();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25)) {
          emitView();
          observer.disconnect();
        }
      },
      { threshold: [0.25] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [samples, tool.slug]);

  if (samples.length === 0) return null;

  return (
    <section ref={sectionRef} className="shell toolProofBlock" aria-label={`${tool.title} real example outputs`}>
      <div className="toolProofHeader">
        <div>
          <p className="homeKicker">Real output proof</p>
          <h2 className="sectionTitle">See what this workflow can generate</h2>
          <p>Each example uses a source image, a generated STL preview, and a downloadable STL file from the same converter pipeline.</p>
        </div>
        <Link className="proofExamplesLink" href="/samples">View all examples</Link>
      </div>
      <div className="toolProofGrid">
        {samples.map((sample, index) => (
          <article className="proofCard toolProofCard" key={sample.title}>
            <div className="proofVisual realProofVisual" aria-label={`${sample.title} source image and STL preview`}>
              <Image className="proofSourceImage" src={sample.sourceImage} width={320} height={320} alt={`${sample.title} source image`} />
              <span className="proofArrow" aria-hidden="true">→</span>
              <Image className="proofPreviewImage" src={sample.previewImage} width={420} height={276} alt={`${sample.title} STL preview`} />
            </div>
            <div>
              <strong>{sample.title}</strong>
              <p>{sample.output}</p>
              <small>{sample.metrics}</small>
              <ul>
                <li>Best for: {sample.bestFor}</li>
                <li>Avoid: {sample.avoid}</li>
              </ul>
              <div className="toolProofActions">
                <Link
                  className="pill"
                  href={sample.route}
                  onClick={() => trackEvent("sample_proof_open_workflow", proofPayload(tool, sample, index))}
                >
                  Open workflow
                </Link>
                <a
                  className="pill"
                  href={sample.stlPath}
                  download
                  onClick={() => trackEvent("sample_proof_download", proofPayload(tool, sample, index))}
                >
                  Download STL
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
