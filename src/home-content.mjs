// Shared interface copy and homepage content (PT/EN).
// Positioning approved by Carlos on 2026-11-18: the homepage presents AI and automation for law firms and
// notary and registry offices (cartórios) in the Federal District, and asks for a free diagnosis over WhatsApp.
// Websites and landing pages (R$ 297 + R$ 97/month) live on their own pages. Texts come from the approved
// prototype (site-novo-2026-11/fonte/prototipo-home.html); do not add clients, figures or promises.

import { APP_STORE_LINKS, DE_ROLE_APP_STORE } from "./app-store-links.mjs";

const NB = " "; // non-breaking space between "R$" and the amount

export const UI = {
  pt: {
    lang: "pt-BR",
    skip: "Pular para o conteúdo",
    homeLabel: "Início",
    brandLabel: "Tetelestai — início",
    navLabel: "Navegação principal",
    nav: [
      ["sites", "Sites"], ["landingPages", "Landing pages"], ["portfolio", "Projetos"],
    ],
    // Anchors of the homepage header and menu.
    homeNav: [["#desafio", "Para quem"], ["#como", "Como funciona"], ["#preco", "Preço"], ["#duvidas", "Dúvidas"]],
    cta: "Pedir orçamento",
    ctaWhatsApp: "Pedir orçamento no WhatsApp",
    waDefault: "Olá! Vim pelo site da Tetelestai e quero um orçamento.",
    // Primary goal of the homepage (Carlos, 18/11): a free diagnosis through WhatsApp.
    ctaDiagnosis: "Pedir diagnóstico",
    ctaDiagnosisShort: "Diagnóstico",
    ctaDiagnosisLong: "Pedir diagnóstico grátis no WhatsApp",
    waDiagnosis: "Olá! Quero o diagnóstico de IA e automação.",
    // Under the final button (20/11): the e-mail as a second way in, and who answers first on WhatsApp (diagnosis pages).
    emailAlt: "Prefere e-mail?",
    agentNote: "Quem responde primeiro é a nossa assistente virtual de IA, o mesmo tipo de atendimento que oferecemos. Você pode pedir atendimento humano a qualquer momento.",
    // Landing page offer (R$ 297 + R$ 97/month since 09/11), kept on the landing page's own page.
    ctaLanding: "Landing page R$ 297 + R$ 97/mês",
    ctaLandingLong: "Quero minha landing page",
    waLanding: "Olá! Quero a landing page de R$ 297 + R$ 97/mês.",
    floatLabel: "Conversar no WhatsApp",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    languageLabel: "Idioma",
    breadcrumbLabel: "Caminho da página",
    visitSite: "Visitar o site",
    seeCase: "Ver como foi feito",
    safety: "No primeiro contato, não envie senhas, dados bancários, documentos de identidade, currículos completos ou outras informações sensíveis.",
    footer: {
      descriptor: "IA e automação · advocacia e cartórios",
      tagline: "Tecnologia com propósito.",
      location: "Brasília-DF · atendimento online em todo o Brasil",
      columns: [
        { title: "Também fazemos", links: [{ label: "Sites e landing pages", key: "landingPages" }, { label: "Projetos entregues", key: "portfolio" }] },
        { title: "Outros produtos", links: [
          { label: "Exato Teor", href: "https://exatoteor.com.br/" },
          { label: "De Rolê", href: DE_ROLE_APP_STORE.url, app: DE_ROLE_APP_STORE.id },
          { label: "À Mesa", href: "https://amesa.app/" },
          { label: "Tempo de Recarga", href: APP_STORE_LINKS.button, app: "6815378368" },
        ] },
      ],
      contact: "Contato",
      company: "Tetelestai Soluções em Tecnologia Ltda. · CNPJ 58.138.258/0001-39",
      otherLanguage: "English",
      verse: "Está consumado!",
      verseReference: "João 19:30",
    },
    notFound: {
      kicker: "Página não encontrada",
      title: "Este endereço não existe",
      text: "Volte ao início para conhecer as soluções da Tetelestai.",
      back: "Ir para o início",
      cta: "Pedir diagnóstico grátis no WhatsApp",
      linksLabel: "Páginas do site",
      links: [
        { key: "advocacia", title: "Escritórios de advocacia", text: "IA e WhatsApp para o primeiro atendimento, a agenda e os documentos." },
        { key: "cartorios", title: "Cartórios", text: "Atendimento inicial, agendamento de atos e transcrição para ata notarial." },
        { key: "landingPages", title: "Sites e landing pages", text: "Página no ar com domínio, hospedagem e atualização mensal." },
        { key: "portfolio", title: "Projetos entregues", text: "Sites de clientes no ar e aplicativos na App Store." },
      ],
      metaTitle: "Página não encontrada | Tetelestai",
    },
  },
  en: {
    lang: "en",
    skip: "Skip to content",
    homeLabel: "Home",
    brandLabel: "Tetelestai — home",
    navLabel: "Primary navigation",
    nav: [
      ["sites", "Websites"], ["landingPages", "Landing pages"], ["portfolio", "Projects"],
    ],
    homeNav: [["#desafio", "Who it's for"], ["#como", "How it works"], ["#preco", "Pricing"], ["#duvidas", "FAQ"]],
    cta: "Get a quote",
    ctaWhatsApp: "Get a quote on WhatsApp",
    waDefault: "Hi! I found Tetelestai's website and I'd like a quote.",
    ctaDiagnosis: "Request a diagnosis",
    ctaDiagnosisShort: "Diagnosis",
    ctaDiagnosisLong: "Request a free diagnosis on WhatsApp",
    waDiagnosis: "Hello! I'd like the AI and automation diagnosis.",
    emailAlt: "Prefer email?",
    agentNote: "The first reply comes from our AI virtual assistant, the same kind of service we offer. You can ask for a person at any time.",
    ctaLanding: "Landing page R$ 297 + R$ 97/month",
    ctaLandingLong: "I want my landing page",
    waLanding: "Hi! I'd like the R$ 297 + R$ 97/month landing page.",
    floatLabel: "Chat on WhatsApp",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    languageLabel: "Language",
    breadcrumbLabel: "Breadcrumb",
    visitSite: "Visit the website (Portuguese)",
    seeCase: "See how it was made",
    safety: "Do not send passwords, banking details, identity documents, full CVs or other sensitive information in the first contact.",
    footer: {
      descriptor: "AI and automation · law firms and notary offices",
      tagline: "Technology with purpose.",
      location: "Based in Brasília, working online across Brazil and abroad",
      columns: [
        { title: "We also offer", links: [{ label: "Websites and landing pages", key: "landingPages" }, { label: "Delivered projects", key: "portfolio" }] },
        { title: "Other products", links: [
          { label: "Exato Teor", href: "https://exatoteor.com.br/" },
          { label: "De Rolê", href: DE_ROLE_APP_STORE.url, app: DE_ROLE_APP_STORE.id },
          { label: "À Mesa", href: "https://amesa.app/" },
          { label: "Tempo de Recarga", href: APP_STORE_LINKS.button, app: "6815378368" },
        ] },
      ],
      contact: "Contact",
      company: "Tetelestai Soluções em Tecnologia Ltda. · CNPJ 58.138.258/0001-39",
      otherLanguage: "Português",
      verse: "It is finished!",
      verseReference: "John 19:30",
    },
    notFound: {
      kicker: "Page not found",
      title: "This address does not exist",
      text: "Return home to explore Tetelestai's solutions.",
      back: "Go to the homepage",
      cta: "Request a free diagnosis on WhatsApp",
      linksLabel: "Pages of the site",
      links: [
        { key: "advocacia", title: "Law firms", text: "AI and WhatsApp for first contact, scheduling and documents." },
        { key: "cartorios", title: "Notary offices", text: "First contact, booking of acts and transcription for notarial records." },
        { key: "landingPages", title: "Websites and landing pages", text: "A page live with domain, hosting and a monthly update." },
        { key: "portfolio", title: "Delivered projects", text: "Client websites live and apps on the App Store." },
      ],
      metaTitle: "Page not found | Tetelestai",
    },
  },
};

