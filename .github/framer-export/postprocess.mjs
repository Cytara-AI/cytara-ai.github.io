// Post-processes a framer-to-static export (dist/) into a GitHub Pages-ready site root.
// Usage: node postprocess.mjs <dist-dir> <site-root> <origin, e.g. https://cytara.ai>
import fs from 'node:fs';
import path from 'node:path';

const [, , distDir, siteRoot, origin] = process.argv;
if (!distDir || !siteRoot || !origin) {
  console.error('usage: node postprocess.mjs <dist-dir> <site-root> <origin>');
  process.exit(1);
}

// Files that live in the repo and must survive a re-export.
const KEEP = new Set(['.git', '.github', '.gitignore', '.nojekyll', 'CNAME', 'README.md', 'llms.txt']);

// 1. Clear the previous export from the site root.
for (const name of fs.readdirSync(siteRoot)) {
  if (!KEEP.has(name)) fs.rmSync(path.join(siteRoot, name), { recursive: true, force: true });
}

// 2. Copy the new export in, skipping Apache/nginx configs that GitHub Pages ignores.
for (const name of fs.readdirSync(distDir)) {
  if (['.htaccess', 'nginx.conf.example'].includes(name) || KEEP.has(name)) continue;
  fs.cpSync(path.join(distDir, name), path.join(siteRoot, name), { recursive: true });
}

// 3. Flatten <route>/index.html -> <route>.html. GitHub Pages serves /about from about.html
//    with no redirect; an about/ directory would 301 /about -> /about/ instead.
const routes = [];
for (const name of fs.readdirSync(siteRoot)) {
  const dir = path.join(siteRoot, name);
  if (name.startsWith('_') || name.startsWith('.') || !fs.statSync(dir).isDirectory()) continue;
  const index = path.join(dir, 'index.html');
  if (!fs.existsSync(index)) continue;
  if (fs.readdirSync(dir).length !== 1) throw new Error(`${name}/ has nested routes; extend the flattening logic`);
  fs.renameSync(index, path.join(siteRoot, `${name}.html`));
  fs.rmdirSync(dir);
}
// Routes = flattened pages (also covers re-running on an already-flattened tree) + text files.
for (const f of fs.readdirSync(siteRoot)) {
  if (f.endsWith('.html') && !['index.html', '404.html'].includes(f)) routes.push(`/${f.slice(0, -5)}`);
}
for (const f of ['llms.txt', 'robots.txt', 'sitemap.xml']) if (fs.existsSync(path.join(siteRoot, f))) routes.push(`/${f}`);

