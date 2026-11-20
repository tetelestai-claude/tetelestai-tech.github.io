import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { AUDIENCE_PAGES } from "../src/audience-content.mjs";
import { HOME } from "../src/home-content.mjs";
import { measurementPath } from "../src/analytics.mjs";

// Pages per audience approved by Carlos on 2026-11-20: law firms and notary offices of the Federal District (PT/EN).
const built = pathname => readFile(new URL(`../dist/client${pathname}index.html`, import.meta.url), "utf8");
const text = markup => markup.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/\s+/g, " ");
const hrefs = html => [...html.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map(match => match[1].replaceAll("&amp;", "&"));
const whatsappMessages = html => hrefs(html).filter(href => href.startsWith("https://wa.me/")).map(href => decodeURIComponent(href.split("?text=")[1] ?? ""));
const pages = ["pt", "en"].flatMap(locale => Object.entries(AUDIENCE_PAGES[locale]).map(([key, page]) => ({ locale, key, page })));

test("the four audience pages have the approved addresses, titles and WhatsApp messages", () => {
  const { pt, en } = AUDIENCE_PAGES;
  assert.deepEqual([pt.advocacia.path, pt.cartorios.path, en.advocacia.path, en.cartorios.path], ["/advocacia/", "/cartorios/", "/en/law-firms/", "/en/notary-offices/"]);
  assert.equal(pt.advocacia.metaTitle, "IA e WhatsApp para escritórios de advocacia do DF | Tetelestai");
  assert.equal(pt.cartorios.metaTitle, "IA e WhatsApp para cartórios do DF | Tetelestai");
  assert.equal(pt.advocacia.waMessage, "Olá! Quero o diagnóstico de IA e automação para o meu escritório.");
  assert.equal(pt.cartorios.waMessage, "Olá! Quero o diagnóstico de IA e automação para o meu cartório.");
  for (const { page } of pages) {
    assert.ok(page.metaDescription.length >= 110 && page.metaDescription.length <= 180, `${page.path}: description length ${page.metaDescription.length}`);
    assert.equal(measurementPath(page.path), page.path, `${page.path} is measured only after consent`);
  }
});

test("each built audience page carries its own content, one request and no new promise", async () => {
  for (const { locale, page } of pages) {
    const html = await built(page.path);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.deepEqual([...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(match => text(match[1]).trim()), [page.heading]);
    assert.ok(text(main).includes(page.intro), `${page.path}: visible introduction`);
    assert.ok(html.includes(`<title>${page.metaTitle}</title>`));
    assert.ok(html.includes(`rel="canonical" href="https://tetelestai.tech${page.path}"`));
    // Every WhatsApp entry point of the page (opening, header, menu, price card, final call, footer, floating button)
    // carries the page's own diagnosis message.
    const messages = whatsappMessages(html);
    assert.ok(messages.length >= 7, `${page.path}: ${messages.length} WhatsApp links`);
    assert.deepEqual([...new Set(messages)], [page.waMessage], `${page.path}: one message`);
    assert.match(page.waMessage, /diagn[óo]stico|diagnosis/);
    // The steps, the fronts and the price are the homepage's.
    const home = HOME[locale];
    for (const [title] of [...home.how.steps, ...home.offer.items]) assert.ok(text(main).includes(title), `${page.path}: ${title}`);
    assert.ok(text(main).includes(home.offer.price.title.replace(/ /g, " ")) || main.includes(home.offer.price.title), `${page.path}: entry price`);
    assert.ok(main.includes('class="card card--wide card--feature price-card'), "the price card reports the price_note placement");
    // No client names, figures or guarantees beyond the homepage.
    assert.doesNotMatch(text(main), /garantimos|we guarantee|depoimento|testimonial|clientes atendidos|\d+\s?%\s+(?:mais|more)/i, page.path);
    assert.doesNotMatch(html, /Carlos|Viegas|Gabriela|Banco do Brasil|linkedin/i, page.path);
    assert.ok(!main.includes("hm-ficha") && !main.includes("hm-chk"), "the illustrated record and its ticks stay on the homepage");
  }
  const lawFirm = text(await built("/advocacia/"));
  assert.match(lawFirm, /Não responde consulta jurídica\./);
  assert.match(lawFirm, /Não fala de honorários\./);
  assert.match(lawFirm, /Provimento 205\/2021/);
  const notary = text(await built("/cartorios/"));
  assert.match(notary, /Código de Normas dos cartórios do DF/);
  assert.match(notary, /O cartório não cobra nada em nosso nome\./);
  assert.ok((await built("/cartorios/")).includes('href="https://exatoteor.com.br/"'));
});

test("the audience pages publish a Service for the Federal District, their FAQ and reciprocal PT/EN links", async () => {
  for (const key of Object.keys(AUDIENCE_PAGES.pt)) {
    const pt = AUDIENCE_PAGES.pt[key]; const en = AUDIENCE_PAGES.en[key];
    for (const [page, lang, other] of [[pt, "pt-BR", en], [en, "en", pt]]) {
      const html = await built(page.path);
      assert.ok(html.includes(`<html lang="${lang}">`));
      assert.ok(html.includes(`hreflang="pt-BR" href="https://tetelestai.tech${pt.path}"`));
      assert.ok(html.includes(`hreflang="en" href="https://tetelestai.tech${en.path}"`));
      assert.ok(html.includes(`href="${other.path}" lang="${lang === "en" ? "pt-BR" : "en"}"`), `${page.path}: language switch to ${other.path}`);
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1])["@graph"];
      const service = graph.find(node => node["@type"] === "Service");
      assert.equal(service.name, page.label);
      assert.equal(service.description, page.intro);
      assert.deepEqual(service.areaServed, { "@type": "AdministrativeArea", name: "Distrito Federal" });
      assert.equal(service.offers, undefined, "no price node: the entry price is stated in the visible text only");
      assert.deepEqual(graph.find(node => node["@type"] === "FAQPage").mainEntity.map(item => item.name), page.faqs.map(item => item.q));
      assert.equal(graph.find(node => node["@type"] === "BreadcrumbList").itemListElement.at(-1).name, page.label);
    }
  }
});

