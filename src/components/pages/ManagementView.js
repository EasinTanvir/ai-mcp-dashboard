"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Package,
  Users,
  Tags,
  ShoppingBag,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { PageTitle, AIButton, Toolbar, Badge } from "@/components/ui/Atoms";
import CrudModal from "@/components/ui/CrudModal";
import {
  productSchema,
  categorySchema,
  customerSchema,
} from "@/lib/validation";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/actions/manage";
import { hasPermission, permissionMessage } from "@/lib/permissions";
const icons = {
  Products: Package,
  Categories: Tags,
  Orders: ShoppingBag,
  Customers: Users,
};
const configs = {
  Products: {
    schema: productSchema,
    actions: {
      create: createProduct,
      update: updateProduct,
      remove: deleteProduct,
    },
    fields: [
      { name: "name", label: "Product name" },
      {
        name: "categoryId",
        label: "Category ID",
        type: "number",
        number: true,
      },
      { name: "price", label: "Price", type: "number", number: true },
      { name: "stock", label: "Stock", type: "number", number: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["In stock", "Low stock", "Out of stock"],
      },
    ],
    row: (x) => [x.name, x.sold, x.status, "$" + x.price],
  },
  Categories: {
    schema: categorySchema,
    actions: {
      create: createCategory,
      update: updateCategory,
      remove: deleteCategory,
    },
    fields: [
      { name: "name", label: "Category name" },
      { name: "description", label: "Description" },
      { name: "color", label: "Color" },
    ],
    row: (x) => [x.name, x.description || "—", x.color],
  },
  Customers: {
    schema: customerSchema,
    actions: {
      create: createCustomer,
      update: updateCustomer,
      remove: deleteCustomer,
    },
    fields: [
      { name: "name", label: "Customer name" },
      { name: "email", label: "Email", type: "email" },
      { name: "location", label: "Location" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Premium", "New", "Inactive"],
      },
    ],
    row: (x) => [
      x.name,
      x.email,
      x.location || "—",
      x.status,
      "$" + Number(x.lifetimeValue || 0).toFixed(2),
    ],
  },
};
export function ManagementView({ type, data, role }) {
  const [modal, setModal] = useState(null),
    [notice, setNotice] = useState("");
  const config = configs[type],
    Icon = icons[type],
    allowed = hasPermission(role, "create");
  if (type === "Orders")
    return <SimpleTable type={type} data={data} Icon={Icon} />;
  const notify = () => setNotice(permissionMessage);
  const edit = (item) => (allowed ? setModal(item) : notify());
  const remove = async (id) => {
    if (!allowed) return notify();
    if (confirm("Delete this record?")) {
      const r = await config.actions.remove(id);
      if (!r.ok) setNotice(r.message);
    }
  };
  return (
    <>
      <PageTitle title={type} eyebrow="Commerce management">
        <div className="flex gap-2">
          <AIButton
            label="Create with AI"
            onClick={allowed ? () => setModal({}) : notify}
          />
          <button
            onClick={allowed ? () => setModal({}) : notify}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold"
          >
            <Plus size={16} /> Create {type.slice(0, -1)}
          </button>
        </div>
      </PageTitle>
      {notice && (
        <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </div>
      )}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Total", data.length],
          ["Active", data.filter((x) => x.status !== "Inactive").length],
          ["Source", "Neon"],
        ].map(([n, v]) => (
          <div className="card p-5" key={n}>
            <div className="flex justify-between">
              <span className="text-sm muted">
                {n} {type}
              </span>
              <span className="rounded-xl bg-[var(--soft)] p-2 text-[var(--primary)]">
                <Icon size={17} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="p-5">
          <Toolbar placeholder={"Search " + type.toLowerCase() + "..."} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <tbody>
              {data.map((item, i) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  key={item.id}
                  className="border-b border-[var(--line)]"
                >
                  {config.row(item).map((v, j) => (
                    <td className="px-5 py-4" key={j}>
                      {[
                        "In stock",
                        "Low stock",
                        "Out of stock",
                        "Premium",
                        "Active",
                        "New",
                      ].includes(v) ? (
                        <Badge type={v === "Low stock" ? "warning" : "success"}>
                          {v}
                        </Badge>
                      ) : (
                        <span className={j === 0 ? "font-semibold" : ""}>
                          {v}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="flex gap-1 px-5 py-3">
                    <button
                      onClick={() => edit(item)}
                      className="icon-btn h-8 w-8"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="icon-btn h-8 w-8 text-rose-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <CrudModal
          title={(modal.id ? "Edit " : "Create ") + type.slice(0, -1)}
          fields={config.fields}
          schema={config.schema}
          item={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={modal.id ? config.actions.update : config.actions.create}
        />
      )}
    </>
  );
}
function SimpleTable({ type, data, Icon }) {
  return (
    <>
      <PageTitle title={type} eyebrow="Commerce management" />

      {/* Stats */}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Total Orders", data.length],
          ["Completed", data.filter((x) => x.status === "Completed").length],
          ["Pending", data.filter((x) => x.status === "Pending").length],
        ].map(([title, value]) => (
          <div className="card p-5" key={title}>
            <div className="flex items-center justify-between">
              <span className="text-sm muted">{title}</span>
              <span className="rounded-xl bg-[var(--soft)] p-2 text-[var(--primary)]">
                <Icon size={17} />
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-y border-[var(--line)] bg-[var(--soft)]">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Payment</th>
                <th className="px-5 py-3 font-semibold">Shipping</th>
                <th className="px-5 py-3 font-semibold">Created</th>
              </tr>
            </thead>

            <tbody>
              {data.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--line)] hover:bg-[var(--soft)]"
                >
                  {/* Order */}
                  <td className="px-5 py-4 font-semibold">
                    {order.orderNumber}
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">{order.customerName}</td>

                  {/* Email */}
                  <td className="px-5 py-4 text-[var(--muted)]">
                    {order.customerEmail}
                  </td>

                  {/* Product */}
                  <td className="px-5 py-4">{order.productName}</td>

                  {/* Total */}
                  <td className="px-5 py-4 font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>

                  {/* Order Status */}
                  <td className="px-5 py-4">
                    <Badge type={order.status}>{order.status}</Badge>
                  </td>

                  {/* Payment */}
                  <td className="px-5 py-4">
                    <Badge
                      type={
                        order.paymentStatus === "Paid" ? "success" : "warning"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </td>

                  {/* Shipping */}
                  <td className="px-5 py-4">
                    <Badge
                      type={
                        order.shippingStatus === "Delivered"
                          ? "success"
                          : order.shippingStatus === "Shipped"
                            ? "info"
                            : "warning"
                      }
                    >
                      {order.shippingStatus}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-[var(--muted)]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export function ReviewsView({ data }) {
  return (
    <>
      <PageTitle title="Reviews" eyebrow="Customer sentiment" />
      <div className="grid gap-4 lg:grid-cols-3">
        {data.map((r) => (
          <article className="card p-5" key={r.id}>
            <b>{r.customerName}</b>
            <p className="mt-3 text-sm">{r.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
