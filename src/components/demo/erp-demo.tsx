import { useMemo, useState } from "react";
import {
  Boxes,
  Factory,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import { DemoBanner } from "./chrome";
import { som } from "./format";
import "./demo.css";

type Sku = {
  sku: string;
  name: string;
  kg: number;
  cost: number;
  price: number;
  packed: number;
  sold: number;
  shipped: number;
};

type Order = {
  code: string;
  customer: string;
  total: number;
  paid: number;
  date: string;
};

type Batch = { code: string; sku: string; dry: number; packed: number };

const TODAY = "2026-10-06";

const startSkus: Sku[] = [
  {
    sku: "OL-10",
    name: "Olov 10 kg",
    kg: 10,
    cost: 19000,
    price: 28000,
    packed: 860,
    sold: 540,
    shipped: 80,
  },
  {
    sku: "OL-12",
    name: "Olov 12 kg",
    kg: 12,
    cost: 22000,
    price: 32000,
    packed: 410,
    sold: 300,
    shipped: 90,
  },
  {
    sku: "QT-08",
    name: "Qora tosh 8 kg",
    kg: 8,
    cost: 15000,
    price: 21000,
    packed: 300,
    sold: 140,
    shipped: 20,
  },
];

const startOrders: Order[] = [
  { code: "BD-1042", customer: "Olmos Market", total: 1400000, paid: 1400000, date: TODAY },
  { code: "BD-1041", customer: "Chiroq Savdo", total: 960000, paid: 400000, date: TODAY },
  { code: "BD-1038", customer: "Yulduz Nuqta", total: 640000, paid: 0, date: "2026-10-02" },
  { code: "BD-1033", customer: "Baraka Nuqta", total: 2100000, paid: 2100000, date: "2026-10-01" },
];

const customers = ["Olmos Market", "Chiroq Savdo", "Yulduz Nuqta", "Baraka Nuqta", "Sadaf Mini"];

const nav = [
  { id: "dash", label: "Dashboard", group: "Boshqaruv", icon: LayoutDashboard },
  { id: "batch", label: "Partiya", group: "Ishlab chiqarish", icon: Factory },
  { id: "stock", label: "Ombor", group: "Ishlab chiqarish", icon: Warehouse },
  { id: "orders", label: "Buyurtma", group: "Savdo", icon: ShoppingCart },
  { id: "pay", label: "To'lov", group: "Savdo", icon: Package },
  { id: "sku", label: "Katalog", group: "Katalog", icon: Boxes },
  { id: "clients", label: "Mijoz", group: "Katalog", icon: Users },
  { id: "shop", label: "Mijoz ilovasi", group: "Mijoz", icon: ShoppingCart },
] as const;

type Tab = (typeof nav)[number]["id"];

function balance(item: Sku) {
  return item.packed - item.sold - item.shipped;
}

function statusOf(order: Order) {
  if (order.paid <= 0) return { key: "info", label: "Yangi" };
  if (order.paid >= order.total) return { key: "ok", label: "To'langan" };
  return { key: "warn", label: "Qisman" };
}

export function ErpDemo() {
  const [tab, setTab] = useState<Tab>("dash");
  const [period, setPeriod] = useState<"today" | "month">("today");
  const [skus, setSkus] = useState(startSkus);
  const [orders, setOrders] = useState(startOrders);
  const [batches, setBatches] = useState<Batch[]>([
    { code: "P-104", sku: "OL-10", dry: 1200, packed: 860 },
    { code: "P-105", sku: "OL-12", dry: 640, packed: 280 },
  ]);
  const [buyer, setBuyer] = useState(customers[0]);
  const [qty, setQty] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<Record<string, number>>({});
  const [payCode, setPayCode] = useState(startOrders[1].code);
  const [paySum, setPaySum] = useState("560000");
  const [note, setNote] = useState("");

  const monthOrders = orders.filter((item) => item.date.startsWith("2026-10"));
  const shown = period === "today" ? orders.filter((item) => item.date === TODAY) : monthOrders;
  const sales = shown.reduce((sum, item) => sum + item.total, 0);
  const cash = shown.reduce((sum, item) => sum + item.paid, 0);
  const debt = orders.reduce((sum, item) => sum + Math.max(0, item.total - item.paid), 0);
  const expense = period === "today" ? 380000 : 5400000;
  const profit = sales - (period === "today" ? 380000 : 5400000);
  const stockValue = skus.reduce((sum, item) => sum + balance(item) * item.price, 0);
  const low = skus.filter((item) => balance(item) < 40);

  const groups = useMemo(() => {
    const map = new Map<string, (typeof nav)[number][]>();
    nav.forEach((item) => {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    });
    return [...map.entries()];
  }, []);

  function pack(batchCode: string, amount: number) {
    setBatches((list) =>
      list.map((item) =>
        item.code === batchCode
          ? { ...item, packed: Math.min(item.dry, item.packed + amount) }
          : item,
      ),
    );
    const batch = batches.find((item) => item.code === batchCode);
    if (!batch) return;
    setSkus((list) =>
      list.map((item) =>
        item.sku === batch.sku ? { ...item, packed: item.packed + amount } : item,
      ),
    );
    setNote(`${batch.sku} omborga ${amount} dona qo'shildi`);
    setTab("stock");
  }

  function place(lines: { sku: string; count: number }[]) {
    const total = lines.reduce((sum, line) => {
      const sku = skus.find((item) => item.sku === line.sku);
      return sum + (sku ? sku.price * line.count : 0);
    }, 0);
    if (total <= 0) return;
    const code = `BD-${1043 + orders.length}`;
    setOrders((list) => [{ code, customer: buyer, total, paid: 0, date: TODAY }, ...list]);
    setSkus((list) =>
      list.map((item) => {
        const line = lines.find((entry) => entry.sku === item.sku);
        return line ? { ...item, sold: item.sold + line.count } : item;
      }),
    );
    setCart({});
    setNote(`Buyurtma qabul qilindi: ${code}`);
    setTab("orders");
  }

  function takePayment() {
    const amount = Number(paySum.replace(/\s/g, ""));
    if (!amount || amount <= 0) return;
    setOrders((list) =>
      list.map((item) =>
        item.code === payCode ? { ...item, paid: Math.min(item.total, item.paid + amount) } : item,
      ),
    );
    setNote(`${payCode} ga ${som(amount)} yozildi`);
  }

  const title = nav.find((item) => item.id === tab)?.label ?? "";

  return (
    <div>
      <DemoBanner />
      <div className="ops">
        <aside className="ops-side">
          <div className="ops-brand">Black Diamond</div>
          {groups.map(([group, items]) => (
            <div key={group}>
              <div className="ops-group">{group}</div>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={tab === item.id ? "on" : ""}
                    onClick={() => setTab(item.id)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </aside>
        <main className="ops-main">
          <div className="ops-mobile">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                className={tab === item.id ? "on" : ""}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {tab !== "shop" ? (
            <div className="ops-head">
              <div>
                <h1>Black Diamond OPS · {title}</h1>
                <p>
                  {TODAY} · Asia/Tashkent · ombor qiymati {som(stockValue)}
                </p>
              </div>
              {tab === "dash" ? (
                <div className="seg">
                  <button
                    type="button"
                    className={period === "today" ? "on" : ""}
                    onClick={() => setPeriod("today")}
                  >
                    Bugun
                  </button>
                  <button
                    type="button"
                    className={period === "month" ? "on" : ""}
                    onClick={() => setPeriod("month")}
                  >
                    Shu oy
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          {note ? <div className="alert">{note}</div> : null}

          {tab === "dash" ? (
            <>
              <div className={low.length ? "alert warn" : "alert"}>
                {low.length
                  ? `${low.map((item) => item.sku).join(", ")} qoldig'i kam — qadoqlash kerak.`
                  : "Ogohlantirish yo'q — zaxira normal."}
              </div>
              <div className="kpis">
                <article className="kpi">
                  <span>{period === "today" ? "Bugungi foyda" : "Oylik foyda"}</span>
                  <strong>{som(profit)}</strong>
                  <em>savdo − xarajat</em>
                  <div className="bar">
                    <i
                      style={{
                        width: `${Math.min(100, (Math.abs(profit) / Math.max(sales, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </article>
                <article className="kpi">
                  <span>Savdo</span>
                  <strong>{som(sales)}</strong>
                  <em>tasdiqlangan buyurtmalar</em>
                </article>
                <article className="kpi">
                  <span>Naqd tushum</span>
                  <strong>{som(cash)}</strong>
                  <em>to'lovlar</em>
                </article>
                <article className="kpi">
                  <span>Xarajat</span>
                  <strong>{som(expense)}</strong>
                  <em>press / qadoq</em>
                </article>
                <article className="kpi">
                  <span>Qarz</span>
                  <strong>{som(debt)}</strong>
                  <em>ochiq buyurtmalar</em>
                </article>
              </div>
              <div className="meta">
                <span>
                  Partiya: <b>{batches.length}</b>
                </span>
                <span>
                  SKU: <b>{skus.length}</b>
                </span>
                <span>
                  Quruq qoldiq:{" "}
                  <b>{batches.reduce((sum, item) => sum + (item.dry - item.packed), 0)} kg</b>
                </span>
              </div>
              <div className="split">
                <section className="panel">
                  <h2>Tayyor mahsulot</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Qadoq</th>
                        <th>Sotuv</th>
                        <th>Qoldiq</th>
                        <th>Qiymat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skus.map((item) => (
                        <tr key={item.sku}>
                          <td>{item.sku}</td>
                          <td>{item.packed}</td>
                          <td>{item.sold}</td>
                          <td>
                            <b>{balance(item)}</b>
                          </td>
                          <td>{som(balance(item) * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
                <section className="panel">
                  <h2>So'nggi buyurtmalar</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Kod</th>
                        <th>Mijoz</th>
                        <th>Summa</th>
                        <th>Holat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map((order) => {
                        const status = statusOf(order);
                        return (
                          <tr key={order.code}>
                            <td>{order.code}</td>
                            <td>{order.customer}</td>
                            <td>{som(order.total)}</td>
                            <td>
                              <span className={`badge ${status.key}`}>{status.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
              </div>
            </>
          ) : null}

          {tab === "batch" ? (
            <section className="panel">
              <h2>Faol partiyalar</h2>
              <table>
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>SKU</th>
                    <th>Quruq</th>
                    <th>Qadoq</th>
                    <th>Qoldiq</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((item) => (
                    <tr key={item.code}>
                      <td>{item.code}</td>
                      <td>{item.sku}</td>
                      <td>{item.dry}</td>
                      <td>{item.packed}</td>
                      <td>
                        {item.dry - item.packed}
                        <div className="bar">
                          <i
                            style={{
                              width: `${Math.min(100, ((item.dry - item.packed) / item.dry) * 100)}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn solid"
                          onClick={() => pack(item.code, 40)}
                        >
                          40 dona qadoq
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {tab === "stock" ? (
            <section className="panel">
              <h2>Ombor · tan narx va optom</h2>
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Qoldiq</th>
                    <th>Tannarx</th>
                    <th>Optom</th>
                    <th>Foyda/dona</th>
                    <th>Ombor savdo</th>
                  </tr>
                </thead>
                <tbody>
                  {skus.map((item) => (
                    <tr key={item.sku}>
                      <td>{item.name}</td>
                      <td>{balance(item)}</td>
                      <td>{som(item.cost)}</td>
                      <td>{som(item.price)}</td>
                      <td>{som(item.price - item.cost)}</td>
                      <td>{som(balance(item) * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {tab === "orders" ? (
            <section className="panel">
              <h2>Buyurtmalar</h2>
              <table>
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>Mijoz</th>
                    <th>Sana</th>
                    <th>Summa</th>
                    <th>To'langan</th>
                    <th>Qarz</th>
                    <th>Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = statusOf(order);
                    return (
                      <tr key={order.code}>
                        <td>{order.code}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>{som(order.total)}</td>
                        <td>{som(order.paid)}</td>
                        <td>{som(order.total - order.paid)}</td>
                        <td>
                          <span className={`badge ${status.key}`}>{status.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ) : null}

          {tab === "pay" ? (
            <section className="panel">
              <h2>To'lov yozish</h2>
              <div className="form">
                <label>
                  Buyurtma
                  <select value={payCode} onChange={(event) => setPayCode(event.target.value)}>
                    {orders
                      .filter((item) => item.paid < item.total)
                      .map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code} · {item.customer} · qarz {som(item.total - item.paid)}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Summa
                  <input
                    value={paySum}
                    onChange={(event) => setPaySum(event.target.value)}
                    inputMode="numeric"
                  />
                </label>
                <button type="button" className="btn solid" onClick={takePayment}>
                  To'lovni saqlash
                </button>
              </div>
            </section>
          ) : null}

          {tab === "sku" ? (
            <section className="panel">
              <h2>Mahsulotlar · optom narx. 500 donagacha mijoz narxi optom + 3 000.</h2>
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>kg</th>
                    <th>Tannarx</th>
                    <th>Optom</th>
                    <th>Mijoz</th>
                    <th>Qoldiq</th>
                  </tr>
                </thead>
                <tbody>
                  {skus.map((item) => (
                    <tr key={item.sku}>
                      <td>{item.name}</td>
                      <td>{item.kg}</td>
                      <td>{som(item.cost)}</td>
                      <td>{som(item.price)}</td>
                      <td>{som(item.price + 3000)}</td>
                      <td>{balance(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {tab === "clients" ? (
            <section className="panel">
              <h2>Mijozlar</h2>
              <table>
                <thead>
                  <tr>
                    <th>Mijoz</th>
                    <th>Ochiq qarz</th>
                    <th>Buyurtma</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((name) => {
                    const rows = orders.filter((item) => item.customer === name);
                    const open = rows.reduce(
                      (sum, item) => sum + Math.max(0, item.total - item.paid),
                      0,
                    );
                    return (
                      <tr key={name}>
                        <td>{name}</td>
                        <td>{som(open)}</td>
                        <td>{rows.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ) : null}

          {tab === "shop" ? (
            <div className="mijoz">
              <div className="mijoz-top">
                <h2>BLACK DIAMOND</h2>
                <p>Premium briket · mijoz katalogi</p>
              </div>
              <div className="mijoz-body">
                <p>1) Miqdorni yozing → 2) Savatga → 3) Buyurtma yuboriladi</p>
                <label>
                  Do'kon
                  <select value={buyer} onChange={(event) => setBuyer(event.target.value)}>
                    {customers.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
                {skus.map((item) => (
                  <article key={item.sku} className="sku">
                    <div>
                      <b>{item.name}</b>
                      <small>
                        {som(item.price)} · qoldiq {balance(item)} · savatda {cart[item.sku] || 0}
                      </small>
                      <input
                        style={{
                          marginTop: 8,
                          background: "#1a1814",
                          color: "#f5f0e6",
                          borderColor: "#c9a227",
                        }}
                        inputMode="numeric"
                        placeholder="Miqdor, masalan 10"
                        value={qty[item.sku] ?? ""}
                        onChange={(event) =>
                          setQty((current) => ({
                            ...current,
                            [item.sku]: event.target.value.replace(/\D/g, ""),
                          }))
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const count = Number(qty[item.sku]) || 0;
                        if (count < 1) {
                          setNote("Avval miqdorni kiriting");
                          return;
                        }
                        setCart((current) => ({
                          ...current,
                          [item.sku]: (current[item.sku] || 0) + count,
                        }));
                        setQty((current) => ({ ...current, [item.sku]: "" }));
                        setNote("");
                      }}
                    >
                      Savatga
                    </button>
                  </article>
                ))}
                <div className="sku">
                  <div>
                    <b>Savat · {buyer}</b>
                    <small>
                      {som(skus.reduce((sum, item) => sum + (cart[item.sku] || 0) * item.price, 0))}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      place(
                        skus
                          .filter((item) => (cart[item.sku] || 0) > 0)
                          .map((item) => ({ sku: item.sku, count: cart[item.sku] })),
                      )
                    }
                  >
                    Yuborish
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
