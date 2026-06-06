import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { HelperUtilityPage } from "@/components/HelperUtilityPage";
import { getTool, helperPages, sampleWorkflows, staticPages, tools } from "@/lib/tools";

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
    ...staticPages.map((page) => ({ slug: page.slug })),
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

  const staticPage = staticPages.find((page) => page.slug === slug);
  if (staticPage) {
    return {
      title: staticPage.title,
      description: staticPage.description,
      alternates: { canonical: `/${staticPage.slug}` },
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

  const staticPage = staticPages.find((page) => page.slug === slug);
  if (staticPage) {
    return <StaticInfoPage slug={slug} />;
  }

  if (slug === "faq") {
    return <FaqPage />;
  }

  notFound();
}

function StaticInfoPage({ slug }: { slug: string }) {
  if (slug === "samples") return <SamplesPage />;
  if (slug === "privacy") return <PrivacyPage />;
  if (slug === "terms") return <TermsPage />;
  if (slug === "contact") return <ContactPage />;
  notFound();
}

function SamplesPage() {
  return (
    <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Real workflow examples</p>
        <h1>Image to STL examples</h1>
        <p>Use these examples to choose the right PNGtoSTL workflow before you upload. Each sample explains the input, output, recommended settings, and common failure cases.</p>
      </section>
      <section className="sampleGallery">
        {sampleWorkflows.map((sample) => (
          <article className="sampleCard proSampleCard" key={sample.title}>
            <div className={`sampleArt proSampleArt realSampleArt ${sample.route.replace('/', '')}`} aria-hidden="true">
              <div className="sampleImageFrame sourceFrame">
                <span>Source</span>
                <Image src={sample.sourceImage} alt="" width={180} height={180} loading="lazy" />
              </div>
              <span className="sampleTransformArrow">→</span>
              <div className="sampleImageFrame previewFrame">
                <span>Generated STL preview</span>
                <Image src={sample.previewImage} alt="" width={360} height={240} loading="lazy" />
              </div>
            </div>
            <div className="sampleCopy">
              <div className="sampleMetaLine">
                <span>{sample.input}</span>
                <span>{sample.metrics}</span>
              </div>
              <h2>{sample.title}</h2>
              <p><strong>Input:</strong> {sample.input}</p>
              <p><strong>Output:</strong> {sample.output}</p>
              <div className="sampleEvidence">
                <p><strong>Source preview:</strong> {sample.sourcePreview}</p>
                <p><strong>Generated result:</strong> {sample.resultPreview}</p>
                <p><strong>Expected metrics:</strong> {sample.metrics}</p>
              </div>
              <ul>
                {sample.settings.map((setting) => <li key={setting}>{setting}</li>)}
              </ul>
              <p><strong>Best for:</strong> {sample.bestFor}</p>
              <p><strong>Avoid:</strong> {sample.avoid}</p>
              <Link className="btnSecondary" href={sample.route}>Open workflow</Link>
              <a className="sampleDownload" href={sample.stlPath} download>
                Download sample STL
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function PrivacyPage() {
  return (
    <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Privacy</p>
        <h1>Privacy Policy</h1>
        <p>Last updated: 2026-06-06. PNGtoSTL is a browser-first image-to-STL tool. This page explains what data is used when you upload an image, generate an STL, use lightweight analytics, or contact us.</p>
      </section>
      <section className="infoGrid">
        <article className="shell"><h2>Uploaded images</h2><p>When you generate an STL, the selected image is sent to the conversion endpoint for that request. The current tool is designed to return the STL result directly; it does not provide public file hosting or account storage. Server and platform logs may record technical request metadata needed to operate and protect the service.</p></article>
        <article className="shell"><h2>Generated STL files</h2><p>The generated STL is returned to your browser for download. PNGtoSTL does not provide a saved project library in this version. You are responsible for checking scale, printability, and rights to the source image before printing or sharing output.</p></article>
        <article className="shell"><h2>Analytics and cookies</h2><p>The interface may emit lightweight product events such as upload selected, generate clicked, generate success, download clicked, and generate error. These events are used to understand tool reliability and do not need image file contents. If third-party analytics is added, this page should be updated with the provider and cookie behavior.</p></article>
        <article className="shell"><h2>Contact and IP requests</h2><p>If you contact us, we may use your message and reply address to respond. Do not send passwords, private keys, confidential files, or sensitive personal data through contact requests. For rights or IP complaints, include the page URL, the material at issue, and your contact information.</p></article>
      </section>
    </main>
  );
}

function TermsPage() {
  return (
    <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Terms</p>
        <h1>Terms of Use</h1>
        <p>Last updated: 2026-06-06. Use PNGtoSTL as a practical maker tool for image-based reliefs, logo badges, lithophanes, and heightmaps. The output is provided as-is and should be checked before printing.</p>
      </section>
      <section className="infoGrid">
        <article className="shell"><h2>Your files and rights</h2><p>Only upload images you own, have permission to use, or are allowed to process. You are responsible for your source image rights and how you use the generated STL.</p></article>
        <article className="shell"><h2>Output limitations</h2><p>PNGtoSTL does not create full CAD reconstruction from one photo. It creates relief, lithophane, logo, or heightmap-style STL surfaces depending on the selected workflow. STL files store geometry, not source image color.</p></article>
        <article className="shell"><h2>Printing responsibility</h2><p>Always inspect generated STL files in a slicer or viewer before printing. We do not guarantee that every generated model will be printable on every printer, material, nozzle, slicer profile, or scale.</p></article>
        <article className="shell"><h2>Availability and changes</h2><p>Features, free limits, analytics, API access, and future account workflows may change. If paid features are introduced later, pricing, limits, cancellation, and refund terms should be published before purchase.</p></article>
        <article className="shell"><h2>No professional advice</h2><p>Print settings and workflow notes are practical starting points, not engineering, manufacturing, safety, or legal advice.</p></article>
        <article className="shell"><h2>Abuse and access</h2><p>Automated abuse, excessive requests, attempts to bypass limits, or use that interferes with service reliability may be blocked.</p></article>
      </section>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Contact</p>
        <h1>Contact PNGtoSTL</h1>
        <p>Send feedback, report conversion issues, or suggest example workflows. Include the page, browser, image type, and what you expected when reporting a bug.</p>
      </section>
      <section className="infoGrid">
        <article className="shell"><h2>Support</h2><p>Email: <a href="mailto:support@pngtostl.net">support@pngtostl.net</a></p><p>For conversion issues, mention the tool route, input format, selected mode, browser, approximate image size, and whether the STL downloaded.</p></article>
        <article className="shell"><h2>Bug report template</h2><p>Page: /image-to-stl or another route. Input: PNG/JPG/WebP/GIF/BMP. Mode: relief, logo, lithophane, or heightmap. Expected result: what you wanted. Actual result: error text, missing download, or unexpected geometry.</p></article>
        <article className="shell"><h2>Rights or IP concerns</h2><p>Send the URL, the material you believe is affected, your relationship to that material, and a reply address. Do not send private keys, passwords, or unrelated confidential files.</p></article>
        <article className="shell"><h2>Useful links</h2><p><Link href="/samples">Examples</Link></p><p><Link href="/image-to-stl">Image to STL</Link></p><p><Link href="/faq">FAQ</Link></p></article>
      </section>
    </main>
  );
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
