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
  routes.push(`/${name}`);
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
  const redirect = `<script>(function(){var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==='/'){var t=p.replace(/\\/+$/,'');if(${JSON.stringify(routes)}.indexOf(t)!==-1)location.replace(t+location.search+location.hash);}})();</script>`;
  const html = fs.readFileSync(notFound, 'utf8').replace(/<head>/, `<head>\n\t${redirect}`);
  fs.writeFileSync(notFound, html);
}

console.log(`routes: / ${routes.join(' ')}`);
