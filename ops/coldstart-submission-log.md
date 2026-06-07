# PNGtoSTL Cold-start Submission Log

Use this file to record every directory, community, newsletter, profile, or backlink attempt. Do not mark anything as submitted unless there is visible confirmation or a saved listing URL.

Related operational docs:

- `ops/first-batch-submission-field-pack.md`
- `ops/launch-media/README.md`
- `ops/manual-required-submission-playbook.md`
- `ops/second-batch-preflight-notes.md`
- `ops/github-awesome-3d-printing-pr-prep.md`

## Status labels

- `planned`: candidate selected, not attempted yet.
- `ready_to_submit`: preflight found a public/free route with no immediate login, CAPTCHA, payment, or reciprocal-link blocker; still requires owner approval before actual submission.
- `submitted`: form/post submitted and confirmation observed.
- `listed`: public listing is visible.
- `pending_review`: submitted but awaiting moderation/review.
- `manual_required`: login/CAPTCHA/account-owner action required.
- `needs_approval`: payment, reciprocal backlink, badge, or site modification requires owner approval.
- `blocked`: not usable due to rules, cost, spam risk, or technical block.
- `not_fit`: low relevance after review.

## Safety rules

- No public post, directory submission, Product Hunt, Show HN, or account action without owner approval.
- No CAPTCHA/security bypass.
- No fake reviews, fake votes, or undisclosed promotion.
- No reciprocal link/badge changes unless owner explicitly approves.
- For Reddit/blog comments, prefer no link in comment body; use website/profile field where allowed.
- Submit at most 3-5 candidates per day.

## Log template

```markdown
## YYYY-MM-DD

- Channel:
  - Type: directory | profile | resource_list | newsletter | reddit | hn | x | maker_forum | blog_comment
  - Candidate URL:
  - Target URL:
  - UTM URL:
  - Submitted content:
  - Status: planned | submitted | listed | pending_review | manual_required | needs_approval | blocked | not_fit
  - Evidence:
  - Next follow-up date:
  - Notes:
```

## Candidate queue

### First real candidate pool — reviewed 2026-06-07 15:36 CST

Some candidates below have since been attempted after owner approval. Treat each entry's `Status` and `Evidence` as authoritative, and use `ops/manual-required-submission-playbook.md` for the remaining owner/browser paths.

#### Best first batch after owner approval

- Channel: Dev Hunt
  - Type: directory
  - Candidate URL: `https://devhunt.org/submit` (legacy URL now returns 404); current visible entry is the header link `Submit your Dev Tool` on `https://devhunt.org/`.
  - Target URL: `https://pngtostl.net/?utm_source=devhunt&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_form`
  - Suggested content: Use directory title option 2 and the short directory description from `ops/coldstart-assets-utm-plan.md`.
  - Status: manual_required
  - Evidence: Browser preflight on 2026-06-07: `/submit` rendered a 404 page; clicking the visible `Submit your Dev Tool` nav entry opened a login page requiring GitHub or Google. Page says Dev Hunt uses GitHub/Google provider to filter bots and fakes.
  - Notes: Requires owner account/login before field-level preflight. Do not create/login an account or proceed automatically.

- Channel: Launching Next
  - Type: directory
  - Candidate URL: `https://www.launchingnext.com/submit/`
  - Target URL: `https://pngtostl.net/?utm_source=launchingnext&utm_campaign=launch_v1`
  - Suggested content: Use directory title option 1 and long directory description.
  - Status: pending_review
  - Evidence: Submitted on 2026-06-07 after owner approval. Free submission accepted into queue; confirmation page displayed `Status: In Queue (Estimated Wait: 4 Months)` and offered optional Fast-Track upgrade `$199$99` / `Proceed to Secure Checkout - $99`.
  - Notes: Used short UTM because Launching Next URL field has `maxlength=100`; did not select newsletter opt-in and did not click/accept any $99 fast-track checkout.