test("the homepage audience cards link the page of each audience in the same language, and the header keeps its menu", async () => {
  for (const [pathname, locale] of [["/", "pt"], ["/en/", "en"]]) {
    const html = await built(pathname);
    const cards = [...html.matchAll(/<article class="hm-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
    for (const [index, key] of ["advocacia", "cartorios"].entries()) {
      assert.ok(cards[index].includes(`href="${AUDIENCE_PAGES[locale][key].path}"`), `${pathname}: card ${index + 1} links ${key}`);
    }
    const header = html.match(/<header[\s\S]*?<\/header>/)[0];
    assert.ok(!Object.values(AUDIENCE_PAGES[locale]).some(page => header.includes(`href="${page.path}"`)), "the menu did not change");
  }
});

test("headings never skip a level on the commercial pages", async () => {
  const paths = ["/", "/en/", ...pages.map(({ page }) => page.path), "/criacao-de-sites/", "/criacao-de-landing-pages/", "/projetos/", "/projetos/respeitavel-feijuca/", "/en/projects/"];
  for (const pathname of paths) {
    const html = await built(pathname);
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1]));
    assert.equal(levels[0], 1, `${pathname}: starts with the h1`);
    levels.reduce((previous, level) => {
      assert.ok(level <= previous + 1, `${pathname}: h${previous} is followed by h${level}`);
      return level;
    });
  }
});

test("the site answers the default icon requests with the protected symbol", async () => {
  const html = await built("/");
  assert.match(html, /<link rel="icon" href="\/favicon\.ico" sizes="48x48" \/>/);
  assert.match(html, /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png" \/>/);
  const ico = await readFile(new URL("../dist/client/favicon.ico", import.meta.url));
  assert.deepEqual([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)], [0, 1, 3], "an ICO file with three sizes");
  assert.deepEqual([0, 1, 2].map(index => ico[6 + index * 16]).sort((a, b) => a - b), [16, 32, 48]);
  const touch = await readFile(new URL("../dist/client/apple-touch-icon.png", import.meta.url));
  assert.deepEqual([touch.readUInt32BE(16), touch.readUInt32BE(20)], [180, 180]);
  assert.equal(touch[25], 2, "opaque RGB: iOS paints transparency black");
  assert.ok(touch.length < 30000);
  assert.ok(existsSync(new URL("../dist/client/advocacia/index.html", import.meta.url)));
});
