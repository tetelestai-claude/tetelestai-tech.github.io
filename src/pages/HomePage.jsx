import { HOME, UI } from "../home-content.mjs";
import { APPS, CLIENT_PROJECTS } from "../portfolio-content.mjs";
import { PageShell } from "../Layout.jsx";
import { WhatsAppLink } from "../ui.jsx";

// Homepage approved on 2026-11-18 (prototype site-novo-2026-11/fonte/prototipo-home.html): navy opening, closing
// commitments, final call and footer; paper in between. Cyan marks only the action button (on dark) and the focus.
const Check = () => (
  <svg className="hm-chk" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

// "{sites}" and "{apps}" are counted from the portfolio data (client websites and App Store apps), never typed by hand.
const countFacts = text => text.replace("{sites}", CLIENT_PROJECTS.length).replace("{apps}", Object.keys(APPS).length);

function Head({ eyebrow, title, lead, id }) {
  return (
    <div className="hm-head" data-reveal="">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  );
}

export function HomePage({ locale }) {
  const t = UI[locale];
  const home = HOME[locale];
  const { hero, challenge, how, offer, commitments, who } = home;
  return (
    <PageShell locale={locale} page="home">
      <section id="home" className="hm-hero dark" aria-labelledby="hero-title">
        <div className="wrap hm-hero__in">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-title">{hero.title}</h1>
            <p className="hm-lede">{hero.lede}</p>
            <div className="hm-acts">
              <WhatsAppLink message={t.waDiagnosis} className="hm-btn hm-btn--cyan" icon={false}>{hero.cta}</WhatsAppLink>
              <a className="hm-btn hm-btn--ghost" href="#como">{hero.secondary}</a>
            </div>
            <p className="hm-note">{hero.note}</p>
          </div>
          <figure className="hm-ficha" aria-label={hero.ficha.label}>
            <div className="hm-ficha__tag"><span>{hero.ficha.tag[0]}</span><span>{hero.ficha.tag[1]}</span></div>
            <p className="hm-msg">{hero.ficha.message}<small>{hero.ficha.messageNote}</small></p>
            <h3>{hero.ficha.title}</h3>
            <dl>
              {hero.ficha.rows.map(([term, value]) => <div className="hm-row" key={term}><dt>{term}</dt><dd>{value}</dd><Check /></div>)}
            </dl>
            <p className="hm-ficha__foot">{hero.ficha.foot}</p>
          </figure>
        </div>
      </section>

      <section className="hm-facts" aria-label={home.factsLabel}>
        <div className="wrap">
          <ul>
            {home.facts.map(item => <li key={item.title}><b>{countFacts(item.title)}</b><span>{item.text}</span></li>)}
          </ul>
        </div>
      </section>

      <section id="desafio" className="hm-sec" aria-labelledby="desafio-title">
        <div className="wrap">
          <Head eyebrow={challenge.eyebrow} title={challenge.title} lead={challenge.lead} id="desafio-title" />
          <div className="hm-duo" data-reveal-group="">
            {challenge.cards.map(card => (
              <article className="hm-card" data-reveal="" key={card.title}>
                <h3>{card.title}</h3>
                <ul>{card.items.map(([title, text]) => <li key={title}><b>{title}</b><span>{text}</span></li>)}</ul>
                <p className="hm-regra"><b>{card.rule[0]}</b> {card.rule[1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como" className="hm-sec hm-sec--alt" aria-labelledby="como-title">
        <div className="wrap">
          <Head eyebrow={how.eyebrow} title={how.title} id="como-title" />
          <ol className="hm-steps" data-reveal-group="">
            {how.steps.map(([title, text]) => <li className="hm-step" data-reveal="" key={title}><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </div>
      </section>

      <section id="preco" className="hm-sec" aria-labelledby="preco-title">
        <div className="wrap hm-offer">
          <div>
            <Head eyebrow={offer.eyebrow} title={offer.title} id="preco-title" />
            <ul className="hm-list" data-reveal-group="">
              {offer.items.map(([title, text]) => <li data-reveal="" key={title}><h3>{title}</h3><p>{text}</p></li>)}
            </ul>
          </div>
          <div className="hm-price price-card dark" data-reveal="">
            <p className="eyebrow">{offer.price.eyebrow}</p>
            <strong>{offer.price.title}</strong>
            <ul>{offer.price.items.map(item => <li key={item}>{item}</li>)}</ul>
            <WhatsAppLink message={t.waDiagnosis} className="hm-btn hm-btn--cyan" icon={false}>{offer.price.cta}</WhatsAppLink>
          </div>
        </div>
      </section>

      <section id="compromissos" className="hm-sec hm-sec--dark dark" aria-labelledby="compromissos-title">
        <div className="wrap">
          <Head eyebrow={commitments.eyebrow} title={commitments.title} id="compromissos-title" />
          <ul className="hm-quad" data-reveal-group="">
            {commitments.items.map(([title, text]) => <li data-reveal="" key={title}><h3>{title}</h3><p>{text}</p></li>)}
          </ul>
        </div>
      </section>

      <section id="quem-faz" className="hm-sec" aria-labelledby="quem-title">
        <div className="wrap">
          <Head eyebrow={who.eyebrow} title={who.title} id="quem-title" />
          <div className="hm-quem" data-reveal-group="">
            {who.cards.map(card => (
              <article className="hm-card" data-reveal="" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                {card.link && <p><a href={card.link.href} target="_blank" rel="noopener noreferrer">{card.link.label}</a></p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section hm-sec hm-sec--alt" id="duvidas" aria-labelledby="duvidas-title">
        <div className="wrap">
          <Head eyebrow={home.faqTitle.eyebrow} title={home.faqTitle.title} id="duvidas-title" />
          <div className="hm-faq" data-reveal="">
            {home.faqs.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="hm-sec hm-final home-final hm-sec--dark dark" aria-labelledby="final-title">
        <div className="wrap">
          <h2 id="final-title" data-reveal="">{home.final.title}</h2>
          <p data-reveal="">{home.final.text}</p>
          <WhatsAppLink message={t.waDiagnosis} className="hm-btn hm-btn--cyan" icon={false}>{home.final.cta}</WhatsAppLink>
          <small>{home.final.note}</small>
        </div>
      </section>
    </PageShell>
  );
}