- Channel: MicroLaunch
  - Type: directory
  - Candidate URL: `https://microlaunch.net/`
  - Target URL: `https://pngtostl.net/samples?utm_source=microlaunch&utm_medium=listing&utm_campaign=sample_gallery&utm_content=launch_listing`
  - Suggested content: Lead with real downloadable STL examples and honest 2D-to-relief limits.
  - Status: manual_required
  - Evidence: Browser preflight on 2026-06-07: page title `Just a moment...`; Cloudflare security verification displayed with `Widget containing a Cloudflare security challenge` and Ray ID footer. No submission form inspected because the verification gate must not be bypassed.
  - Notes: Requires owner/visible-browser verification before checking whether a free launch route exists. Do not retry aggressively or bypass Cloudflare.

- Channel: Insidr AI
  - Type: directory
  - Candidate URL: `https://www.insidr.ai/submit-tool` (redirects to `https://www.insidr.ai/submit-tools/`).
  - Target URL: `https://pngtostl.net/?utm_source=insidr_ai&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - Suggested content: Use short pitch; emphasize maker/3D-printing use case to avoid generic AI-tool framing.
  - Status: manual_required
  - Evidence: Attempted on 2026-06-07 after owner approval. Public form accepted field values and `form.checkValidity()` returned true; clicked the real submit button twice, but page stayed on the form with no visible success, error, redirect, or alert. Fields remained populated.
  - Notes: Do not force a backend request. Needs visible-browser/manual follow-up or site contact if owner wants to pursue. Relevance remains medium because this is an AI-tool directory; keep copy focused on maker/3D-printing use cases and avoid overclaiming AI capability.

- Channel: Hackaday Submit A Tip
  - Type: newsletter
  - Candidate URL: `https://hackaday.com/submit-a-tip/`
  - Target URL: `https://pngtostl.net/samples?utm_source=hackaday&utm_medium=newsletter&utm_campaign=sample_gallery&utm_content=submit_a_tip`
  - Suggested content: Pitch as a maker utility with real STL examples; ask for feedback rather than coverage.
  - Status: pending_review
  - Evidence: Submitted on 2026-06-07 after owner approval. Browser render timed out, so the public Jetpack contact form was submitted via standard HTTP POST using the page's real hidden fields. Server returned HTTP 200 and final URL included `contact-form-id=2542&contact-form-sent=1116626`; response text included `Thank you for your response.`
  - Notes: Editorial tip only; no attachment upload, login, CAPTCHA handling, payment, reciprocal link, or coverage claim. Used `/samples` UTM proof URL and feedback-request framing.

#### Manual-required / account-gated candidates

- Channel: Product Hunt
  - Type: product_hunt
  - Candidate URL: `https://www.producthunt.com/posts/new`
  - Target URL: `https://pngtostl.net/?utm_source=producthunt&utm_medium=post&utm_campaign=launch_v1&utm_content=launch_page`
  - Suggested content: Use launch asset pack only after screenshots and owner account are ready.
  - Status: manual_required
  - Evidence: HTTP 200 redirected to login page; script saw `submit`, `sign in`, `login`, `captcha`, `advertise`, `contact`, and `tip` signals.
  - Notes: Defer until coordinated launch. Do not submit casually.

- Channel: Hacker News Submit / Show HN
  - Type: hn
  - Candidate URL: `https://news.ycombinator.com/submit`
  - Target URL: `https://pngtostl.net/image-to-stl?utm_source=hn&utm_medium=post&utm_campaign=launch_v1&utm_content=show_hn`
  - Suggested content: Show HN draft should focus on practical browser image-to-STL workflows and honest limits.
  - Status: manual_required
  - Evidence: HTTP 200; script saw `submit` and `login` signals.
  - Notes: Owner/account approval required. Better after screenshots and at least a few real usage signals.

- Channel: BetaList
  - Type: directory
  - Candidate URL: `https://betalist.com/submit`
  - Target URL: `https://pngtostl.net/?utm_source=betalist&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_form`
  - Suggested content: Use startup-style short description if owner wants early-adopter listing.
  - Status: manual_required
  - Evidence: HTTP 200 redirected to sign-in; title `Discover and get early access to tomorrow's startups | BetaList`; script saw `submit`, `sign in`, and `advertise` signals.
  - Notes: Account-gated and possibly startup-audience mismatch. Lower priority than maker/dev channels.