export const HOME = {
  pt: {
    path: "/",
    metaTitle: "IA e automação para advocacia e cartórios do DF | Tetelestai",
    metaDescription: "IA e automação para escritórios de advocacia e cartórios do DF: atendimento, agenda e documentos, com o dado dentro da conta do cliente.",
    hero: {
      eyebrow: "IA e automação · Distrito Federal",
      title: "IA e automação para escritórios de advocacia e cartórios do DF.",
      lede: "Atendimento no WhatsApp, agenda e documentos funcionando sem depender de alguém livre para responder. O dado fica na conta do seu escritório ou da sua serventia.",
      cta: "Pedir diagnóstico grátis no WhatsApp",
      secondary: "Ver como funciona",
      note: "De 30 a 45 minutos, por vídeo ou visita. Termina em proposta por escrito.",
      ficha: {
        label: "Ilustração: uma mensagem de WhatsApp vira ficha de atendimento conferida",
        // Two examples, law firm first (approved on 2026-11-18): the opening must not read as "only notarial records".
        // The law firm example shows intake and hand-off only, never an answer to a legal question (OAB 205/2021).
        switchLabel: "Exemplo de atendimento",
        tagLabel: "Primeiro contato",
        messageNote: "Mensagem recebida fora do expediente",
        title: "Ficha de atendimento",
        terms: ["Assunto", "Documentos", "Horário", "Passou para"],
        examples: [
          { name: "Escritório", when: "terça, 19h42", message: "Boa noite. Fui demitido e não recebi as verbas. Vocês atendem esse tipo de caso?", values: ["Trabalhista · rescisão", "Lista enviada, 2 recebidos", "Quinta, 10h", "Advogado responsável"] },
          { name: "Cartório", when: "quarta, 17h48", message: "Boa tarde. Quais documentos preciso para a escritura de compra e venda?", values: ["Escritura de compra e venda", "Lista enviada, 3 recebidos", "Sexta, 14h", "Escrevente"] },
        ],
        foot: "Ilustração do fluxo, sem dados de clientes.",
      },
    },
    // "{sites}" and "{apps}" are counted from the portfolio data, never typed by hand.
    factsLabel: "Fatos",
    facts: [
      { title: "Exato Teor no ar", text: "Produto próprio: transcrição de conversas de WhatsApp para ata notarial." },
      { title: "14 anos em banco", text: "Liderança técnica onde sigilo e auditoria são rotina." },
      { title: "{sites} sites e {apps} apps", text: "Entregues a clientes e publicados na App Store." },
      { title: "WhatsApp oficial", text: "Só pela API oficial, sem disparo em massa." },
    ],
    challenge: {
      eyebrow: "Para quem", title: "Qual é o seu desafio hoje?", lead: "O trabalho começa pelo que mais toma tempo da sua equipe.",
      cards: [
        {
          title: "Escritório de advocacia",
          items: [
            ["O cliente chama à noite e fica sem resposta.", "Um atendimento inicial explica como o escritório funciona, coleta dados e documentos e passa a conversa para o advogado."],
            ["A agenda vive em mensagens soltas.", "Agendamento pelo WhatsApp e um painel com todos os atendimentos."],
            ["A equipe redigita o que o cliente já enviou.", "Documentos de rotina preenchidos a partir do que foi coletado, para a equipe conferir."],
          ],
          rule: ["Regra da OAB respeitada.", "O agente não responde consulta jurídica e não fala de honorários (Provimento 205/2021)."],
          // Page of this audience (20/11).
          link: { label: "Ver a página para escritórios de advocacia", key: "advocacia" },
        },
        {
          title: "Cartório",
          items: [
            ["O balcão responde as mesmas perguntas o dia todo.", "Um atendimento inicial informa documentos, horários e andamento, e passa o caso para o escrevente."],
            ["Transcrever conversa para ata notarial toma horas.", "O Exato Teor entrega texto, áudio e mídia organizados para o escrevente conferir."],
            ["Os atos são marcados por telefone.", "Agendamento pelo WhatsApp e painel do dia para a equipe."],
          ],
          rule: ["O cartório não cobra nada em nosso nome.", "As ferramentas ficam na conta da serventia, sob a responsabilidade do titular."],
          // Page of this audience (20/11).
          link: { label: "Ver a página para cartórios", key: "cartorios" },
        },
      ],
    },
    how: {
      eyebrow: "Como funciona", title: "Do diagnóstico à operação, em três passos.",
      steps: [
        ["Diagnóstico grátis", "De 30 a 45 minutos, por vídeo ou visita. Você mostra como o atendimento acontece hoje e onde ele trava."],
        ["Proposta por escrito", "Três opções em PDF, com o que entra em cada uma, o preço e o prazo. Sem promessa de resultado."],
        ["Implantação e acompanhamento", "Colocamos no ar na sua conta. Toda semana uma pessoa revisa as conversas e ajusta o que for preciso."],
      ],
    },
    offer: {
      eyebrow: "O que entregamos", title: "Quatro frentes. Você escolhe por onde começar.",
      items: [
        ["Atendimento inicial no WhatsApp", "Primeiras dúvidas, coleta de dados e documentos, passagem para uma pessoa."],
        ["Agendamento e painel", "Horários marcados na conversa e a visão do dia para a equipe."],
        ["Automação de documentos", "O que se repete é preenchido sozinho e conferido por quem assina."],
        ["Treinamento da equipe", "Para a sua equipe usar IA no trabalho com segurança."],
      ],
      price: {
        eyebrow: "Preço",
        title: `A partir de R$${NB}2.500 de implantação + R$${NB}500 por mês.`,
        items: [
          "Implantação em duas partes: 50% no aceite e 50% na entrega.",
          "Mínimo de 3 meses de mensalidade. Depois, cancelamento com 30 dias de aviso, sem multa.",
          "A mensalidade cobre a revisão semanal das conversas, ajustes e suporte.",
          "A plataforma do agente e a API do WhatsApp ficam na sua conta e são pagas à parte.",
        ],
        cta: "Pedir diagnóstico grátis",
      },
    },
    commitments: {
      eyebrow: "Compromissos", title: "O que vale em todo projeto.",
      items: [
        ["WhatsApp só pela API oficial", "Sem aplicativo paralelo e sem disparo em massa. É o caminho que a própria Meta oferece para automatizar o atendimento."],
        ["Tudo na sua conta", "As ferramentas são contratadas no nome do escritório ou da serventia. Se o contrato acabar, elas continuam suas."],
        ["Dentro das regras da profissão", "Seguimos o Provimento 205/2021 da OAB e o Código de Normas dos cartórios do DF no que a automação pode e não pode fazer."],
        ["Uma pessoa revisa toda semana", "A automação atende; uma pessoa lê as conversas, corrige e melhora. Você recebe o que mudou."],
      ],
    },
    who: {
      eyebrow: "Quem faz", title: "Engenharia de banco, aplicada ao seu atendimento.",
      cards: [
        { title: "Quem constrói", text: "A parte técnica é conduzida por um engenheiro de software com 14 anos de liderança técnica em banco. Sigilo, auditoria e operação que não pode parar fazem parte da formação de quem entrega." },
        { title: "Exato Teor", text: "Produto da TETELESTAI no ar. Transcreve conversas de WhatsApp para ata notarial, com texto, áudio e mídia organizados para conferência.", link: { label: "Conhecer o Exato Teor", href: "https://exatoteor.com.br/" } },
      ],
    },
    faqTitle: { eyebrow: "Dúvidas", title: "Antes de pedir o diagnóstico." },
    faqs: [
      { q: "Quanto custa?", a: `A partir de R$${NB}2.500 de implantação e R$${NB}500 por mês. O valor do seu caso sai na proposta, depois do diagnóstico, com três opções.` },
      { q: "Escritório de advocacia pode usar atendimento automático?", a: "Pode, com limites. O Provimento 205/2021 da OAB permite o uso para facilitar a comunicação, responder às primeiras dúvidas e coletar dados e documentos, sem afastar o atendimento pessoal nem a responsabilidade do advogado. O agente é configurado dentro desse limite: não responde consulta jurídica e não fala de honorários." },
      { q: "Onde ficam os dados dos meus clientes?", a: "Nas contas do seu escritório ou da sua serventia. A plataforma do agente e a API do WhatsApp são contratadas no seu nome; a TETELESTAI acessa só o necessário para implantar e acompanhar." },
      { q: "Preciso trocar o número do WhatsApp?", a: "Depende de como o número é usado hoje. Isso é visto no diagnóstico, antes de qualquer mudança." },
      { q: "Em quanto tempo fica pronto?", a: "O prazo depende do que for escolhido e vem escrito na proposta." },
      { q: "E se eu quiser cancelar?", a: "Há um mínimo de 3 meses de mensalidade. Depois disso, basta avisar com 30 dias de antecedência, sem multa." },
      { q: "Vocês garantem mais clientes ou mais atos?", a: "Não. O que entregamos é atendimento mais rápido e equipe com menos trabalho repetido. Resultado comercial depende de fatores que não controlamos." },
    ],
    final: {
      title: "Peça o diagnóstico e veja o que dá para automatizar.",
      text: "Em 30 a 45 minutos você sai com o desenho do que muda no seu atendimento, sem compromisso.",
      cta: "Pedir diagnóstico grátis no WhatsApp",
      note: "No primeiro contato, não envie senhas, dados bancários, documentos de identidade nem informações de clientes.",
    },
    // Visible description of the Service structured data (same sentence as the hero text).
    serviceName: "IA e automação para escritórios de advocacia e cartórios",
    serviceArea: "Distrito Federal",
  },
  en: {
    path: "/en/",
    metaTitle: "AI and automation for law firms and notary offices in Brasília | Tetelestai",
    metaDescription: "AI and automation for law firms and notary offices in the Federal District: customer service, scheduling and documents, with the data kept in the client's own account.",
    hero: {
      eyebrow: "AI and automation · Federal District",
      title: "AI and automation for law firms and notary and registry offices in the Federal District.",
      lede: "WhatsApp customer service, scheduling and documents that keep working without waiting for someone to be free to answer. The data stays in the account of your firm or your notary and registry office.",
      cta: "Request a free diagnosis on WhatsApp",
      secondary: "See how it works",
      note: "30 to 45 minutes, by video or on-site visit. It ends in a written proposal.",
      ficha: {
        label: "Illustration: a WhatsApp message becomes a checked service record",
        switchLabel: "Service example",
        tagLabel: "First contact",
        messageNote: "Message received outside business hours",
        title: "Service record",
        terms: ["Subject", "Documents", "Time", "Handed to"],
        examples: [
          { name: "Law firm", when: "Tuesday, 7:42 pm", message: "Good evening. I was dismissed and did not receive my severance pay. Do you handle this kind of case?", values: ["Labor · termination", "List sent, 2 received", "Thursday, 10 am", "Lawyer in charge"] },
          { name: "Notary office", when: "Wednesday, 5:48 pm", message: "Good afternoon. Which documents do I need for a property purchase deed?", values: ["Purchase and sale deed", "List sent, 3 received", "Friday, 2 pm", "Clerk"] },
        ],
        foot: "Illustration of the flow, with no client data.",
      },
    },
    factsLabel: "Facts",
    facts: [
      { title: "Exato Teor is live", text: "Our own product: transcription of WhatsApp conversations for notarial records." },
      { title: "14 years in banking", text: "Technical leadership where confidentiality and auditing are routine." },
      { title: "{sites} websites and {apps} apps", text: "Delivered to clients and published on the App Store." },
      { title: "Official WhatsApp", text: "Only through the official API, with no mass messaging." },
    ],
    challenge: {
      eyebrow: "Who it's for", title: "What is your challenge today?", lead: "The work starts with what takes your team the most time.",
      cards: [
        {
          title: "Law firm",
          items: [
            ["The client messages at night and gets no answer.", "A first-contact assistant explains how the firm works, collects data and documents and hands the conversation over to the lawyer."],
            ["The calendar lives in scattered messages.", "Scheduling over WhatsApp and a dashboard with every appointment."],
            ["The team retypes what the client already sent.", "Routine documents filled in from what was collected, for the team to check."],
          ],
          rule: ["Brazilian Bar Association (OAB) rule respected.", "The agent does not answer legal consultations and does not discuss fees (Provimento 205/2021)."],
          // Page of this audience (20/11).
          link: { label: "See the page for law firms", key: "advocacia" },
        },
        {
          title: "Notary and registry office",
          items: [
            ["The counter answers the same questions all day.", "A first-contact assistant gives out documents, opening hours and case status, and hands the case over to the clerk (escrevente)."],
            ["Transcribing a conversation for a notarial record takes hours.", "Exato Teor delivers text, audio and media organized for the clerk to check."],
            ["Notarial acts are booked by phone.", "Scheduling over WhatsApp and a daily dashboard for the team."],
          ],
          rule: ["The notary office charges nothing in our name.", "The tools stay in the account of the office (serventia), under the responsibility of its titular notary."],
          // Page of this audience (20/11).
          link: { label: "See the page for notary offices", key: "cartorios" },
        },
      ],
    },
    how: {
      eyebrow: "How it works", title: "From diagnosis to operation, in three steps.",
      steps: [
        ["Free diagnosis", "30 to 45 minutes, by video or on-site visit. You show how service works today and where it gets stuck."],
        ["Written proposal", "Three options in PDF, with what each one includes, the price and the timeline. No promise of results."],
        ["Setup and follow-up", "We put it live in your account. Every week a person reviews the conversations and adjusts whatever is needed."],
      ],
    },
    offer: {
      eyebrow: "What we deliver", title: "Four fronts. You choose where to start.",
      items: [
        ["First-contact service on WhatsApp", "First questions, collection of data and documents, handover to a person."],
        ["Scheduling and dashboard", "Appointments booked in the conversation and the day's view for the team."],
        ["Document automation", "What repeats is filled in automatically and checked by whoever signs."],
        ["Team training", "So that your team uses AI at work safely."],
      ],
      price: {
        eyebrow: "Pricing",
        title: `From R$${NB}2,500 in setup + R$${NB}500 per month.`,
        items: [
          "Setup in two parts: 50% on acceptance and 50% on delivery.",
          "Minimum of 3 months of monthly fees. After that, cancellation with 30 days' notice, with no fee.",
          "The monthly fee covers the weekly review of conversations, adjustments and support.",
          "The agent platform and the WhatsApp API stay in your account and are paid separately.",
        ],
        cta: "Request a free diagnosis",
      },
    },
    commitments: {
      eyebrow: "Commitments", title: "What holds for every project.",
      items: [
        ["WhatsApp only through the official API", "No parallel app and no mass messaging. It is the path Meta itself offers to automate customer service."],
        ["Everything in your account", "The tools are contracted in the name of the firm or the notary and registry office. If the contract ends, they stay yours."],
        ["Within the rules of the profession", "We follow the Brazilian Bar Association's (OAB) Provimento 205/2021 and the Federal District notary offices' Code of Norms on what automation can and cannot do."],
        ["A person reviews it every week", "The automation answers; a person reads the conversations, corrects and improves. You receive what changed."],
      ],
    },
    who: {
      eyebrow: "Who does it", title: "Banking engineering, applied to your customer service.",
      cards: [
        { title: "Who builds it", text: "The technical side is led by a software engineer with 14 years of technical leadership in banking. Confidentiality, auditing and operations that cannot stop are part of the background of whoever delivers." },
        { title: "Exato Teor", text: "A TETELESTAI product that is live. It transcribes WhatsApp conversations for notarial records, with text, audio and media organized for checking.", link: { label: "Learn about Exato Teor", href: "https://exatoteor.com.br/" } },
      ],
    },
    faqTitle: { eyebrow: "FAQ", title: "Before you request the diagnosis." },
    faqs: [
      { q: "How much does it cost?", a: `From R$${NB}2,500 in setup and R$${NB}500 per month. The amount for your case comes in the proposal, after the diagnosis, with three options.` },
      { q: "Can a law firm use automated customer service?", a: "Yes, within limits. The Brazilian Bar Association's (OAB) Provimento 205/2021 allows its use to ease communication, answer first questions and collect data and documents, without replacing personal service or the lawyer's responsibility. The agent is set up within that limit: it does not answer legal consultations and does not discuss fees." },
      { q: "Where is my clients' data kept?", a: "In the accounts of your firm or your notary and registry office. The agent platform and the WhatsApp API are contracted in your name; TETELESTAI accesses only what is needed to set up and follow up." },
      { q: "Do I need to change my WhatsApp number?", a: "It depends on how the number is used today. That is looked at in the diagnosis, before any change." },
      { q: "How long does it take?", a: "The timeline depends on what you choose and is written in the proposal." },
      { q: "What if I want to cancel?", a: "There is a minimum of 3 months of monthly fees. After that, just give 30 days' notice, with no fee." },
      { q: "Do you guarantee more clients or more notarial acts?", a: "No. What we deliver is faster service and a team with less repetitive work. Commercial results depend on factors we do not control." },
    ],
    final: {
      title: "Request the diagnosis and see what can be automated.",
      text: "In 30 to 45 minutes you leave with an outline of what changes in your customer service, with no commitment.",
      cta: "Request a free diagnosis on WhatsApp",
      note: "In the first contact, do not send passwords, banking details, identity documents or client information.",
    },
    serviceName: "AI and automation for law firms and notary offices",
    serviceArea: "Distrito Federal",
  },
};

