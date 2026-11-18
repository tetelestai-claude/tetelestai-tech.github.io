import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SERVICE_PAGES } from "../src/service-content.mjs";
import { HOME } from "../src/home-content.mjs";

const origin = "https://tetelestai.tech";
const services = Object.values(SERVICE_PAGES);
const paths = ["/", "/en/", ...services.map(service => service.path)];
const readPage = pathname => readFile(new URL(`../dist/client${pathname}index.html`, import.meta.url), "utf8");
const graphOf = html => {
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, "A commercial page must publish one unambiguous structured-data graph");
  return JSON.parse(scripts[0][1])["@graph"];
};
const textOf = markup => markup.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
const decode = value => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");
function meta(html, name) {
  const tags = html.match(/<meta\b[^>]*>/g) ?? [];
  const tag = tags.find(tag => tag.includes(`name="${name}"`) || tag.includes(`property="${name}"`));
  return tag?.match(/content="([^"]*)"/)?.[1];
}

test("the commercial HTML pages identify the same organization and their own actual content", async () => {
  for (const pathname of paths) {
    const html = await readPage(pathname);
    const graph = graphOf(html);
    const organization = graph.find(node => node["@type"] === "Organization");
    const website = graph.find(node => node["@type"] === "WebSite");
    const page = graph.find(node => node["@type"] === "WebPage");
    const service = services.find(service => service.path === pathname);
    assert.equal(organization["@id"], `${origin}/#organization`);
    assert.equal(organization.legalName, "Tetelestai Soluções em Tecnologia Ltda.");
    assert.equal(organization.logo.url, `${origin}/assets/tetelestai-symbol.png`);
    assert.equal(website.publisher["@id"], organization["@id"]);
    assert.equal(page.url, origin + pathname);
    assert.equal(page.name, decode(html.match(/<title>(.*?)<\/title>/)[1]));
    assert.equal(page.description, decode(meta(html, "description")));
    assert.equal(page.inLanguage, pathname === "/en/" ? "en" : "pt-BR");
    const serviceNodes = graph.filter(node => node["@type"] === "Service");
    assert.equal(serviceNodes.length, 1, `${pathname}: one Service`);
    assert.equal(serviceNodes[0].provider["@id"], organization["@id"]);
    assert.equal(page.mainEntity["@id"], serviceNodes[0]["@id"]);
    if (service) {
      assert.equal(serviceNodes[0].name, service.label);
      assert.equal(serviceNodes[0].description, service.intro);
    } else {
      // Homepage (18/11): AI and automation for law firms and notary offices in the Federal District, from its visible text.
      const home = HOME[pathname === "/en/" ? "en" : "pt"];
      assert.equal(serviceNodes[0].name, home.serviceName);
      assert.equal(serviceNodes[0].description, home.hero.lede);
      assert.deepEqual(serviceNodes[0].areaServed, { "@type": "AdministrativeArea", name: "Distrito Federal" });
      assert.equal(serviceNodes[0].offers, undefined, "the homepage no longer carries the landing page Offer");
      assert.equal(organization.description, home.metaDescription);
    }
    assert.ok(textOf(html).includes(serviceNodes[0].description));
    // No people in structured data (18/11): only visible facts, and the people block left the site.
    assert.ok(!graph.some(node => node["@type"] === "Person") && organization.founder === undefined, `${pathname}: no Person data`);
    assert.doesNotMatch(JSON.stringify(graph), /Carlos|Viegas|Gabriela|Banco do Brasil|linkedin/i, `${pathname}: no names in structured data`);
  }
  const homeGraph = graphOf(await readPage("/"));
  assert.ok(!homeGraph.some(node => node["@type"] === "Offer") && !JSON.stringify(homeGraph).includes('"price"'), "the R$ 297 Offer stays on the landing page only");
  assert.ok(JSON.stringify(graphOf(await readPage("/criacao-de-landing-pages/"))).includes('"price":"297.00"'));
});

test("sharing metadata remains specific to the page and the PT/EN content", async () => {
  for (const pathname of paths) {
    const html = await readPage(pathname);
    const english = pathname === "/en/";
    assert.equal(meta(html, "og:locale"), english ? "en_US" : "pt_BR");
    assert.equal(meta(html, "twitter:card"), "summary_large_image");
    assert.equal(meta(html, "twitter:title"), html.match(/<title>(.*?)<\/title>/)[1]);
    assert.equal(meta(html, "twitter:description"), meta(html, "description"));
    assert.equal(meta(html, "twitter:image"), `${origin}/assets/tetelestai-share.png`);
    assert.equal(meta(html, "twitter:image:alt"), meta(html, "og:image:alt"));
    assert.equal(meta(html, "og:locale:alternate"), english ? "pt_BR" : "en_US");
  }
});

test("the homes carry the new positioning in title and description", async () => {
  const pt = await readPage("/");
  const en = await readPage("/en/");
  assert.equal(decode(pt.match(/<title>(.*?)<\/title>/)[1]), "IA e automação para advocacia e cartórios do DF | Tetelestai");
  assert.equal(decode(en.match(/<title>(.*?)<\/title>/)[1]), "AI and automation for law firms and notary offices in Brasília | Tetelestai");
  assert.equal(decode(meta(pt, "description")), "IA e automação para escritórios de advocacia e cartórios do DF: atendimento, agenda e documentos, com o dado dentro da conta do cliente.");
  assert.match(decode(meta(en, "description")), /^AI and automation for law firms and notary offices in the Federal District/);
  for (const html of [pt, en]) assert.equal(meta(html, "og:image"), `${origin}/assets/tetelestai-share.png`);
});

test("the homes answer price and format questions and every visible FAQ matches its FAQPage data", async () => {
  const pt = await readPage("/");
  const en = await readPage("/en/");
  assert.match(pt, /Quanto custa\?/);
  assert.match(pt, /Escritório de advocacia pode usar atendimento automático\?/);
  assert.match(en, /How much does it cost\?/);
  assert.match(en, /Can a law firm use automated customer service\?/);
  for (const pathname of paths) {
    const html = await readPage(pathname);
    const faqSection = html.match(/<section class="faq-section[^"]*"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(faqSection, pathname);
    const questions = [...faqSection.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map(match => decode(match[1]));
    assert.ok(questions.length >= 4, pathname);
    const faqPage = graphOf(html).find(node => node["@type"] === "FAQPage");
    assert.deepEqual(faqPage.mainEntity.map(item => item.name), questions, `${pathname}: FAQPage must mirror the visible questions`);
  }
});

test("commercial structured data does not leak into legal or app support pages", async () => {
  for (const pathname of ["/privacidade/", "/en/privacy/", "/termos/", "/exclusao-de-dados/", "/recarga/suporte/", "/de-role/suporte/"]) {
    const html = await readPage(pathname);
    assert.ok(!html.includes('type="application/ld+json"'), pathname);
    assert.equal(meta(html, "robots"), "noindex,nofollow");
  }
});
