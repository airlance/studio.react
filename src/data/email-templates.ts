import { EmailTemplate } from '@/types/email-builder';
import { Language } from '@/config/i18n/types';

let idCounter = 1000;
const uid = () => `tpl-${++idCounter}-${Date.now()}`;

export interface StarterTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    build: () => EmailTemplate;
}

// ---------------------------------------------------------------------------
// Localised string tables
// ---------------------------------------------------------------------------

interface TemplateLocale {
    welcome: {
        name: string;
        description: string;
        heading: string;
        body: string;
        button: string;
        footer: string;
    };
    newsletter: {
        name: string;
        description: string;
        heading: string;
        issue: string;
        featuredTitle: string;
        featuredBody: string;
        readMore: string;
        col1Title: string;
        col1Body: string;
        col2Title: string;
        col2Body: string;
        footer: string;
    };
    promotion: {
        name: string;
        description: string;
        heading: string;
        body: string;
        button: string;
        product1: string;
        product2: string;
        product3: string;
        disclaimer: string;
    };
}

const LOCALES: Record<Language, TemplateLocale> = {
    en: {
        welcome: {
            name: 'Welcome Email',
            description: 'Onboard new users with a warm greeting',
            heading: 'Welcome aboard! 🎉',
            body: "We're thrilled to have you join us. Your account is all set up and ready to go. Here's what you can do next to get the most out of your experience.",
            button: 'Get Started →',
            footer: 'Need help? Reply to this email or visit our help center.',
        },
        newsletter: {
            name: 'Newsletter',
            description: 'Share updates with a clean multi-section layout',
            heading: '📬 Weekly Digest',
            issue: 'March 2026 · Issue #42',
            featuredTitle: 'Featured: The Future of Design',
            featuredBody: 'Explore the latest trends shaping how we build digital experiences. From AI-assisted workflows to new interaction patterns, the landscape is evolving rapidly.',
            readMore: 'Read More',
            col1Title: 'Quick Tips & Tricks',
            col1Body: 'Five productivity hacks you can use today.',
            col2Title: 'Community Spotlight',
            col2Body: 'Meet the creators building amazing things.',
            footer: 'You received this because you subscribed. Unsubscribe anytime.',
        },
        promotion: {
            name: 'Promotion',
            description: 'Drive sales with a bold offer announcement',
            heading: 'Spring Sale — 40% Off',
            body: "Don't miss out on our biggest sale of the season. Limited time only — use code SPRING40 at checkout.",
            button: 'Shop Now',
            product1: 'Essential Tee\n$29 → $17',
            product2: 'Classic Hoodie\n$59 → $35',
            product3: 'Weekend Bag\n$89 → $53',
            disclaimer: 'Offer valid until March 31, 2026. Cannot be combined with other discounts.',
        },
    },

    ru: {
        welcome: {
            name: 'Приветственное письмо',
            description: 'Тёплое приветствие для новых пользователей',
            heading: 'Добро пожаловать! 🎉',
            body: 'Мы рады, что вы с нами! Ваш аккаунт готов к работе. Вот что вы можете сделать прямо сейчас, чтобы получить максимум от нашего сервиса.',
            button: 'Начать →',
            footer: 'Нужна помощь? Ответьте на это письмо или посетите центр поддержки.',
        },
        newsletter: {
            name: 'Рассылка',
            description: 'Делитесь новостями с чистым многосекционным макетом',
            heading: '📬 Еженедельный дайджест',
            issue: 'Март 2026 · Выпуск №42',
            featuredTitle: 'Тема номера: Будущее дизайна',
            featuredBody: 'Исследуем последние тенденции в создании цифровых продуктов. От рабочих процессов с AI до новых паттернов взаимодействия — пейзаж меняется стремительно.',
            readMore: 'Читать далее',
            col1Title: 'Советы и лайфхаки',
            col1Body: 'Пять приёмов продуктивности, которые можно применить уже сегодня.',
            col2Title: 'Сообщество',
            col2Body: 'Знакомьтесь с авторами, создающими удивительные вещи.',
            footer: 'Вы получили это письмо, потому что подписались на нашу рассылку. Отписаться.',
        },
        promotion: {
            name: 'Акция',
            description: 'Привлекайте продажи ярким объявлением об акции',
            heading: 'Весенняя распродажа — скидка 40%',
            body: 'Не пропустите главную акцию сезона! Ограниченное время — используйте промокод SPRING40 при оформлении заказа.',
            button: 'Купить сейчас',
            product1: 'Базовая футболка\n1 900 ₽ → 1 140 ₽',
            product2: 'Классовое худи\n3 900 ₽ → 2 340 ₽',
            product3: 'Дорожная сумка\n5 900 ₽ → 3 540 ₽',
            disclaimer: 'Предложение действует до 31 марта 2026 г. Не суммируется с другими скидками.',
        },
    },

    uk: {
        welcome: {
            name: 'Вітальний лист',
            description: 'Тепле привітання для нових користувачів',
            heading: 'Ласкаво просимо! 🎉',
            body: 'Ми раді, що ви з нами! Ваш акаунт готовий до роботи. Ось що ви можете зробити просто зараз, щоб отримати максимум від нашого сервісу.',
            button: 'Почати →',
            footer: 'Потрібна допомога? Відповідайте на цей лист або відвідайте центр підтримки.',
        },
        newsletter: {
            name: 'Розсилка',
            description: 'Діліться новинами із чистим багатосекційним макетом',
            heading: '📬 Щотижневий дайджест',
            issue: 'Березень 2026 · Випуск №42',
            featuredTitle: 'Тема номера: Майбутнє дизайну',
            featuredBody: 'Досліджуємо останні тенденції у створенні цифрових продуктів. Від робочих процесів з AI до нових патернів взаємодії — пейзаж змінюється стрімко.',
            readMore: 'Читати далі',
            col1Title: 'Поради та лайфхаки',
            col1Body: "П'ять прийомів продуктивності, які можна застосувати вже сьогодні.",
            col2Title: 'Спільнота',
            col2Body: 'Знайомтеся з авторами, що створюють дивовижні речі.',
            footer: 'Ви отримали цей лист, бо підписалися на нашу розсилку. Відписатися.',
        },
        promotion: {
            name: 'Акція',
            description: "Залучайте продажі яскравим оголошенням про акцію",
            heading: 'Весінній розпродаж — знижка 40%',
            body: 'Не пропустіть головну акцію сезону! Обмежений час — використовуйте промокод SPRING40 при оформленні замовлення.',
            button: 'Купити зараз',
            product1: 'Базова футболка\n760 ₴ → 456 ₴',
            product2: 'Класичне худі\n1 560 ₴ → 936 ₴',
            product3: 'Дорожня сумка\n2 360 ₴ → 1 416 ₴',
            disclaimer: 'Пропозиція діє до 31 березня 2026 р. Не сумується з іншими знижками.',
        },
    },

    it: {
        welcome: {
            name: 'Email di benvenuto',
            description: 'Un caloroso benvenuto per i nuovi utenti',
            heading: 'Benvenuto a bordo! 🎉',
            body: 'Siamo entusiasti di averti con noi! Il tuo account è pronto. Ecco cosa puoi fare subito per ottenere il massimo dalla nostra piattaforma.',
            button: 'Inizia ora →',
            footer: 'Hai bisogno di aiuto? Rispondi a questa email o visita il nostro centro assistenza.',
        },
        newsletter: {
            name: 'Newsletter',
            description: 'Condividi aggiornamenti con un layout pulito e multisezione',
            heading: '📬 Digest settimanale',
            issue: 'Marzo 2026 · Numero #42',
            featuredTitle: 'In primo piano: Il futuro del design',
            featuredBody: "Esploriamo le ultime tendenze nella creazione di esperienze digitali. Dai flussi di lavoro assistiti dall'AI ai nuovi pattern di interazione, il panorama si evolve rapidamente.",
            readMore: 'Leggi di più',
            col1Title: 'Consigli e trucchi',
            col1Body: 'Cinque trucchi di produttività da usare oggi stesso.',
            col2Title: 'Spotlight della community',
            col2Body: 'Scopri i creatori che stanno realizzando cose straordinarie.',
            footer: 'Hai ricevuto questa email perché sei iscritto. Annulla iscrizione.',
        },
        promotion: {
            name: 'Promozione',
            description: "Aumenta le vendite con un'offerta in evidenza",
            heading: 'Saldi di primavera — 40% di sconto',
            body: "Non perdere i nostri saldi più grandi della stagione! Solo per un tempo limitato — usa il codice SPRING40 al momento del pagamento.",
            button: 'Acquista ora',
            product1: 'T-shirt essenziale\n€29 → €17',
            product2: 'Felpa classica\n€59 → €35',
            product3: 'Borsa weekend\n€89 → €53',
            disclaimer: "Offerta valida fino al 31 marzo 2026. Non cumulabile con altri sconti.",
        },
    },

    es: {
        welcome: {
            name: 'Email de bienvenida',
            description: 'Un cálido saludo para los nuevos usuarios',
            heading: '¡Bienvenido a bordo! 🎉',
            body: '¡Nos alegra mucho tenerte con nosotros! Tu cuenta está lista. Aquí tienes lo que puedes hacer ahora mismo para sacar el máximo partido a nuestra plataforma.',
            button: 'Empezar →',
            footer: '¿Necesitas ayuda? Responde a este email o visita nuestro centro de ayuda.',
        },
        newsletter: {
            name: 'Boletín',
            description: 'Comparte novedades con un diseño limpio de varias secciones',
            heading: '📬 Resumen semanal',
            issue: 'Marzo 2026 · Número #42',
            featuredTitle: 'Destacado: El futuro del diseño',
            featuredBody: 'Exploramos las últimas tendencias en la creación de experiencias digitales. Desde flujos de trabajo asistidos por IA hasta nuevos patrones de interacción, el panorama evoluciona rápidamente.',
            readMore: 'Leer más',
            col1Title: 'Consejos y trucos',
            col1Body: 'Cinco hacks de productividad que puedes usar hoy mismo.',
            col2Title: 'Destacados de la comunidad',
            col2Body: 'Conoce a los creadores que están haciendo cosas increíbles.',
            footer: 'Recibiste este email porque te suscribiste. Cancelar suscripción.',
        },
        promotion: {
            name: 'Promoción',
            description: 'Impulsa las ventas con un anuncio de oferta llamativo',
            heading: 'Rebajas de primavera — 40% de descuento',
            body: '¡No te pierdas nuestras mayores rebajas de la temporada! Solo por tiempo limitado — usa el código SPRING40 en el pago.',
            button: 'Comprar ahora',
            product1: 'Camiseta esencial\n29 € → 17 €',
            product2: 'Sudadera clásica\n59 € → 35 €',
            product3: 'Bolsa de fin de semana\n89 € → 53 €',
            disclaimer: 'Oferta válida hasta el 31 de marzo de 2026. No acumulable con otros descuentos.',
        },
    },

    fr: {
        welcome: {
            name: "Email de bienvenue",
            description: 'Un accueil chaleureux pour les nouveaux utilisateurs',
            heading: 'Bienvenue à bord ! 🎉',
            body: "Nous sommes ravis de vous accueillir ! Votre compte est prêt. Voici ce que vous pouvez faire dès maintenant pour profiter au maximum de notre plateforme.",
            button: 'Commencer →',
            footer: "Besoin d'aide ? Répondez à cet email ou visitez notre centre d'assistance.",
        },
        newsletter: {
            name: 'Newsletter',
            description: 'Partagez des actualités avec une mise en page claire multi-sections',
            heading: '📬 Digest hebdomadaire',
            issue: 'Mars 2026 · Numéro #42',
            featuredTitle: "À la une : L'avenir du design",
            featuredBody: "Nous explorons les dernières tendances qui façonnent la création d'expériences numériques. Des flux de travail assistés par l'IA aux nouveaux modèles d'interaction, le paysage évolue rapidement.",
            readMore: 'Lire la suite',
            col1Title: 'Conseils et astuces',
            col1Body: "Cinq hacks de productivité à utiliser dès aujourd'hui.",
            col2Title: 'Coup de projecteur communauté',
            col2Body: 'Rencontrez les créateurs qui font des choses extraordinaires.',
            footer: "Vous avez reçu cet email car vous êtes abonné. Se désabonner.",
        },
        promotion: {
            name: 'Promotion',
            description: 'Stimulez les ventes avec une annonce d\'offre percutante',
            heading: 'Soldes de printemps — 40 % de réduction',
            body: "Ne manquez pas nos plus grandes soldes de la saison ! Durée limitée — utilisez le code SPRING40 à la caisse.",
            button: 'Acheter maintenant',
            product1: 'T-shirt essentiel\n29 € → 17 €',
            product2: 'Sweat classique\n59 € → 35 €',
            product3: 'Sac de week-end\n89 € → 53 €',
            disclaimer: "Offre valable jusqu'au 31 mars 2026. Non cumulable avec d'autres réductions.",
        },
    },
};