- Channel: StartupBase
  - Type: directory
  - Candidate URL: `https://startupbase.io/submit`
  - Target URL: `https://pngtostl.net/?utm_source=startupbase&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_form`
  - Suggested content: Use one-line pitch and short directory description.
  - Status: manual_required
  - Evidence: HTTP 200 redirected to login with origin `/submit`; script saw `submit` and `sign in` signals.
  - Notes: Account-gated. Check free listing rules in browser before considering.

- Channel: Fazier
  - Type: directory
  - Candidate URL: `https://fazier.com/launch`
  - Target URL: `https://pngtostl.net/?utm_source=fazier&utm_medium=listing&utm_campaign=launch_v1&utm_content=launch_form`
  - Suggested content: Use short pitch and samples URL as proof if allowed.
  - Status: manual_required
  - Evidence: HTTP 200; title `Fazier – Find your next favourite product, every day.`; script saw `launch`, `sign in`, and `advertise` signals.
  - Notes: Account/launch-flow likely required. Verify whether free launch is available before filling anything.

#### Needs approval / likely paid or high-visibility

- Channel: Futurepedia
  - Type: directory
  - Candidate URL: `https://www.futurepedia.io/submit-tool`
  - Target URL: `https://pngtostl.net/?utm_source=futurepedia&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - Suggested content: Only if owner approves AI-directory exposure and any paid review terms.
  - Status: needs_approval
  - Evidence: HTTP 200; title `Submit Your Company, Software or AI Tool to Futurepedia`; script saw `submit`, `login`, `pricing`, `paid`, `sponsor`, `advertise`, and `contact` signals.
  - Notes: Paid/sponsored signals present. Do not proceed without owner approving cost/terms.

- Channel: Future Tools
  - Type: directory
  - Candidate URL: `https://www.futuretools.io/submit-a-tool`
  - Target URL: `https://pngtostl.net/?utm_source=futuretools&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - Suggested content: Use AI/tool framing only if a relevant category exists.
  - Status: needs_approval
  - Evidence: HTTP 200 redirected to `https://futuretools.io/submit-a-tool`; script saw `submit`, `captcha`, `pricing`, and `paid` signals.
  - Notes: CAPTCHA/paid signals. Owner/browser approval required; skip for free first batch.

- Channel: SideProjectors
  - Type: directory
  - Candidate URL: `https://www.sideprojectors.com/project/new`
  - Target URL: `https://pngtostl.net/?utm_source=sideprojectors&utm_medium=listing&utm_campaign=launch_v1&utm_content=project_new`
  - Suggested content: Use startup/tool listing copy only if free listing is confirmed.
  - Status: manual_required
  - Evidence: Second-batch browser preflight on 2026-06-07: page loaded, `+ SUBMIT A PROJECT` routed to `Login to SideProjectors`; login options included Google, GitHub, GitLab, ProductHunt, LinkedIn, and email/password. No product form was available without login. HTTP preflight saw mixed `paid`/`sponsor`/`free` signals but no form.
  - Notes: Owner/account action required before field-level check. After login, stop if project submission is paid, sponsored-only, sale/marketplace-oriented, or requires reciprocal link/site modification.

#### Browser-check candidates blocked to scripts

- Channel: AlternativeTo
  - Type: directory
  - Candidate URL: `https://alternativeto.net/software/new/`
  - Target URL: `https://pngtostl.net/?utm_source=alternativeto&utm_medium=listing&utm_campaign=launch_v1&utm_content=software_new`
  - Suggested content: Position against image-to-STL / lithophane generator alternatives if browser route works.
  - Status: manual_required
  - Evidence: Second-batch HTTP preflight on 2026-06-07 returned HTTP 403 with title `Just a moment...` and Cloudflare signal. Earlier script also received HTTP 403.
  - Notes: Requires owner/visible-browser security verification before any form check. Do not bypass anti-bot/security checks; stop if login, paid listing, reciprocal link, or misleading category appears.

