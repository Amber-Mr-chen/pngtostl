import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SampleGalleryFilter } from "@/components/SampleGalleryFilter";
import { ToolPage } from "@/components/ToolPage";
import { HelperUtilityPage } from "@/components/HelperUtilityPage";
import { getSampleWorkflow, getTool, helperPages, sampleWorkflows, sampleWorkflowSlug, staticPages, tools } from "@/lib/tools";

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

function samplesJsonLd() {
  const base = "https://pngtostl.net";
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Image to STL Examples",
    url: `${base}/samples`,
    description: "Real image-to-STL examples with source images, generated STL previews, recommended settings, and downloadable STL files.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sampleWorkflows.map((sample, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: sample.title,
          url: `${base}/samples#${sampleWorkflowSlug(sample.title)}`,
          description: `${sample.input} to ${sample.output}`,
          genre: sample.categoryLabel,
          encoding: {
            "@type": "MediaObject",
            contentUrl: `${base}${sample.stlPath}`,
            encodingFormat: "model/stl",
            name: `${sample.title} STL sample`,
          },
          image: [`${base}${sample.sourceImage}`, `${base}${sample.previewImage}`],
        },
      })),
    },
  };
}

const primaryInfoNav = [
  { href: "/image-to-stl", label: "Image to STL" },
  { href: "/logo-to-stl", label: "Logo to STL" },
  { href: "/lithophane-generator", label: "Lithophane" },
  { href: "/heightmap-to-stl", label: "Heightmap" },
  { href: "/samples", label: "Examples" },
  { href: "/pricing", label: "Pricing" },
];

