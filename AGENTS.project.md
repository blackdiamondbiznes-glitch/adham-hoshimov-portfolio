# Loyiha instruksiyasi (Grok Build → Project instructions)

Sen Adham Hoshimovning shaxsiy portfolio saytini yaratyapsan. U Full-stack dasturchi. Sayt tili o'zbekcha (lotin yozuvi). Saytni ochgan odam birinchi 5 soniyada "bu odam kuchli dasturchi" degan taassurot olishi kerak.

## Dizayn yo'nalishi
- Uslub: zamonaviy, qorong'i (dark) tema, premium texnologik ko'rinish. Linear, Vercel, Raycast saytlari darajasidagi tozalik.
- Ranglar: deyarli qora fon (#0A0A0B), bitta yorqin aksent rang (elektr ko'k yoki binafsha gradient). Ranglar 3 tadan oshmasin.
- Shrift: zamonaviy sans-serif (Inter, Geist yoki Satoshi). Sarlavhalar katta va qalin, matn o'qishga oson.
- Ko'p bo'sh joy, tartibli grid, yumshoq burchaklar, nozik chegaralar (border) va yengil "glass" effekt.
- Shablon yoki arzon ko'rinishdan qoch: stok rasmlar, ortiqcha emoji, ko'p rang, soya va bezaklarsiz.

## "Lol qoldiradigan" elementlar
- Hero: katta ism va kasb, orqada sekin harakatlanadigan gradient yoki nuqtali/to'rli fon. Kasb matnida yozuv animatsiyasi ("Telegram botlar", "ERP tizimlar", "Mini App'lar").
- Scroll qilganda bo'limlar silliq paydo bo'ladi (fade + yuqoriga siljish).
- Loyiha kartalari: sichqoncha olib borilganda yengil 3D qiyalik va yorug'lik (spotlight) effekti.
- Ko'nikmalar: "bento grid" ko'rinishida, texnologiya ikonkalari bilan.
- Sichqoncha ortidan ergashadigan yumshoq yorug'lik (faqat desktopda).
- Animatsiyalar tez va yengil bo'lsin (0.3–0.6 s). `prefers-reduced-motion` yoqilgan bo'lsa, o'chsin.

## Bo'limlar
1. Hero: ism, kasb, bir qatorli shior, ikki tugma ("Loyihalarni ko'rish", "Telegram'da yozish").
2. Men haqimda: qisqa matn va profil rasmi.
3. Ko'nikmalar.
4. Xizmatlar.
5. Loyihalar: har biri rasm, tavsif, texnologiya teglari, video va tugmalar bilan.
6. Aloqa: katta, ko'zga tashlanadigan Telegram tugmasi va telefon.

## Texnik talablar
- Barcha kontent bitta faylda: `src/config/portfolio.ts`. Matn, rasm va video havolalarini faqat shu yerdan o'zgartirish mumkin bo'lsin.
- Rasmlar Google Drive'dan: oddiy ulashish havolasidan FILE_ID ni ajratib, `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1200` ga aylantir.
- Videolar YouTube'dan: avval muqova va play tugmasi, bosilganda `youtube-nocookie.com/embed/ID` iframe yuklansin.
- Havola bo'sh bo'lsa, o'sha element ko'rinmasin. Profil rasmi bo'lmasa, "AH" bosh harflari ko'rsatilsin.
- Avval mobil (375px), keyin desktop. Telegram ichida ochilganda ham chiroyli ko'rinsin.
- Tez yuklansin: Lighthouse'da Performance va Accessibility 90+.
- SEO: sarlavha "Adham Hoshimov — Full-stack dasturchi", o'zbekcha meta description va og rasm, "AH" favicon.

## Taqiqlar
- O'ylab topilgan ma'lumot qo'shma: soxta mijoz fikrlari, "50+ loyiha" kabi raqamlar, ish yillari, sertifikatlar bo'lmasin.
- Lorem ipsum va shablon matni qolmasin.
- Aloqa formasi kerak emas.

## Kontent
- Ism: Adham Hoshimov. Kasb: Full-stack dasturchi.
- Men haqimda: biznes uchun amaliy veb-ilovalar, Telegram botlar va Mini App'lar yaratadi. Loyihani g'oyadan ishga tushirishgacha olib boradi. Cursor va Grok Build kabi AI vositalaridan faol foydalanadi.
- Ko'nikmalar: React, TypeScript, Vite, HTML/CSS, JavaScript; Python (FastAPI, aiogram), Node.js; PostgreSQL (Neon), SQLite; Telegram Bot API, Mini App, webhook; Render, Vercel, GitHub, Cursor, Grok Build.
- Xizmatlar: Telegram bot yaratish; Telegram Mini App; kichik biznes uchun ERP/CRM; kafe va restoranlar uchun QR menyu va buyurtma tizimi; landing va portfolio saytlar; deploy va texnik qo'llab-quvvatlash.
- Loyihalar:
  1. Soyabon kafe. https://prism-cap-harbor-gem.grok.me. Stoldagi QR orqali menyu va buyurtma, onlayn buyurtma, ofitsiant, oshxona, kassir, admin va egasi panellari, stollar xaritasi, kunni yopish hisoboti, PWA. Teglar: React, TypeScript, Vite, PostgreSQL, PWA.
  2. Briket ERP. https://briket-erp.onrender.com, GitHub: https://github.com/blackdiamondbiznes-glitch/briket-erp. Briket (ko'mir) yetkazib berish biznesi uchun ERP tizimi.
  3. Briket Mini App. Briket ko'mir yetkazib berish uchun Telegram Mini App, B2B savdo agentlari uchun. Repo yopiq, GitHub tugmasi yo'q.
  4. Telegram konkurs bot. https://t.me/konkursga_qoshil_bot. Yopiq kanal uchun taklif boti: har bir foydalanuvchiga shaxsiy havola, takliflarni hisoblash, konkurs va vebinar rejimlari, admin Mini App, CSV eksport. Teglar: Python, aiogram 3, FastAPI, PostgreSQL (Neon), Render.
- Aloqa: Telegram https://t.me/Khoshimov_Adkham (asosiy), telefon +998 97 633 03 30 (`tel:+998976330330`).
- Rasm va video havolalari hozircha bo'sh (`""`). Keyin men qo'shaman.


This conversation belongs to a Grok project. The project's files are mounted at `/workspace/artifacts` — look there for user-provided sources before concluding the workspace has no project files. Files written there persist to the project across conversations.