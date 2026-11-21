import { getAnalytics } from "./analytics.mjs";
import { whatsappHref } from "./contact.mjs";
import { UI } from "./home-content.mjs";

/* ---------- Icons (inline, decorative) ---------- */
const svg = { "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24", focusable: "false" };
export const IconWhatsApp = () => <svg className="i-wa" width="20" height="20" {...svg}><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" /></svg>;
export const IconArrow = () => <svg className="i-arrow" width="16" height="16" {...svg}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const IconArrowBack = () => <svg className="i-arrow i-arrow--back" width="16" height="16" {...svg}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const IconOut = () => <svg className="i-out" width="14" height="14" {...svg}><path d="M7 17L17 7M8 7h9v9" /></svg>;
export const IconDown = () => <svg className="i-down" width="16" height="16" {...svg}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
export const IconCart = () => <svg width="20" height="20" {...svg}><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6 5 3H2" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></svg>;
export const IconPlay = () => <svg width="16" height="16" {...svg} fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z" /></svg>;

const ICONS = { arrow: IconArrow, back: IconArrowBack, out: IconOut, down: IconDown };

/* ---------- Actions ---------- */
// Where on the page a link sits, so GA4 shows which button people use.
const PLACEMENTS = [[".wa-float", "floating"], [".site-head", "header"], [".mobile-menu", "menu"], [".sticky-cta", "sticky"], [".receipt", "price_note"], [".price-card", "price_note"], [".hero, .hm-hero", "hero"], [".cta-final, .home-final", "final_cta"], [".site-foot", "footer"]];
export function placementOf(element) {
  for (const [selector, name] of PLACEMENTS) if (element?.closest?.(selector)) return name;
  const id = element?.closest?.("section[id]")?.id;
  return id ? `section_${id.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`.slice(0, 40) : "content";
}

// What the visitor asked for: the landing page, the free AI and automation diagnosis (homepage, since 18/11) or a quote.
// The GA4 value stays "landing_697" so reports keep one series after the 09/11 price change.
export const intentOf = message => (/landing page/i.test(message ?? "") ? "landing_697" : /diagn[óo]stic[oa]|diagnosis/i.test(message ?? "") ? "diagnostico" : "orcamento");

// Every WhatsApp entry point reports the same consented `whatsapp_click` event, with its placement and intent.
export function WhatsAppLink({ message, className = "btn btn--lg", children, icon = true }) {
  return (
    <a className={className} href={whatsappHref(message)} target="_blank" rel="noopener noreferrer" onClick={event => getAnalytics()?.trackWhatsApp(placementOf(event.currentTarget), intentOf(message))}>
      {icon && <IconWhatsApp />}{children}
    </a>
  );
}

// Official WhatsApp glyph (Simple Icons, CC0) for the round floating button.
const WHATSAPP_GLYPH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

// Round WhatsApp button fixed at the bottom right of every commercial page (Carlos, 28/10),
// in WhatsApp's official green. It replaces the former mobile sticky bar.
export function FloatingWhatsApp({ message, label }) {
  return (
    <a className="wa-float" href={whatsappHref(message)} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} onClick={event => getAnalytics()?.trackWhatsApp(placementOf(event.currentTarget), intentOf(message))}>
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d={WHATSAPP_GLYPH} /></svg>
    </a>
  );
}

export function LinkArrow({ href, children, className = "link link--arrow", icon = "arrow", external = false, lang, hrefLang }) {
  const Icon = ICONS[icon] ?? IconArrow;
  const target = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={className} href={href} lang={lang} hrefLang={hrefLang} {...target}>
      {icon === "back" && <Icon />}{children}{icon !== "back" && <Icon />}
    </a>
  );
}

/* ---------- Brand imagery ---------- */
// The protected original symbol, served through its proportional lossless WebP variants.
export function SymbolPicture({ sizes, width = 72, height = 72, className, alt = "", loading }) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet="/assets/tetelestai-symbol-144.webp 144w, /assets/tetelestai-symbol-320.webp 320w, /assets/tetelestai-symbol-640.webp 640w" sizes={sizes} />
      <img src="/assets/tetelestai-symbol.png" width={width} height={height} alt={alt} aria-hidden={alt ? undefined : "true"} loading={loading} decoding="async" />
    </picture>
  );
}

