# cytara-ai.github.io

Static export of the Cytara website (originally built and hosted on Framer), served by GitHub Pages at https://cytara.ai.

The files in the repo root are generated. Don't hand-edit them; change the site in Framer and re-export.

## Re-exporting from Framer

Requires Node 20+.

```bash
.github/framer-export/rebuild.sh https://<project>.framer.website
```

Pass the Framer project's free `*.framer.website` URL (Framer → Site Settings → Domains). `https://cytara.ai` serves this repo, so the script refuses it. The script rewrites links to the Framer URL back to `https://cytara.ai`.

If you only changed the post-processing (for example the form endpoint), re-apply it to the committed files without exporting again:

```bash
.github/framer-export/rebuild.sh --local
```

What the script does:

1. Runs [framer-to-static](https://github.com/haroonjamil/framer-to-static), pinned to a known commit, in `--static` mode. It downloads every page, JS module, image, font and CMS chunk into `_deps/` and rewrites the URLs.
2. Runs `postprocess.mjs`, which:
   - flattens `about/index.html` to `about.html`, so GitHub Pages serves `/about` without a redirect;
   - makes `og:image`, `twitter:image` and JSON-LD image URLs absolute, so link previews work;
   - adds a script to `404.html` that sends `/about/` to `/about`, the way Framer's 308 redirect did;
   - points the contact form at Basin (`FORM_ENDPOINTS`) and patches Framer's submit code to send a plain POST;
   - adds a guard against accidental submits. In the Framer design, the Message box sits inside the Send button, so clicking it or typing a space would send a half-written message. Remove the guard once the box is moved out of the button in Framer.

Afterwards, review the result with `git diff --stat`, check it locally with `npx serve .`, then commit and push.

## Files kept between re-exports

The re-export leaves these files alone:

- `CNAME`: the custom domain.
- `.nojekyll`: stops Jekyll, which would otherwise drop the `_deps/` folder.
- `llms.txt`: maintained by hand. Framer served it as an HTML page; here it is the plain-text markdown it should be. Update it when the site copy changes.

## Known differences from Framer hosting

- **Contact form:** submissions go to Basin (`https://usebasin.com/f/8eb9901cfc62`), not Framer. Framer's server-side spam check is gone. Bots that fill the hidden honeypot fields are dropped in the browser; anything else relies on Basin's spam filtering.
- **Redirects:** GitHub Pages can't send HTTP redirects. `/about/` now returns a 404 status and then redirects in the browser, where Framer returned a 308. `/about.html` returns 200; canonical tags keep these duplicate URLs out of search results.
- **Analytics:** Framer's own analytics and editor bar are removed. Google Analytics (`G-QVL3P58KRR`) still runs.
