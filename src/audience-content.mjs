// Pages per audience (approved by Carlos on 2026-11-20): law firms and notary and registry offices (cartórios) of the
// Federal District, each with its own address, title and WhatsApp message. They only deepen what the homepage and
// llms.txt already state (pains, four fronts, three steps, entry price, OAB Provimento 205/2021, Código de Normas):
// no new case, figure or promise. The steps, the fronts and the price card are read from HOME, so they cannot drift.
// `label` and `intro` feed the Service structured data; `intro` must stay identical to the visible hero lead.

import { HOME } from "./home-content.mjs";

const NB = " "; // non-breaking space between "R$" and the amount

// Answers shared with the homepage FAQ are taken from it by their question.
function homeFaq(locale, question) {
  const item = HOME[locale].faqs.find(faq => faq.q === question);
  if (!item) throw new Error(`Homepage FAQ not found: ${question}`);
  return item;
}

const PT = {
  advocacia: {
    kind: "audience",
    path: "/advocacia/",
    label: "IA e automação para advocacia",
    serviceArea: "Distrito Federal",
    metaTitle: "IA e WhatsApp para escritórios de advocacia do DF | Tetelestai",
    metaDescription: "Atendimento inicial no WhatsApp, agenda e documentos para escritórios de advocacia do DF, dentro do Provimento 205/2021 da OAB. Diagnóstico grátis.",
    eyebrow: "Advocacia · Distrito Federal",
    heading: "IA e WhatsApp para escritórios de advocacia do DF",
    intro: "O primeiro atendimento no WhatsApp, a agenda e os documentos de rotina funcionando sem depender de alguém livre para responder. O agente coleta dados e documentos e passa a conversa para o advogado; não responde consulta jurídica.",
    ctaLabel: "Pedir diagnóstico grátis no WhatsApp",
    headerCta: "Pedir diagnóstico",
    secondaryLabel: "Ver como funciona",
    waMessage: "Olá! Quero o diagnóstico de IA e automação para o meu escritório.",
    facts: [
      ["Para quem", "Escritórios de advocacia do DF"],
      ["Primeiro passo", "Diagnóstico grátis, de 30 a 45 minutos"],
      ["Preço", `A partir de R$${NB}2.500 de implantação + R$${NB}500 por mês`],
      ["WhatsApp", "Só pela API oficial, sem disparo em massa"],
      ["Regra da OAB", "Provimento 205/2021"],
      ["Dados", "Na conta do escritório"],
    ],
    pains: {
      eyebrow: "O que trava hoje", title: "Três situações que tomam tempo do escritório",
      items: [
        { k: "Atendimento", title: "O cliente chama à noite e fica sem resposta.", text: "Um atendimento inicial explica como o escritório funciona, coleta dados e documentos e passa a conversa para o advogado." },
        { k: "Agenda", title: "A agenda vive em mensagens soltas.", text: "Agendamento pelo WhatsApp e um painel com todos os atendimentos." },
        { k: "Documentos", title: "A equipe redigita o que o cliente já enviou.", text: "Documentos de rotina preenchidos a partir do que foi coletado, para a equipe conferir." },
      ],
    },
    limits: {
      eyebrow: "Dentro da regra da OAB", title: "O que o agente faz e o que ele não faz",
      aside: "O Provimento 205/2021 permite o uso para facilitar a comunicação, sem afastar o atendimento pessoal nem a responsabilidade do advogado.",
      does: { badge: "Faz", title: "Recebe, organiza e passa adiante", items: ["Explica como o escritório funciona.", "Responde às primeiras dúvidas sobre o atendimento.", "Coleta dados e documentos.", "Marca o horário na conversa.", "Passa a conversa para o advogado."] },
      doesNot: { badge: "Não faz", title: "O que continua com o advogado", items: ["Não responde consulta jurídica.", "Não fala de honorários.", "Não substitui o atendimento pessoal.", "Não faz disparo em massa."] },
    },
    how: { eyebrow: "Como funciona", title: "Do diagnóstico à operação, em três passos" },
    offer: { eyebrow: "O que entregamos", title: "Quatro frentes. O escritório escolhe por onde começar." },
    faqTitle: { eyebrow: "Dúvidas", title: "Perguntas de escritórios de advocacia" },
    faqs: [
      homeFaq("pt", "Escritório de advocacia pode usar atendimento automático?"),
      { q: "O agente responde dúvidas jurídicas?", a: "Não. Ele explica como o escritório funciona, coleta dados e documentos e passa a conversa para o advogado. Não responde consulta jurídica e não fala de honorários." },
      { q: "Onde ficam os dados dos clientes do escritório?", a: "Nas contas do seu escritório. A plataforma do agente e a API do WhatsApp são contratadas no nome do escritório; a TETELESTAI acessa só o necessário para implantar e acompanhar." },
      homeFaq("pt", "Quanto custa?"),
      homeFaq("pt", "Preciso trocar o número do WhatsApp?"),
      homeFaq("pt", "E se eu quiser cancelar?"),
      { q: "Vocês garantem mais clientes?", a: "Não. O que entregamos é atendimento mais rápido e equipe com menos trabalho repetido. Resultado comercial depende de fatores que não controlamos." },
    ],
    final: { title: "Peça o diagnóstico do seu escritório.", text: "Em 30 a 45 minutos você sai com o desenho do que muda no seu atendimento, sem compromisso." },
  },
  cartorios: {
    kind: "audience",
    path: "/cartorios/",
    label: "IA e automação para cartórios",
    serviceArea: "Distrito Federal",
    metaTitle: "IA e WhatsApp para cartórios do DF | Tetelestai",
    metaDescription: "Atendimento no WhatsApp, agendamento de atos e transcrição para ata notarial para cartórios do DF, com as ferramentas na conta da serventia. Diagnóstico grátis.",
    eyebrow: "Cartórios · Distrito Federal",
    heading: "IA e WhatsApp para cartórios do DF",
    intro: "Um atendimento inicial no WhatsApp informa documentos, horários e andamento e passa o caso para o escrevente, para o balcão não responder as mesmas perguntas o dia todo. As ferramentas ficam na conta da serventia.",
    ctaLabel: "Pedir diagnóstico grátis no WhatsApp",
    headerCta: "Pedir diagnóstico",
    secondaryLabel: "Ver como funciona",
    waMessage: "Olá! Quero o diagnóstico de IA e automação para o meu cartório.",
    facts: [
      ["Para quem", "Cartórios do DF"],
      ["Primeiro passo", "Diagnóstico grátis, de 30 a 45 minutos"],
      ["Preço", `A partir de R$${NB}2.500 de implantação + R$${NB}500 por mês`],
      ["WhatsApp", "Só pela API oficial, sem disparo em massa"],
      ["Regras", "Código de Normas dos cartórios do DF"],
      ["Ferramentas", "Na conta da serventia"],
    ],
    pains: {
      eyebrow: "O que trava hoje", title: "Três situações que tomam tempo da serventia",
      items: [
        { k: "Balcão", title: "O balcão responde as mesmas perguntas o dia todo.", text: "Um atendimento inicial informa documentos, horários e andamento, e passa o caso para o escrevente." },
        { k: "Ata notarial", title: "Transcrever conversa para ata notarial toma horas.", text: "O Exato Teor entrega texto, áudio e mídia organizados para o escrevente conferir." },
        { k: "Agenda", title: "Os atos são marcados por telefone.", text: "Agendamento pelo WhatsApp e painel do dia para a equipe." },
      ],
    },
    limits: {
      eyebrow: "Dentro das regras da serventia", title: "O que a automação faz e o que ela não faz",
      aside: "Seguimos o Código de Normas dos cartórios do DF no que a automação pode e não pode fazer.",
      does: { badge: "Faz", title: "Informa, agenda e passa adiante", items: ["Informa documentos, horários e andamento.", "Marca os atos pelo WhatsApp.", "Mostra o painel do dia para a equipe.", "Passa o caso para o escrevente."] },
      doesNot: { badge: "Não faz", title: "O que continua com a serventia", items: ["Não substitui a conferência do escrevente.", "Não tira as ferramentas da conta da serventia.", "O cartório não cobra nada em nosso nome.", "Não faz disparo em massa."] },
    },
    product: {
      eyebrow: "Produto próprio", title: "Exato Teor",
      text: "Produto da TETELESTAI no ar. Transcreve conversas de WhatsApp para ata notarial, com texto, áudio e mídia organizados para conferência.",
      link: { label: "Conhecer o Exato Teor", href: "https://exatoteor.com.br/" },
    },
    how: { eyebrow: "Como funciona", title: "Do diagnóstico à operação, em três passos" },
    offer: { eyebrow: "O que entregamos", title: "Quatro frentes. A serventia escolhe por onde começar." },
    faqTitle: { eyebrow: "Dúvidas", title: "Perguntas de cartórios" },
    faqs: [
      { q: "O cartório cobra alguma coisa em nome da Tetelestai?", a: "Não. O cartório não cobra nada em nosso nome. As ferramentas ficam na conta da serventia, sob a responsabilidade do titular." },
      { q: "O que o atendimento inicial responde?", a: "Informa documentos, horários e andamento e passa o caso para o escrevente." },
      { q: "Como o Exato Teor entra no trabalho do cartório?", a: "O Exato Teor é um produto da TETELESTAI que transcreve conversas de WhatsApp para ata notarial e entrega texto, áudio e mídia organizados para o escrevente conferir." },
      { q: "Quais regras a automação segue?", a: "Seguimos o Código de Normas dos cartórios do DF no que a automação pode e não pode fazer. O WhatsApp é automatizado só pela API oficial, sem disparo em massa." },
      { q: "Onde ficam os dados de quem procura o cartório?", a: "Nas contas da sua serventia. A plataforma do agente e a API do WhatsApp são contratadas no nome da serventia; a TETELESTAI acessa só o necessário para implantar e acompanhar." },
      homeFaq("pt", "Quanto custa?"),
      homeFaq("pt", "Preciso trocar o número do WhatsApp?"),
      homeFaq("pt", "E se eu quiser cancelar?"),
      { q: "Vocês garantem mais atos?", a: "Não. O que entregamos é atendimento mais rápido e equipe com menos trabalho repetido. Resultado comercial depende de fatores que não controlamos." },
    ],
    final: { title: "Peça o diagnóstico do seu cartório.", text: "Em 30 a 45 minutos você sai com o desenho do que muda no seu atendimento, sem compromisso." },
  },
};

