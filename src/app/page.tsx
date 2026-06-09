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

const storyPoints = [
  "Turn flat artwork into raised STL geometry for signs, badges, panels, and maker labels.",
  "Route complex images to relief/photo workflows instead of pretending every image becomes a perfect full 3D object.",
  "Preview the mesh before downloading so print issues are visible early.",
];

const advancedFeatures = [
  { title: "Smart workflow routing", body: "Detects logos, transparent subjects, tonal photos, sketches, and depth-map inputs before choosing a safer path." },
  { title: "Higher-detail relief mesh", body: "Detailed mode keeps more shape information with smoother sampling for complex artwork and photo-style panels." },
  { title: "Browser 3D preview", body: "Inspect solid, edges, and wireframe views in the page before downloading the STL file." },
  { title: "Print-scale controls", body: "Set output width, relief depth, base thickness, smoothing, and threshold when a print needs tuning." },
  { title: "Format-friendly upload", body: "Start from PNG, JPG, WebP, GIF, or BMP and normalize the image for STL generation." },
  { title: "Maker-safe expectations", body: "Clear guidance separates reliable relief outputs from unrealistic one-click full 3D reconstruction claims." },
];

const modelShowcase = [
  { title: "Logo badge", image: "/samples/logo-badge-premium-v4-preview.png", body: "Crisp raised mark for labels and signs." },
  { title: "Photo relief panel", image: "/samples/lithophane-panel-premium-v4-preview.png", body: "Tonal surface for backlit or display panels." },
  { title: "Depth surface", image: "/samples/heightmap-surface-premium-v4-preview.png", body: "Terrain-style grayscale height output." },
];

const pricingPlans = [
  { name: "Free", price: "$0", tag: "Start", features: ["Image check", "STL preview", "Manual download", "Core workflows"] },
  { name: "Maker", price: "$10", tag: "Planned", featured: true, features: ["Higher-detail exports", "Batch queue", "Saved settings", "Priority processing"] },
  { name: "Studio", price: "$21", tag: "Planned", features: ["Team workflow", "API access", "Commercial review", "Volume jobs"] },
];

const homeFaqs = [
  { q: "Can any image become a clean STL?", a: "No. Clean STL works best for logos, icons, stickers, and simple high-contrast art. Complex images are routed to relief or photo-panel workflows." },
  { q: "Is this the same as AI full 3D reconstruction?", a: "No. PNGtoSTL focuses on printable relief, badge, lithophane, and height-map STL outputs from 2D images." },
  { q: "Why preview before download?", a: "The preview helps catch low contrast, blocky details, oversized meshes, or square plates before you open a slicer." },
  { q: "Which files can I upload?", a: "PNG, JPG, JPEG, WebP, GIF, and BMP are supported through the browser upload flow." },
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

      <section className="landingStory" aria-labelledby="story-title">
        <div className="storyVisual" aria-hidden="true">
          <Image src="/samples/logo-badge-premium-v4-preview.png" alt="" width={520} height={390} loading="lazy" />
        </div>
        <div className="storyCopy">
          <p className="homeKicker">What image-to-STL means here</p>
          <h2 id="story-title">A practical 2D image to printable STL workflow.</h2>
          <p>PNGtoSTL is built for reliable relief-style outputs: raised badges, photo panels, depth surfaces, and simple printable plates. It keeps the promise honest while still feeling like a modern image-to-3D product.</p>
          <div className="storyList">
            {storyPoints.map((point) => <span key={point}>{point}</span>)}
          </div>
        </div>
      </section>

      <section className="whyChooseBand" aria-labelledby="why-title">
        <div className="sectionIntro compact centerIntro">
          <p className="homeKicker">Why choose PNGtoSTL</p>
          <h2 id="why-title">Cleaner routing, clearer previews, fewer failed prints.</h2>
          <p>Instead of treating every upload the same, the converter checks image fit first and guides users toward the workflow most likely to produce a usable STL.</p>
        </div>
      </section>

      <section className="timelineSteps" aria-labelledby="timeline-title">
        <div className="sectionIntro compact centerIntro">
          <p className="homeKicker">How it works</p>
          <h2 id="timeline-title">From image upload to STL download in four steps.</h2>
        </div>
        <div className="timelineGrid">
          {conversionSteps.map((item) => (
            <article key={item.step}>
              <b>{item.step}</b>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="advancedFeatureSection" aria-labelledby="advanced-title">
        <div className="sectionIntro compact centerIntro">
          <p className="homeKicker">Converter features</p>
          <h2 id="advanced-title">Advanced controls without a CAD learning curve.</h2>
        </div>
        <div className="advancedFeatureGrid">
          {advancedFeatures.map((feature, index) => (
            <article key={feature.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="modelShowcase" aria-labelledby="showcase-title">
        <div className="sectionIntro compact centerIntro">
          <p className="homeKicker">Generated STL showcase</p>
          <h2 id="showcase-title">Real output types the site can reproduce.</h2>
        </div>
        <div className="modelCards">
          {modelShowcase.map((item) => (
            <article key={item.title}>
              <Image src={item.image} alt={`${item.title} STL preview`} width={360} height={260} loading="lazy" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricingShowcase" aria-labelledby="pricing-title">
        <div className="sectionIntro compact centerIntro">
          <p className="homeKicker">Pricing path</p>
          <h2 id="pricing-title">Start free, scale when batch work matters.</h2>
          <p>Current generation is free while commercial batch/API plans are being prepared. Pricing cards set expectations without blocking the upload flow.</p>
        </div>
        <div className="pricingCards">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={plan.featured ? "featuredPrice" : undefined}>
              <span>{plan.tag}</span>
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <Link href={plan.name === "Free" ? "#converter" : "/pricing"}> {plan.name === "Free" ? "Start free" : "View plan"}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="homeFaqSection" aria-labelledby="home-faq-title">
        <div className="sectionIntro compact centerIntro">
          <p className="homeKicker">FAQ</p>
          <h2 id="home-faq-title">Common image-to-STL questions.</h2>
        </div>
        <div className="homeFaqGrid">
          {homeFaqs.map((item) => (
            <article key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
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

      <section className="finalCta" aria-labelledby="final-cta-title">
        <p className="homeKicker">Ready to test your image?</p>
        <h2 id="final-cta-title">Upload once, see the best STL path before you print.</h2>
        <div className="heroActions">
          <Link className="btnPrimary" href="#converter">Start converting</Link>
          <Link className="btnSecondary" href="/samples">Browse examples</Link>
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
    <script src="/stl-preview.js?v=light-preview-20260609" defer></script>
    <script src="/converter.js?v=smooth-relief-20260609" defer></script>
    </>
  );
}