- Channel: SaaSHub
  - Type: directory
  - Candidate URL: `https://www.saashub.com/add`
  - Target URL: `https://pngtostl.net/?utm_source=saashub&utm_medium=listing&utm_campaign=launch_v1&utm_content=add_product`
  - Suggested content: Use short pitch if browser route offers a free add-product flow.
  - Status: manual_required
  - Evidence: Second-batch HTTP preflight on 2026-06-07 returned HTTP 403 with title `Attention Required! | Cloudflare`; signals included `captcha`, `cloudflare`, and `submit`. Earlier script also received HTTP 403.
  - Notes: Requires owner/visible-browser security verification before any form check. Skip if paid, CAPTCHA-blocked, login-only, or reciprocal requirements appear.

- Channel: There Is An AI For That
  - Type: directory
  - Candidate URL: `https://theresanaiforthat.com/submit/`
  - Target URL: `https://pngtostl.net/?utm_source=tiaft&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - Suggested content: Use only if category fit is not misleading; emphasize image-to-STL utility.
  - Status: manual_required
  - Evidence: Second-batch HTTP preflight on 2026-06-07 returned HTTP 403 with title `Just a moment...`; signals included `cloudflare` and `submit`. Earlier script also received HTTP 403.
  - Notes: Requires owner/visible-browser security verification before any form check. Likely high-noise AI directory; proceed only if a truthful design/maker/tool category exists and no paid/login/CAPTCHA requirement remains.

#### Community / resource-list candidates for later

- Channel: Reddit r/3Dprinting
  - Type: reddit
  - Candidate URL: `https://www.reddit.com/r/3Dprinting/`
  - Target URL: `https://pngtostl.net/image-to-stl?utm_source=reddit_3dprinting&utm_medium=community&utm_campaign=launch_v1&utm_content=website_field`
  - Suggested content: Use Reddit-safe non-link comment pattern only on relevant threads.
  - Status: manual_required
  - Evidence: Script received HTTP 403 blocked.
  - Notes: Do not post promotional link. Use only with owner account, subreddit-rule check, and a relevant user question.

- Channel: Reddit r/Lithophanes
  - Type: reddit
  - Candidate URL: `https://www.reddit.com/r/Lithophanes/`
  - Target URL: `https://pngtostl.net/lithophane-generator?utm_source=reddit_lithophanes&utm_medium=community&utm_campaign=lithophane_push&utm_content=website_field`
  - Suggested content: Discuss lithophane settings and slicer inspection; avoid link in comment body unless explicitly allowed.
  - Status: manual_required
  - Evidence: Script received HTTP 403 blocked.
  - Notes: High relevance but community-sensitive. Website/profile field preferred.

- Channel: GitHub awesome-3d-printing
  - Type: resource_list
  - Candidate URL: `https://github.com/ad-si/awesome-3d-printing`
  - Target URL: `https://pngtostl.net/samples?utm_source=github_awesome_3d_printing&utm_medium=referral&utm_campaign=sample_gallery&utm_content=resource_list_pr`
  - Suggested content: Candidate entry under `Online Tools`: `[PNGtoSTL](https://pngtostl.net/samples?utm_source=github_awesome_3d_printing&utm_medium=referral&utm_campaign=sample_gallery&utm_content=resource_list_pr) - Browser-based image-to-STL workspace for reliefs, lithophanes, logo badges, and heightmap surfaces, with real downloadable STL examples.`
  - Status: pending_review
  - Evidence: Second-batch preflight on 2026-06-07: browser page loaded and repo is active; latest visible commit was `Add Gridfinity Layout Tool to Online Tools (#89)` from 5 days ago. Raw README has an `Online Tools` section. Raw `contributing.md` says PRs are welcome if the resource is useful, not duplicate, one suggestion per PR, title-cased, and formatted as `[Resource Name](link) - Description text.` Final owner-approved execution on 2026-06-07 rechecked upstream README/issues/PRs with no duplicates; fork branch `Amber-Mr-chen:add-pngtostl-online-tool` was pushed with commit `f062beb Add PNGtoSTL to Online Tools`; compare page showed `Able to merge`. Owner manually opened PR #92. `gh pr view` verified state `OPEN`, mergeable `MERGEABLE`, base `main`, head `add-pngtostl-online-tool`, title `Add PNGtoSTL to Online Tools`.
  - Notes: PR URL: `https://github.com/ad-si/awesome-3d-printing/pull/92`. Follow up for maintainer review/merge; do not comment or push extra commits unless a maintainer requests changes.

