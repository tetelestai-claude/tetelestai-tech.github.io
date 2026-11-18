import { COMMERCIAL_TRANSLATIONS } from "../src/localized-content.mjs";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

const servicePages = [
  {
    path: "/criacao-de-sites/",
    heading: "Criação de sites para empresas de todo o Brasil",
    titlePattern: /criação de sites/i,
    canonical: "https://tetelestai.tech/criacao-de-sites/",
    shell: "/criacao-de-sites/index.html",
    fixture: "sites page",
    contentPattern: /\b(?:site|sites)\b/i,
  },
  {
    path: "/criacao-de-landing-pages/",
    heading: "Landing page sob medida: R$\u00a0297 de entrada + R$\u00a097/mês, no ar em até 2 dias úteis",
    titlePattern: /criação de landing page/i,
    canonical: "https://tetelestai.tech/criacao-de-landing-pages/",
    shell: "/criacao-de-landing-pages/index.html",
    fixture: "landing pages page",
    contentPattern: /landing page/i,
  },
];

async function readBuiltHtml(pathname) {
  const file = new URL(`../dist/client${pathname}index.html`, import.meta.url);
  assert.ok(existsSync(file), `The build must emit ${pathname}index.html`);
  return readFile(file, "utf8");
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1];
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
}

function textContent(markup) {
  return markup.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/[ \t\n\r]+/g, " ").trim();
}

