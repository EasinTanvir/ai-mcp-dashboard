"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
export default function CrudModal({
  title,
  fields,
  schema,
  item,
  onClose,
  onSave,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: item || {} });
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/45 p-4">
      <form
        onSubmit={handleSubmit(async (values) => {
          const f = new FormData();
          Object.entries({ ...values, id: item?.id || "" }).forEach(([k, v]) =>
            f.append(k, v),
          );
          const result = await onSave(f);
          if (result.ok) onClose();
          else alert(result.message || "Unable to save changes.");
        })}
        className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {fields.map((f) => (
            <label key={f.name} className="block text-sm font-medium">
              {f.label}
              {f.type === "select" ? (
                <select
                  {...register(f.name, { valueAsNumber: f.number })}
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm"
                >
                  <option value="">Select</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register(f.name, { valueAsNumber: f.number })}
                  type={f.type || "text"}
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm"
                />
              )}
              {errors[f.name] && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors[f.name].message}
                </p>
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            {isSubmitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