const EN = {
  advocacia: {
    kind: "audience",
    path: "/en/law-firms/",
    label: "AI and automation for law firms",
    serviceArea: "Distrito Federal",
    metaTitle: "AI and WhatsApp for law firms in Brasília | Tetelestai",
    metaDescription: "First-contact service on WhatsApp, scheduling and documents for law firms in the Federal District, within the Brazilian Bar Association's Provimento 205/2021. Free diagnosis.",
    eyebrow: "Law firms · Federal District",
    heading: "AI and WhatsApp for law firms in the Federal District",
    intro: "First contact on WhatsApp, scheduling and routine documents that keep working without waiting for someone to be free to answer. The agent collects data and documents and hands the conversation over to the lawyer; it does not answer legal consultations.",
    ctaLabel: "Request a free diagnosis on WhatsApp",
    headerCta: "Request a diagnosis",
    secondaryLabel: "See how it works",
    waMessage: "Hello! I'd like the AI and automation diagnosis for my law firm.",
    facts: [
      ["Who it's for", "Law firms in the Federal District"],
      ["First step", "Free diagnosis, 30 to 45 minutes"],
      ["Price", `From R$${NB}2,500 in setup + R$${NB}500 per month`],
      ["WhatsApp", "Official API only, no mass messaging"],
      ["Bar Association rule", "OAB Provimento 205/2021"],
      ["Data", "In the firm's own account"],
    ],
    pains: {
      eyebrow: "What gets stuck today", title: "Three situations that take the firm's time",
      items: [
        { k: "Service", title: "The client messages at night and gets no answer.", text: "A first-contact assistant explains how the firm works, collects data and documents and hands the conversation over to the lawyer." },
        { k: "Calendar", title: "The calendar lives in scattered messages.", text: "Scheduling over WhatsApp and a dashboard with every appointment." },
        { k: "Documents", title: "The team retypes what the client already sent.", text: "Routine documents filled in from what was collected, for the team to check." },
      ],
    },
    limits: {
      eyebrow: "Within the Bar Association rule", title: "What the agent does and what it does not do",
      aside: "The Brazilian Bar Association's (OAB) Provimento 205/2021 allows its use to ease communication, without replacing personal service or the lawyer's responsibility.",
      does: { badge: "It does", title: "Receives, organizes and hands over", items: ["Explains how the firm works.", "Answers first questions about the service.", "Collects data and documents.", "Books the appointment in the conversation.", "Hands the conversation over to the lawyer."] },
      doesNot: { badge: "It does not", title: "What stays with the lawyer", items: ["It does not answer legal consultations.", "It does not discuss fees.", "It does not replace personal service.", "It does not send mass messages."] },
    },
    how: { eyebrow: "How it works", title: "From diagnosis to operation, in three steps" },
    offer: { eyebrow: "What we deliver", title: "Four fronts. The firm chooses where to start." },
    faqTitle: { eyebrow: "FAQ", title: "Questions from law firms" },
    faqs: [
      homeFaq("en", "Can a law firm use automated customer service?"),
      { q: "Does the agent answer legal questions?", a: "No. It explains how the firm works, collects data and documents and hands the conversation over to the lawyer. It does not answer legal consultations and does not discuss fees." },
      { q: "Where is the data of the firm's clients kept?", a: "In your firm's own accounts. The agent platform and the WhatsApp API are contracted in the firm's name; TETELESTAI accesses only what is needed to set up and follow up." },
      homeFaq("en", "How much does it cost?"),
      homeFaq("en", "Do I need to change my WhatsApp number?"),
      homeFaq("en", "What if I want to cancel?"),
      { q: "Do you guarantee more clients?", a: "No. What we deliver is faster service and a team with less repetitive work. Commercial results depend on factors we do not control." },
    ],
    final: { title: "Request the diagnosis for your firm.", text: "In 30 to 45 minutes you leave with an outline of what changes in your customer service, with no commitment." },
  },
  cartorios: {
    kind: "audience",
    path: "/en/notary-offices/",
    label: "AI and automation for notary offices",
    serviceArea: "Distrito Federal",
    metaTitle: "AI and WhatsApp for notary offices in Brasília | Tetelestai",
    metaDescription: "WhatsApp service, booking of acts and transcription for notarial records for notary offices in the Federal District, with the tools in the office's own account. Free diagnosis.",
    eyebrow: "Notary offices · Federal District",
    heading: "AI and WhatsApp for notary offices in the Federal District",
    intro: "First contact on WhatsApp gives out documents, opening hours and case status and hands the case over to the clerk, so the counter stops answering the same questions all day. The tools stay in the office's own account.",
    ctaLabel: "Request a free diagnosis on WhatsApp",
    headerCta: "Request a diagnosis",
    secondaryLabel: "See how it works",
    waMessage: "Hello! I'd like the AI and automation diagnosis for my notary office.",
    facts: [
      ["Who it's for", "Notary and registry offices in the Federal District"],
      ["First step", "Free diagnosis, 30 to 45 minutes"],
      ["Price", `From R$${NB}2,500 in setup + R$${NB}500 per month`],
      ["WhatsApp", "Official API only, no mass messaging"],
      ["Rules", "Federal District notary offices' Code of Norms"],
      ["Tools", "In the office's own account"],
    ],
    pains: {
      eyebrow: "What gets stuck today", title: "Three situations that take the office's time",
      items: [
        { k: "Counter", title: "The counter answers the same questions all day.", text: "A first-contact assistant gives out documents, opening hours and case status, and hands the case over to the clerk (escrevente)." },
        { k: "Notarial record", title: "Transcribing a conversation for a notarial record takes hours.", text: "Exato Teor delivers text, audio and media organized for the clerk to check." },
        { k: "Calendar", title: "Notarial acts are booked by phone.", text: "Scheduling over WhatsApp and a daily dashboard for the team." },
      ],
    },
    limits: {
      eyebrow: "Within the office's rules", title: "What the automation does and what it does not do",
      aside: "We follow the Federal District notary offices' Code of Norms on what automation can and cannot do.",
      does: { badge: "It does", title: "Informs, books and hands over", items: ["Gives out documents, opening hours and case status.", "Books notarial acts over WhatsApp.", "Shows the daily dashboard to the team.", "Hands the case over to the clerk."] },
      doesNot: { badge: "It does not", title: "What stays with the office", items: ["It does not replace the clerk's check.", "It does not take the tools out of the office's account.", "The office charges nothing in our name.", "It does not send mass messages."] },
    },
    product: {
      eyebrow: "Our own product", title: "Exato Teor",
      text: "A TETELESTAI product that is live. It transcribes WhatsApp conversations for notarial records, with text, audio and media organized for checking.",
      link: { label: "Learn about Exato Teor (Portuguese)", href: "https://exatoteor.com.br/" },
    },
    how: { eyebrow: "How it works", title: "From diagnosis to operation, in three steps" },
    offer: { eyebrow: "What we deliver", title: "Four fronts. The office chooses where to start." },
    faqTitle: { eyebrow: "FAQ", title: "Questions from notary offices" },
    faqs: [
      { q: "Does the notary office charge anything in Tetelestai's name?", a: "No. The notary office charges nothing in our name. The tools stay in the account of the office (serventia), under the responsibility of its titular notary." },
      { q: "What does the first-contact service answer?", a: "It gives out documents, opening hours and case status and hands the case over to the clerk." },
      { q: "Where does Exato Teor fit in the office's work?", a: "Exato Teor is a TETELESTAI product that transcribes WhatsApp conversations for notarial records and delivers text, audio and media organized for the clerk to check." },
      { q: "Which rules does the automation follow?", a: "We follow the Federal District notary offices' Code of Norms on what automation can and cannot do. WhatsApp is automated only through the official API, with no mass messaging." },
      { q: "Where is the data of the people who contact the office kept?", a: "In your office's own accounts. The agent platform and the WhatsApp API are contracted in the office's name; TETELESTAI accesses only what is needed to set up and follow up." },
      homeFaq("en", "How much does it cost?"),
      homeFaq("en", "Do I need to change my WhatsApp number?"),
      homeFaq("en", "What if I want to cancel?"),
      { q: "Do you guarantee more notarial acts?", a: "No. What we deliver is faster service and a team with less repetitive work. Commercial results depend on factors we do not control." },
    ],
    final: { title: "Request the diagnosis for your notary office.", text: "In 30 to 45 minutes you leave with an outline of what changes in your customer service, with no commitment." },
  },
};

export const AUDIENCE_PAGES = { pt: PT, en: EN };
export const AUDIENCE_KEYS = Object.keys(PT);
