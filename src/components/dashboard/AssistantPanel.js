"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Package, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

const prompts = [
  "Show me the most recent orders",
  "Show low stock products",
  "How many products do we have?",
  "How many customers?",
  "How many orders today?",
];

export default function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const [question, setQuestion] = useState("");

  const closeAndReset = () => {
    setOpen(false);
    setAnswer("");
    setData(null);
    setLoading(false);
    setQuestion("");
  };

  const ask = async (message) => {
    if (!message) return;
    setLoading(true);
    setAnswer("");
    setData(null);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const json = await r.json();
      setAnswer(json.answer || json.error || "Unable to answer right now.");
      setData(json.data || null);
    } catch {
      setAnswer("Unable to answer right now.");
    } finally {
      setLoading(false);
      setQuestion(""); // clear input only after the response lands
    }
  };
  if (pathname.includes("login")) return null;

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 0px rgba(99,102,241,0.4)",
            "0 0 22px rgba(99,102,241,0.7)",
            "0 0 0px rgba(99,102,241,0.4)",
          ],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
      >
        <Sparkles size={16} />
        Ask Nexa AI
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-end bg-slate-950/35 p-4 sm:place-items-center"
            onClick={closeAndReset}
          >
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--soft)] text-[var(--primary)]">
                    <Sparkles size={19} />
                  </span>
                  <div>
                    <h2 className="font-semibold">Nexa AI</h2>
                    <p className="text-xs muted">Workspace assistant</p>
                  </div>
                </div>
                <button onClick={closeAndReset} className="icon-btn">
                  <X size={18} />
                </button>
              </header>

              <div className="my-5 py-4 flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <button
                    onClick={() => ask(p)}
                    key={p}
                    className="rounded-lg border border-[var(--line)] px-3 py-2 text-left text-xs hover:bg-[var(--soft)] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="rounded-2xl bg-[var(--soft)] p-4 text-sm muted animate-pulse">
                  Thinking…
                </div>
              )}

              {!loading && answer && (
                <div className="rounded-2xl bg-[var(--soft)] p-4 text-lg font-semibold">
                  {answer}
                </div>
              )}

              {!loading &&
                data?.type === "orders" &&
                data.items?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {data.items.map((order, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--soft)] text-[var(--primary)]">
                          <ShoppingBag size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold">
                              {order.orderNumber}
                            </p>
                            <span className="shrink-0 rounded-full bg-[var(--soft)] px-2 py-0.5 text-xs font-medium">
                              {order.status}
                            </span>
                          </div>
                          <p className="truncate text-xs muted">
                            {order.customerName || "Unknown customer"}
                            {order.customerEmail
                              ? ` · ${order.customerEmail}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {!loading &&
                data?.type === "products" &&
                data.items?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {data.items.map((product, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--soft)] text-[var(--primary)]">
                          <Package size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {product.name}
                          </p>
                          <p className="text-xs muted">
                            {product.stock} in stock
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(question);
                }}
                className="mt-5"
              >
                <textarea
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                  className="w-full p-4 text-lg flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 disabled:opacity-60"
                  placeholder="Ask a question..."
                />
                <button
                  disabled={loading}
                  className="w-full flex justify-center p-2 items-center rounded-xl gap-2 bg-[var(--primary)] text-white mt-2 disabled:opacity-60"
                >
                  send <Send size={16} />
                </button>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
