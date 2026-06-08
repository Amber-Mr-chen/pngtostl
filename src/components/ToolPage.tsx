import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { ConverterPanel } from "@/components/ConverterPanel";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { ToolProofBlock } from "@/components/ToolProofBlock";
import { UtilityAdvisor } from "@/components/UtilityAdvisor";
import { helperPages, sampleWorkflows, type SampleWorkflow, type ToolConfig } from "@/lib/tools";

const primaryNav = [
  { href: "/image-to-stl", label: "Image to STL" },
  { href: "/logo-to-stl", label: "Logo to STL" },
  { href: "/lithophane-generator", label: "Lithophane" },
  { href: "/heightmap-to-stl", label: "Heightmap" },
  { href: "/faq", label: "Guides" },
];

function activeNavFor(currentPath: string, itemHref: string) {
  const groupedRoutes: Record<string, string[]> = {
    "/image-to-stl": ["/image-to-stl", "/png-to-stl", "/jpg-to-stl", "/convert-image-to-stl", "/2d-image-to-3d-model", "/3d-print-photo"],
    "/lithophane-generator": ["/lithophane-generator", "/photo-to-lithophane"],
    "/heightmap-to-stl": ["/heightmap-to-stl"],
    "/logo-to-stl": ["/logo-to-stl"],
    "/faq": [
      "/faq",
      "/image-contrast-guide",
      "/print-settings-checker",
      "/how-to-turn-logo-into-stl",
      "/lithophane-image-guide",
      "/heightmap-to-stl-terrain-guide",
    ],
  };
  return groupedRoutes[itemHref]?.includes(currentPath) ?? itemHref === currentPath;
}

