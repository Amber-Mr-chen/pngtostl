# PNGtoSTL Cold-start Submission Log

Use this file to record every directory, community, newsletter, profile, or backlink attempt. Do not mark anything as submitted unless there is visible confirmation or a saved listing URL.

## Status labels

- `planned`: candidate selected, not attempted yet.
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

No candidate below has been submitted yet. Status means recommended next handling, not execution result.

#### Best first batch after owner approval

- Channel: Dev Hunt
  - Type: directory
  - Candidate URL: `https://devhunt.org/submit`
  - Target URL: `https://pngtostl.net/?utm_source=devhunt&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_form`
  - Suggested content: Use directory title option 2 and the short directory description from `ops/coldstart-assets-utm-plan.md`.
  - Status: planned
  - Evidence: HTTP 200; title contained Dev Hunt submit/profile page; script saw `submit` signal.
  - Notes: Good early dev-tool directory candidate. Verify category fit and login state in browser before submitting.

- Channel: Launching Next
  - Type: directory
  - Candidate URL: `https://www.launchingnext.com/submit/`
  - Target URL: `https://pngtostl.net/?utm_source=launchingnext&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_form`
  - Suggested content: Use directory title option 1 and long directory description.
  - Status: planned
  - Evidence: HTTP 200; page title `Submit Your Project | Launching Next`; script saw `submit`, `launch`, and `free` signals.
  - Notes: Good free startup/tool listing candidate. Check whether approval queue or email confirmation is required.

- Channel: MicroLaunch
  - Type: directory
  - Candidate URL: `https://microlaunch.net/`
  - Target URL: `https://pngtostl.net/samples?utm_source=microlaunch&utm_medium=listing&utm_campaign=sample_gallery&utm_content=launch_listing`
  - Suggested content: Lead with real downloadable STL examples and honest 2D-to-relief limits.
  - Status: planned
  - Evidence: HTTP 200; page title `World-class Tech Products on Microlaunch`; script saw `launch`, `add your`, and `free` signals.
  - Notes: Good candidate if a free product launch route is visible in browser. Owner/account approval required before launch.

- Channel: Insidr AI
  - Type: directory
  - Candidate URL: `https://www.insidr.ai/submit-tool`
  - Target URL: `https://pngtostl.net/?utm_source=insidr_ai&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - Suggested content: Use short pitch; emphasize maker/3D-printing use case to avoid generic AI-tool framing.
  - Status: planned
  - Evidence: HTTP 200; redirected to `/submit-tools/`; page title `Submit AI Tools - Insidr.ai`; script saw `submit` and `free` signals.
  - Notes: Medium relevance because it is AI-tool oriented, not 3D-printing-specific. Submit only if category fit is clear.

- Channel: Hackaday Submit A Tip
  - Type: newsletter
  - Candidate URL: `https://hackaday.com/submit-a-tip/`
  - Target URL: `https://pngtostl.net/samples?utm_source=hackaday&utm_medium=newsletter&utm_campaign=sample_gallery&utm_content=submit_a_tip`
  - Suggested content: Pitch as a maker utility with real STL examples; ask for feedback rather than coverage.
  - Status: planned
  - Evidence: HTTP 200; title `Submit A Tip | Hackaday`; script saw `submit`, `login`, `contact`, and `tip` signals.
  - Notes: High audience relevance, but editorial/newsletter route. Do not submit unless screenshots and owner approval are ready.

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
  - Status: needs_approval
  - Evidence: HTTP 200; script saw `paid`, `sponsor`, `contact`, and `free` signals.
  - Notes: Mixed free/paid signals. Needs owner approval if payment, sponsorship, or sale-listing angle appears.

#### Browser-check candidates blocked to scripts

- Channel: AlternativeTo
  - Type: directory
  - Candidate URL: `https://alternativeto.net/software/new/`
  - Target URL: `https://pngtostl.net/?utm_source=alternativeto&utm_medium=listing&utm_campaign=launch_v1&utm_content=software_new`
  - Suggested content: Position against image-to-STL / lithophane generator alternatives if browser route works.
  - Status: manual_required
  - Evidence: Script received HTTP 403.
  - Notes: Verify in visible browser before marking unreachable. Do not bypass anti-bot/security checks.

- Channel: SaaSHub
  - Type: directory
  - Candidate URL: `https://www.saashub.com/add`
  - Target URL: `https://pngtostl.net/?utm_source=saashub&utm_medium=listing&utm_campaign=launch_v1&utm_content=add_product`
  - Suggested content: Use short pitch if browser route offers a free add-product flow.
  - Status: manual_required
  - Evidence: Script received HTTP 403.
  - Notes: Browser check required; skip if paid, CAPTCHA-blocked, or reciprocal requirements appear.

- Channel: There Is An AI For That
  - Type: directory
  - Candidate URL: `https://theresanaiforthat.com/submit/`
  - Target URL: `https://pngtostl.net/?utm_source=tiaft&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool`
  - Suggested content: Use only if category fit is not misleading; emphasize image-to-STL utility.
  - Status: manual_required
  - Evidence: Script received HTTP 403.
  - Notes: Browser check required; likely high-noise AI directory, not first priority.

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
  - Suggested content: Only consider a PR if contribution rules allow online tools and PNGtoSTL fits an existing category.
  - Status: manual_required
  - Evidence: HTTP 200; title indicates curated 3D printing resources; script saw `submit`, `sign in`, `captcha`, `pricing`, `sponsor`, `contact`, and `tip` signals from GitHub page chrome.
  - Notes: Requires repository rule review and GitHub PR. Do not add if list is inactive or category fit is weak.

- Channel: 3D Printing Stack Exchange
  - Type: community
  - Candidate URL: `https://3dprinting.stackexchange.com/`
  - Target URL: `https://pngtostl.net/image-to-stl?utm_source=stackexchange_3dprinting&utm_medium=community&utm_campaign=launch_v1&utm_content=profile_or_answer_reference`
  - Suggested content: Only answer relevant questions with transparent disclosure; no promotional posting.
  - Status: manual_required
  - Evidence: Script received HTTP 403.
  - Notes: Use only for genuine answers. Profile website field may be safer than answer-body links.

## Submission records

_No submissions executed in this document-setup pass._
