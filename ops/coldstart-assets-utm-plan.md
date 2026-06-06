# Cold-start Launch Assets and UTM Plan — pngtostl.net

## Launch positioning

One-line pitch:

> PNGtoSTL is a browser-based image-to-STL workspace for reliefs, logo badges, lithophanes, and heightmap surfaces.

Do not overclaim:

- Do not say it reconstructs a full 3D object from one photo.
- Do not say STL preserves image color.
- Do not say every output is printer-ready without slicer inspection.

## Screenshots to prepare

- Homepage upload-first hero.
- `/image-to-stl` workspace before upload.
- `/image-to-stl` after successful STL generation with metrics.
- `/samples` workflow examples.
- A generated STL preview / downloaded file evidence.

## UTM conventions

Use canonical base URLs only:

- `https://pngtostl.net/?utm_source=directory&utm_medium=listing&utm_campaign=launch_v1`
- `https://pngtostl.net/image-to-stl?utm_source=reddit&utm_medium=community&utm_campaign=launch_v1`
- `https://pngtostl.net/samples?utm_source=maker_forum&utm_medium=post&utm_campaign=launch_v1`

Fields:

- `utm_source`: directory, reddit, hn, x, maker_forum, newsletter, backlink_partner.
- `utm_medium`: listing, community, post, social, referral.
- `utm_campaign`: launch_v1, sample_gallery, lithophane_push, logo_badge_push.

## Safe launch channels

Priority 1:

- Maker / 3D printing directories that accept tools.
- Personal X post with demo screenshot.
- Indie maker communities where tool demos are welcome.

Priority 2:

- Reddit only when the post is useful and non-spammy.
- Hacker News Show HN only after the tool has stable HTTP->HTTPS canonicalization and screenshots.

## Launch copy template

Title:

> I built a browser-based Image to STL workspace for reliefs, logos, lithophanes, and heightmaps

Body:

> Upload an image, choose the workflow, generate an STL, inspect mesh metrics, and download. It is meant for practical relief/lithophane-style outputs, not full 3D reconstruction from one photo.

CTA:

> Try it: https://pngtostl.net/image-to-stl

## Launch gates

- [ ] P1 lint fixed.
- [ ] HTTP apex redirects to HTTPS apex.
- [ ] Core browser conversion test passes on production.
- [ ] GSC/Bing submitted or scheduled.
- [ ] Analytics provider connected or Cloudflare Web Analytics enabled.