/* ---------- Frames ---------- */
// The frame shows the first screen of the site (`src`). `video`/`videoWebm` are the site recorded while scrolled
// (its own videos and effects playing); `full` is the whole page as a still. src/scroll-shots.mjs downloads them only
// on intent (hover, keyboard focus or, on touch screens, when the frame comes into view) and plays the recording, or
// scrolls the still when there is no recording. The poster stays the only image that loads with the page.
export function Shot({ src, full, video, videoWebm, alt, width, height, eager = false }) {
  return (
    <div className="shot" data-full={full || undefined} data-video={video || undefined} data-video-webm={videoWebm || undefined}>
      <img className="shot__poster" src={src} alt={alt} width={width} height={height} loading={eager ? undefined : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" />
    </div>
  );
}

export function Browser({ src, full, video, videoWebm, alt, host, eager = false, className = "browser" }) {
  return (
    <div className={className}>
      <div className="browser__bar" aria-hidden="true"><i /><i /><i /><span>{host}</span></div>
      <Shot src={src} full={full} video={video} videoWebm={videoWebm} alt={alt} width="1265" height="889" eager={eager} />
    </div>
  );
}

export function Phone({ src, full, video, videoWebm, alt, className = "phone" }) {
  return <div className={className}><Shot src={src} full={full} video={video} videoWebm={videoWebm} alt={alt} width="375" height="812" /></div>;
}

// Hero media slides in once on load (`load`); the headline and call to action never wait.
// Browser and phone scroll together: the pair is one hover zone (`data-shot-zone`).
export function DevicePair({ project, eager = false, load = false, className = "device-pair" }) {
  return (
    <div className={className || undefined} data-shot-zone="">
      <div className={load ? "load-shot" : undefined}><Browser src={project.desktop} full={project.desktopFull} video={project.desktopVideo} videoWebm={project.desktopVideoWebm} alt={project.altDesktop} host={project.domain} eager={eager} /></div>
      <Phone src={project.mobile} full={project.mobileFull} video={project.mobileVideo} videoWebm={project.mobileVideoWebm} alt={project.altMobile} className={load ? "phone load-phone" : "phone"} />
    </div>
  );
}

/* ---------- Content blocks ---------- */
export function SectionHead({ eyebrow, title, aside, id }) {
  return (
    <div className="section-head" data-reveal="">
      <div className="section-head__main"><p className="eyebrow">{eyebrow}</p><h2 className="h2" id={id}>{title}</h2></div>
      {aside && <p className="section-head__aside muted">{aside}</p>}
    </div>
  );
}

// Columns that divide the item count exactly, so the grid never ends with empty cells:
// 8 items fill 4 columns, 6 items fill 3; smaller screens use 2 columns, then 1.
export function factsColumns(count) {
  return count % 4 === 0 ? 4 : count % 3 === 0 ? 3 : Math.min(count, 4);
}

export function Facts({ items }) {
  return <dl className="facts" data-reveal="" style={{ "--facts-cols": factsColumns(items.length) }}>{items.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>;
}

export function CardGrid({ items, columns = 3 }) {
  return (
    <div className={`grid grid--${columns}`} data-reveal-group="">
      {items.map(item => (
        <div className="card" data-reveal="" key={item.title}>
          {item.k && <span className="card__k">{item.k}</span>}
          <h3 className="h3">{item.title}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

// Steps: on hover the card tints and lifts like the other cards; no bar beside it (removed on 25/10).
export function Steps({ items }) {
  return (
    <ol className="steps" data-reveal-group="">
      {items.map((item, index) => (
        <li data-reveal="" key={item.title}>
          <div className="card">
            <span className="card__k">{item.k ?? String(index + 1).padStart(2, "0")}</span>
            <h3 className="h3">{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FaqSection({ eyebrow, title, items, id = "faq" }) {
  return (
    <section className="faq-section section light section--alt" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap faq-wrap">
        <div className="stack" data-reveal=""><p className="eyebrow">{eyebrow}</p><h2 className="h2" id={`${id}-title`}>{title}</h2></div>
        <div className="faq" data-reveal="">
          {items.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
        </div>
      </div>
    </section>
  );
}

export function Crumbs({ label, items }) {
  return (
    <nav className="crumbs" aria-label={label}>
      <ol>
        {items.map(item => <li key={item.label}>{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}</li>)}
      </ol>
    </nav>
  );
}

// Price note: the page's signature element. Prices are stated as Carlos defined them.
export function Receipt({ data, message }) {
  return (
    <div className="receipt-wrap" data-reveal="zoom">
      <div className="receipt">
        <div className="receipt__head"><span><SymbolPicture sizes="22px" width={22} height={22} loading="lazy" />Tetelestai</span><span>{data.place}</span></div>
        <div className="receipt__cut" />
        <p className="receipt__title">{data.title}</p>
        <div className="receipt__rows">
          {data.rows.map(([label, value]) => <div className="receipt__row" key={label}><span>{label}</span><i /><span>{value}</span></div>)}
        </div>
        <div className="receipt__cut receipt__cut--total" />
        <div className="receipt__total"><span>Total</span><strong>{data.total}</strong></div>
        <p className="receipt__split">{data.split}</p>
        <WhatsAppLink message={message} className="btn btn--dark btn--block" icon={false}>{data.cta}</WhatsAppLink>
        <p className="receipt__note">{data.note}</p>
      </div>
    </div>
  );
}

// Under the final button: who answers first on WhatsApp (diagnosis pages only) and the e-mail as a second way in.
// The e-mail is a plain link and sends no Analytics event.
export const CONTACT_EMAIL = "contato@tetelestai.tech";
export function ContactAlt({ locale, agent = false }) {
  const t = UI[locale];
  return (
    <p className="contact-alt">
      {agent && <span>{t.agentNote}</span>}
      <span>{t.emailAlt} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></span>
    </p>
  );
}

// Closing call to action (navy, like the homepage final call; the circuit artwork was removed on 18/11).
export function CtaFinal({ title, text, note, locale, agent = false, children }) {
  return (
    <section className="cta-final dark" aria-labelledby="cta-final-title">
      <div className="wrap cta-final__in">
        <div className="cta-final__text" data-reveal="">
          <h2 className="h2" id="cta-final-title">{title}</h2>
          <p className="lead">{text}</p>
          {children}
          {locale && <ContactAlt locale={locale} agent={agent} />}
          {note && <p className="note">{note}</p>}
        </div>
      </div>
    </section>
  );
}