function InfoHeader() {
  return (
    <header className="container toolHeader infoHeader">
      <nav>
        <Link href="/" className="brandMark" aria-label="PNGtoSTL home">
          <span aria-hidden="true" />
          PNGtoSTL
        </Link>
        <div className="toolNavLinks">
          {primaryInfoNav.map((item) => (
            <Link key={item.href} className="pill" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

type SlugParams = Promise<{ slug: string }>;
type PageSearchParams = Promise<{ sample?: string | string[] }>;

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
    const canonical = `/${staticPage.slug}`;
    return {
      title: staticPage.title,
      description: staticPage.description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: `https://pngtostl.net${canonical}`,
        siteName: "PNGtoSTL",
        title: staticPage.title,
        description: staticPage.description,
      },
      twitter: {
        card: "summary",
        title: staticPage.title,
        description: staticPage.description,
      },
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

export default async function DynamicPage({ params, searchParams }: { params: SlugParams; searchParams?: PageSearchParams }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (tool) {
    const search = searchParams ? await searchParams : {};
    const sampleParam = Array.isArray(search.sample) ? search.sample[0] : search.sample;
    const loadedSample = getSampleWorkflow(sampleParam, `/${tool.slug}`);
    return (
      <>
        <ToolPage tool={tool} loadedSample={loadedSample} />
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
  if (slug === "samples") {
    return (
      <>
        <SamplesPage />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(samplesJsonLd()) }} />
      </>
    );
  }
  if (slug === "privacy") return <PrivacyPage />;
  if (slug === "terms") return <TermsPage />;
  if (slug === "developers") return <DevelopersPage />;
  if (slug === "pricing") return <PricingPage />;
  if (slug === "contact") return <ContactPage />;
  notFound();
}

function LegalSupportLinks() {
  return (
    <nav className="shell legalSupportLinks" aria-label="Legal and support links">
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href="/developers">API and batch access</Link>
    </nav>
  );
}

function SamplesPage() {
  return (
    <>
      <InfoHeader />
      <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Real workflow examples</p>
        <h1>Image to STL examples</h1>
        <p>Use these examples to choose the right PNGtoSTL workflow before you upload. Each sample explains the input, output, recommended settings, and common failure cases.</p>
      </section>
      <SampleGalleryFilter samples={sampleWorkflows} />
      <LegalSupportLinks />
      </main>
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <InfoHeader />
      <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Privacy</p>
        <h1>Privacy Policy</h1>
        <p>Last updated: 2026-06-06. PNGtoSTL is a browser-first image-to-STL tool. This page explains what data is used when you upload an image, generate an STL, use lightweight analytics, or contact us.</p>
      </section>
      <section className="infoGrid">
        <article className="shell"><h2>Uploaded images</h2><p>When you generate an STL, the selected image is sent to the conversion endpoint for that request. The current tool is designed to return the STL result directly; it does not provide public file hosting or account storage. Server and platform logs may record technical request metadata needed to operate and protect the service.</p></article>
        <article className="shell"><h2>Generated STL files</h2><p>The generated STL is returned to your browser for download. PNGtoSTL does not provide a saved project library in this version. You are responsible for checking scale, printability, and rights to the source image before printing or sharing output.</p></article>
        <article className="shell"><h2>Analytics and cookies</h2><p>PNGtoSTL uses Google Analytics 4 to measure lightweight product events such as page views, sample clicks, feedback clicks, upload selected, generate clicked, generate success, download clicked, and generate error. These events help us understand reliability and improve the tool. They do not require image file contents, passwords, private keys, or generated STL file contents.</p></article>
        <article className="shell"><h2>Service providers</h2><p>PNGtoSTL runs on hosting and edge infrastructure providers that process technical request data needed to deliver pages, conversion responses, security controls, and logs. Google Analytics 4 processes analytics events for product measurement. Cloudflare Email Routing forwards support messages sent to support@pngtostl.net. If we later add payment, authentication, storage, or API-key providers, this policy should be updated before those features are launched.</p></article>
        <article className="shell"><h2>Contact and IP requests</h2><p>If you contact us, we may use your message and reply address to respond. Do not send passwords, private keys, confidential files, or sensitive personal data through contact requests. For rights or IP complaints, include the page URL, the material at issue, and your contact information.</p></article>
      </section>
      <LegalSupportLinks />
      </main>
    </>
  );
}

function TermsPage() {
  return (
    <>
      <InfoHeader />
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
        <article className="shell"><h2>Availability and changes</h2><p>Features, free limits, analytics, API access, and future account workflows may change. PNGtoSTL does not currently collect payment for the public single-file converter. If paid features are introduced later, pricing, limits, cancellation, and refund terms should be published before purchase.</p></article>
        <article className="shell"><h2>No professional advice</h2><p>Print settings and workflow notes are practical starting points, not engineering, manufacturing, safety, or legal advice.</p></article>
        <article className="shell"><h2>Abuse and access</h2><p>Automated abuse, excessive requests, attempts to bypass limits, or use that interferes with service reliability may be blocked.</p></article>
      </section>
      <LegalSupportLinks />
      </main>
    </>
  );
}

function DevelopersPage() {
  return (
    <>
      <InfoHeader />
      <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">API and batch workflows</p>
        <h1>Developers, batch conversion, and commercial image-to-STL workflows</h1>
        <p>PNGtoSTL is free for instant single-file conversion today. If you need batch processing, repeatable API access, higher-detail STL output, or commercial workflow support, tell us what you are building so we can prioritize the right Pro/API features.</p>
        <div className="heroActions compactActions">
          <Link className="btnPrimary" href="mailto:support@pngtostl.net?subject=PNGtoSTL%20API%20or%20batch%20access&body=Use%20case%3A%0AExpected%20monthly%20conversions%3A%0AInput%20formats%3A%0AOutput%20workflow%20%28relief%2Flogo%2Flithophane%2Fheightmap%29%3A%0ACommercial%20or%20personal%20use%3A%0A">Request API access</Link>
          <Link className="btnSecondary" href="/pricing">View planned options</Link>
        </div>
      </section>
      <section className="infoGrid">
        <article className="shell"><h2>Batch image-to-STL conversion</h2><p>Tell us if you need to convert many PNG, JPG, WebP, GIF, or BMP files into relief, logo badge, lithophane, or heightmap STL outputs. Include approximate monthly volume, average image size, and target output mode.</p></article>
        <article className="shell"><h2>API access</h2><p>API access is not self-serve yet. Early requests help define the limits, authentication, file-size caps, response format, and pricing before a public API is released.</p></article>
        <article className="shell"><h2>Commercial use</h2><p>If you use generated STL files for client work, shops, print farms, education, or internal production, contact us with your expected workflow. PNGtoSTL does not currently require login for normal single-file conversion.</p></article>
        <article className="shell"><h2>What to include</h2><p>Use case, monthly conversion estimate, input formats, output modes, required detail level, whether you need saved history, and whether you need invoice or team access later.</p></article>
        <article className="shell"><h2>Current free path</h2><p>For single images, use the no-signup converter first. It is the fastest way to validate whether the relief, logo, lithophane, or heightmap output fits your source image.</p><p><Link href="/image-to-stl">Open Image to STL</Link></p></article>
        <article className="shell"><h2>Not promised yet</h2><p>Self-serve API keys, uptime commitments, saved project libraries, billing, and team dashboards are planned only after enough real demand is confirmed.</p></article>
      </section>
      <LegalSupportLinks />
      </main>
    </>
  );
}

function PricingPage() {
  return (
    <>
      <InfoHeader />
      <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Pricing</p>
        <h1>PNGtoSTL pricing</h1>
        <p>The current converter is free for no-signup single-file image-to-STL use. Pro, batch, and API options are planned around real usage demand, not launched payment pages yet.</p>
        <div className="heroActions compactActions">
          <Link className="btnPrimary" href="/image-to-stl">Use free converter</Link>
          <Link className="btnSecondary" href="/developers">Request API or batch access</Link>
        </div>
      </section>
      <section className="infoGrid">
        <article className="shell"><h2>Free</h2><p><strong>Available now.</strong> Single-file conversion for relief, logo badge, lithophane, and heightmap workflows. No signup required. Best for makers testing images before printing.</p><p><Link href="/samples">See sample STL outputs</Link></p></article>
        <article className="shell"><h2>Pro</h2><p><strong>Planned.</strong> Higher practical limits, more detail controls, faster repeat workflows, and saved defaults may be added after usage data shows where serious users need help.</p><p>No payment is collected on this page.</p></article>
        <article className="shell"><h2>Batch</h2><p><strong>By request.</strong> For schools, print farms, shops, and teams that need many image-to-STL conversions. Contact us with volume, formats, and output mode.</p><p><Link href="mailto:support@pngtostl.net?subject=PNGtoSTL%20batch%20conversion%20request">Ask about batch conversion</Link></p></article>
        <article className="shell"><h2>API</h2><p><strong>Early access interest.</strong> API keys and programmatic conversion are not self-serve yet. Requests help define usage limits and price points before launch.</p><p><Link href="/developers">Developer access details</Link></p></article>
        <article className="shell"><h2>Why no forced account?</h2><p>Most users arrive from search and want one result quickly. The free converter keeps the core path simple: upload, generate, download. Accounts make sense later for history, quota, API keys, and billing.</p></article>
        <article className="shell"><h2>Future terms</h2><p>If paid features launch, limits, cancellation, refunds, commercial terms, privacy behavior, and billing details will be published before purchase.</p><p><Link href="/terms">Read current terms</Link></p></article>
      </section>
      <LegalSupportLinks />
      </main>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <InfoHeader />
      <main className="container infoPage">
      <section className="shell infoHero">
        <p className="pill">Contact</p>
        <h1>Contact PNGtoSTL</h1>
        <p>Send feedback, report conversion issues, request API or batch conversion access, or suggest example workflows. Include the page, browser, image type, and what you expected when reporting a bug.</p>
      </section>
      <section className="infoGrid">
        <article className="shell"><h2>Support</h2><p>Email: <a href="mailto:support@pngtostl.net">support@pngtostl.net</a></p><p>For conversion issues, mention the tool route, input format, selected mode, browser, approximate image size, and whether the STL downloaded.</p></article>
        <article className="shell"><h2>Bug report template</h2><p>Page: /image-to-stl or another route. Input: PNG/JPG/WebP/GIF/BMP. Mode: relief, logo, lithophane, or heightmap. Expected result: what you wanted. Actual result: error text, missing download, or unexpected geometry.</p></article>
        <article className="shell"><h2>API, batch, or commercial use</h2><p>For API access, batch image-to-STL conversion, school/shop workflows, or commercial use questions, include expected monthly conversions, input formats, output mode, and whether you need invoices or team access.</p><p><Link href="/developers">Developer and batch access</Link></p></article>
        <article className="shell"><h2>Rights or IP concerns</h2><p>Send the URL, the material you believe is affected, your relationship to that material, and a reply address. Do not send private keys, passwords, or unrelated confidential files.</p></article>
        <article className="shell"><h2>Useful links</h2><p><Link href="/samples">Examples</Link></p><p><Link href="/pricing">Pricing</Link></p><p><Link href="/developers">API and batch access</Link></p><p><Link href="/image-to-stl">Image to STL</Link></p><p><Link href="/faq">FAQ</Link></p></article>
      </section>
      <LegalSupportLinks />
      </main>
    </>
  );
}

function FaqPage() {
  const questions = tools.flatMap((tool) => tool.faq.map((item) => ({ ...item, source: tool.title })));
  const practicalGuides = helperPages.filter((page) => [
    "how-to-turn-logo-into-stl",
    "lithophane-image-guide",
    "heightmap-to-stl-terrain-guide",
  ].includes(page.slug));
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
    <>
      <InfoHeader />
      <main className="container infoPage faqPage">
      <section className="shell" style={{ padding: 30 }}>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4.6rem)", margin: "0 0 12px", lineHeight: 0.98 }}>
          PNG to STL FAQ
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.2rem", maxWidth: 720 }}>
          Quick answers about formats, relief output, lithophanes, file handling, and 3D printing limits.
        </p>
      </section>
      <section className="shell" style={{ padding: 22, marginTop: 22 }}>
        <h2 className="sectionTitle">Practical guides</h2>
        <div className="relatedTools">
          {practicalGuides.map((page) => (
            <Link key={page.slug} className="pill" href={`/${page.slug}`}>
              {page.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="shell" style={{ padding: 22, marginTop: 22 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {questions.slice(0, 14).map((item, index) => (
            <details key={`${item.source}-${item.q}`} open={index < 6} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14, background: "#fff" }}>
              <summary style={{ fontWeight: 750 }}>{item.q}</summary>
              <p className="smallMuted">{item.a}</p>
              <p className="smallMuted">Related: {item.source}</p>
            </details>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </main>
    </>
  );
}
