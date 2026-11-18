import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const whatsapp = /href="https:\/\/wa\.me\/556184711930(?:\?text=[^"]+)?"/g;
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/[ \t\n\r]+/g, ' ');
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

// Homepage approved by Carlos on 18/11/2026 (positioning "AI and automation for law firms and notary offices in the DF").
test('the homepage opens with one request: the free diagnosis through WhatsApp, in both languages', async () => {
  await withApp(({ render }) => {
    const expected = {
      '/': { h1: 'IA e automação para escritórios de advocacia e cartórios do DF.', message: 'Olá! Quero o diagnóstico de IA e automação.', cta: 'Pedir diagnóstico grátis no WhatsApp', see: 'Ver como funciona', note: /De 30 a 45 minutos, por vídeo ou visita\. Termina em proposta por escrito\./, illustration: 'Ilustração do fluxo, sem dados de clientes.' },
      '/en/': { h1: 'AI and automation for law firms and notary and registry offices in the Federal District.', message: "Hello! I'd like the AI and automation diagnosis.", cta: 'Request a free diagnosis on WhatsApp', see: 'See how it works', note: /30 to 45 minutes, by video or on-site visit\. It ends in a written proposal\./, illustration: 'Illustration of the flow, with no client data.' },
    };
    for (const [path, want] of Object.entries(expected)) {
      const html = render(path);
      const hero = html.match(/<section id="home"[\s\S]*?<\/section>/)?.[0] ?? '';
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one h1`);
      assert.ok(text(hero).includes(want.h1), `${path}: h1`);
      const actions = [...hero.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(match => [match[1].replaceAll('&amp;', '&'), text(match[2]).trim()]);
      assert.equal(actions.length, 2, `${path}: exactly two actions in the opening`);
      assert.ok(actions[0][0].startsWith('https://wa.me/556184711930?text='), `${path}: the primary action goes to the company WhatsApp`);
      assert.equal(decodeURIComponent(actions[0][0].split('?text=')[1]), want.message);
      assert.equal(actions[0][1], want.cta);
      assert.deepEqual(actions[1], ['#como', want.see]);
      assert.match(text(hero), want.note);
      // The record is labeled as an illustration and carries no client data; the ticks draw in sequence, then stay.
      assert.match(hero, /<figure class="hm-ficha" aria-label="(?:Ilustração|Illustration):/);
      assert.ok(text(hero).includes(want.illustration));
      assert.equal((hero.match(/class="hm-chk"/g) ?? []).length, 4, `${path}: four ticks`);
      assert.ok(!/data-reveal/.test(hero), `${path}: the title and the button never wait for the reveal`);
      // Every WhatsApp entry point of the page carries the diagnosis message and the confirmed number.
      const links = html.match(whatsapp) ?? [];
      assert.ok(links.length >= 6, `${path}: opening, header, menu, price card, final call, footer and floating button`);
      for (const link of links.filter(item => item.includes('text='))) assert.ok(!/landing|orçamento|quote/i.test(decodeURIComponent(link)), `${path}: no quote or landing page message on the homepage`);
      assert.ok(html.includes('class="wa-float"') && html.match(/class="wa-float" href="([^"]+)"/)[1].includes(encodeURIComponent(want.message).replaceAll("'", '%27')), `${path}: the floating button asks for the diagnosis`);
    }
  });
});

test('the homepage follows the approved prototype section by section, with facts counted from the data', async () => {
  const { CLIENT_PROJECTS, APPS } = await import('../src/portfolio-content.mjs');
  await withApp(({ render }) => {
    for (const path of ['/', '/en/']) {
      const html = render(path);
      const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(ids, ['home', 'desafio', 'como', 'preco', 'compromissos', 'quem-faz', 'duvidas'], `${path}: sections`);
      // Four facts: "5 sites and 2 apps" comes from the portfolio data, never from typing.
      const facts = html.match(/<section class="hm-facts"[\s\S]*?<\/section>/)[0];
      assert.equal((facts.match(/<li>/g) ?? []).length, 4);
      const counted = `${CLIENT_PROJECTS.length} ${path === '/' ? 'sites e' : 'websites and'} ${Object.keys(APPS).length} apps`;
      assert.ok(text(facts).includes(counted), `${path}: "${counted}"`);
      assert.ok(!facts.includes('{sites}') && !facts.includes('{apps}'));
      // Two audience cards, three steps, four fronts, four commitments, two "who does it" cards, seven questions.
      assert.equal((html.match(/<article class="hm-card"/g) ?? []).length, 4, `${path}: audience and who-does-it cards`);
      assert.equal((html.match(/<li class="hm-step"/g) ?? []).length, 3);
      assert.equal((html.match(/<ul class="hm-list"[\s\S]*?<\/ul>/)[0].match(/<li\b/g) ?? []).length, 4);
      assert.equal((html.match(/<ul class="hm-quad"[\s\S]*?<\/ul>/)[0].match(/<li\b/g) ?? []).length, 4);
      assert.equal((html.match(/<details>/g) ?? []).length, 7);
      assert.ok(html.includes('Provimento 205/2021'));
      assert.ok(text(html).includes(path === '/' ? 'O agente não responde consulta jurídica e não fala de honorários' : 'does not answer legal consultations and does not discuss fees'));
      // No client projects, no price note, no circuit background or pulses on the homepage.
      for (const gone of ['class="receipt"', 'hero__bg', 'circuit-visual', 'class="trace"', 'case--featured', 'data-shot-zone']) assert.ok(!html.includes(gone), `${path}: no ${gone}`);
    }
  });
});

test('the homepage states only the approved price, as plain facts, and nothing from the old offer', async () => {
  await withApp(({ render }) => {
    for (const [path, amounts, title] of [['/', ['R$ 2.500', 'R$ 500'], 'A partir de R$ 2.500 de implantação + R$ 500 por mês.'], ['/en/', ['R$ 2,500', 'R$ 500'], 'From R$ 2,500 in setup + R$ 500 per month.']]) {
      const html = render(path);
      const body = text(html.match(/<main\b[\s\S]*?<\/main>/)[0]);
      const card = html.match(/<div class="hm-price price-card dark"[\s\S]*?<\/div>/)[0];
      assert.ok(text(card).includes(title), `${path}: price headline`);
      assert.equal((card.match(/<li>/g) ?? []).length, 4, `${path}: four lines in the card`);
      const seen = new Set([...body.matchAll(/R\$ ?[\d.,]+/g)].map(match => match[0].replace(/ /g, ' ')));
      assert.deepEqual([...seen].sort(), [...amounts].sort(), `${path}: no other amount on the page`);
      assert.doesNotMatch(body, /\b297\b|\b97\b|landing page de|R\$ ?\d+ ?\/ ?m/i, `${path}: the R$ 297 + R$ 97/month offer lives on its own pages`);
      assert.match(card, /class="hm-btn hm-btn--cyan"/);
    }
  });
});

test('the people block is gone from every commercial page and from the structured data', async () => {
  await withApp(({ render }) => {
    const forbidden = /Carlos|Viegas|Gabriela|Banco do Brasil|LinkedIn|linkedin\.com|22 anos|22 years|Oportunidades sem fronteiras|Opportunities without borders|Quem faz o trabalho|Co-Founder|Cofundador/i;
    for (const path of ['/', '/en/', '/criacao-de-sites/', '/criacao-de-landing-pages/', '/en/website-development/', '/en/landing-pages/', '/projetos/', '/en/projects/', '/projetos/infinity-car-studio/', '/en/projects/respeitavel-feijuca/']) {
      const html = render(path);
      assert.doesNotMatch(html, forbidden, path);
    }
    // The home "who does it" text keeps the bank leadership without a name or the bank's name.
    assert.ok(text(render('/')).includes('engenheiro de software com 14 anos de liderança técnica em banco'));
    assert.ok(text(render('/en/')).includes('software engineer with 14 years of technical leadership in banking'));
  });
});

test('mentoring, AI training and IA na Prática left the menu, the footer and the routes', async () => {
  await withApp(({ render }) => {
    for (const path of ['/', '/en/', '/criacao-de-sites/', '/en/landing-pages/', '/projetos/']) {
      const html = render(path);
      const chrome = (html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? '') + (html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '') + (html.match(/<div class="mobile-menu"[\s\S]*?<\/div>/)?.[0] ?? '');
      assert.doesNotMatch(html, /carreira-internacional|capacitacao-em-ia|international-career|ai-training|Carreira internacional|Capacitação em IA|International careers|AI training|IA na Prática|ia\.napratica|\/experimento/i, path);
      assert.ok(chrome.length > 0);
    }
    // Unknown routes keep rendering the strict not-found page (the old addresses are static redirect pages).
    for (const path of ['/carreira-internacional/', '/capacitacao-em-ia/', '/en/international-career/', '/en/ai-training/']) {
      assert.match(render(path), /não existe|does not exist/, path);
    }
  });
});

test('header, menu and footer: anchors and diagnosis button on the home, quote rule elsewhere, signature with descriptor everywhere', async () => {
  await withApp(({ render }) => {
    const pt = render('/');
    const header = pt.match(/<header[\s\S]*?<\/header>/)[0];
    for (const [href, label] of [['#desafio', 'Para quem'], ['#como', 'Como funciona'], ['#preco', 'Preço'], ['#duvidas', 'Dúvidas']]) assert.ok(header.includes(`href="${href}"`) && header.includes(label), `header ${label}`);
    assert.ok(header.includes('Pedir diagnóstico') && header.includes('Diagnóstico'), 'full and short label of the header button');
    assert.match(header, /aria-label="Idioma"/);
    assert.ok(pt.match(/<div class="mobile-menu"[\s\S]*?<\/div>/)[0].includes('Pedir diagnóstico grátis no WhatsApp'));
    assert.ok(render('/en/').match(/<header[\s\S]*?<\/header>/)[0].includes('Request a diagnosis'));
    // Other pages keep the quote rule; the landing page keeps its own button.
    assert.ok(render('/criacao-de-sites/').match(/<header[\s\S]*?<\/header>/)[0].includes('Pedir orçamento'));
    assert.ok(render('/criacao-de-landing-pages/').match(/<header[\s\S]*?<\/header>/)[0].includes('Landing page R$'));
    assert.ok(!render('/criacao-de-sites/').match(/<header[\s\S]*?<\/header>/)[0].includes('Diagnóstico'));
    for (const [path, descriptor, tagline] of [['/', 'IA e automação · advocacia e cartórios', 'Tecnologia com propósito.'], ['/en/', 'AI and automation · law firms and notary offices', 'Technology with purpose.'], ['/criacao-de-sites/', 'IA e automação · advocacia e cartórios', 'Tecnologia com propósito.'], ['/privacidade/', 'IA e automação · advocacia e cartórios', 'Tecnologia com propósito.']]) {
      const footer = render(path).match(/<footer[\s\S]*?<\/footer>/)[0];
      assert.ok(footer.includes(descriptor), `${path}: descriptor`);
      assert.ok(footer.includes(`<p>${tagline}</p>`), `${path}: tagline`);
      assert.ok(footer.includes('Brasília') && footer.includes('CNPJ 58.138.258/0001-39'));
      assert.ok(footer.includes('João 19:30') || footer.includes('John 19:30'));
      assert.match(footer, /tetelestai-symbol-144\.webp/);
    }
  });
});

test('WhatsApp intents: the diagnosis is its own value; the landing page and quote values are unchanged', async () => {
  await withApp(async ({ renderer }) => {
    const { intentOf } = await renderer.ssrLoadModule('/src/ui.jsx');
    assert.equal(intentOf('Olá! Quero o diagnóstico de IA e automação.'), 'diagnostico');
    assert.equal(intentOf("Hello! I'd like the AI and automation diagnosis."), 'diagnostico');
    assert.equal(intentOf('Olá! Quero a landing page de R$ 297 + R$ 97/mês.'), 'landing_697');
    assert.equal(intentOf("Hi! I'd like the R$ 297 + R$ 97/month landing page."), 'landing_697');
    assert.equal(intentOf('Olá! Vim pelo site da Tetelestai e quero um orçamento.'), 'orcamento');
    assert.equal(intentOf(undefined), 'orcamento');
  });
});

test('home styles: paper reading, ink titles, petrol links, cyan only on the action and the focus, Newsreader headings', async () => {
  const css = await read('src/site.css');
  const app = await read('src/App.jsx');
  assert.match(app, /@fontsource-variable\/newsreader\/wght\.css/, 'Newsreader is self-hosted through Fontsource');
  assert.doesNotMatch(css, /fonts\.googleapis|fonts\.gstatic|@import url\(/);
  assert.match(css, /--serif:'Newsreader Variable'/);
  assert.match(css, /\.h1\{font-family:var\(--serif\);font-weight:500/);
  assert.match(css, /\.h2\{font-family:var\(--serif\);font-weight:500/);
  assert.match(css, /\nh1,h2\{font-family:var\(--serif\);font-weight:500/);
  const block = css.match(/\/\* ---------- Homepage \(approved 18\/11\)[\s\S]*?(?=\/\* ---------- Scroll reveal)/)[0].replace(/\/\*[\s\S]*?\*\//g, '');
  for (const token of ['#F7F6F5', '#ECEAE7', '#000C19', '#0A6373', '#4B5560']) assert.ok(new RegExp(token, 'i').test(css), token);
  assert.match(css, /--petrol:#0A6373/); // the token moved to :root in phase 2, so every page shares it
  assert.match(block, /\.hm-sec\{[^}]*background:var\(--paper\)/);
  assert.match(block, /\.hm-sec--dark\{background:var\(--navy\)/);
  assert.match(block, /\.hm-card\{background:#fff/);
  // Every use of cyan inside the homepage block is the action button or the focus ring.
  for (const line of block.split('\n').filter(line => /cyan|#0ED0E6/i.test(line))) assert.match(line, /hm-btn--cyan|focus-visible|head-diag/, `cyan outside the action or the focus: ${line.trim()}`);
  // Hover only on fine pointers; reduced motion shows everything still, with the ticks already drawn.
  for (const line of block.split('\n').filter(line => /:hover/.test(line) && !/^\s/.test(line) && !/^@media \(hover:hover\)/.test(line))) assert.ok(false, `hover outside a media query: ${line}`);
  assert.match(block, /@media \(hover:hover\) and \(pointer:fine\)\{\s*\.hm-btn:hover/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)\{[\s\S]*animation:none!important/);
  assert.match(block, /@keyframes tt-confere\{from\{stroke-dashoffset:1\.01\}to\{stroke-dashoffset:0\}\}/);
  assert.match(block, /\.hm-chk path\{stroke-dasharray:1 1\.5;animation:tt-confere/);
  assert.match(block, /@media \(max-width:359px\)\{\.site-shell--home \.head-cta \.head-diag\{display:none\}\}/);
});

test('the removed pages are static noindex redirect pages to the home of the same language, and the sitemap and llms.txt follow', async () => {
  for (const [file, target, lang] of [['carreira-internacional', 'https://tetelestai.tech/', 'pt-BR'], ['capacitacao-em-ia', 'https://tetelestai.tech/', 'pt-BR'], ['experimento', 'https://tetelestai.tech/', 'pt-BR'], ['en/international-career', 'https://tetelestai.tech/en/', 'en'], ['en/ai-training', 'https://tetelestai.tech/en/', 'en']]) {
    const path = `dist/client/${file}/index.html`;
    assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), `${path} is published as a static page`);
    const html = await read(path);
    assert.ok(html.includes(`<html lang="${lang}">`));
    assert.ok(html.includes('<meta name="robots" content="noindex,nofollow">'));
    assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${target}">`));
    assert.ok(html.includes(`<a href="${target}">${target}</a>`), 'a visible link');
    assert.doesNotMatch(html, /IA na Prática|ia\.napratica|Carlos|mentoria|carreira internacional/i);
    assert.equal(html, await read(`public/${file}/index.html`));
  }
  const sitemap = await read('public/sitemap.xml');
  for (const gone of ['carreira-internacional', 'capacitacao-em-ia', 'international-career', 'ai-training', 'experimento']) assert.ok(!sitemap.includes(gone), gone);
  assert.match(sitemap, /<loc>https:\/\/tetelestai\.tech\/<\/loc><lastmod>2026-11-18<\/lastmod>/);
  assert.match(sitemap, /<loc>https:\/\/tetelestai\.tech\/en\/<\/loc><lastmod>2026-11-18<\/lastmod>/);
  const llms = await read('public/llms.txt');
  assert.doesNotMatch(llms, /Carlos|Viegas|Gabriela|Banco do Brasil|linkedin|carreira|career|international-career|capacitacao|ai-training|mentor|IA na Prática/i);
  for (const fact of ['Federal District', 'R$ 2,500', 'R$ 500', 'Provimento 205/2021', 'free diagnosis', '14 years of technical leadership in banking']) assert.ok(llms.includes(fact), fact);
});

