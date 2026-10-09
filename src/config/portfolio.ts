/**
 * Portfolio kontenti. Matn, narx, natija va rasmlarni shu fayldan o'zgartiring.
 *
 * projects[].metric — raqamli ko'rsatkich. Bo'sh yoki "[RAQAM]" bo'lsa saytda chiqmaydi.
 *   To'ldirish: "kuniga 40 ta buyurtma" kabi matn, [RAQAM] so'zini olib tashlang.
 * projects[].gallery — demo skrinshotlari. Bo'sh bo'lsa galereya chiqmaydi.
 *   "/projects/mini-1.jpg" yoki Google Drive ulashish havolasi.
 * services[].price — faqat qiymat, masalan "5 mln". Bo'sh yoki "[NARX]" bo'lsa
 *   kartada narx chiqmaydi; "Narx loyihaga qarab..." xizmatlar ro'yxati ostida bir marta.
 *   To'ldirilsa kartada "Narx: 5 mln dan".
 * projects[].status — "demo" yoki "live". Badge matni shu yerdan chiqadi.
 */

export type Locale = "uz" | "ru";

export type PortfolioLink = {
  label: string;
  href: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type ServiceView = {
  title: string;
  detail: string;
  price: string;
};

export type ProjectView = {
  id: string;
  title: string;
  summary: string;
  result: string;
  metric: string;
  tags: string[];
  image: string;
  video: string;
  gallery: string[];
  links: PortfolioLink[];
  status: "demo" | "live";
  closed?: boolean;
};

const skillItems = [
  ["React", "TypeScript", "Vite", "HTML/CSS", "JavaScript"],
  ["Python (FastAPI, aiogram)", "Node.js", "Express"],
  ["PostgreSQL (Neon)", "SQLite", "Supabase"],
  ["Bot API", "Telegram Mini App", "webhook"],
  ["Render", "Vercel", "GitHub", "Cursor", "Grok Build"],
];

const servicePrices = ["[NARX]", "[NARX]", "[NARX]", "[NARX]", "[NARX]", "[NARX]", "[NARX]"];

const projectFacts = [
  {
    id: "soyabon",
    tags: ["React", "TypeScript", "Vite", "PostgreSQL", "PWA"],
    image: "/projects/kafe.jpg",
    video: "",
    gallery: [] as string[],
    metric: "[RAQAM]",
    status: "demo" as const,
    links: [{ href: "https://prism-cap-harbor-gem.grok.me" }],
  },
  {
    id: "briket-erp",
    tags: ["Node.js", "Express", "PostgreSQL"],
    image: "/projects/briket-erp.jpg",
    video: "",
    gallery: [] as string[],
    metric: "[RAQAM]",
    status: "live" as const,
    links: [
      { href: "/demo/briket-erp" },
      { href: "https://briket-erp.onrender.com" },
      { href: "https://github.com/blackdiamondbiznes-glitch/briket-erp" },
    ],
  },
  {
    id: "briket-mijoz",
    tags: ["React", "Telegram"],
    image: "/projects/briket-mijoz.jpg",
    video: "",
    gallery: [] as string[],
    metric: "[RAQAM]",
    status: "live" as const,
    links: [{ href: "https://briket-erp.onrender.com/mijoz" }],
  },
  {
    id: "briket-mini",
    tags: ["React", "Vite", "Tailwind", "Supabase", "Telegram Mini App"],
    image: "/projects/briket-mini-app.jpg",
    video: "",
    gallery: [] as string[],
    metric: "[RAQAM]",
    status: "live" as const,
    closed: true,
    links: [{ href: "/demo/briket-mini-app" }],
  },
  {
    id: "konkurs-bot",
    tags: ["Python", "aiogram 3", "FastAPI", "PostgreSQL (Neon)", "Render"],
    image: "/projects/konkurs-bot.jpg",
    video: "",
    gallery: [] as string[],
    metric: "[RAQAM]",
    status: "live" as const,
    links: [{ href: "/demo/konkurs-bot" }, { href: "https://t.me/konkursga_qoshil_bot" }],
  },
];

const messages = {
  uz: {
    role: "Full-stack dasturchi",
    slogan: "Muammoni tinglab, yechimni taklif qilaman va uni ishlaydigan tizimga aylantiraman.",
    rotating: ["Telegram botlar", "ERP tizimlar", "Mini App'lar"],
    profileAlt: "Adham Hoshimov",
    seo: {
      title: "Adham Hoshimov — full-stack dasturchi",
      description:
        "Muammoni tinglab, yechimni taklif qilaman va uni ishlaydigan tizimga aylantiraman.",
    },
    telegramLabel: "Telegram'da yozish",
    aboutTitle: "Biznes uchun bot, Mini App va ERP yaratuvchi dasturchi",
    aboutLead:
      "Najot Ta'lim va Mohirdev o'quv platformalarida zamonaviy full-stack dasturlash yo'nalishini tamomlagach, ko'mir (briket) ishlab chiqarish va yetkazib berish uchun ERP tizimlar va Telegram Mini App'lar qilaman.",
    aboutPoints: [
      {
        title: "Ishlab turgan tizimlar",
        detail:
          "Briket ERP, Black Diamond buyurtma sahifasi, Briket Mini App va Telegram konkurs boti real biznesda ishlatilmoqda.",
      },
      {
        title: "Haqiqiy kanal uchun bot",
        detail:
          "Konkurs boti haqiqiy Telegram kanali uchun moslashtirilgan va hozir shu kanalda ishlatilmoqda.",
      },
      {
        title: "Kafe tizimi demosi",
        detail:
          "Kafe va restoran tizimi to'liq ishlaydigan demo. Haqiqiy kafe undan foydalanmaydi.",
      },
    ],
    aboutClose: "Ishlab turgan 4 ta tizim real biznesda ishlatilmoqda.",
    ageLabel: "yosh",
    aboutKicker: "Haqimda",
    summaryLabel: "Xulosa",
    nav: [
      { id: "haqimda", label: "Haqimda" },
      { id: "konikmalar", label: "Ko'nikmalar" },
      { id: "xizmatlar", label: "Xizmatlar" },
      { id: "loyihalar", label: "Loyihalar" },
      { id: "aloqa", label: "Aloqa" },
    ],
    skillTitles: ["Frontend", "Backend", "Ma'lumotlar bazasi", "Telegram", "Joylash va vositalar"],
    skillsKicker: "Ko'nikmalar",
    skillsTitle: "Ko'nikmalar",
    chipsLabel: "Ko'nikmalar",
    techLabel: "Texnologiyalar",
    servicesKicker: "Xizmatlar",
    servicesTitle: "Xizmatlar",
    services: [
      { title: "Telegram bot yaratish", detail: "Konkurs, taklif, buyurtma va xabar yuborish botlari." },
      { title: "Telegram Mini App", detail: "Telegram ichida ochiladigan amaliy veb-ilovalar." },
      { title: "ERP va CRM", detail: "Kichik biznes uchun ichki boshqaruv tizimlari." },
      { title: "QR menyu va buyurtma", detail: "Kafe va restoranlar uchun stol QR, menyu va buyurtma." },
      { title: "Landing sahifa", detail: "Mahsulot yoki xizmat uchun tanishuv sahifasi." },
      { title: "Joylash va qo'llab-quvvatlash", detail: "Domen ulash, serverga chiqarish va texnik yordam." },
      {
        title: "Portfolio sayt yaratish",
        detail: "Dasturchi, dizayner va mutaxassislar uchun zamonaviy shaxsiy portfolio sayt.",
      },
    ],
    demoBadge: "Demo loyiha",
    liveBadge: "Ishlab turibdi",
    priceAsk: "Narx loyihaga qarab, Telegramda so'rang",
    formatPrice: (value: string) => `Narx: ${value} dan`,
    processKicker: "Qanday ishlayman",
    processTitle: "Qanday ishlayman",
    steps: [
      {
        title: "Suhbat va muammoni o'rganish",
        detail: "Biznes qanday ishlashini va qayeri qiyinligini birga aniqlaymiz.",
      },
      {
        title: "Demo ko'rsatish",
        detail: "Asosiy oqimni ishlaydigan demo ko'rinishida ko'rsataman.",
      },
      {
        title: "Ishga tushirish",
        detail: "Tizimni serverga chiqarib, ishlatishga topshiraman.",
      },
      {
        title: "Qo'llab-quvvatlash",
        detail: "Ishga tushgach savol va tuzatishlarda yordam beraman.",
      },
    ],
    projectsKicker: "Loyihalar",
    projectsTitle: "Loyihalar",
    projectsButton: "Loyihalarni ko'rish",
    resultLabel: "Natija",
    closedLabel: "Yopiq loyiha",
    videoLabel: "Videoni ko'rish",
    projects: [
      {
        title: "Kafe/restoran tizimi",
        summary:
          "Kafe uchun to'liq tizim. Stoldagi QR orqali menyu va buyurtma, onlayn buyurtma, ofitsiant, oshxona, kassir, admin va egasi uchun alohida panellar, stollar xaritasi va kunni yopish hisoboti. Telefonga ilova sifatida o'rnatiladi (PWA).",
        result:
          "to'liq ishlaydigan demo: QR buyurtmadan kunni yopish hisobotigacha bo'lgan oqim ko'rsatiladi",
        linkLabels: ["Demoni ochish"],
      },
      {
        title: "Briket ERP",
        summary:
          "Briket (ko'mir) ishlab chiqarish va yetkazib berish biznesi uchun ERP tizimi. Xom ashyo, mahsulot va partiyalar, qadoqlash, mijoz va hamkorlar, buyurtmalar, to'lovlar, jo'natmalar hamda xarajatlar bitta tizimda.",
        result: "xom ashyo, buyurtma, to'lov va jo'natma bitta tizimda yuritiladi",
        linkLabels: ["Saytdagi demo", "Jonli tizim", "GitHub"],
      },
      {
        title: "Black Diamond — Buyurtma",
        summary:
          "Briket mijozlari uchun haqiqiy buyurtma sahifasi. Katalog, miqdor va savat shu yerda. Sahifa o'zi ishlab turgan tizimga ulangan.",
        result: "mijoz katalogdan miqdor tanlab savatga soladi va buyurtma yuboradi",
        linkLabels: ["Jonli tizim"],
      },
      {
        title: "Briket Mini App",
        summary: "Briket ko'mir yetkazib berish uchun Telegram Mini App, B2B savdo agentlari uchun.",
        result: "savdo agentlari buyurtma va qarzni Telegram ichida yuritadi",
        linkLabels: ["Saytdagi demo"],
      },
      {
        title: "Telegram konkurs bot",
        summary:
          "Yopiq Telegram kanal uchun taklif boti. Har bir foydalanuvchiga shaxsiy taklif havolasi beradi, kim nechta odam qo'shganini hisoblaydi. Konkurs va vebinar rejimlari, admin Mini App va CSV eksport bor. Haqiqiy Telegram kanali uchun moslashtirilgan va hozir ishlatilmoqda.",
        result: "takliflar hisoblanadi, admin reytingni va CSV eksportni ko'radi",
        linkLabels: ["Saytdagi demo", "Botni ochish"],
      },
    ],
    ticker:
      "Telegram botlar  •  Mini App  •  ERP tizimlar  •  Kafe va restoran tizimlari  •  Portfolio saytlar  •  ",
    contactKicker: "Aloqa",
    contactTitle:
      "Biznes jarayonlaringizni tartibga solish va raqamlashtirishni boshlaymizmi? Menga Telegram'da yozing.",
    contactText:
      "Sizning biznesingiz uchun moslashtirilgan Telegram Mini App yoki ERP tizim qurishni muhokama qilamiz.",
    footerTelegram: "Telegram",
    skip: "Asosiy bo'limga o'tish",
    langLabel: "Til",
    themeLabel: "Ko'rinish",
    themeToLight: "Kunduzgi ko'rinish",
    themeToDark: "Tungi ko'rinish",
    menuOpen: "Menyuni ochish",
    menuClose: "Menyuni yopish",
    sectionsLabel: "Bo'limlar",
    mobileMenu: "Mobil menyu",
  },
  ru: {
    role: "Full-stack разработчик",
    slogan: "Выслушиваю задачу, предлагаю решение и превращаю его в рабочую систему.",
    rotating: ["Telegram-боты", "ERP-системы", "Mini App"],
    profileAlt: "Adham Hoshimov",
    seo: {
      title: "Adham Hoshimov — full-stack разработчик",
      description:
        "Выслушиваю задачу, предлагаю решение и превращаю его в рабочую систему.",
    },
    telegramLabel: "Написать в Telegram",
    aboutTitle: "Разработчик ботов, Mini App и ERP для бизнеса",
    aboutLead:
      "После обучения современному full-stack программированию на учебных платформах Najot Ta'lim и Mohirdev я делаю ERP-системы и Telegram Mini App для производства и доставки угольного брикета.",
    aboutPoints: [
      {
        title: "Работающие системы",
        detail:
          "Briket ERP, страница заказа Black Diamond, Briket Mini App и Telegram-бот конкурса используются в реальном бизнесе.",
      },
      {
        title: "Бот для реального канала",
        detail: "Бот конкурса настроен под реальный Telegram-канал и сейчас используется в этом канале.",
      },
      {
        title: "Демо системы кафе",
        detail:
          "Система для кафе и ресторана — полностью рабочее демо. Настоящее кафе ей не пользуется.",
      },
    ],
    aboutClose: "Четыре работающие системы используются в реальном бизнесе.",
    ageLabel: "лет",
    aboutKicker: "Обо мне",
    summaryLabel: "Итог",
    nav: [
      { id: "haqimda", label: "Обо мне" },
      { id: "konikmalar", label: "Навыки" },
      { id: "xizmatlar", label: "Услуги" },
      { id: "loyihalar", label: "Проекты" },
      { id: "aloqa", label: "Контакты" },
    ],
    skillTitles: ["Frontend", "Backend", "База данных", "Telegram", "Размещение и инструменты"],
    skillsKicker: "Навыки",
    skillsTitle: "Навыки",
    chipsLabel: "Навыки",
    techLabel: "Технологии",
    servicesKicker: "Услуги",
    servicesTitle: "Услуги",
    services: [
      { title: "Telegram-бот", detail: "Боты для конкурсов, приглашений, заказов и рассылок." },
      { title: "Telegram Mini App", detail: "Практичные веб-приложения внутри Telegram." },
      { title: "ERP и CRM", detail: "Внутренние системы управления для небольшого бизнеса." },
      { title: "QR-меню и заказы", detail: "QR на столе, меню и заказы для кафе и ресторанов." },
      { title: "Лендинг", detail: "Страница знакомства с продуктом или услугой." },
      { title: "Запуск и поддержка", detail: "Домен, выкладка на сервер и техническая помощь." },
      {
        title: "Сайт-портфолио",
        detail: "Современный личный сайт для разработчиков, дизайнеров и специалистов.",
      },
    ],
    demoBadge: "Демо-проект",
    liveBadge: "Работает",
    priceAsk: "Цена зависит от проекта — напишите в Telegram",
    formatPrice: (value: string) => `Цена: от ${value}`,
    processKicker: "Как я работаю",
    processTitle: "Как я работаю",
    steps: [
      {
        title: "Разговор и разбор задачи",
        detail: "Вместе выясняем, как устроен бизнес и где узкие места.",
      },
      {
        title: "Показ демо",
        detail: "Показываю основной сценарий в рабочем демо.",
      },
      {
        title: "Запуск",
        detail: "Выкладываю систему на сервер и передаю в работу.",
      },
      {
        title: "Поддержка",
        detail: "После запуска помогаю с вопросами и правками.",
      },
    ],
    projectsKicker: "Проекты",
    projectsTitle: "Проекты",
    projectsButton: "Смотреть проекты",
    resultLabel: "Результат",
    closedLabel: "Закрытый проект",
    videoLabel: "Смотреть видео",
    projects: [
      {
        title: "Система для кафе и ресторана",
        summary:
          "Полная система для кафе. Меню и заказ по QR на столе, онлайн-заказы, отдельные панели для официанта, кухни, кассира, администратора и владельца, карта столов и отчёт закрытия дня. Ставится на телефон как приложение (PWA).",
        result: "рабочее демо: показан путь от заказа по QR до отчёта закрытия дня",
        linkLabels: ["Открыть демо"],
      },
      {
        title: "Briket ERP",
        summary:
          "ERP для производства и доставки брикета (угля). Сырьё, продукция и партии, фасовка, клиенты и партнёры, заказы, оплаты, отгрузки и расходы — в одной системе.",
        result: "сырьё, заказы, оплаты и отгрузки ведутся в одной системе",
        linkLabels: ["Демо на сайте", "Живая система", "GitHub"],
      },
      {
        title: "Black Diamond — Заказ",
        summary:
          "Настоящая страница заказа для клиентов брикета. Каталог, количество и корзина. Страница подключена к рабочей системе.",
        result: "клиент выбирает количество в каталоге, кладёт в корзину и отправляет заказ",
        linkLabels: ["Живая система"],
      },
      {
        title: "Briket Mini App",
        summary: "Telegram Mini App для доставки угольного брикета, для B2B торговых агентов.",
        result: "агенты ведут заказы и долги внутри Telegram",
        linkLabels: ["Демо на сайте"],
      },
      {
        title: "Telegram-бот конкурса",
        summary:
          "Бот приглашений для закрытого Telegram-канала. Даёт каждому личную ссылку и считает, сколько людей он привёл. Есть режимы конкурса и вебинара, админ Mini App и экспорт CSV. Настроен под реальный Telegram-канал и используется в работе.",
        result: "приглашения считаются, администратор видит рейтинг и экспорт CSV",
        linkLabels: ["Демо на сайте", "Открыть бота"],
      },
    ],
    ticker:
      "Telegram-боты  •  Mini App  •  ERP-системы  •  Кафе и рестораны  •  Сайты-портфолио  •  ",
    contactKicker: "Контакты",
    contactTitle:
      "Наведём порядок в бизнес-процессах и начнём цифровизацию? Напишите мне в Telegram.",
    contactText: "Обсудим Telegram Mini App или ERP-систему под ваш бизнес.",
    footerTelegram: "Telegram",
    skip: "Перейти к основному разделу",
    langLabel: "Язык",
    themeLabel: "Оформление",
    themeToLight: "Дневной вид",
    themeToDark: "Ночной вид",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    sectionsLabel: "Разделы",
    mobileMenu: "Мобильное меню",
  },
} as const;

export type PortfolioContent = ReturnType<typeof content>;

export function shownValue(value: string) {
  const text = value.trim();
  if (!text || /\[(RAQAM|NARX)\]/.test(text)) return "";
  return text;
}

export function content(locale: Locale) {
  const text = messages[locale];
  return {
    locale,
    name: "Adham Hoshimov",
    initials: "AH",
    age: 28,
    role: text.role,
    slogan: text.slogan,
    rotating: text.rotating,
    profileImage: "",
    profileAlt: text.profileAlt,
    seo: text.seo,
    telegram: {
      href: "https://t.me/Khoshimov_Adkham",
      label: text.telegramLabel,
    },
    phone: {
      href: "tel:+998976330330",
      label: "+998 97 633 03 30",
    },
    aboutTitle: text.aboutTitle,
    aboutLead: text.aboutLead,
    aboutPoints: text.aboutPoints,
    aboutClose: text.aboutClose,
    ageLabel: text.ageLabel,
    aboutKicker: text.aboutKicker,
    summaryLabel: text.summaryLabel,
    nav: text.nav,
    skills: text.skillTitles.map((title, index) => ({
      title,
      items: skillItems[index] ?? [],
    })) satisfies SkillGroup[],
    skillsKicker: text.skillsKicker,
    skillsTitle: text.skillsTitle,
    chipsLabel: text.chipsLabel,
    techLabel: text.techLabel,
    services: text.services.map((service, index) => ({
      ...service,
      price: servicePrices[index] ?? "",
    })) satisfies ServiceView[],
    servicesKicker: text.servicesKicker,
    servicesTitle: text.servicesTitle,
    demoBadge: text.demoBadge,
    liveBadge: text.liveBadge,
    priceAsk: text.priceAsk,
    formatPrice: text.formatPrice,
    processKicker: text.processKicker,
    processTitle: text.processTitle,
    steps: text.steps,
    projects: projectFacts.map((project, index) => {
      const translated = text.projects[index];
      return {
        id: project.id,
        title: translated?.title ?? project.id,
        summary: translated?.summary ?? "",
        result: translated?.result ?? "",
        metric: project.metric,
        tags: project.tags,
        image: project.image,
        video: project.video,
        gallery: project.gallery,
        status: project.status,
        closed: "closed" in project ? project.closed : undefined,
        links: project.links.map((link, linkIndex) => ({
          href: link.href,
          label: translated?.linkLabels[linkIndex] ?? link.href,
        })),
      };
    }) satisfies ProjectView[],
    projectsKicker: text.projectsKicker,
    projectsTitle: text.projectsTitle,
    projectsButton: text.projectsButton,
    resultLabel: text.resultLabel,
    closedLabel: text.closedLabel,
    videoLabel: text.videoLabel,
    ticker: text.ticker,
    contactKicker: text.contactKicker,
    contactTitle: text.contactTitle,
    contactText: text.contactText,
    footerTelegram: text.footerTelegram,
    skip: text.skip,
    langLabel: text.langLabel,
    themeLabel: text.themeLabel,
    themeToLight: text.themeToLight,
    themeToDark: text.themeToDark,
    menuOpen: text.menuOpen,
    menuClose: text.menuClose,
    sectionsLabel: text.sectionsLabel,
    mobileMenu: text.mobileMenu,
  };
}

/** Standart til. Boshqa joylar `content(locale)` ishlatadi. */
export const portfolio = content("uz");
