import Link from "next/link";
import { MiniToolExample, ShowcaseDemo } from "@/components/HomeShowcase";
import { helperPages, tools } from "@/lib/tools";

const heroTools = [
  { label: "Image to STL", href: "/image-to-stl", note: "Upload PNG, JPG, WebP, GIF, or BMP" },
  { label: "Logo to STL", href: "/logo-to-stl", note: "SVG or high-contrast logo relief" },
  { label: "Lithophane", href: "/lithophane-generator", note: "Backlit photo panels" },
  { label: "Heightmap", href: "/heightmap-to-stl", note: "Brightness mapped into surface height" },
];

const primaryTools = ["image-to-stl", "logo-to-stl", "lithophane-generator", "heightmap-to-stl"];

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

  return (
    <main className="homePage">
      <header className="homeNav">
        <Link href="/" className="brandMark" aria-label="PNGtoSTL home">
          <span aria-hidden="true" />
          PNGtoSTL
        </Link>
        <div className="homeNavRight">
        <nav className="homeNavLinks" aria-label="Primary">
          <Link href="/image-to-stl">Image to STL</Link>
          <Link href="/logo-to-stl">Logo to STL</Link>
          <Link href="/lithophane-generator">Lithophane</Link>
          <Link href="/heightmap-to-stl">Heightmap</Link>
          <Link href="/faq">Guides</Link>
        </nav>
        <div className="accountActions" aria-label="Primary action">
          <a className="signupButton" href="/image-to-stl">Start converting</a>
        </div>
        </div>
      </header>

      <section className="homeHero">
        <div className="homeHeroCopy">
          <p className="homeKicker">Image to 3D printing toolkit</p>
          <h1>Upload one image. Choose the STL workflow that fits.</h1>
          <p>
            Start with a single image upload for PNG, JPG, WebP, GIF, or BMP. Then choose relief, logo, lithophane, or heightmap output with the right defaults.
          </p>
          <div className="heroActions" aria-label="Popular conversion tools">
            <Link className="btnPrimary" href="/image-to-stl">Upload image</Link>
            <Link className="btnSecondary" href="#tools">Browse tools</Link>
          </div>
        </div>

        <aside className="heroUploadPanel" aria-label="Start image upload">
          <div className="uploadMockDropzone">
            <span className="uploadIcon" aria-hidden="true">↑</span>
            <strong>Drop image here</strong>
            <p>or start with the universal converter.</p>
            <Link className="btnPrimary" href="/image-to-stl">Choose image</Link>
            <small>PNG, JPG, WebP, GIF, BMP · STL preview after generation</small>
          </div>
          <div className="workflowPicker" aria-label="Output workflows">
            {heroTools.map((tool, index) => (
              <Link key={tool.href} className={index === 0 ? "heroToolLink workflowChoice primary" : "heroToolLink workflowChoice"} href={tool.href}>
                <span>{tool.label}</span>
                <small>{tool.note}</small>
              </Link>
            ))}
          </div>
          <div className="toolPanelNote">
            <strong>No fake login wall</strong>
            <span>Use the browser tool first. API and batch workflows can come after real usage data.</span>
          </div>
        </aside>
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
        </div>
        <nav aria-label="Footer">
          <Link href="/image-to-stl">Image to STL</Link>
          <Link href="/logo-to-stl">Logo to STL</Link>
          <Link href="/lithophane-generator">Lithophane</Link>
          <Link href="/heightmap-to-stl">Heightmap</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
        </nav>
      </footer>
    </main>
  );
}