// Decided by Carlos on 13/11/2026 (direction "cauda"): the landing page's exit rule stays on its own pages.
test('the landing page keeps its price, exit rule and cancellation row, in both languages', async () => {
  await withApp(({ render, renderer }) => {
    const expected = {
      '/criacao-de-landing-pages/': { notice: /30 dias/, question: 'Posso cancelar a mensalidade quando quiser?', row: 'Cancelamento' },
      '/en/landing-pages/': { notice: /30 days/, question: 'Can I cancel the monthly fee whenever I want?', row: 'Cancellation' },
    };
    for (const [path, want] of Object.entries(expected)) {
      const html = render(path);
      const receipt = html.match(/<div class="receipt">[\s\S]*?<p class="receipt__note">/)?.[0] ?? '';
      assert.ok(receipt.includes(`<span>${want.row}</span>`), `${path}: cancellation row on the price note`);
      assert.ok(receipt.includes('R$ 297') || receipt.includes('R$ 297'), `${path}: R$ 297 on the landing page`);
      const faq = html.match(/<section class="faq-section[\s\S]*?<\/section>/)?.[0] ?? '';
      assert.ok(faq.includes(`<summary>${want.question}</summary>`), `${path}: cancellation question`);
      assert.match(faq, want.notice, `${path}: notice period in the answer`);
      assert.doesNotMatch(html, /fidelidade|lock-in/i, `${path}: no loyalty wording`);
    }
    return renderer.ssrLoadModule('/src/home-content.mjs').then(({ LANDING_RECEIPT }) => {
      assert.equal(LANDING_RECEIPT.pt.rows.length, LANDING_RECEIPT.en.rows.length);
      assert.ok(LANDING_RECEIPT.en.rows.some(([label]) => label === 'Monthly fee'));
    });
  });
});

test('the sites and landing pages keep one WhatsApp action in the opening and a real project', async () => {
  await withApp(({ render }) => {
    for (const path of ['/criacao-de-sites/', '/criacao-de-landing-pages/']) {
      const html = render(path);
      const hero = html.match(/<section id="home"[\s\S]*?<\/section>/)?.[0];
      assert.equal((hero?.match(whatsapp) ?? []).length >= 1, true, `${path}: WhatsApp action in the opening`);
      assert.match(hero, /href="\/projetos\/(?:infinity-car-studio|respeitavel-feijuca)\/"/, `${path}: opening links to a real project`);
      assert.ok(html.includes('id="projects"'));
    }
  });
});