// ---------------------------------------------------------------------------
// Template builders
// ---------------------------------------------------------------------------

function buildWelcomeTemplate(loc: TemplateLocale['welcome']): EmailTemplate {
    return {
        bgColor: '#F8FAFC',
        contentWidth: 600,
        fontFamily: 'Arial, Helvetica, sans-serif',
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'image', src: 'https://placehold.co/600x120/4F46E5/FFFFFF?text=Your+Logo', alt: 'Logo', width: 50, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.heading, level: 'h1' as const, color: '#0F172A', align: 'center' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.body, fontSize: 16, color: '#475569', align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 8 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'button', text: loc.button, url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 8, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.footer, fontSize: 13, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

function buildNewsletterTemplate(loc: TemplateLocale['newsletter']): EmailTemplate {
    return {
        bgColor: '#F8FAFC',
        contentWidth: 600,
        fontFamily: "'Georgia', Times, serif",
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.heading, level: 'h1' as const, color: '#0F172A', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.issue, fontSize: 13, color: '#94A3B8', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'image', src: 'https://placehold.co/600x250/e2e8f0/475569?text=Featured+Article', alt: 'Featured', width: 100, align: 'center' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.featuredTitle, level: 'h2' as const, color: '#0F172A', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.featuredBody, fontSize: 15, color: '#475569', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'button', text: loc.readMore, url: '#', bgColor: '#0F172A', textColor: '#FFFFFF', borderRadius: 6, align: 'left' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 12 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 2,
                blocks: [
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/280x160/e2e8f0/475569?text=Article+2', alt: 'Article', width: 100, align: 'center' as const },
                        { id: uid(), type: 'heading', content: loc.col1Title, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                        { id: uid(), type: 'text', content: loc.col1Body, fontSize: 14, color: '#475569', align: 'left' as const },
                    ],
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/280x160/e2e8f0/475569?text=Article+3', alt: 'Article', width: 100, align: 'center' as const },
                        { id: uid(), type: 'heading', content: loc.col2Title, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                        { id: uid(), type: 'text', content: loc.col2Body, fontSize: 14, color: '#475569', align: 'left' as const },
                    ],
                ],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.footer, fontSize: 12, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

function buildPromotionTemplate(loc: TemplateLocale['promotion']): EmailTemplate {
    return {
        bgColor: '#F8FAFC',
        contentWidth: 600,
        fontFamily: 'Arial, Helvetica, sans-serif',
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'image', src: 'https://placehold.co/600x80/4F46E5/FFFFFF?text=BRAND', alt: 'Brand', width: 30, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 12 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.heading, level: 'h1' as const, color: '#4F46E5', align: 'center' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.body, fontSize: 16, color: '#475569', align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 8 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'button', text: loc.button, url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 24, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 3,
                blocks: [
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+1', alt: 'Product', width: 100, align: 'center' as const },
                        { id: uid(), type: 'text', content: loc.product1, fontSize: 14, color: '#0F172A', align: 'center' as const },
                    ],
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+2', alt: 'Product', width: 100, align: 'center' as const },
                        { id: uid(), type: 'text', content: loc.product2, fontSize: 14, color: '#0F172A', align: 'center' as const },
                    ],
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+3', alt: 'Product', width: 100, align: 'center' as const },
                        { id: uid(), type: 'text', content: loc.product3, fontSize: 14, color: '#0F172A', align: 'center' as const },
                    ],
                ],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.disclaimer, fontSize: 12, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns starter templates localised for the given language.
 * Falls back to English for any unsupported language.
 */
export function getStarterTemplates(language: Language): StarterTemplate[] {
    const locale = LOCALES[language] ?? LOCALES.en;

    return [
        {
            id: 'welcome',
            name: locale.welcome.name,
            description: locale.welcome.description,
            thumbnail: '👋',
            build: () => buildWelcomeTemplate(locale.welcome),
        },
        {
            id: 'newsletter',
            name: locale.newsletter.name,
            description: locale.newsletter.description,
            thumbnail: '📰',
            build: () => buildNewsletterTemplate(locale.newsletter),
        },
        {
            id: 'promotion',
            name: locale.promotion.name,
            description: locale.promotion.description,
            thumbnail: '🏷️',
            build: () => buildPromotionTemplate(locale.promotion),
        },
    ];
}

/**
 * English default — kept for backward compatibility with existing imports.
 */
export const starterTemplates: StarterTemplate[] = getStarterTemplates('en');