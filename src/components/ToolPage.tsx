import Link from "next/link";
import { ConverterPanel } from "@/components/ConverterPanel";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { UtilityAdvisor } from "@/components/UtilityAdvisor";
import type { ToolConfig } from "@/lib/tools";

const primaryNav = [
  { href: "/image-to-stl", label: "Image to STL" },
  { href: "/logo-to-stl", label: "Logo to STL" },
  { href: "/lithophane-generator", label: "Lithophane" },
  { href: "/heightmap-to-stl", label: "Heightmap" },
  { href: "/faq", label: "Guides" },
];

function Header() {
  return (
    <header className="container toolHeader">
      <nav>
        <Link href="/" className="brandMark" aria-label="PNGtoSTL home">
          <span aria-hidden="true" />
          PNGtoSTL
        </Link>
        <div className="toolNavLinks">
          {primaryNav.map((item) => (
            <Link key={item.href} className="pill" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
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
      </div>
      <nav aria-label="Footer">
        <Link href="/image-to-stl">Image to STL</Link>
        <Link href="/logo-to-stl">Logo to STL</Link>
        <Link href="/lithophane-generator">Lithophane</Link>
        <Link href="/heightmap-to-stl">Heightmap</Link>
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

export function ToolPage({ tool }: { tool: ToolConfig }) {
  const advisorOnly = tool.slug === "3d-print-photo";

  return (
    <>
      <Header />
      <main className="container toolPage">
        <section className="toolHero">
          <div>
            <p className="pill">{tool.eyebrow}</p>
            <h1>{tool.title}</h1>
            <p>{tool.description}</p>
            <p>{tool.promise}</p>
            <div className="heroActions">
              <a className="btnPrimary" href="#converter">Start converting</a>
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
            <ConverterPanel tool={tool} />
          )}
        </section>

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
        </section>

        <section className="shell faqBlock">
          <h2 className="sectionTitle">Quick answers</h2>
          <div>
            {tool.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
            <details>
              <summary>Is this a full 3D reconstruction from one photo?</summary>
              <p>No. The tools create printable relief, lithophane, logo, or heightmap-style STL surfaces from a 2D image.</p>
            </details>
            <details>
              <summary>How do I reduce STL file size?</summary>
              <p>Lower the detail level, reduce output width, or use a cleaner high-contrast image with less noise.</p>
            </details>
            <details>
              <summary>Can I print the STL directly?</summary>
              <p>Usually yes for simple reliefs, but you should still inspect orientation, scale, and slicer warnings before printing.</p>
            </details>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script src="/stl-preview.js" defer />
      <script src="/converter.js" defer />
    </>
  );
}
