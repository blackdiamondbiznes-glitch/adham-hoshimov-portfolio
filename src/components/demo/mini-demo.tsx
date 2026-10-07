import { lazy, Suspense, useMemo, useState, type FormEvent } from "react";
import {
  Bell,
  ChevronRight,
  Minus,
  Plus,
  Settings,
  ShoppingCart,
  Store,
  Wallet,
} from "lucide-react";
import { DemoBanner } from "./chrome";
import { som } from "./format";
import "./demo.css";

const MapPicker = lazy(() => import("./mini-map").then((mod) => ({ default: mod.MapPicker })));

type Item = { name: string; qty: number; price: number };
type Invoice = { id: string; created: string; due: string; debt: number; items: Item[] };
type Shop = {
  id: string;
  name: string;
  phone: string;
  address: string;
  lat: number | null;
  lng: number | null;
  invoices: Invoice[];
};
type Product = { id: string; name: string; price: number };

const TODAY = "2026-10-06";
const TOMORROW = "2026-10-07";

const startProducts: Product[] = [
  { id: "kg1", name: "1 kg", price: 4500 },
  { id: "kg15", name: "1.5 kg", price: 6500 },
  { id: "kg2", name: "2 kg", price: 8500 },
];

const rawShops = [
  {
    id: "s1",
    name: "Olmos Market",
    invoices: [
      {
        id: "YX-18",
        created: "2026-09-12",
        due: "2026-10-01",
        debt: 180000,
        items: [{ name: "2 kg", qty: 20, price: 8500 }],
      },
      {
        id: "YX-24",
        created: "2026-09-28",
        due: TODAY,
        debt: 90000,
        items: [{ name: "1.5 kg", qty: 12, price: 6500 }],
      },
    ],
  },
  {
    id: "s2",
    name: "Chiroq Savdo",
    invoices: [
      {
        id: "YX-21",
        created: "2026-09-20",
        due: TOMORROW,
        debt: 120000,
        items: [{ name: "1 kg", qty: 20, price: 4500 }],
      },
    ],
  },
  { id: "s3", name: "Yulduz Nuqta", invoices: [] },
  {
    id: "s4",
    name: "Baraka Nuqta",
    invoices: [
      {
        id: "YX-16",
        created: "2026-09-02",
        due: "2026-09-25",
        debt: 70000,
        items: [{ name: "2 kg", qty: 8, price: 8500 }],
      },
    ],
  },
  { id: "s5", name: "Sadaf Mini", invoices: [] },
];

type Tab = "sales" | "stores" | "debts" | "reminders" | "settings";

function blankShop(partial: Pick<Shop, "id" | "name" | "invoices"> & Partial<Shop>): Shop {
  return { phone: "", address: "", lat: null, lng: null, ...partial };
}

const startShops = rawShops.map((item) => blankShop(item));

function debtOf(shop: Shop) {
  return shop.invoices.reduce((sum, item) => sum + item.debt, 0);
}

function payOldest(invoices: Invoice[], amount: number) {
  const next = invoices.map((item) => ({ ...item }));
  const ordered = [...next].sort(
    (a, b) => a.created.localeCompare(b.created) || a.id.localeCompare(b.id),
  );
  let left = amount;
  const steps: string[] = [];
  for (const invoice of ordered) {
    if (left <= 0 || invoice.debt <= 0) continue;
    const take = Math.min(invoice.debt, left);
    invoice.debt -= take;
    left -= take;
    steps.push(`${invoice.id} dan ${som(take)}${invoice.debt === 0 ? " — yopildi" : ""}`);
  }
  return { invoices: next.filter((item) => item.debt > 0), steps };
}