// WhatsApp entry points may carry a prefilled first message; the number stays the confirmed one.
function isConfirmedWhatsApp(href) {
  if (href === "https://wa.me/556184711930") return true;
  const match = href?.match(/^https:\/\/wa\.me\/556184711930\?text=([^"&]+)$/);
  return Boolean(match && decodeURIComponent(match[1]).trim().length > 10);
}

function metadata(html, name) {
  return tags(html, "meta")
    .filter((tag) => attribute(tag, "name") === name)
    .map((tag) => attribute(tag, "content"));
}

test("explicit index documents render the same page as their known directory routes", async () => {
  const renderer = await createServer({
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { App } = await renderer.ssrLoadModule("/src/App.jsx");
    const render = (pathname) => renderToString(createElement(App, { pathname }));
    for (const pathname of ["/", "/en/", "/criacao-de-sites/", "/criacao-de-landing-pages/", "/privacidade/", "/en/privacy/", "/recarga/suporte/"]) {
      assert.equal(render(`${pathname}index.html`), render(pathname), `${pathname}index.html must preserve its page during hydration`);
    }
    assert.match(render("/unknown-service/index.html"), /Página não encontrada/);
    assert.match(render("/criacao-de-sites/missing/index.html"), /Página não encontrada/);
  } finally {
    await renderer.close();
  }
});

for (const page of servicePages) {
  test(`${page.path} contains its service and WhatsApp contact before JavaScript runs`, async () => {
    const html = await readBuiltHtml(page.path);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
    assert.ok(main, "The initial HTML must contain the service's main content");
    const headings = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((match) => textContent(match[1]));
    assert.deepEqual(headings, [page.heading]);
    const paragraphs = [...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => textContent(match[1]));
    assert.ok(paragraphs.some((text) => page.contentPattern.test(text)),
      "Service copy must be present in the initial HTML, not only in a JavaScript bundle");
    assert.ok(tags(main, "a").some((tag) => isConfirmedWhatsApp(attribute(tag, "href")?.replaceAll("&amp;", "&"))),
      "The initial service content must link to the confirmed WhatsApp address");
  });

  test(`${page.path} has its own indexable Portuguese metadata with its equivalent English translation`, async () => {
    const html = await readBuiltHtml(page.path);
    const home = await readBuiltHtml("/");
    assert.equal(attribute(tags(html, "html")[0] ?? "", "lang"), "pt-BR");
    assert.match(textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""), page.titlePattern);
    assert.deepEqual(metadata(html, "robots"), ["index,follow"]);
    const descriptions = metadata(html, "description");
    assert.equal(descriptions.length, 1);
    assert.ok(descriptions[0]?.trim(), "The service must have a description");
    assert.notEqual(descriptions[0], metadata(home, "description")[0], "The service must not inherit the home description");
    const links = tags(html, "link");
    assert.deepEqual(links.filter((tag) => attribute(tag, "rel") === "canonical")
      .map((tag) => attribute(tag, "href")), [page.canonical]);
    assert.ok(links.some(tag => attribute(tag,"hreflang")==="en" && attribute(tag,"href")===`https://tetelestai.tech${COMMERCIAL_TRANSLATIONS.find(p=>p.pt===page.path).en}`), "Each service has its actual English equivalent");
  });

  test(`${page.path} falls back to its own HTML for exact GET and HEAD routes`, async () => {
    // ASSETS is an external hosting binding. Distinct fixtures expose wrong-route fallbacks.
    for (const pathname of [page.path, page.path.slice(0, -1)]) {
      for (const method of ["GET", "HEAD"]) {
        const calls = [];
        const response = await worker.fetch(new Request(`https://example.test${pathname}?source=search`, {
          method, headers: { accept: "text/html" },
        }), { ASSETS: { fetch: async (request) => {
          const url = new URL(request.url);
          calls.push([request.method, url.pathname + url.search]);
          const fixture = servicePages.find((candidate) => candidate.shell === url.pathname);
          if (!fixture || url.search) return new Response(null, { status: 404 });
          return new Response(request.method === "HEAD" ? null : fixture.fixture, {
            status: 200, headers: { "content-type": "text/html" },
          });
        } } });
        assert.equal(response.status, 200, `${method} ${pathname} must resolve`);
        assert.equal(await response.text(), method === "HEAD" ? "" : page.fixture);
        assert.deepEqual(calls, [[method, `${pathname}?source=search`], [method, page.shell]]);
      }
    }
  });
}

test("the footer of every page links the landing page offer and the projects, and the other products", async () => {
  for (const [pathname, landing, projects, heading] of [["/", "/criacao-de-landing-pages/", "/projetos/", "Também fazemos"], ["/en/", "/en/landing-pages/", "/en/projects/", "We also offer"], ["/criacao-de-sites/", "/criacao-de-landing-pages/", "/projetos/", "Também fazemos"]]) {
    const html = await readBuiltHtml(pathname);
    const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1];
    assert.ok(footer, pathname);
    assert.ok(footer.includes(`>${heading}</h2>`), `${pathname}: footer column`);
    const hrefs = tags(footer, "a").map(tag => attribute(tag, "href")?.replaceAll("&amp;", "&"));
    for (const href of [landing, projects, "https://exatoteor.com.br/", "https://amesa.app/", "https://apps.apple.com/br/app/id6820150552", "https://apps.apple.com/br/app/id6815378368?pt=129504047&ct=site_tetelestai_botao&mt=8"]) {
      assert.ok(hrefs.includes(href), `${pathname}: footer links to ${href}`);
    }
  }
});

test("the sitemap lists the homes, service pages and approved portfolio pages exactly once", async () => {
  const sitemap = await readFile(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8");
  const locations = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(locations.sort(), [
    "https://tetelestai.tech/",
    "https://tetelestai.tech/en/",
    ...COMMERCIAL_TRANSLATIONS.map(pair=>`https://tetelestai.tech${pair.en}`),
    "https://tetelestai.tech/criacao-de-sites/",
    "https://tetelestai.tech/criacao-de-landing-pages/",
    "https://tetelestai.tech/projetos/",
    "https://tetelestai.tech/projetos/infinity-car-studio/",
    "https://tetelestai.tech/projetos/bolachinhas-da-vovo-juju/",
    "https://tetelestai.tech/projetos/afeto-nobre/",
    "https://tetelestai.tech/projetos/lalelis/",
    "https://tetelestai.tech/projetos/respeitavel-feijuca/",
  ].sort());
});

test("unknown, malformed and asset paths never enter the service route fallback", async () => {
  for (const pathname of [
    "/unknown-service/",
    "/criacao-de-sites//",
    "/criacao-de-landing-pages//",
    "/criacao-de-sites/missing",
    "/criacao-de-landing-pages/missing",
    "/en/criacao-de-sites/",
    "/en/criacao-de-landing-pages/",
    "/criacao-de-sites/missing.js",
    "/criacao-de-landing-pages/missing.css",
    "/assets/missing.js",
    "/carreira-internacional//",
    "/capacitacao-em-ia/missing",
    "/carreira-internacional/missing",
    "/en/international-career/missing",
    "/en/ai-training/missing",
    "/experimento/missing",
    "/en/carreira-internacional/",
    "/capacitacao-em-ia/missing.js",
  ]) {
    let calls = 0;
    const missing = new Response("missing", { status: 404 });
    const response = await worker.fetch(new Request(`https://example.test${pathname}`, {
      headers: { accept: "text/html" },
    }), { ASSETS: { fetch: async () => ++calls === 1 ? missing : new Response("unexpected fallback") } });
    assert.strictEqual(response, missing, pathname);
    assert.equal(calls, 1, `${pathname} must not issue a fallback request`);
  }
});

test("the English home contains its translated content and contact before JavaScript", async () => {
  const html = await readBuiltHtml("/en/");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main, "The English home must include initial main content");
  assert.match(textContent(main), /AI and automation for law firms and notary and registry offices in the Federal District\./);
  assert.match(textContent(html.match(/<footer\b[\s\S]*?<\/footer>/i)[0]), /Technology with purpose\./);
  assert.doesNotMatch(html, /Opportunities without borders/);
  assert.ok(tags(main, "a").some(tag => isConfirmedWhatsApp(attribute(tag, "href")?.replaceAll("&amp;", "&"))));
  assert.equal(attribute(tags(html, "html")[0], "lang"), "en");
});

test("the website and landing page pages keep their client projects before the FAQ", async () => {
  for (const pathname of ["/criacao-de-sites/", "/criacao-de-landing-pages/"]) {
    assert.ok((await readBuiltHtml(pathname)).includes('id="projects"'));
  }
  assert.ok(!(await readBuiltHtml("/")).includes('id="projects"'), "the homepage no longer presents client projects");
});

test("service paths preserve missing responses for unsupported methods and non-HTML requests", async () => {
  for (const page of servicePages) {
    for (const init of [
      ...["POST", "PUT", "PATCH", "DELETE", "OPTIONS"].map((method) => ({ method, headers: { accept: "text/html" } })),
      { method: "GET", headers: { accept: "application/json" } },
      { method: "GET", headers: { accept: "*/*" } },
      { method: "GET" },
      { method: "HEAD", headers: { accept: "application/json" } },
    ]) {
      let calls = 0;
      const missing = new Response(init.method === "HEAD" ? null : "missing", { status: 404 });
      const response = await worker.fetch(new Request(`https://example.test${page.path}`, init), {
        ASSETS: { fetch: async () => ++calls === 1 ? missing : new Response("unexpected fallback") },
      });
      assert.strictEqual(response, missing, `${init.method} ${page.path}`);
      assert.equal(calls, 1, "A disallowed request must not issue a fallback request");
    }
  }
});

test("service routing preserves asset responses that are not 404", async () => {
  for (const status of [200, 500]) {
    let calls = 0;
    const original = new Response("original asset response", { status });
    const response = await worker.fetch(new Request("https://example.test/criacao-de-sites/", {
      headers: { accept: "text/html" },
    }), { ASSETS: { fetch: async () => ++calls === 1 ? original : new Response("unexpected fallback") } });
    assert.strictEqual(response, original);
    assert.equal(calls, 1);
  }
});

test("key facts grids end with full rows on every page that has them", async () => {
  const renderer = await createServer({
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { App } = await renderer.ssrLoadModule("/src/App.jsx");
    const { factsColumns } = await renderer.ssrLoadModule("/src/ui.jsx");
    assert.deepEqual([6, 8, 9, 12].map(factsColumns), [3, 4, 3, 4]);
    for (const pathname of ["/criacao-de-sites/", "/criacao-de-landing-pages/", "/en/website-development/", "/projetos/infinity-car-studio/", "/projetos/bolachinhas-da-vovo-juju/", "/projetos/afeto-nobre/", "/projetos/lalelis/", "/en/projects/lalelis/", "/projetos/respeitavel-feijuca/"]) {
      const html = renderToString(createElement(App, { pathname }));
      const grid = html.match(/<dl class="facts"[^>]*style="--facts-cols:(\d+)"[^>]*>([\s\S]*?)<\/dl>/);
      assert.ok(grid, `${pathname} renders a key facts grid with a column count`);
      const cells = grid[2].match(/<dt>/g).length;
      assert.equal(cells % Number(grid[1]), 0, `${pathname}: ${cells} facts in ${grid[1]} columns leave empty cells`);
      assert.equal(cells % 2, 0, `${pathname}: ${cells} facts leave an empty cell in the 2-column layout`);
    }
  } finally {
    await renderer.close();
  }
});

test("method steps light up on hover without a cyan bar beside the card", async () => {
  const css = await readFile(new URL("../src/site.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.steps\s*>\s*li(?::hover)?::(?:before|after)/, "steps must not draw a side bar");
  assert.match(css, /\.steps > li:hover \.card\{background-color:/, "steps keep the hover tint");
  assert.match(css, /\.card:hover\{transform:translateY\(-4px\)/, "cards keep the hover lift");
});
