export const roles = { DEMO: "demo", REAL: "real" };
const access = {
  demo: new Set(["view", "dashboard_ai"]),
  real: new Set([
    "view",
    "dashboard_ai",
    "create",
    "update",
    "delete",
    "page_ai",
    "mcp",
  ]),
};
export const hasPermission = (role, permission) =>
  access[role]?.has(permission) ?? false;
export const isDemoAdmin = (role) => role === roles.DEMO;
export const isRealAdmin = (role) => role === roles.REAL;
export const permissionMessage =
  "Demo Admin cannot perform this action. Please log in as the Real Admin.";
