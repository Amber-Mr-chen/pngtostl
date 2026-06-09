import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { TrackedLink } from "@/components/TrackedLink";
import { ConverterPanel } from "@/components/ConverterPanel";
import { MiniToolExample, ShowcaseDemo } from "@/components/HomeShowcase";
import { helperPages, tools } from "@/lib/tools";

const primaryTools = ["image-to-stl", "logo-to-stl", "lithophane-generator", "heightmap-to-stl"];

const proofSamples = [
  {
    label: "Logo badge",
    input: "transparent PNG",
    output: "95 mm raised plate",
    metric: "22,300 triangles",
    route: "/logo-to-stl",
    kind: "logo",
    sourceImage: "/samples/logo-badge-premium-v4-source.png",
    previewImage: "/samples/logo-badge-premium-v4-preview.png",
  },
  {
    label: "Photo lithophane",
    input: "portrait-style image",
    output: "0.8–3.2 mm panel",
    metric: "65,532 triangles",
    route: "/lithophane-generator",
    kind: "litho",
    sourceImage: "/samples/lithophane-panel-premium-v4-source.png",
    previewImage: "/samples/lithophane-panel-premium-v4-preview.png",
  },
  {
    label: "Heightmap surface",
    input: "grayscale PNG",
    output: "terrain-like relief",
    metric: "65,532 triangles",
    route: "/heightmap-to-stl",
    kind: "heightmap",
    sourceImage: "/samples/heightmap-surface-premium-v4-source.png",
    previewImage: "/samples/heightmap-surface-premium-v4-preview.png",
  },
];

const categories = [
  {
    eyebrow: "01",
    title: "Core STL workflows",
    description: "Start from the output you want, not the file extension. Format-specific pages remain available for SEO and defaults.",
    slugs: ["image-to-stl", "logo-to-stl", "lithophane-generator", "heightmap-to-stl"],
    example: "relief" as const,
  },
  {
    eyebrow: "02",
    title: "Format-specific starting points",
    description: "SEO-friendly entry pages with the same converter engine and better defaults for each file type.",
    slugs: ["png-to-stl", "jpg-to-stl", "convert-image-to-stl"],
    example: "litho" as const,
  },
  {
    eyebrow: "03",
    title: "Photo and print planning utilities",
    description: "Choose the right path before wasting filament: lithophane, relief, or settings check.",
    slugs: ["photo-to-lithophane", "3d-print-photo", "2d-image-to-3d-model"],
    example: "plan" as const,
  },
];

function hrefFor(slug: string) {
  return `/${slug}`;
}

function findTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export default function HomePage() {
  const featured = primaryTools.map(findTool).filter(Boolean);
  const universalTool = findTool("image-to-stl");

  return (
    <>
    <main className="homePage">
      <header className="homeNav">
        <BrandMark />
        <div className="homeNavRight">
        <nav className="homeNavLinks" aria-label="Primary">
          <Link href="/image-to-stl">Image to STL</Link>
          <Link href="/logo-to-stl">Logo to STL</Link>
          <Link href="/lithophane-generator">Lithophane</Link>
          <Link href="/heightmap-to-stl">Heightmap</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/developers">API</Link>
          <Link href="/faq">Guides</Link>
        </nav>
        <div className="accountActions" aria-label="Primary action">
          <Link className="signupButton" href="#converter">Start converting</Link>
        </div>
        </div>
      </header>

      <section className="homeHero">
        <div className="homeHeroCopy">
          <p className="homeKicker">Upload-first image to STL workspace</p>
          <h1>Convert sketches, logos, and images into printable STL models.</h1>
          <p>
            Upload directly on this page, inspect the source image beside a slicer-style 3D preview, tune relief thickness, then download a print-ready STL without leaving the homepage.
          </p>
          <div className="heroActions" aria-label="Popular conversion tools">
            <Link className="btnPrimary" href="#converter">Upload and generate STL</Link>
            <Link className="btnSecondary" href="#examples">See real examples</Link>
          </div>
        </div>

        <aside className="heroResultPanel" aria-label="Input image to generated STL proof">
          <div className="heroProofTopline">
            <span>Live workflow preview</span>
            <strong>Input → STL</strong>
          </div>
          <div className="heroProofVisual">
            <figure>
              <Image
                src="/samples/logo-badge-premium-v4-source.png"
                alt="Example source image for STL conversion"
                width={160}
                height={160}
                priority
              />
              <figcaption>Source image</figcaption>
            </figure>
            <span className="heroProofArrow" aria-hidden="true">→</span>
            <figure className="heroOutputFigure">
              <Image
                src="/samples/logo-badge-premium-v4-preview.png"
                alt="Generated STL preview from the source image"
                width={280}
                height={210}
                priority
              />
              <figcaption>Generated STL preview</figcaption>
            </figure>
          </div>
          <div className="heroProofMetrics" aria-label="Example mesh metrics">
            <span><b>95 mm</b> raised plate</span>
            <span><b>22,300</b> triangles</span>
            <span><b>Printable</b> STL</span>
          </div>
          <Link className="btnSecondary heroProofCta" href="#converter">Upload your own image below</Link>
        </aside>
      </section>

      {universalTool && (
        <section className="homeConverterDock" id="converter" aria-labelledby="home-converter-title">
          <div className="sectionIntro compact">
            <p className="homeKicker">Use it here</p>
            <h2 id="home-converter-title">Upload, preview, and download without leaving the homepage.</h2>
            <p>Designed like a lightweight slicer workspace: source image on the left, STL preview and mesh checks on the right.</p>
          </div>
          <ConverterPanel tool={universalTool} />
        </section>
      )}

      <section className="proofStrip" id="examples" aria-label="Example outputs with source and mesh evidence">
        <div className="proofIntro">
          <div>
            <p className="homeKicker">Pick an output type</p>
            <h2>Start from the print result you want.</h2>
          </div>
          <TrackedLink
            className="proofExamplesLink"
            href="/samples"
            eventName="homepage_view_examples_click"
            eventPayload={{ location: "home_proof_strip" }}
          >
            View all examples
          </TrackedLink>
        </div>
        {proofSamples.map((sample) => (
          <Link key={sample.label} className="proofCard" href={sample.route}>
            <div className={`proofVisual realProofVisual ${sample.kind}`}>
              <Image
                className="proofSourceImage"
                src={sample.sourceImage}
                alt={`${sample.label} ${sample.input} source image`}
                width={96}
                height={96}
                loading="lazy"
              />
              <span className="proofArrow" aria-hidden="true">→</span>
              <Image
                className="proofPreviewImage"
                src={sample.previewImage}
                alt={`${sample.label} generated ${sample.output} STL preview`}
                width={220}
                height={160}
                loading="lazy"
              />
            </div>
            <div>
              <strong>{sample.label}</strong>
              <p>{sample.input} → {sample.output}</p>
              <small>{sample.metric}</small>
            </div>
          </Link>
        ))}
      </section>

      <ShowcaseDemo />

      <section className="quickTools" id="tools" aria-labelledby="quick-tools-title">
        <div className="sectionIntro compact">
          <p className="homeKicker">Most used</p>
          <h2 id="quick-tools-title">Start with a common task.</h2>
        </div>
        <div className="featuredGrid">
          {featured.map((tool, index) => tool && (
            <Link key={tool.slug} className="featuredTool" href={hrefFor(tool.slug)}>
              <MiniToolExample type={index === 3 ? "plan" : "relief"} />
              <span>{tool.eyebrow}</span>
              <strong>{tool.navLabel}</strong>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="toolDirectory" aria-label="All tools">
        {categories.map((category) => (
          <div className="directoryRow" key={category.title}>
            <div className="directoryHeading">
              <span>{category.eyebrow}</span>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <MiniToolExample type={category.example} />
            </div>
            <div className="directoryList">
              {category.slugs.map((slug) => {
                const tool = findTool(slug);
                if (!tool) return null;
                return (
                  <Link key={slug} className="directoryLink" href={hrefFor(slug)}>
                    <span>
                      <strong>{tool.navLabel}</strong>
                      <small>{tool.description}</small>
                    </span>
                    <b aria-hidden="true">Open</b>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="utilityBand" aria-labelledby="utility-title">
        <div>
          <p className="homeKicker">Before printing</p>
          <h2 id="utility-title">Check the image before wasting filament.</h2>
        </div>
        <div className="utilityLinks">
          {helperPages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`}>{page.title}</Link>
          ))}
          <Link href="/faq">FAQ</Link>
        </div>
      </section>

      <footer className="siteFooter homeFooter">
        <div>
          <strong>PNGtoSTL</strong>
          <p>Image-to-STL tools for makers who need reliefs, logo badges, lithophanes, and heightmaps without opening CAD first.</p>
          <p><Link href="mailto:support@pngtostl.net">support@pngtostl.net</Link></p>
        </div>
        <nav aria-label="Footer">
          <Link href="/image-to-stl">Image to STL</Link>
          <Link href="/logo-to-stl">Logo to STL</Link>
          <Link href="/lithophane-generator">Lithophane</Link>
          <Link href="/heightmap-to-stl">Heightmap</Link>
          <Link href="/how-to-turn-logo-into-stl">Logo guide</Link>
          <Link href="/lithophane-image-guide">Lithophane guide</Link>
          <Link href="/heightmap-to-stl-terrain-guide">Heightmap guide</Link>
          <Link href="/samples">Examples</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/developers">API</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
        </nav>
      </footer>
    </main>
    <script src="/stl-preview.js?v=webgl-final-20260608a" defer></script>
    <script src="/converter.js?v=clean-preview-20260608a" defer></script>
    </>
  );
}
