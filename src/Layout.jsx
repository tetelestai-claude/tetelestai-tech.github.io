import { useEffect, useRef, useState } from "react";
import { AnalyticsPreferencesButton } from "./AnalyticsConsent.jsx";
import { getAnalytics } from "./analytics.mjs";
import { INSTAGRAM_URL } from "./contact.mjs";
import { HOME, UI } from "./home-content.mjs";
import { LEGAL_CONTENT, LEGAL_PATHS } from "./legal-content.mjs";
import { equivalentPaths, portfolioFor, servicesFor } from "./localized-content.mjs";
import { CLIENT_PROJECTS } from "./portfolio-content.mjs";
import { FloatingWhatsApp, IconArrow, IconArrowBack, SymbolPicture, WhatsAppLink } from "./ui.jsx";

// Pages whose main action is the landing page (Carlos, 28/10; the home moved to the diagnosis on 18/11).
const LANDING_FIRST = ["landingPages"];
// The homepage asks for the free AI and automation diagnosis (Carlos, 18/11).
const DIAGNOSIS_FIRST = ["home"];

export function pathFor(key, locale) {
  if (key === "home") return HOME[locale].path;
  if (key === "apps") return `${portfolioFor(locale).portfolio.path}#apps`;
  return servicesFor(locale)[key]?.path ?? portfolioFor(locale)[key]?.path ?? LEGAL_PATHS[key]?.[locale] ?? HOME[locale].path;
}

export function languagePaths(page) {
  return LEGAL_PATHS[page] ?? equivalentPaths(page);
}

function Brand({ locale, sizes = "50px" }) {
  return (
    <a className="brand" href={pathFor("home", locale)} aria-label={UI[locale].brandLabel}>
      <SymbolPicture sizes={sizes} width={50} height={50} />
      <span className="brand__name">TETELESTAI</span>
    </a>
  );
}

function LanguageSwitch({ locale, page }) {
  const paths = languagePaths(page);
  return (
    <div className="lang" role="group" aria-label={UI[locale].languageLabel}>
      {locale === "pt"
        ? <><span aria-current="true">PT</span><a href={paths.en} lang="en" hrefLang="en">EN</a></>
        : <><a href={paths.pt} lang="pt-BR" hrefLang="pt-BR">PT</a><span aria-current="true">EN</span></>}
    </div>
  );
}

const isCurrent = (key, page) => key === page || (key === "portfolio" && CLIENT_PROJECTS.some(item => item.key === page));

