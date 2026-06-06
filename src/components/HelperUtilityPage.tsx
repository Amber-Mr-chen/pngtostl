import Link from "next/link";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { UtilityAdvisor } from "@/components/UtilityAdvisor";
import { helperPages, tools } from "@/lib/tools";

function advisorKindFromSlug(slug: string) {
  if (slug === "print-settings-checker") return "print-settings";
  return "contrast";
}

export function HelperUtilityPage({ slug }: { slug: string }) {
  const page = helperPages.find((item) => item.slug === slug);
  if (!page) return null;

  return (
    <main className="container" style={{ padding: "32px 0 56px" }}>
      <Link className="pill" href="/">
        PNGtoSTL
      </Link>
      <section className="shell" style={{ padding: 30, marginTop: 18 }}>
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
  );
}
