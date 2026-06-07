import Link from "next/link";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { UtilityAdvisor } from "@/components/UtilityAdvisor";
import { getSampleWorkflow, helperPages, sampleWorkflowSlug, tools } from "@/lib/tools";

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

export function HelperUtilityPage({ slug }: { slug: string }) {
  const page = helperPages.find((item) => item.slug === slug);
  if (!page) return null;
  const featuredSamples = (page.sampleSlugs || [])
    .map((sampleSlug) => getSampleWorkflow(sampleSlug))
    .filter(Boolean);

  return (
    <>
      <HelperHeader />
      <main className="container infoPage helperPage">
      <section className="shell" style={{ padding: 30 }}>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4.6rem)", margin: "0 0 12px", lineHeight: 0.98 }}>
          {page.title}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.2rem", maxWidth: 680 }}>{page.description}</p>
        {page.intent ? <p className="smallMuted" style={{ maxWidth: 760 }}>{page.intent}</p> : null}
        <Link className="btnPrimary" href={page.href}>
          {page.cta}
        </Link>
      </section>

      <section style={{ marginTop: 22, display: "grid", gap: 16 }}>
        {page.slug === "image-contrast-guide" ? <ImageAnalyzer title="Analyze image contrast" /> : null}
        <UtilityAdvisor kind={page.advisorKind || "contrast"} />
      </section>

      <section className="shell" style={{ padding: 22, marginTop: 22 }}>
        <h2 className="sectionTitle">On-page checklist</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {page.checks.map((check) => (
            <div key={check} style={{ border: "1px solid var(--line)", borderRadius: 14, background: "#fff", padding: 14 }}>
              <strong>✓</strong> <span style={{ color: "var(--muted)", lineHeight: 1.55 }}>{check}</span>
            </div>
          ))}
        </div>
      </section>

      {page.steps?.length ? (
        <section className="infoGrid" style={{ marginTop: 22 }}>
          {page.steps.map((step, index) => (
            <article className="shell" key={step.title}>
              <span className="pill">Step {index + 1}</span>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </article>
          ))}
        </section>
      ) : null}

      {featuredSamples.length ? (
        <section className="shell" style={{ padding: 22, marginTop: 22 }}>
          <h2 className="sectionTitle">Start from a proven sample preset</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {featuredSamples.map((sample) => {
              if (!sample) return null;
              const sampleSlug = sampleWorkflowSlug(sample.title);
              const href = `${sample.route}?sample=${sampleSlug}&utm_source=seo_helper&utm_medium=internal&utm_campaign=${page.slug}`;
              return (
                <article key={sample.title} style={{ border: "1px solid var(--line)", borderRadius: 16, background: "#fff", padding: 16, display: "grid", gap: 10 }}>
                  <span className="pill">{sample.categoryLabel}</span>
                  <h3 style={{ margin: 0 }}>{sample.title}</h3>
                  <p className="smallMuted" style={{ margin: 0 }}>{sample.recommendedPreset}</p>
                  <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>Best for {sample.bestFor}. Avoid {sample.avoid}.</p>
                  <Link className="btnSecondary" href={href}>Load this preset</Link>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {page.faqs?.length ? (
        <section className="shell" style={{ padding: 22, marginTop: 22 }}>
          <h2 className="sectionTitle">Quick answers</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {page.faqs.map((faq) => (
              <details key={faq.q} open style={{ border: "1px solid var(--line)", borderRadius: 14, background: "#fff", padding: 14 }}>
                <summary style={{ fontWeight: 800 }}>{faq.q}</summary>
                <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

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
