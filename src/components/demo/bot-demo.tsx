import { useEffect, useMemo, useRef, useState } from "react";
import { DemoBanner } from "./chrome";
import "./demo.css";

type Person = { name: string; count: number; invited: string[] };

const people: Person[] = [
  { name: "Aziza K.", count: 12, invited: ["Do'st 1", "Do'st 2", "Do'st 3"] },
  { name: "Bekzod R.", count: 9, invited: ["Do'st 4", "Do'st 5"] },
  { name: "Dilnoza S.", count: 7, invited: ["Do'st 6"] },
  { name: "Eldor M.", count: 4, invited: [] },
  { name: "Demo a'zo", count: 3, invited: ["Do'st 7"] },
];

type Msg = { id: number; mine: boolean; text: string };
type AdminTab = "stats" | "people" | "winner" | "settings";

export function BotDemo() {
  const [mode, setMode] = useState<"contest" | "webinar">("contest");
  const [date, setDate] = useState("12 oktyabr, 20:00");
  const [link, setLink] = useState("https://demo.example/vebinar");
  const [minInvites, setMinInvites] = useState(5);
  const [saved, setSaved] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [winner, setWinner] = useState("");
  const [admin, setAdmin] = useState<AdminTab>("stats");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      mine: false,
      text: "Konkurs boti tayyor. Pastdagi tugmalar doim chiqib turadi.",
    },
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const webinar = mode === "webinar";

  const filtered = useMemo(
    () => people.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );
  const eligible = people.filter((item) => item.count >= minInvites).length;

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [messages]);

  function say(mine: boolean, text: string) {
    setMessages((list) => [...list, { id: Date.now() + list.length, mine, text }]);
  }

  function start() {
    say(true, "/start");
    say(
      false,
      "Assalomu alaykum, Demo a'zo!\n\nKonkursga xush kelibsiz. Quyidagi xabarni do'stlaringizga yuboring — ular shu havola orqali kanalga a'zo bo'lsa, taklif sizga hisoblanadi.\n\nt.me/demo_konkurs_bot?start=1042",
    );
  }

  function share() {
    say(true, "Mening taklif havolam");
    say(
      false,
      "Sahifaga a'zo bo'ling.\nBot orqali do'stlaringizni taklif qiling.\nt.me/demo_konkurs_bot?start=1042",
    );
  }

  function status() {
    say(true, "Mening holatim");
    const need = webinar
      ? `Vebinar ishtirokchisi bo'lish uchun kerak: ${minInvites} ta`
      : `G'olib bo'lish uchun kerak: ${minInvites} ta`;
    const extra =
      3 >= minInvites
        ? webinar
          ? `\nTabriklaymiz! Siz vebinar ishtirokchisisiz.\n${date}\n${link}`
          : "\nTabriklaymiz! Siz shartni bajardingiz."
        : `\nYana ${minInvites - 3} ta do'stingizni taklif qiling!`;
    say(
      false,
      `Ismingiz: Demo a'zo\nTasdiqlangan taklif: 3 ta\nKutilmoqdagi taklif: 1 ta\n${need}\nReytingda o'rningiz: 5-o'rin${extra}`,
    );
  }

  function rating() {
    say(true, "Reyting");
    say(
      false,
      [
        webinar ? "TOP-5 vebinar ishtirokchilari:" : "TOP-5 ishtirokchilar:",
        "",
        ...people.map((item, index) => `${index + 1}. ${item.name} — ${item.count} ta`),
      ].join("\n"),
    );
  }

  function exportCsv() {
    const text = [
      "ism,tasdiqlangan,taklif_qilgan",
      ...people.map((item) => `${item.name},${item.count},${item.invited.length}`),
    ].join("\n");
    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "konkurs-demo.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setSaved("Demo CSV yuklandi");
  }

  function pick() {
    const pool = people.filter((item) => item.count >= minInvites);
    const choice = pool[Math.floor(Math.random() * pool.length)] ?? people[0];
    setWinner(`${choice.name} — ${choice.count} ta tasdiqlangan taklif`);
  }

  return (
    <div>
      <DemoBanner />
      <div className="tg-page">
        <section className="tg" aria-label="Telegram chat">
          <div className="tg-bar">
            Konkurs bot
            <small>demo · javoblar shu yerda</small>
          </div>
          <div className="tg-log" ref={logRef}>
            {messages.map((message) => (
              <div key={message.id} className={message.mine ? "bubble me" : "bubble"}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="keys">
            <button type="button" onClick={start}>
              /start
            </button>
            <button type="button" onClick={share}>
              Mening taklif havolam
            </button>
            <div className="keys-2">
              <button type="button" onClick={status}>
                Mening holatim
              </button>
              <button type="button" onClick={rating}>
                Reyting
              </button>
            </div>
          </div>
        </section>

        <section className="wa" aria-label="Admin Mini App">
          <div className="wa-body">
            {admin === "stats" ? (
              <>
                <h1>{webinar ? "Vebinar statistikasi" : "Statistika"}</h1>
                <div className="folio" style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h2>{webinar ? "Vebinar ishtirokchilari" : "Ishtirok"}</h2>
                    <span className="badge ok">{webinar ? "Vebinar" : "Konkurs"}</span>
                  </div>
                  <p>
                    {webinar ? "Vebinarga yo'l olgan" : "Shartni bajargan"}: {eligible} / {people.length}
                  </p>
                  <div className="bar">
                    <i style={{ width: `${(eligible / people.length) * 100}%` }} />
                  </div>
                  <p className="bd-muted">Minimal taklif: {minInvites}</p>
                </div>
                <div className="split" style={{ marginTop: 12 }}>
                  <div className="folio">
                    <h2>Tasdiqlangan</h2>
                    <p style={{ fontSize: 28, margin: "8px 0 0" }}>
                      {people.reduce((sum, item) => sum + item.count, 0)}
                    </p>
                  </div>
                  <div className="folio">
                    <h2>Kutilmoqda</h2>
                    <p style={{ fontSize: 28, margin: "8px 0 0" }}>6</p>
                  </div>
                </div>
                <h2 style={{ marginTop: 16 }}>{webinar ? "Vebinar reytingi" : "Reyting"}</h2>
                {people.map((person, index) => (
                  <div key={person.name} className="person">
                    <b>
                      {index + 1}. {person.name} — {person.count} ta
                    </b>
                    <div className="bar">
                      <i style={{ width: `${(person.count / people[0].count) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {admin === "people" ? (
              <>
                <h1>{webinar ? "Vebinar ishtirokchilari" : "Ishtirokchilar"}</h1>
                <input
                  placeholder="Ism bo'yicha"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {filtered.map((person) => (
                  <button
                    key={person.name}
                    type="button"
                    className="person"
                    onClick={() => setOpen(open === person.name ? null : person.name)}
                  >
                    <b>
                      {person.name} — {person.count} ta
                    </b>
                    <div className={person.count >= minInvites ? "badge ok" : "badge warn"}>
                      {person.count >= minInvites
                        ? webinar
                          ? "Vebinarga tayyor"
                          : "Shart bajarilgan"
                        : "Yetmaydi"}
                    </div>
                    {open === person.name ? (
                      <div className="bd-muted">
                        Taklif qilganlar:{" "}
                        {person.invited.length ? person.invited.join(", ") : "hali yo'q"}
                      </div>
                    ) : null}
                  </button>
                ))}
              </>
            ) : null}

            {admin === "winner" ? (
              <>
                <h1>{webinar ? "Vebinar ishtirokchisini tanlash" : "G'olibni aniqlash"}</h1>
                <p>
                  {webinar
                    ? "Faqat vebinarga yo'l olganlar ichidan tanlanadi. Kanalga xabar ketmaydi."
                    : "Faqat minimal taklifni bajarganlar ichidan tanlanadi. Kanalga xabar ketmaydi."}
                </p>
                <button type="button" className="primary" onClick={pick}>
                  {webinar ? "Ishtirokchini tanlash" : "G'olibni aniqlash"}
                </button>
                {winner ? (
                  <div className="folio" style={{ marginTop: 12 }}>
                    <h2>{winner}</h2>
                  </div>
                ) : (
                  <div className="folio" style={{ marginTop: 12 }}>
                    <h2>Hali tanlanmagan</h2>
                    <p>
                      {webinar ? "Vebinarga yo'l olgan" : "Shartni bajargan"} {eligible} kishi ichidan
                      tasodifiy bitta chiqadi.
                    </p>
                  </div>
                )}
              </>
            ) : null}

            {admin === "settings" ? (
              <>
                <h1>Sozlamalar</h1>
                <label>
                  Minimal taklif
                  <input
                    inputMode="numeric"
                    value={minInvites}
                    onChange={(event) => setMinInvites(Math.max(1, Number(event.target.value) || 1))}
                  />
                </label>
                <label>
                  Rejim
                  <select
                    value={mode}
                    onChange={(event) => setMode(event.target.value as "contest" | "webinar")}
                  >
                    <option value="contest">Konkurs</option>
                    <option value="webinar">Vebinar</option>
                  </select>
                </label>
                <label>
                  Vebinar sanasi
                  <input value={date} onChange={(event) => setDate(event.target.value)} />
                </label>
                <label>
                  Vebinar havolasi
                  <input value={link} onChange={(event) => setLink(event.target.value)} />
                </label>
                <button
                  type="button"
                  className="primary"
                  style={{ marginTop: 8 }}
                  onClick={() => setSaved("Sozlama saqlandi. Holatim shu rejimni ko'rsatadi.")}
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  className="primary"
                  style={{ marginTop: 8, background: "#2f4f4f" }}
                  onClick={exportCsv}
                >
                  CSV eksport
                </button>
                {saved ? <p>{saved}</p> : null}
              </>
            ) : null}
          </div>

          <nav className="wa-nav">
            {(
              [
                ["stats", "Statistika"],
                ["people", "Odamlar"],
                ["winner", "G'olib"],
                ["settings", "Sozlama"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={admin === id ? "on" : ""}
                onClick={() => setAdmin(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </section>
      </div>
    </div>
  );
}
