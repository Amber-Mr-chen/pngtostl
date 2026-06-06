import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { HelperUtilityPage } from "@/components/HelperUtilityPage";
import { getTool, helperPages, tools } from "@/lib/tools";

function pageJsonLd(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: `https://pngtostl.net${path}`,
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}


type SlugParams = Promise<{ slug: string }>;

export function generateStaticParams() {
  return [
    ...tools.filter((tool) => tool.slug).map((tool) => ({ slug: tool.slug })),
    ...helperPages.map((page) => ({ slug: page.slug })),
    { slug: "faq" },
  ];
}

export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (tool) {
    return {
      title: tool.title,
      description: tool.description,
      alternates: { canonical: `/${tool.slug}` },
    };
  }

  const helper = helperPages.find((page) => page.slug === slug);
  if (helper) {
    return {
      title: helper.title,
      description: helper.description,
      alternates: { canonical: `/${helper.slug}` },
    };
  }

  if (slug === "faq") {
    return {
      title: "PNG to STL FAQ",
      description: "Quick answers about PNG to STL, image to STL, lithophane output, and 3D printing limits.",
      alternates: { canonical: "/faq" },
    };
  }

  return {};
}

export default async function DynamicPage({ params }: { params: SlugParams }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (tool) {
    return (
      <>
        <ToolPage tool={tool} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(tool.title, tool.description, tool.slug ? `/${tool.slug}` : "/")) }}
        />
      </>
    );
  }

  const helper = helperPages.find((page) => page.slug === slug);
  if (helper) {
    return (
      <>
        <HelperUtilityPage slug={slug} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(helper.title, helper.description, `/${helper.slug}`)) }}
        />
      </>
    );
  }

  if (slug === "faq") {
    return <FaqPage />;
  }

  notFound();
}

function FaqPage() {
  const questions = tools.flatMap((tool) => tool.faq.map((item) => ({ ...item, source: tool.title })));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.slice(0, 10).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="container" style={{ padding: "32px 0 56px" }}>
      <section className="shell" style={{ padding: 30 }}>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4.6rem)", margin: "0 0 12px", lineHeight: 0.98 }}>
          PNG to STL FAQ
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.2rem", maxWidth: 720 }}>
          Quick answers about formats, relief output, lithophanes, file handling, and 3D printing limits.
        </p>
      </section>
      <section className="shell" style={{ padding: 22, marginTop: 22 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {questions.slice(0, 14).map((item) => (
            <details key={`${item.source}-${item.q}`} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14, background: "#fff" }}>
              <summary style={{ fontWeight: 750 }}>{item.q}</summary>
              <p className="smallMuted">{item.a}</p>
              <p className="smallMuted">Related: {item.source}</p>
            </details>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