export function Header({ locale, page }) {
  const t = UI[locale];
  const home = DIAGNOSIS_FIRST.includes(page);
  const links = home ? t.homeNav : t.nav.map(([key, label]) => [pathFor(key, locale), label, key]);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef(null);
  const menu = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector("a")?.focus();
    const onKey = event => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const onResize = () => { if (window.innerWidth > 980) setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return <>
    <header className={`site-head${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap site-head__in">
        <Brand locale={locale} />
        <nav className="nav" aria-label={t.navLabel}>
          {links.map(([href, label, key]) => <a className="nav__link" href={href} aria-current={key && isCurrent(key, page) ? "page" : undefined} key={href}>{label}</a>)}
        </nav>
        <div className="head-cta">
          <LanguageSwitch locale={locale} page={page} />
          {home
            ? <WhatsAppLink message={t.waDiagnosis} className="btn btn--sm head-diag" icon={false}><span className="head-diag__long">{t.ctaDiagnosis}</span><span className="head-diag__short">{t.ctaDiagnosisShort}</span></WhatsAppLink>
            : LANDING_FIRST.includes(page)
              ? <WhatsAppLink message={t.waLanding} className="btn btn--sm" icon={false}>{t.ctaLanding}</WhatsAppLink>
              : <WhatsAppLink message={t.waDefault} className="btn btn--sm" icon={false}>{t.cta}</WhatsAppLink>}
          <button ref={toggle} className="menu-btn" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t.menuClose : t.menuOpen} onClick={() => setOpen(value => !value)}><span /></button>
        </div>
      </div>
    </header>
    <div ref={menu} className={`mobile-menu${open ? " is-open" : ""}`} id="mobile-menu" inert={open ? undefined : true} onClick={event => { if (event.target.closest("a")) setOpen(false); }}>
      {(home ? links : [[pathFor("home", locale), t.homeLabel, "home"], ...links]).map(([href, label, key]) => <a className="mm-link" href={href} aria-current={key && isCurrent(key, page) ? "page" : undefined} key={href}>{label}<IconArrow /></a>)}
      {home
        ? <WhatsAppLink message={t.waDiagnosis}>{t.ctaDiagnosisLong}</WhatsAppLink>
        : LANDING_FIRST.includes(page)
          ? <WhatsAppLink message={t.waLanding}>{t.ctaLandingLong}</WhatsAppLink>
          : <WhatsAppLink message={t.waDefault}>{t.ctaWhatsApp}</WhatsAppLink>}
      <LanguageSwitch locale={locale} page={page} />
    </div>
  </>;
}

// Minimal header for app support pages linked from the App Store.
export function SupportHeader() {
  return (
    <header className="site-head">
      <div className="wrap site-head__in">
        <Brand locale="pt" />
        <a className="head-back" href="/"><IconArrowBack />Site da Tetelestai</a>
      </div>
    </header>
  );
}

// Signature with descriptor (Carlos, 18/11): the protected symbol, the wordmark and what the company does.
function Signature({ locale }) {
  const f = UI[locale].footer;
  return (
    <a className="brand signature" href={pathFor("home", locale)} aria-label={UI[locale].brandLabel}>
      <SymbolPicture sizes="50px" width={50} height={50} loading="lazy" />
      <span className="signature__text"><span className="brand__name">TETELESTAI</span><span className="signature__desc">{f.descriptor}</span></span>
    </a>
  );
}

// Internal pages and external products; App Store links keep their consented `app_store_click` event.
function FooterLink({ link, locale }) {
  if (link.key) return <a href={pathFor(link.key, locale)}>{link.label}</a>;
  return <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={link.app ? () => getAnalytics()?.trackAppStore("button", link.app) : undefined}>{link.label}</a>;
}

export function Footer({ locale, page }) {
  const t = UI[locale];
  const f = t.footer;
  const other = locale === "pt" ? "en" : "pt";
  return (
    <footer className="site-foot">
      <div className="wrap site-foot__in">
        <div className="site-foot__top">
          <div className="site-foot__brand">
            <Signature locale={locale} />
            <p>{f.tagline}</p>
            <p className="site-foot__people">{f.location}</p>
          </div>
          <div className="site-foot__cols">
            {f.columns.map(column => (
              <div className="site-foot__col" key={column.title}>
                <h2>{column.title}</h2>
                {column.links.map(link => <FooterLink link={link} locale={locale} key={link.label} />)}
              </div>
            ))}
            <div className="site-foot__col">
              <h2>{f.contact}</h2>
              <WhatsAppLink message={DIAGNOSIS_FIRST.includes(page) ? t.waDiagnosis : t.waDefault} className={null} icon={false}>WhatsApp</WhatsAppLink>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="site-foot__bottom">
          <span>{f.company}</span>
          <nav className="site-foot__legal" aria-label={LEGAL_CONTENT[locale].navigation}>
            {Object.entries(LEGAL_PATHS).map(([key, paths]) => <a href={paths[locale]} key={key}>{LEGAL_CONTENT[locale][key].label}</a>)}
            <a href={pathFor("home", other)} lang={other === "en" ? "en" : "pt-BR"} hrefLang={other === "en" ? "en" : "pt-BR"}>{f.otherLanguage}</a>
            <AnalyticsPreferencesButton locale={locale} />
          </nav>
          <p className="site-foot__verse"><span>{f.verse}</span>{" "}<span>{f.verseReference}</span></p>
        </div>
      </div>
    </footer>
  );
}

// Mobile-only purchase bar (career page), shown between the hero and the final call to action.
export function StickyCta({ children }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const final = document.querySelector(".cta-final");
    if (!hero || !("IntersectionObserver" in window)) return undefined;
    let heroVisible = true; let finalVisible = false;
    const update = () => setOn(!heroVisible && !finalVisible);
    const heroObserver = new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; update(); });
    heroObserver.observe(hero);
    const finalObserver = final && new IntersectionObserver(entries => { finalVisible = entries[0].isIntersecting; update(); });
    if (final) finalObserver.observe(final);
    return () => { heroObserver.disconnect(); finalObserver?.disconnect(); };
  }, []);
  return <div className={`sticky-cta${on ? " is-on" : ""}`} aria-hidden={on ? undefined : "true"} inert={on ? undefined : true}>{children}</div>;
}

// `whatsapp` sets the round floating button's message and label; `sticky` keeps a purchase bar
// instead (none now that the career page is gone); `sticky={null}` shows neither (legal pages).
export function PageShell({ locale, page, sticky, whatsapp, children }) {
  const t = UI[locale];
  const contact = whatsapp ?? (DIAGNOSIS_FIRST.includes(page) ? { message: t.waDiagnosis } : LANDING_FIRST.includes(page) ? { message: t.waLanding } : { message: t.waDefault });
  return (
    <div className={`site-shell${DIAGNOSIS_FIRST.includes(page) ? " site-shell--home" : ""}`}>
      <a className="skip-link" href="#main-content">{t.skip}</a>
      <Header locale={locale} page={page} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} page={page} />
      {sticky ? <StickyCta>{sticky}</StickyCta> : sticky !== null && <FloatingWhatsApp message={contact.message} label={contact.label ?? t.floatLabel} />}
    </div>
  );
}
