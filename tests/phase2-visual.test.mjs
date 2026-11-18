import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Phase 2 of the visual redesign (18/11/2026): the palette "Tinta e selo" on the whole site, no circuit anywhere.
const read = name => readFile(new URL(`../${name}`, import.meta.url), 'utf8');

async function withApp(run) {
  const renderer = await createServer({
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { App } = await renderer.ssrLoadModule('/src/App.jsx');
    const render = pathname => renderToStaticMarkup(createElement(App, { pathname }));
    return await run({ render, renderer });
  } finally {
    await renderer.close();
  }
}

// Every route the React app renders (home pages included), taken from the content modules.
async function allPaths(renderer) {
  const { LEGAL_PATHS } = await renderer.ssrLoadModule('/src/legal-content.mjs');
  const { DE_ROLE_PAGES } = await renderer.ssrLoadModule('/src/de-role-content.mjs');
  const { RECARGA_PAGES } = await renderer.ssrLoadModule('/src/recarga-content.mjs');
  return [
    '/', '/en/', '/criacao-de-sites/', '/criacao-de-landing-pages/', '/en/website-development/', '/en/landing-pages/', '/projetos/', '/en/projects/',
    '/projetos/infinity-car-studio/', '/projetos/lalelis/', '/projetos/afeto-nobre/', '/projetos/bolachinhas-da-vovo-juju/', '/projetos/respeitavel-feijuca/',
    '/en/projects/infinity-car-studio/', '/en/projects/respeitavel-feijuca/',
    ...Object.values(LEGAL_PATHS).flatMap(paths => [paths.pt, paths.en]),
    ...Object.values(DE_ROLE_PAGES).map(page => page.path), ...Object.values(RECARGA_PAGES).map(page => page.path),
    '/nao-existe/', '/en/nao-existe/',
  ];
}

test('no circuit background, pulse or sweep is left: files, styles, scripts and every rendered page', async () => {
  for (const gone of ['src/circuit-motion.mjs', 'tests/circuit-motion.test.mjs', 'public/assets/circuit-network.png', 'public/assets/circuit-network.webp']) {
    assert.ok(!existsSync(new URL(`../${gone}`, import.meta.url)), `${gone} was removed`);
  }
  const css = (await read('src/site.css')).replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /circuit|\.pulse|hero__bg|hero__glow|\.trace\b|\.node\{|tt-pulse|circuit-network/i, 'the stylesheet carries no circuit');
  for (const file of ['src/ui.jsx', 'src/App.jsx', 'src/Layout.jsx', 'src/pages/ServicePages.jsx', 'src/pages/PortfolioPages.jsx', 'src/pages/DocumentPages.jsx', 'src/pages/HomePage.jsx']) {
    assert.doesNotMatch(await read(file), /Circuits|circuit-network|circuit-visual|createCircuitMotion|className="pulse|className="trace/, file);
  }
  await withApp(async ({ render, renderer }) => {
    const paths = await allPaths(renderer);
    assert.ok(paths.length >= 25, 'a representative set of routes');
    for (const path of paths) assert.doesNotMatch(render(path), /circuit|hero__bg|hero__glow|class="pulse|class="trace"|circuit-network/i, path);
  });
});

test('paper reading everywhere: navy only in the hero and the final call, header and footer', async () => {
  await withApp(async ({ render }) => {
    const pages = ['/criacao-de-sites/', '/criacao-de-landing-pages/', '/en/website-development/', '/en/landing-pages/', '/projetos/', '/en/projects/', '/projetos/lalelis/', '/en/projects/respeitavel-feijuca/', '/privacidade/', '/en/privacy/', '/nao-existe/'];
    for (const path of pages) {
      const main = render(path).match(/<main\b[\s\S]*?<\/main>/)?.[0];
      if (!main) continue;
      const sections = [...main.matchAll(/<(?:section|div) class="([^"]*)"/g)].map(match => match[1].split(/\s+/));
      for (const classes of sections.filter(list => list.includes('dark'))) {
        assert.ok(classes.some(name => ['hero', 'cta-final', 'doc-hero'].includes(name)), `${path}: a navy section other than the opening or the final call: ${classes.join(' ')}`);
      }
      assert.ok(sections.some(list => list.includes('light')) || path === '/nao-existe/', `${path}: has paper sections`);
    }
    // The commercial pages open on navy and close on navy; the 404 is a paper page between the header and the footer.
    for (const path of ['/criacao-de-sites/', '/criacao-de-landing-pages/', '/projetos/', '/projetos/lalelis/']) {
      const main = render(path).match(/<main\b[\s\S]*?<\/main>/)[0];
      assert.match(main, /^<main[^>]*><section id="home" class="hero hero--page dark"/, `${path}: navy opening`);
      assert.match(main, /<section class="cta-final dark"[\s\S]*<\/section><\/main>$/, `${path}: navy final call last`);
    }
    assert.match(render('/nao-existe/'), /<section class="doc-hero light not-found">/);
  });
});

test('client material keeps its identity: the device frames and captures are untouched by the palette', async () => {
  const css = await read('src/site.css');
  // The frames show the clients' own sites; the Tetelestai palette only changes their shadow on paper.
  assert.match(css, /\.light \.browser\{box-shadow:/);
  assert.match(css, /\.browser\{border-radius:var\(--radius\);background:#06182A/);
  assert.doesNotMatch(css, /\.shot__poster\{[^}]*(filter|mix-blend|opacity)/);
  await withApp(({ render }) => {
    const html = render('/projetos/respeitavel-feijuca/');
    assert.match(html, /class="shot__poster"/);
    assert.match(html, /\/assets\/portfolio\//);
  });
});

// --- WCAG 2 contrast, computed from the tokens the stylesheet declares ---
const hex = value => [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16));
const linear = channel => { const s = channel / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const luminance = value => { const [r, g, b] = hex(value).map(linear); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const mix = (fg, bg, alpha) => `#${hex(fg).map((channel, i) => Math.round(channel * alpha + hex(bg)[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('')}`;

test('every color pair of the paper pages passes WCAG AA, and cyan is never text on paper', async () => {
  const css = await read('src/site.css');
  const token = name => css.match(new RegExp(`--${name}:(#[0-9A-Fa-f]{6})`))[1].toUpperCase();
  const [navy, paper, paper2, ink, inkMuted, petrol, cyan, cyan2, muted] = ['navy', 'paper', 'paper-2', 'ink', 'ink-muted', 'petrol', 'cyan', 'cyan-2', 'muted'].map(token);
  assert.deepEqual([navy, paper, paper2, ink, inkMuted, petrol, cyan, muted], ['#000C19', '#F7F6F5', '#ECEAE7', '#000C19', '#4B5560', '#0A6373', '#0ED0E6', '#B2B5B7']);
  const white = '#FFFFFF', tint = '#F1F6F7';
  const badge = background => mix(petrol, background, 0.12);
  const text = [ // ordinary text: 4.5:1
    ['ink on paper', ink, paper], ['ink on paper-2', ink, paper2], ['ink on white card', ink, white], ['ink on step tint', ink, tint],
    ['support on paper', inkMuted, paper], ['support on paper-2', inkMuted, paper2], ['support on white card', inkMuted, white], ['support on step tint', inkMuted, tint],
    ['link and details (petrol) on paper', petrol, paper], ['petrol on paper-2', petrol, paper2], ['petrol on white card', petrol, white], ['petrol on step tint', petrol, tint],
    ['badge on white', petrol, badge(white)], ['badge on paper', petrol, badge(paper)], ['badge on paper-2', petrol, badge(paper2)],
    ['paper on the ink button', paper, ink], ['white on the petrol hover button', white, petrol],
    ['text on navy', paper, navy], ['support on navy', muted, navy], ['cyan link on navy', cyan, navy], ['navy on the cyan button', navy, cyan], ['navy on the cyan hover button', navy, cyan2],
    ['support on the facts panel', muted, '#08131F'], ['support on the facts panel hover', muted, mix(paper, '#08131F', 0.07)],
    ['price note: support on its paper', inkMuted, paper],
  ];
  for (const [name, foreground, background] of text) assert.ok(ratio(foreground, background) >= 4.5, `${name}: ${ratio(foreground, background).toFixed(2)}:1`);
  assert.ok(ratio(cyan, paper) < 2, 'cyan on paper is 1.74:1 and must not be used as text there');
  // Over paper, links, details, focus ring and outlines come from the context tokens, never from cyan.
  const lightRules = css.replace(/\/\*[\s\S]*?\*\//g, '').split('}').map(chunk => chunk.split('{').slice(-2)).filter(([selector, body]) => body !== undefined && /\.light/.test(selector)).map(([selector, body]) => [selector.trim(), body]);
  assert.ok(lightRules.length >= 8);
  for (const [selector, body] of lightRules) assert.doesNotMatch(body, /cyan|0ED0E6|14,208,230/i, `cyan inside a paper rule: ${selector}`);
  assert.match(css, /\.light\{--link:var\(--petrol\);--detail:var\(--petrol\);--fg:var\(--ink\);--fg-2:var\(--ink-muted\);--card-bg:#fff/);
  assert.match(css, /\.site-shell :focus-visible\{outline-color:var\(--petrol\)\}/);
  assert.match(css, /a\{color:var\(--link\)\}/);
  assert.match(css, /\.link--teal\{color:var\(--link\)\}/);
});

test('motion stays finite and calm: hover only on fine pointers, no new loop, reduced motion respected, no side bar on hover', async () => {
  const css = await read('src/site.css');
  // Hover only inside a (hover:hover) media query.
  for (const line of css.split('\n').filter(line => /:hover/.test(line) && !/^\s/.test(line) && !/^@media/.test(line))) assert.ok(false, `hover outside a media query: ${line}`);
  for (const line of css.split('\n').filter(line => /^@media/.test(line) && /:hover/.test(line))) assert.match(line, /^@media \(hover:hover\) and \(pointer:fine\)\{/, line);
  // The only continuous animation is the finite-scope scroll of a still inside a client frame (approved on 28/10); nothing new.
  const loops = css.split('\n').filter(line => /\binfinite\b/.test(line));
  assert.equal(loops.length, 1);
  assert.match(loops[0], /tt-shot-scroll/);
  // tt-confere belongs to the homepage record only.
  assert.equal((css.match(/animation:tt-confere/g) ?? []).length, 1);
  assert.match(css, /\.hm-chk path\{stroke-dasharray:1 1\.5;animation:tt-confere/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)\{[\s\S]*animation:none!important;transition:none!important/);
  // No decorative bar beside cards (cards, steps, cases, facts, FAQ).
  assert.doesNotMatch(css, /(?:\.card|\.steps[^{]*|\.case|\.facts[^{]*|\.faq[^{]*|\.hm-[a-z]+)(?::hover)?::(?:before|after)\{[^}]*(?:width:[2-6]px;[^}]*height:(?:100%|auto)|border-left)/);
});

test('footer and header on every page: signature, no cyan ornament', async () => {
  const css = await read('src/site.css');
  assert.doesNotMatch(css, /drop-shadow\(0 0 1[06]px rgba\(14,208,230/);
  assert.match(css, /\.site-foot__col h2\{[^}]*color:var\(--text\)/);
  await withApp(({ render }) => {
    for (const path of ['/criacao-de-sites/', '/en/landing-pages/', '/projetos/', '/privacidade/']) {
      const footer = render(path).match(/<footer[\s\S]*?<\/footer>/)[0];
      assert.match(footer, /signature__desc/);
      assert.match(footer, /tetelestai-symbol-144\.webp/);
    }
  });
});
