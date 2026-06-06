import Link from "next/link";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { UtilityAdvisor } from "@/components/UtilityAdvisor";
import { helperPages, tools } from "@/lib/tools";

const helperNav = [
  { href: "/image-to-stl", label: "Image to STL" },
  { href: "/logo-to-stl", label: "Logo to STL" },
  { href: "/lithophane-generator", label: "Lithophane" },
  { href: "/heightmap-to-stl", label: "Heightmap" },
  { href: "/samples", label: "Examples" },
];

function HelperHeader() {
  return (
    <header className="container toolHeader infoHeader">
      <nav>
        <Link href="/" className="brandMark" aria-label="PNGtoSTL home">
          <span aria-hidden="true" />
          PNGtoSTL
        </Link>
        <div className="toolNavLinks">
          {helperNav.map((item) => (
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
  if (slug === "print-settings-checker") return "print-settings";
  return "contrast";
}

export function HelperUtilityPage({ slug }: { slug: string }) {
  const page = helperPages.find((item) => item.slug === slug);
  if (!page) return null;

  return (
    <>
      <HelperHeader />
      <main className="container infoPage helperPage">
      <section className="shell" style={{ padding: 30 }}>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4.6rem)", margin: "0 0 12px", lineHeight: 0.98 }}>
          {page.title}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.2rem", maxWidth: 680 }}>{page.description}</p>
        <Link className="btnPrimary" href={page.href}>
          {page.cta}
        </Link>
      </section>

      <section style={{ marginTop: 22, display: "grid", gap: 16 }}>
        {page.slug === "image-contrast-guide" ? <ImageAnalyzer title="Analyze image contrast" /> : null}
        <UtilityAdvisor kind={advisorKindFromSlug(page.slug)} />
      </section>

      <section className="shell" style={{ padding: 22, marginTop: 22 }}>
        <h2 className="sectionTitle">Continue with a tool</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {tools.slice(0, 10).map((tool) => (
            <Link className="pill" key={tool.slug || "home"} href={tool.slug ? `/${tool.slug}` : "/"}>
              {tool.title}
            </Link>
          ))}
        </div>
      </section>
      </main>
    </>
  );
}
