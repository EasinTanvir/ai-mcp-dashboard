"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
const prompts = [
  // "How many products do we have?",
  // "How many customers?",
  // "How many orders today?",
  // "Show low stock products",
];
export default function AssistantPanel() {
  const [open, setOpen] = useState(false),
    [answer, setAnswer] = useState("");
  const ask = async (message) => {
    if (!message) return;
    setAnswer("Thinking…");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const json = await r.json();
      setAnswer(json.answer || json.error || "Unable to answer right now.");
    } catch {
      setAnswer("Unable to answer right now.");
    }
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
      >
        <Sparkles size={16} />
        Ask Nexa AI
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-end bg-slate-950/35 p-4 sm:place-items-center"
            onClick={() => setOpen(false)}
          >
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-2xl"
            >
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--soft)] text-[var(--primary)]">
                    <Sparkles size={19} />
                  </span>
                  <div>
                    <h2 className="font-semibold">Nexa AI</h2>
                    <p className="text-xs muted">
                      Read-only workspace assistant
                    </p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="icon-btn">
                  <X size={18} />
                </button>
              </header>
              <div className="my-5  py-4 flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <button
                    onClick={() => ask(p)}
                    key={p}
                    className="rounded-lg border border-[var(--line)] px-3 py-2 text-left text-xs"
                  >
                    {p}
                  </button>
                ))}
              </div>
              {answer && (
                <div className="rounded-2xl bg-[var(--soft)] p-4 text-lg font-semibold">
                  {answer}
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(new FormData(e.currentTarget).get("question"));
                  e.currentTarget.reset();
                }}
                className="mt-5 "
              >
                <textarea
                  rows={10}
                  name="question"
                  className=" w-full p-4 text-lg flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3"
                  placeholder="Ask a question..."
                />
                <button className="w-full flex justify-center p-2 items-center rounded-4 gap-2 bg-[var(--primary)] text-white">
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