- Channel: 3D Printing Stack Exchange
  - Type: community
  - Candidate URL: `https://3dprinting.stackexchange.com/`
  - Target URL: `https://pngtostl.net/image-to-stl?utm_source=stackexchange_3dprinting&utm_medium=community&utm_campaign=launch_v1&utm_content=profile_or_answer_reference`
  - Suggested content: Only answer relevant questions with transparent disclosure; no promotional posting.
  - Status: manual_required
  - Evidence: Script received HTTP 403.
  - Notes: Use only for genuine answers. Profile website field may be safer than answer-body links.

## Submission records

## 2026-06-07

- Channel: Launching Next
  - Type: directory
  - Candidate URL: `https://www.launchingnext.com/submit/`
  - Target URL: `https://pngtostl.net/?utm_source=launchingnext&utm_campaign=launch_v1`
  - UTM URL: `https://pngtostl.net/?utm_source=launchingnext&utm_campaign=launch_v1`
  - Submitted content: `PNGtoSTL`; headline `Image to STL converter for makers`; description focused on practical image-to-STL, reliefs, logo badges, lithophanes, heightmap surfaces, real examples, and honest non-full-3D-reconstruction limits.
  - Status: pending_review
  - Evidence: Free submission accepted into queue. Confirmation page showed `Status: In Queue (Estimated Wait: 4 Months)` plus optional Fast-Track upgrade `$199$99`, `Upgrade to Fast-Track - $99`, and `Proceed to Secure Checkout - $99`; no paid option was clicked.
  - Next follow-up date: 2026-06-14
  - Notes: URL field had `maxlength=100`, so short UTM was used. Newsletter opt-in was unchecked. Startup type set to bootstrapped startup; marketing budget set to `$0`; quick check answered `5`.

- Channel: Insidr AI
  - Type: directory
  - Candidate URL: `https://www.insidr.ai/submit-tool` / `https://www.insidr.ai/submit-tools/`
  - Target URL: `https://pngtostl.net/?utm_source=insidr_ai&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - UTM URL: `https://pngtostl.net/?utm_source=insidr_ai&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - Submitted content: Prepared and filled message for `PNGtoSTL — Image to STL converter for 3D printing workflows`, plus link and tags `Image Tools, 3D Printing, Design Tools, Maker Tools`.
  - Status: manual_required
  - Evidence: Public form accepted values and passed browser form validity; two clicks on the real submit button produced no visible success, error, redirect, or alert, and fields stayed populated.
  - Next follow-up date: 2026-06-14
  - Notes: Not marked submitted because no confirmation was observed. Do not force backend request; retry only in visible browser/manual flow or contact Insidr AI directly.

- Channel: Hackaday Submit A Tip
  - Type: newsletter
  - Candidate URL: `https://hackaday.com/submit-a-tip/`
  - Target URL: `https://pngtostl.net/samples?utm_source=hackaday&utm_medium=newsletter&utm_campaign=sample_gallery&utm_content=submit_a_tip`
  - UTM URL: `https://pngtostl.net/samples?utm_source=hackaday&utm_medium=newsletter&utm_campaign=sample_gallery&utm_content=submit_a_tip`
  - Submitted content: Subject `Browser-based image-to-STL workflow with real downloadable 3D printing examples`; body framed PNGtoSTL as a practical maker utility and asked for feedback on examples/settings, without claiming expected coverage.
  - Status: pending_review
  - Evidence: HTTP POST to the public Jetpack contact form returned 200; final URL included `contact-form-id=2542&contact-form-sent=1116626&contact-form-hash=380eee749dc8097bb2079b2bd11d9b24e9ff6474`; response text included `Thank you for your response.` Evidence snippet saved at `ops/hackaday-submit-response-snippet.txt`.
  - Next follow-up date: 2026-06-14
  - Notes: Browser rendering timed out, matching preflight behavior, but no CAPTCHA/payment/login/reciprocal requirement was present in the public form. No files were uploaded.
