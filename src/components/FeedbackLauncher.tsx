"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

function feedbackMailto(pathname: string) {
  const subject = "PNGtoSTL feedback";
  const body = [
    "Page: " + pathname,
    "",
    "What happened?",
    "",
    "What did you expect?",
    "",
    "Browser / device:",
  ].join("\n");
  return `mailto:support@pngtostl.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function FeedbackLauncher() {
  const [open, setOpen] = useState(false);
  const [pagePath, setPagePath] = useState("https://pngtostl.net/");

  const mailto = useMemo(() => feedbackMailto(pagePath), [pagePath]);

  return (
    <aside className="feedbackLauncher" data-feedback-launcher="true" aria-label="Feedback and support">
      {open ? (
        <div id="pngtostl-feedback-panel" className="feedbackPanel" role="dialog" aria-label="Send feedback to PNGtoSTL">
          <div className="feedbackPanelHeader">
            <div>
              <p className="feedbackKicker">Feedback</p>
              <h2>Need help or found a bug?</h2>
            </div>
            <button
              type="button"
              className="feedbackClose"
              aria-label="Close feedback panel"
              onClick={() => {
                setOpen(false);
                trackEvent("feedback_panel_close", { path: typeof window === "undefined" ? "" : window.location.pathname });
              }}
            >
              ×
            </button>
          </div>
          <p className="feedbackCopy">
            Tell us what you tried, what image type you used, and what output you expected. Do not send private files or passwords.
          </p>
          <div className="feedbackActions">
            <a
              className="btnPrimary feedbackMail"
              href={mailto}
              onClick={() => trackEvent("feedback_email_click", { path: typeof window === "undefined" ? "" : window.location.pathname })}
            >
              Email support
            </a>
            <Link
              className="btnSecondary"
              href="/contact"
              onClick={() => trackEvent("feedback_contact_click", { path: typeof window === "undefined" ? "" : window.location.pathname })}
            >
              Contact page
            </Link>
          </div>
          <p className="feedbackFootnote">support@pngtostl.net</p>
        </div>
      ) : null}
      <button
        type="button"
        className="feedbackButton"
        aria-expanded={open}
        aria-controls="pngtostl-feedback-panel"
        onClick={() => {
          const next = !open;
          if (next && typeof window !== "undefined") {
            setPagePath(window.location.href);
          }
          setOpen(next);
          trackEvent(next ? "feedback_panel_open" : "feedback_panel_close", { path: typeof window === "undefined" ? "" : window.location.pathname });
        }}
      >
        <span aria-hidden="true">?</span>
        Feedback
      </button>
    </aside>
  );
}
