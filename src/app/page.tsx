import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { TrackedLink } from "@/components/TrackedLink";
import { ConverterPanel } from "@/components/ConverterPanel";
import { MiniToolExample, ShowcaseDemo } from "@/components/HomeShowcase";
import { helperPages, tools } from "@/lib/tools";

const qualityModes = [
  {
    name: "Fast Check",
    cost: "Free",
    detail: "Instant browser diagnosis for transparency, subject coverage, edge complexity, and recommended STL mode.",
  },
  {
    name: "Clean STL",
    cost: "Free",
    detail: "Best for transparent logos, icons, stickers, silhouettes, and other simple shapes that can become raised geometry.",
  },
  {
    name: "Print Review",
    cost: "Planned",
    detail: "Commercial users can request batch/API review for repeat logo, backlit photo panel, or depth-map workflows before a public paid plan launches.",
  },
];

const conversionSteps = [
  {
    step: "1",
    title: "Upload image",
    body: "Drop PNG, JPG, WebP, GIF, or BMP. The checker reads image structure before it lets clean extrude proceed.",
  },
  {
    step: "2",
    title: "Route the workflow",
    body: "Simple logos stay in clean STL mode; photos, sketches, and noisy images are routed to raised-surface, backlit-panel, or depth-map paths.",
  },
  {
    step: "3",
    title: "Preview geometry",
    body: "Inspect solid, edge, wireframe, front, side, and top views before downloading the STL.",
  },
  {
    step: "4",
    title: "Download and slicer-check",
    body: "Export the STL, then confirm scale, supports, and print settings in your slicer before printing.",
  },
];

const capabilityCards = [
  {
    icon: "◇",
    title: "Image-fit analysis",
    body: "Reads transparency, subject coverage, edge complexity, and cutout shape before generating.",
  },
  {
    icon: "▧",
    title: "Multi-workflow output",
    body: "Clean STL, logo badge, photo panel, raised-surface, and depth-map paths share one upload station.",
  },
  {
    icon: "◉",
    title: "Print-aware preview",
    body: "Inspect the generated STL with solid, edges, wireframe, top, front, and reset controls before download.",
  },
];