// 4. Social-preview and structured-data image URLs must be absolute for crawlers.
const htmlFiles = fs.readdirSync(siteRoot).filter((f) => f.endsWith('.html'));
for (const f of htmlFiles) {
  const file = path.join(siteRoot, f);
  let html = fs.readFileSync(file, 'utf8');
  html = html
    .replace(/(<meta (?:property|name)="(?:og|twitter):image(?::url)?" content=")\/(?!\/)/g, `$1${origin}/`)
    .replace(/("(?:logo|image|thumbnailUrl|contentUrl)":\s*")\/(?!\/)/g, `$1${origin}/`);
  fs.writeFileSync(file, html);
}

// 5. Framer answers /about/ with a 308 to /about. GitHub Pages can't redirect, so the
//    404 page bounces known routes to their slash-less form before Framer boots.
const notFound = path.join(siteRoot, '404.html');
if (fs.existsSync(notFound)) {
  const redirect = `<script data-export="slash-redirect">(function(){var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==='/'){var t=p.replace(/\\/+$/,'');if(${JSON.stringify(routes)}.indexOf(t)!==-1)location.replace(t+location.search+location.hash);}})();</script>`;
  const html = fs.readFileSync(notFound, 'utf8').replace(/\n?\t?<script(?: data-export="slash-redirect")?>\(function\(\)\{var p=location\.pathname;.*?<\/script>/, '');
  fs.writeFileSync(notFound, html.replace(/<head>/, `<head>\n\t${redirect}`));
}

// 6. Framer forms post to api.framer.com, which only works while the Framer plan is active.
//    Point each form at our own backend and patch Framer's submit function so it sends a
//    plain multipart POST (no Framer-specific headers). A filled honeypot is treated as a bot: no request, fake success.
const FORM_ENDPOINTS = {
  // Contact form on /contact
  '743eebba-3012-499c-87c6-c7a6c3a139f5': 'https://usebasin.com/f/8eb9901cfc62',
};
const HONEYPOTS = ['website', 'company', 'message', 'subject', 'title', 'description', 'feedback', 'notes', 'details', 'remarks', 'comments'];
const basinSubmit = (url, data) =>
  `if(/^https:\\/\\/usebasin\\.com\\//.test(${url})){` +
  `const H=${JSON.stringify(HONEYPOTS)},B=new FormData;` +
  // Framer removes its honeypots from the FormData, so check the hidden inputs in the page too.
  `let bot=[...document.querySelectorAll('form input[aria-hidden="true"][tabindex="-1"]')].some(i=>H.includes(i.name)&&i.value);` +
  `for(const[k,v]of ${data}){if(H.includes(k)){if(v)bot=!0;continue}if(k.startsWith("__framer"))continue;B.append(k.toLowerCase()==="email"?"email":k,v)}` +
  `if(bot)return new Response(null,{status:200});` +
  `const s=await fetch(${url},{body:B,method:"POST",headers:{Accept:"application/json"}});` +
  `if(s.ok)return s;throw Error("Failed to submit form")}`;

const jsFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.m?js$/.test(e.name)) jsFiles.push(p);
  }
})(path.join(siteRoot, '_deps'));

let patchedSubmit = 0;
const SUBMIT_MARKER = 'if(/^https:\\/\\/usebasin\\.com\\//.test(';
for (const file of jsFiles) {
  let js = fs.readFileSync(file, 'utf8');
  const before = js;
  js = js.replace(/https:\/\/api\.framer\.com\/forms\/v1\/forms\/([0-9a-f-]+)\/submit/g, (m, id) => {
    if (!FORM_ENDPOINTS[id]) throw new Error(`Unmapped Framer form ${id} in ${file}; add it to FORM_ENDPOINTS`);
    return FORM_ENDPOINTS[id];
  });
  js = js.replace(
    /(async function \w+\((\w+),(\w+),\w+,\w+\)\{)(?=let \w+=await \w+\(\);if\(!\w+\)throw Error\(`Failed to calculate proof of work`\))/,
    (m, head, url, data) => { patchedSubmit++; return head + basinSubmit(url, data); },
  );
  if (js === before && js.includes(SUBMIT_MARKER)) patchedSubmit++; // already patched (re-run)
  if (js !== before) fs.writeFileSync(file, js);
}
if (patchedSubmit !== 1) throw new Error(`Expected to patch 1 Framer form submit function, patched ${patchedSubmit}`);

// 7. In the Framer design the contact form's Message textarea sits inside the Send <button>,
//    so a click or Space keypress in the textarea activates the button and submits a half-typed
//    message. Block submits whose triggering event came from a field nested inside the submitter.
//    Remove this once the field is moved out of the button in Framer.
const submitGuard =
  // Blocks when focus is in a field inside the submit button and the "click" was either on that
  // field (mouse) or synthesized by the keyboard (detail 0, e.g. Space in the textarea).
  // (Target is copied at dispatch time: after dispatch Chrome reports a textarea's inner UA div.)
  `<script data-export="submit-guard">(function(){var c=null,F='textarea,input,select';window.addEventListener('click',function(e){c={t:e.target,d:e.detail}},true);` +
  `window.addEventListener('submit',function(e){var s=e.submitter,a=document.activeElement;` +
  `if(!s||!a||a===s||!s.contains(a)||!a.matches(F)||!c)return;` +
  `if(c.d===0||(c.t.closest&&c.t.closest(F))){e.preventDefault();e.stopImmediatePropagation();}},true);})();</script>`;
for (const f of htmlFiles) {
  const file = path.join(siteRoot, f);
  const html = fs.readFileSync(file, 'utf8').replace(/\t?<script data-export="submit-guard">.*?<\/script>\n?/, '');
  fs.writeFileSync(file, html.replace(/<\/head>/, `\t${submitGuard}\n</head>`));
}

console.log(`routes: / ${routes.join(' ')}`);