function Header({ currentPath }: { currentPath: string }) {
  return (
    <header className="container toolHeader">
      <nav>
        <BrandMark />
        <div className="toolNavLinks">
          {primaryNav.map((item) => {
            const isActive = activeNavFor(currentPath, item.href);
            return (
              <Link key={item.href} className={isActive ? "pill activePill" : "pill"} aria-current={isActive ? "page" : undefined} href={item.href}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

const toolGuidance: Record<string, {
  bestFor: string[];
  avoid: string[];
  printTips: string[];
}> = {
  "image-to-stl": {
    bestFor: ["High-contrast icons, line art, simple illustrations, and clean subject photos.", "Makers who are choosing between relief, logo, lithophane, and heightmap output.", "Fast single-file tests before spending time in CAD or a slicer."],
    avoid: ["Expecting a complete 3D object reconstruction from one normal photo.", "Very low-contrast images where the subject blends into the background.", "Images where color is the main information, because STL stores geometry only."],
    printTips: ["Start with the default relief mode, then lower detail if the STL is too large.", "Use the preview and triangle count before downloading large files.", "Open the STL in a slicer from the front/top view and confirm scale before printing."],
  },
  "png-to-stl": {
    bestFor: ["Transparent PNG icons, emojis, silhouettes, stamps, and black-and-white artwork.", "Clean alpha edges that should become raised or recessed geometry.", "Simple maker badges where color does not need to survive in the STL."],
    avoid: ["Noisy screenshots, tiny text, and PNGs where the important detail is color rather than shape.", "Photographic PNGs that would work better as lithophanes or photo reliefs.", "Expecting transparent pixels to become colored material; they only affect shape/background."],
    printTips: ["Keep the icon simple and remove background clutter before upload.", "Use lower smoothing for crisp badges and higher smoothing for jagged pixel art.", "Check thin strokes in the preview; tiny raised lines may fail on small nozzles."],
  },
  "jpg-to-stl": {
    bestFor: ["JPG photos or downloaded images with a clear subject and strong contrast.", "Testing whether a photo is better as relief or lithophane before printing.", "Users who do not want to manually convert JPG to PNG first."],
    avoid: ["Portraits with subtle skin tones when you actually want a backlit lithophane.", "Compressed, blurry, or shadow-heavy photos that will create noisy surface bumps.", "Full object reconstruction claims; this creates relief-style STL output."],
    printTips: ["Crop the subject and increase contrast before upload when possible.", "If the relief looks noisy, try lithophane mode or reduce detail/smoothing.", "Use a larger output width for photo reliefs so small features remain printable."],
  },
  "logo-to-stl": {
    bestFor: ["Simple SVG or transparent PNG logos with strong edges.", "Badges, plaques, signs, product marks, makerspace labels, and name plates.", "Flat artwork that should become a raised logo on a printable base."],
    avoid: ["Complex mascot art, gradients, tiny text, and low-resolution screenshots.", "Logos that rely on multiple colors rather than silhouette or contrast.", "Trying to create a sculpted 3D character from a 2D logo."],
    printTips: ["Use a thicker base for signs and a lower relief height for small badges.", "Simplify tiny text before conversion; very thin strokes may not slice well.", "Preview the edges and lower smoothing only when you need sharper geometry."],
  },
  "lithophane-generator": {
    bestFor: ["Portraits, memorial photos, night lights, window panels, and backlit gifts.", "Images with clear subjects, balanced contrast, and visible highlights/shadows.", "Single-material prints where light passing through thickness creates the picture."],
    avoid: ["Very dark images, blown-out highlights, cluttered backgrounds, or photos with no clear subject.", "Expecting color in the STL; lithophanes are geometry/thickness, not color images.", "Printing without a light source behind the panel."],
    printTips: ["Use light filament and thin layers for clearer backlit detail.", "Keep min/max thickness conservative first, then adjust after a small test print.", "Check whether inversion is correct before slicing the full-size panel."],
  },
  "heightmap-to-stl": {
    bestFor: ["Grayscale heightmaps, terrain maps, texture plates, and depth maps.", "Users who already know that brightness should map to surface height.", "Surface reliefs where black-to-white values represent low-to-high geometry."],
    avoid: ["Normal photos that are not intended as height data.", "Expecting a watertight CAD assembly when the input is only a surface map.", "Color maps without a meaningful grayscale depth relationship."],
    printTips: ["Use a true grayscale depth map for predictable height behavior.", "Start with lower max height and smoothing before increasing terrain exaggeration.", "Check the base and orientation in your slicer before printing large surfaces."],
  },
};

function guidanceFor(tool: ToolConfig) {
  return toolGuidance[tool.slug] ?? {
    bestFor: [tool.promise, "Single-image maker workflows where a relief-style STL is acceptable.", "Quick tests before committing to a larger print."],
    avoid: ["Full 3D object reconstruction from one image.", "Images where color, texture, or hidden backside geometry is required.", "Printing without checking scale, orientation, and slicer warnings."],
    printTips: ["Use a clean, high-contrast image first.", "Start with default settings before changing advanced controls.", "Inspect the preview, size, and triangle count before printing."],
  };
}

function relatedProofsFor(tool: ToolConfig) {
  const currentPath = `/${tool.slug}`;
  const routeAliases: Record<string, string[]> = {
    "/image-to-stl": ["/image-to-stl", "/jpg-to-stl", "/png-to-stl"],
    "/png-to-stl": ["/png-to-stl", "/logo-to-stl", "/image-to-stl"],
    "/jpg-to-stl": ["/jpg-to-stl", "/image-to-stl", "/lithophane-generator"],
    "/logo-to-stl": ["/logo-to-stl", "/png-to-stl"],
    "/lithophane-generator": ["/lithophane-generator", "/photo-to-lithophane"],
    "/photo-to-lithophane": ["/photo-to-lithophane", "/lithophane-generator"],
    "/heightmap-to-stl": ["/heightmap-to-stl"],
  };
  const aliases = routeAliases[currentPath] ?? [currentPath];
  return sampleWorkflows
    .filter((sample) => aliases.includes(sample.route))
    .sort((a, b) => aliases.indexOf(a.route) - aliases.indexOf(b.route))
    .slice(0, 2);
}

const supportGuideMap: Record<string, string[]> = {
  "image-to-stl": ["image-contrast-guide", "how-to-turn-logo-into-stl", "lithophane-image-guide"],
  "png-to-stl": ["image-contrast-guide", "how-to-turn-logo-into-stl"],
  "jpg-to-stl": ["image-contrast-guide", "lithophane-image-guide"],
  "convert-image-to-stl": ["image-contrast-guide", "how-to-turn-logo-into-stl", "lithophane-image-guide"],
  "2d-image-to-3d-model": ["image-contrast-guide", "how-to-turn-logo-into-stl", "heightmap-to-stl-terrain-guide"],
  "3d-print-photo": ["lithophane-image-guide", "image-contrast-guide", "print-settings-checker"],
  "photo-to-lithophane": ["lithophane-image-guide", "image-contrast-guide"],
  "logo-to-stl": ["how-to-turn-logo-into-stl", "image-contrast-guide", "print-settings-checker"],
  "lithophane-generator": ["lithophane-image-guide", "image-contrast-guide", "print-settings-checker"],
  "heightmap-to-stl": ["heightmap-to-stl-terrain-guide", "image-contrast-guide", "print-settings-checker"],
};

function supportGuidesFor(tool: ToolConfig) {
  const slugs = supportGuideMap[tool.slug] ?? ["image-contrast-guide", "print-settings-checker"];
  return slugs
    .map((slug) => helperPages.find((page) => page.slug === slug))
    .filter((page): page is (typeof helperPages)[number] => Boolean(page));
}

function advisorKindFromSlug(slug: string) {
  if (slug === "jpg-to-stl") return "jpg-gate";
  return "photo-path";
}

function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <strong>PNGtoSTL</strong>
        <p>Browser-first image to STL workflows for reliefs, logos, lithophanes, and heightmaps.</p>
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
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/sitemap.xml">Sitemap</Link>
      </nav>
    </footer>
  );
}

export function ToolPage({ tool, loadedSample }: { tool: ToolConfig; loadedSample?: SampleWorkflow | null }) {
  const advisorOnly = tool.slug === "3d-print-photo";
  const guidance = guidanceFor(tool);
  const relatedProofs = relatedProofsFor(tool);
  const supportGuides = supportGuidesFor(tool);
  const faqItems = [
    ...tool.faq,
    {
      q: "Is this a full 3D reconstruction from one photo?",
      a: "No. The tools create printable relief, lithophane, logo, or heightmap-style STL surfaces from a 2D image.",
    },
    {
      q: "How do I reduce STL file size?",
      a: "Lower the detail level, reduce output width, or use a cleaner high-contrast image with less noise.",
    },
    {
      q: "Can I print the STL directly?",
      a: "Usually yes for simple reliefs, but you should still inspect orientation, scale, and slicer warnings before printing.",
    },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.slice(0, 8).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Header currentPath={`/${tool.slug}`} />
      <main className="container toolPage">
        <section className="toolHero">
          <div>
            <p className="pill">{tool.eyebrow}</p>
            <h1>{tool.title}</h1>
            <p>{tool.description}</p>
            <p>{tool.promise}</p>
            <div className="heroActions">
              <a className="btnPrimary" href="#converter">Go to upload area</a>
              <a className="btnSecondary" href="#how-it-works">How it works</a>
            </div>
          </div>
          <aside className="toolTrustCard compactTrust">
            <strong>Before you generate</strong>
            <ul>
              <li>STL stores geometry, not image color.</li>
              <li>Use preview and metrics before printing.</li>
            </ul>
          </aside>
        </section>

        <section id="converter" className="toolConverterBlock">
          {advisorOnly ? (
            <div className="advisorGrid">
              <ImageAnalyzer title="Analyze this photo" />
              <UtilityAdvisor kind={advisorKindFromSlug(tool.slug)} tool={tool} />
            </div>
          ) : (
            <ConverterPanel tool={tool} loadedSample={loadedSample} />
          )}
        </section>

        <section className="supportGrid guidanceGrid" aria-label={`${tool.title} guidance`}>
          <div className="shell">
            <h2 className="sectionTitle">Best for</h2>
            <ul>
              {guidance.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="shell">
            <h2 className="sectionTitle">Avoid this input</h2>
            <ul>
              {guidance.avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="shell">
            <h2 className="sectionTitle">Print checks</h2>
            <ul>
              {guidance.printTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <ToolProofBlock tool={tool} samples={relatedProofs} />

        <section id="how-it-works" className="stepGrid">
          {tool.steps.map((step, index) => (
            <div className="shell" key={step}>
              <span className="smallMuted">Step {index + 1}</span>
              <h3>{step}</h3>
              <p>{index === 0 ? "Use a clean image and check the supported formats before generating." : index === 1 ? "Tune only the basic values first; advanced settings are optional." : "Inspect the preview and download when the STL is ready."}</p>
            </div>
          ))}
        </section>

        <section className="supportGrid">
          <div className="shell">
            <h2 className="sectionTitle">Why use this page?</h2>
            <ul>
              {tool.pains.map((pain) => (
                <li key={pain}>{pain}</li>
              ))}
            </ul>
          </div>
          <div className="shell">
            <h2 className="sectionTitle">Related tools</h2>
            <div className="relatedTools">
              {tool.related.map((item) => (
                <Link key={item.href} className="pill" href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link className="pill" href="/logo-to-stl">Logo to STL</Link>
              <Link className="pill" href="/lithophane-generator">Lithophane</Link>
              <Link className="pill" href="/heightmap-to-stl">Heightmap</Link>
            </div>
          </div>
          <div className="shell">
            <h2 className="sectionTitle">Related guides</h2>
            <div className="relatedTools">
              {supportGuides.map((page) => (
                <Link key={page.slug} className="pill" href={`/${page.slug}`}>
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="shell faqBlock">
          <h2 className="sectionTitle">Quick answers</h2>
          <div>
            {faqItems.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script src="/stl-preview.js?v=webgl-front-20260608c" defer />
      <script src="/converter.js?v=cutout-quality-20260608" defer />
    </>
  );
}