const primaryTools = ["logo-to-stl", "png-to-stl", "heightmap-to-stl", "lithophane-generator"];

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
    label: "Backlit photo panel",
    input: "portrait-style image",
    output: "0.8–3.2 mm panel",
    metric: "65,532 triangles",
    route: "/lithophane-generator",
    kind: "litho",
    sourceImage: "/samples/lithophane-panel-premium-v4-source.png",
    previewImage: "/samples/lithophane-panel-premium-v4-preview.png",
  },
  {
    label: "Depth-map surface",
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
    title: "Reliable STL workflows",
    description: "Start with inputs this site can handle well: transparent logos, icons, simple silhouettes, grayscale depth maps, and backlit photo panels.",
    slugs: ["logo-to-stl", "png-to-stl", "heightmap-to-stl", "lithophane-generator"],
    example: "relief" as const,
  },
  {
    eyebrow: "02",
    title: "Guided starting points",
    description: "Use these when the source image is not a clean logo and you need guidance before generating.",
    slugs: ["image-to-stl", "convert-image-to-stl", "jpg-to-stl", "jpeg-to-stl", "pic-to-stl"],
    example: "litho" as const,
  },
  {
    eyebrow: "03",
    title: "Photo and print planning utilities",
    description: "Route photos and complex images away from clean extrude before they waste time or filament.",
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
          <Link href="/logo-to-stl">Logo to STL</Link>
          <Link href="/png-to-stl">Icon to STL</Link>
          <Link href="/image-to-stl">Image Check</Link>
          <Link href="/lithophane-generator">Photo Panel</Link>
          <Link href="/heightmap-to-stl">Depth Map</Link>
          <Link href="/developers">API</Link>
          <Link href="/faq">Guides</Link>
        </nav>
        <div className="accountActions" aria-label="Primary action">
          <Link className="signupButton" href="#converter">Start converting</Link>
        </div>
        </div>
      </header>

      {universalTool && (
        <section className="homeConverterDock primaryConverterDock" id="converter" aria-labelledby="home-converter-title">
          <div className="sectionIntro compact">
            <p className="homeKicker">Free image to STL converter</p>
            <h1 id="home-converter-title">Upload an image. Preview a printable STL.</h1>
            <p>Best for clean logos, icons, stickers, silhouettes, and simple high-contrast art. The checker warns when a complex photo or noisy sketch needs a safer workflow.</p>
          </div>
          <ConverterPanel tool={universalTool} />
        </section>
      )}

      <section className="homeHero secondaryHomeHero">
        <div className="homeHeroCopy">
          <p className="homeKicker">Logo, icon, and simple shape to STL</p>
          <h1>Convert clean logos and simple images into printable STL models.</h1>
          <p>
            Built for transparent PNGs, icons, stickers, flat logos, and simple silhouettes. Photos, pencil sketches, and grid-paper drawings are routed to safer raised-surface or backlit-panel workflows instead of being overpromised.
          </p>
          <div className="fitChecklist" aria-label="What works best">
            <span>Best: transparent logo</span>
            <span>Best: simple icon</span>
            <span>Best: silhouette</span>
            <span>Not ideal: noisy photo/sketch</span>
          </div>
          <div className="heroActions" aria-label="Popular conversion tools">
            <Link className="btnPrimary" href="#converter">Check image and generate</Link>
            <Link className="btnSecondary" href="#examples">See reliable examples</Link>
          </div>
        </div>

        <aside className="heroResultPanel" aria-label="Input image to generated STL proof">
          <div className="heroProofTopline">
            <span>Reliable workflow preview</span>
            <strong>Clean input → clean STL</strong>
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
          <Link className="btnSecondary heroProofCta" href="#converter">Check your image below</Link>
        </aside>
      </section>

      <section className="workflowProductBand" aria-labelledby="workflow-product-title">
        <div className="sectionIntro compact">
          <p className="homeKicker">Product workflow</p>
          <h2 id="workflow-product-title">A converter flow inspired by AI 3D tools, without overpromising reconstruction.</h2>
          <p>Use the same page pattern users expect from modern image-to-3D sites: quality choices, upload guidance, preview, and pricing entry — but keep the promise focused on reliable STL panel workflows.</p>
        </div>
        <div className="qualityCards" aria-label="Available quality paths">
          {qualityModes.map((mode) => (
            <article key={mode.name} className="qualityCard">
              <span>{mode.cost}</span>
              <h3>{mode.name}</h3>
              <p>{mode.detail}</p>
            </article>
          ))}
        </div>
        <div className="conversionSteps" aria-label="How image to STL conversion works">
          {conversionSteps.map((item) => (
            <article key={item.step}>
              <b>{item.step}</b>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilityGrid" aria-label="Converter capabilities">
        {capabilityCards.map((card) => (
          <article key={card.title}>
            <span aria-hidden="true">{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </section>

      <section className="proofStrip" id="examples" aria-label="Example outputs with source and mesh evidence">
        <div className="proofIntro">
          <div>
            <p className="homeKicker">Pick a reliable output type</p>
            <h2>Use examples this site can reproduce consistently.</h2>
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
          <p className="homeKicker">Most reliable</p>
          <h2 id="quick-tools-title">Start with a high-success workflow.</h2>
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
          <p>Image-to-STL tools for makers who need raised panels, logo badges, backlit photo panels, and depth maps without opening CAD first.</p>
          <p><Link href="mailto:support@pngtostl.net">support@pngtostl.net</Link></p>
        </div>
        <nav aria-label="Footer">
          <Link href="/image-to-stl">Image to STL</Link>
          <Link href="/png-to-stl">PNG to STL</Link>
          <Link href="/jpg-to-stl">JPG to STL</Link>
          <Link href="/jpeg-to-stl">JPEG to STL</Link>
          <Link href="/pic-to-stl">Pic to STL</Link>
          <Link href="/logo-to-stl">Logo to STL</Link>
          <Link href="/lithophane-generator">Photo Panel</Link>
          <Link href="/heightmap-to-stl">Depth Map</Link>
          <Link href="/how-to-turn-logo-into-stl">Logo guide</Link>
          <Link href="/lithophane-image-guide">Photo Panel guide</Link>
          <Link href="/heightmap-to-stl-terrain-guide">Depth Map guide</Link>
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
    <script src="/converter.js?v=benchmark-ui-20260609a" defer></script>
    </>
  );
}