// Shared building blocks reused by several pages.
export const HOW_STEPS = {
  pt: [
    { k: "Passo 1", title: "Você conta o que vende", text: "Pelo WhatsApp: o que você oferece, para quem e o que o cliente precisa fazer depois de ler a página." },
    { k: "Passo 2", title: "Você recebe a proposta", text: "Preço, prazo e o que está incluso, por escrito. A entrada de R$ 297 é paga na contratação." },
    { k: "Passo 3", title: "A página vai ao ar", text: "Você manda textos e fotos, revisa uma prévia, pede os ajustes e a página entra no ar. A mensalidade de R$ 97 cobre hospedagem, backup e uma atualização por mês." },
  ],
  en: [
    { k: "Step 1", title: "Tell us what you sell", text: "On WhatsApp: what you offer, who it's for and what customers should do after reading the page." },
    { k: "Step 2", title: "Get a written proposal", text: "Price, timeline and what's included, in writing. The R$ 297 upfront payment is made when you hire us." },
    { k: "Step 3", title: "Your page goes live", text: "You send texts and photos, review a preview, ask for changes and the page goes live. The R$ 97 monthly fee covers hosting, backups and one update a month." },
  ],
};

export const LANDING_RECEIPT = {
  pt: {
    title: "Landing page", place: "Online · todo o Brasil", total: "R$ 297", split: "de entrada + R$ 97/mês desde o 1º mês",
    note: "O prazo conta a partir do envio dos textos e das fotos.", cta: "Quero minha landing page",
    rows: [["Página", "1, até 5 seções"], ["Oferta e textos", "sob medida"], ["SEO e GEO", "incluso"], ["Celular e WhatsApp", "incluso"], ["Ajustes", "1 rodada"], ["Prazo", "até 2 dias úteis"], ["Mensalidade", "hospedagem, SSL, backup, 1 atualização"], ["Domínio .com.br", "1º ano incluso"], ["Cancelamento", "30 dias de aviso, sem multa"]],
  },
  en: {
    title: "Landing page", place: "Online · Brazil and abroad", total: "R$ 297", split: "upfront + R$ 97/month from the first month",
    note: "The deadline starts when you send the texts and photos.", cta: "I want my landing page",
    rows: [["Page", "1, up to 5 sections"], ["Offer and copy", "tailored"], ["SEO and GEO", "included"], ["Mobile + WhatsApp", "included"], ["Revisions", "1 round"], ["Delivery", "up to 2 business days"], ["Monthly fee", "hosting, SSL, backups, 1 update"], [".com.br domain", "1st year included"], ["Cancellation", "30 days' notice, no fee"]],
  },
};