export function MiniDemo() {
  const [tab, setTab] = useState<Tab>("sales");
  const [shops, setShops] = useState(startShops);
  const [products, setProducts] = useState(startProducts);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"debt" | "name">("debt");
  const [shopId, setShopId] = useState(startShops[0].id);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [paid, setPaid] = useState("");
  const [due, setDue] = useState(TOMORROW);
  const [pay, setPay] = useState("");
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    address: "",
    lat: null as number | null,
    lng: null as number | null,
  });
  const [formError, setFormError] = useState("");
  const [mapFor, setMapFor] = useState<null | "new" | string>(null);
  const [toast, setToast] = useState("");
  const [report, setReport] = useState("");

  const selected = shops.find((item) => item.id === shopId) ?? shops[0];
  const open = shops.find((item) => item.id === openId) ?? null;
  const total = products.reduce((sum, item) => sum + (qty[item.id] || 0) * item.price, 0);
  const paidNum = Math.min(total, Math.max(0, Number(paid) || 0));
  const rest = Math.max(0, total - paidNum);
  const totalDebt = shops.reduce((sum, item) => sum + debtOf(item), 0);

  const visible = useMemo(() => {
    const list = shops.filter((item) =>
      item.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
    return [...list].sort((a, b) =>
      sort === "debt" ? debtOf(b) - debtOf(a) : a.name.localeCompare(b.name, "uz"),
    );
  }, [shops, query, sort]);

  const reminders = shops.flatMap((shop) =>
    shop.invoices.filter((item) => item.due <= TOMORROW).map((item) => ({ ...item, shop })),
  );

  function saveSale() {
    if (!selected || total <= 0) {
      setToast("Mahsulot miqdorini kiriting");
      return;
    }
    if (rest > 0 && !due) {
      setToast("Qarz bo'lsa, muddat kerak");
      return;
    }
    const items = products
      .filter((item) => (qty[item.id] || 0) > 0)
      .map((item) => ({ name: item.name, qty: qty[item.id], price: item.price }));
    if (rest > 0) {
      const id = `YX-${30 + shops.reduce((sum, item) => sum + item.invoices.length, 0)}`;
      setShops((list) =>
        list.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                invoices: [...item.invoices, { id, created: TODAY, due, debt: rest, items }],
              }
            : item,
        ),
      );
    }
    setQty({});
    setPaid("");
    setToast(`Yuk xati saqlandi · ${selected.name} · ${som(total)}`);
  }

  function settle(shop: Shop) {
    const amount = Number(pay);
    const max = debtOf(shop);
    if (!amount || amount <= 0 || amount > max) {
      setToast("To'lov qarzdan oshmasligi kerak");
      return;
    }
    const result = payOldest(shop.invoices, amount);
    setShops((list) =>
      list.map((item) => (item.id === shop.id ? { ...item, invoices: result.invoices } : item)),
    );
    setPay("");
    setToast(result.steps.join(" · "));
  }

  function openCreate() {
    setDraft({ name: "", phone: "", address: "", lat: null, lng: null });
    setFormError("");
    setCreating(true);
  }

  function saveStore(event: FormEvent) {
    event.preventDefault();
    const name = draft.name.trim();
    if (name.length < 2) {
      setFormError("Do'kon nomi kamida 2 belgi bo'lsin.");
      return;
    }
    const phone = draft.phone.trim();
    if (phone && !/^\+?[0-9]{7,15}$/.test(phone.replace(/[\s()-]/g, ""))) {
      setFormError("Telefon raqami noto'g'ri.");
      return;
    }
    const id = `s${shops.length + 1}`;
    setShops((list) => [
      ...list,
      blankShop({
        id,
        name,
        invoices: [],
        phone,
        address: draft.address.trim(),
        lat: draft.lat,
        lng: draft.lng,
      }),
    ]);
    setShopId(id);
    setCreating(false);
    setToast("Do'kon qo'shildi");
  }

  function savePin(lat: number, lng: number, address: string | null) {
    if (mapFor === "new") {
      setDraft((current) => ({
        ...current,
        lat,
        lng,
        address: current.address.trim() ? current.address : address || current.address,
      }));
    } else if (mapFor) {
      setShops((list) =>
        list.map((item) =>
          item.id === mapFor
            ? {
                ...item,
                lat,
                lng,
                address: item.address.trim() ? item.address : address || item.address,
              }
            : item,
        ),
      );
      setToast("Xarita nuqtasi saqlandi");
    }
    setMapFor(null);
  }

  return (
    <div>
      <DemoBanner />
      <div className="bd-stage">
        <div className="bd-phone bd">
          <div className="bd-screen">
            {toast ? <div className="toast">{toast}</div> : null}

            {tab === "sales" ? (
              <>
                <p className="bd-kicker">Yangi sotuv</p>
                <h1>Sotuv oynasi</h1>
                <label className="bd-muted">
                  Do'kon
                  <select value={shopId} onChange={(event) => setShopId(event.target.value)}>
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </label>
                {selected && debtOf(selected) > 0 ? (
                  <div
                    className="bd-card"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>
                      Eski qarz: <b className="bd-ember">{som(debtOf(selected))}</b>
                    </span>
                    <button
                      type="button"
                      className="bd-ember"
                      onClick={() => {
                        setOpenId(selected.id);
                        setTab("stores");
                      }}
                    >
                      Qaytarish
                    </button>
                  </div>
                ) : null}
                {products.map((product) => {
                  const count = qty[product.id] || 0;
                  return (
                    <div key={product.id} className="bd-card">
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <b>{product.name}</b>
                        <span className="bd-muted">{som(count * product.price)}</span>
                      </div>
                      <div className="step" style={{ marginTop: 8 }}>
                        <button
                          type="button"
                          aria-label="Kamaytirish"
                          onClick={() =>
                            setQty((c) => ({ ...c, [product.id]: Math.max(0, count - 1) }))
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          value={count}
                          onChange={(event) =>
                            setQty((c) => ({
                              ...c,
                              [product.id]: Math.max(0, Number(event.target.value) || 0),
                            }))
                          }
                        />
                        <button
                          type="button"
                          aria-label="Ko'paytirish"
                          onClick={() => setQty((c) => ({ ...c, [product.id]: count + 1 }))}
                        >
                          <Plus size={16} />
                        </button>
                        <span className="bd-muted">{som(product.price)}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="bd-card">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Jami</span>
                    <b>{som(total)}</b>
                  </div>
                  <label className="bd-muted">
                    To'langan summa
                    <input
                      value={paid}
                      inputMode="numeric"
                      placeholder="0"
                      onChange={(event) => setPaid(event.target.value)}
                    />
                  </label>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span>Qoldiq qarz</span>
                    <b className={rest > 0 ? "bd-ember" : ""}>{som(rest)}</b>
                  </div>
                </div>
                {rest > 0 ? (
                  <label className="bd-muted">
                    Qarz muddati
                    <input
                      type="date"
                      value={due}
                      onChange={(event) => setDue(event.target.value)}
                    />
                  </label>
                ) : null}
                <button
                  type="button"
                  className="primary"
                  style={{ marginTop: 10 }}
                  onClick={saveSale}
                >
                  Saqlash va yuk xati
                </button>
              </>
            ) : null}

            {tab === "stores" && !open ? (
              <>
                <p className="bd-kicker">Do'konlar va qarzlar</p>
                <h1>Do'konlar</h1>
                <p className="bd-muted">
                  Umumiy qarz: <span className="bd-ember">{som(totalDebt)}</span>
                </p>
                <div className="bd-card">
                  <div className="bd-muted">Kunlik yuklar</div>
                  <button
                    type="button"
                    className="primary"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      const lines = shops.flatMap((shop) =>
                        shop.invoices
                          .filter((item) => item.created === TODAY)
                          .map(
                            (item) =>
                              `${shop.name}: ${item.items.map((line) => `${line.name} x${line.qty}`).join(", ")}`,
                          ),
                      );
                      setReport(
                        lines.length
                          ? lines.join("\n")
                          : "Bugun yangi yuk yo'q. Sotuv saqlang — shu yerga tushadi.",
                      );
                    }}
                  >
                    Bugungi ro'yxat
                  </button>
                  {report ? (
                    <pre style={{ whiteSpace: "pre-wrap", color: "#d4d6db" }}>{report}</pre>
                  ) : null}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input
                    placeholder="Do'kon nomi"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <button
                    type="button"
                    className="primary"
                    style={{ width: "auto", padding: "0 14px" }}
                    onClick={openCreate}
                  >
                    + Yangi
                  </button>
                </div>
                <div className="chips">
                  <button
                    type="button"
                    className={sort === "debt" ? "on" : ""}
                    onClick={() => setSort("debt")}
                  >
                    Qarz
                  </button>
                  <button
                    type="button"
                    className={sort === "name" ? "on" : ""}
                    onClick={() => setSort("name")}
                  >
                    Nom
                  </button>
                </div>
                {visible.map((shop) => (
                  <div key={shop.id} className="bd-line">
                    <button
                      type="button"
                      onClick={() => setOpenId(shop.id)}
                      style={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "space-between",
                        background: "transparent",
                        border: 0,
                        color: "inherit",
                        textAlign: "left",
                      }}
                    >
                      <span>
                        <b>{shop.name}</b>
                        <span className="bd-muted" style={{ display: "block" }}>
                          {shop.address || "Manzil belgilanmagan"}
                        </span>
                      </span>
                      <span className={debtOf(shop) > 0 ? "bd-ember" : "bd-muted"}>
                        {som(debtOf(shop))} <ChevronRight size={16} />
                      </span>
                    </button>
                  </div>
                ))}
              </>
            ) : null}

            {tab === "stores" && open ? (
              <>
                <button type="button" className="bd-muted" onClick={() => setOpenId(null)}>
                  ← Do'konlar
                </button>
                <h1>{open.name}</h1>
                <p className="bd-ember">{som(debtOf(open))}</p>
                <p className="bd-muted">{open.address || "Manzil yo'q"}</p>
                <button type="button" className="bd-ghost" onClick={() => setMapFor(open.id)}>
                  {open.lat != null ? "Nuqta belgilangan — tahrirlash" : "Xaritadan belgilash"}
                </button>
                {open.invoices.length === 0 ? (
                  <p className="bd-muted">Bu do'konda ochiq yuk xati yo'q.</p>
                ) : null}
                {[...open.invoices]
                  .sort((a, b) => a.created.localeCompare(b.created))
                  .map((item, index) => (
                    <div key={item.id} className="bd-card">
                      <b>
                        {index === 0 ? "Eng eski · " : ""}
                        {item.id}
                      </b>
                      <div className="bd-muted">
                        {item.created} · muddat {item.due}
                      </div>
                      <div>{item.items.map((line) => `${line.name} × ${line.qty}`).join(", ")}</div>
                      <div className="bd-ember">{som(item.debt)}</div>
                    </div>
                  ))}
                {debtOf(open) > 0 ? (
                  <form
                    className="sheet"
                    onSubmit={(event) => {
                      event.preventDefault();
                      settle(open);
                    }}
                  >
                    <div className="bd-muted">To'lov eng eski yuk xatidan yopiladi</div>
                    <input
                      inputMode="numeric"
                      placeholder="To'langan summa"
                      value={pay}
                      onChange={(event) => setPay(event.target.value)}
                    />
                    <button className="primary" type="submit" style={{ marginTop: 8 }}>
                      Qarzni kamaytirish
                    </button>
                  </form>
                ) : null}
              </>
            ) : null}

            {tab === "debts" ? (
              <>
                <p className="bd-kicker">Qarzlar</p>
                <h1>Ochiq yuk xatlari</h1>
                <p className="bd-muted">Ro'yxat eskidan yangiga. To'lov shu tartibda ketadi.</p>
                {shops.flatMap((shop) =>
                  [...shop.invoices]
                    .sort((a, b) => a.created.localeCompare(b.created))
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="bd-line"
                        onClick={() => {
                          setOpenId(shop.id);
                          setTab("stores");
                        }}
                      >
                        <span>
                          <b>{shop.name}</b>
                          <span className="bd-muted" style={{ display: "block" }}>
                            {item.id} · {item.created}
                          </span>
                        </span>
                        <span className="bd-ember">{som(item.debt)}</span>
                      </button>
                    )),
                )}
              </>
            ) : null}

            {tab === "reminders" ? (
              <>
                <p className="bd-kicker">Qarzdorlik</p>
                <h1>Eslatmalar</h1>
                <p className="bd-muted">Bugun, ertaga va muddati o'tgan.</p>
                {reminders.length === 0 ? (
                  <div className="bd-card" style={{ textAlign: "center" }}>
                    <Bell />
                    <p>Yaqin qarz yo'q.</p>
                  </div>
                ) : null}
                {reminders.map((item) => {
                  const late = item.due < TODAY;
                  const badge = late ? "KECHIKKAN" : item.due === TODAY ? "BUGUN" : "ERTAGA";
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="bd-card"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        color: "inherit",
                      }}
                      onClick={() => {
                        setOpenId(item.shop.id);
                        setTab("stores");
                      }}
                    >
                      <b>{item.shop.name}</b>
                      <div className="bd-muted">
                        {item.id} · muddat {item.due} · {badge}
                      </div>
                      <div className="bd-ember">{som(item.debt)}</div>
                    </button>
                  );
                })}
              </>
            ) : null}

            {tab === "settings" ? (
              <>
                <p className="bd-kicker">Sozlamalar</p>
                <h1>Mahsulot narxi</h1>
                <p className="bd-muted">Sotuv oynasi shu narxlardan oladi.</p>
                {products.map((product) => (
                  <label key={product.id} className="bd-card" style={{ display: "block" }}>
                    {product.name}
                    <input
                      inputMode="numeric"
                      value={prices[product.id] ?? String(product.price)}
                      onChange={(event) =>
                        setPrices((current) => ({ ...current, [product.id]: event.target.value }))
                      }
                    />
                  </label>
                ))}
                <button
                  type="button"
                  className="primary"
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setProducts((list) =>
                      list.map((item) => ({
                        ...item,
                        price: Number(prices[item.id] ?? item.price) || item.price,
                      })),
                    );
                    setToast("Narxlar saqlandi");
                  }}
                >
                  Saqlash
                </button>
              </>
            ) : null}
          </div>
          <nav className="bd-nav" aria-label="Asosiy menyu">
            {(
              [
                ["sales", "Sotuv", ShoppingCart],
                ["stores", "Do'konlar", Store],
                ["debts", "Qarzlar", Wallet],
                ["reminders", "Eslatma", Bell],
                ["settings", "Sozlama", Settings],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                className={tab === id ? "on" : ""}
                onClick={() => {
                  setTab(id);
                  if (id !== "stores") setOpenId(null);
                }}
              >
                <Icon size={18} />
                <span className="bd-nav-row">
                  {label}
                  {id === "reminders" && reminders.length > 0 ? <i>{reminders.length}</i> : null}
                </span>
              </button>
            ))}
          </nav>
          {creating || mapFor ? (
            <div className="bd-modal">
              {mapFor ? (
                <Suspense fallback={<div className="bd-sheet">Xarita yuklanmoqda…</div>}>
                  <MapPicker
                    lat={
                      mapFor === "new"
                        ? draft.lat
                        : (shops.find((item) => item.id === mapFor)?.lat ?? null)
                    }
                    lng={
                      mapFor === "new"
                        ? draft.lng
                        : (shops.find((item) => item.id === mapFor)?.lng ?? null)
                    }
                    onClose={() => setMapFor(null)}
                    onConfirm={savePin}
                  />
                </Suspense>
              ) : (
                <form className="bd-sheet" onSubmit={saveStore}>
                  <h2>Yangi do'kon</h2>
                  <label className="bd-muted">
                    Nomi
                    <input
                      value={draft.name}
                      placeholder="Masalan: Karvon market"
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </label>
                  <label className="bd-muted">
                    Telefon
                    <input
                      value={draft.phone}
                      inputMode="tel"
                      placeholder="Ixtiyoriy"
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, phone: event.target.value }))
                      }
                    />
                  </label>
                  <label className="bd-muted">
                    Manzil
                    <input
                      value={draft.address}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, address: event.target.value }))
                      }
                    />
                  </label>
                  <button type="button" className="bd-ghost" onClick={() => setMapFor("new")}>
                    {draft.lat != null ? "Nuqta belgilangan — tahrirlash" : "Xaritadan belgilash"}
                  </button>
                  {formError ? <p className="bd-ember">{formError}</p> : null}
                  <div className="ops-row" style={{ marginTop: 8 }}>
                    <button type="button" className="bd-ghost" onClick={() => setCreating(false)}>
                      Bekor
                    </button>
                    <button type="submit" className="primary">
                      Saqlash
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
