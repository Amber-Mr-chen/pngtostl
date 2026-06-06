import Link from "next/link";
import { ConverterPanel } from "@/components/ConverterPanel";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { UtilityAdvisor } from "@/components/UtilityAdvisor";
import type { ToolConfig } from "@/lib/tools";
import { tools } from "@/lib/tools";

function Header() {
  return (
    <header className="container" style={{ padding: "22px 0 12px" }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontWeight: 800 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: "linear-gradient(135deg, #0f6fff, #00a3b5)",
              display: "inline-block",
            }}
          />
          PNGtoSTL
        </Link>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", justifyContent: "flex-end" }}>
          {tools.slice(0, 5).map((tool) => (
            <Link key={tool.slug || "home"} className="pill" href={tool.slug ? `/${tool.slug}` : "/"}>
              {tool.navLabel}
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

export function ToolPage({ tool }: { tool: ToolConfig }) {
  const advisorOnly = tool.slug === "3d-print-photo";

  return (
    <>
      <Header />
      <main className="container" style={{ padding: "22px 0 56px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
            gap: "22px",
            alignItems: "stretch",
          }}
        >
          <div className="shell" style={{ padding: "30px" }}>
            <p className="pill" style={{ width: "fit-content", margin: "0 0 18px" }}>
              {tool.eyebrow}
            </p>
            <h1 style={{ fontSize: "clamp(2.3rem, 6vw, 5.6rem)", lineHeight: 0.94, margin: "0 0 16px", letterSpacing: 0 }}>
              {tool.title}
            </h1>
            <p style={{ fontSize: "1.25rem", lineHeight: 1.5, maxWidth: 720, color: "var(--muted)", margin: "0 0 10px" }}>
              {tool.description}
            </p>
            <p style={{ fontSize: "1.02rem", margin: "0 0 22px" }}>{tool.promise}</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: 24 }}>
              <a className="btnPrimary" href="#converter">{tool.primaryCta}</a>
              <a className="btnSecondary" href="#how-it-works">{tool.secondaryCta}</a>
            </div>

            <div id="converter">
              {advisorOnly ? (
                <div style={{ display: "grid", gap: 16 }}>
                  <ImageAnalyzer title="Analyze this photo" />
                  <UtilityAdvisor kind={advisorKindFromSlug(tool.slug)} tool={tool} />
                </div>
              ) : (
                <ConverterPanel tool={tool} />
              )}
            </div>
          </div>

          <aside className="shell" style={{ padding: 24, display: "grid", gap: 18, alignContent: "start" }}>
            <h2 className="sectionTitle">Output Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {tool.outputFacts.map((fact) => (
                <div key={fact.label} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12, background: "#fff" }}>
                  <div className="smallMuted">{fact.label}</div>
                  <strong>{fact.value}</strong>
                </div>
              ))}
            </div>
            <p style={{ borderLeft: "3px solid var(--warning)", paddingLeft: 12, margin: 0, color: "var(--muted)" }}>
              {tool.limit}
            </p>
            <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14, background: "#f8fbff", color: "var(--muted)", lineHeight: 1.55 }}>
              Generate an STL to reveal mesh metrics, file size, coverage, download link, and the interactive STL preview in the converter panel.
            </div>
          </aside>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 22 }}>
          {tool.steps.map((step, index) => (
            <div className="shell" key={step} style={{ padding: 18 }}>
              <span className="smallMuted">Step {index + 1}</span>
              <h3 style={{ margin: "0.35rem 0 0" }}>{step}</h3>
            </div>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
          <div className="shell" style={{ padding: 22 }}>
            <h2 className="sectionTitle">Why use this page?</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", lineHeight: 1.75 }}>
              {tool.pains.map((pain) => (
                <li key={pain}>{pain}</li>
              ))}
            </ul>
          </div>
          <div className="shell" style={{ padding: 22 }}>
            <h2 className="sectionTitle">Related tools</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {tool.related.map((item) => (
                <Link key={item.href} className="pill" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="shell" style={{ padding: 22, marginTop: 22 }}>
          <h2 className="sectionTitle">Quick answers</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {tool.faq.map((item) => (
              <details key={item.q} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14, background: "#fff" }}>
                <summary style={{ fontWeight: 750 }}>{item.q}</summary>
                <p className="smallMuted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <script src="/stl-preview.js" defer />
      <script src="/converter.js" defer />
    </>
  );
}
