
const BASE = "/api"; // proxied by Vite in dev; handled by reverse-proxy in prod
const TOKEN_KEY = "adminToken";

// ─── Shared fetch wrapper ─────────────────────────────────────────────────────

/**
 * Low-level fetch wrapper used by every module below.
 *
 * @param {string} path         – API path, e.g. "/admin/login"
 * @param {RequestInit} options – fetch options (method, body, headers …)
 * @returns {Promise<any>}      – parsed JSON response body
 * @throws {ApiError}
 */
async function request(path, options = {}) {
  const url = `${BASE}${path}`;

  // Merge default headers with caller-supplied headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach the bearer token when one is stored (admin-protected routes)
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      credentials: "same-origin", // works with the Vite proxy setup
      ...options,
      headers,
    });
  } catch (networkError) {
    // fetch() only throws on genuine network failures (no connection, DNS, …)
    throw new ApiError(
      0,
      "Unable to reach the server. Check your connection and try again."
    );
  }

  // Parse JSON regardless of status so backend error messages are surfaced
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      response.status,
      `Unexpected server response (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? defaultMessage(response.status)
    );
  }

  return data;
}

/** Convenience helpers ───────────────────────────────────────────────────── */

function get(path, headers = {}) {
  return request(path, { method: "GET", headers });
}

function post(path, body, headers = {}) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}

function put(path, body, headers = {}) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
    headers,
  });
}

function patch(path, body, headers = {}) {
  return request(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers,
  });
}

function del(path, headers = {}) {
  return request(path, { method: "DELETE", headers });
}

/** Human-readable fallback messages for common HTTP status codes */
function defaultMessage(status) {
  const messages = {
    400: "Bad request. Please check your input.",
    401: "Invalid credentials. Please log in again.",
    403: "You do not have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "Conflict — the resource already exists.",
    422: "Validation failed. Please check the submitted data.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "An internal server error occurred. Please try again later.",
    502: "The server is temporarily unavailable. Please try again.",
    503: "Service unavailable. Please try again later.",
  };
  return messages[status] ?? `Request failed (HTTP ${status}).`;
}

// ─── Custom error class ───────────────────────────────────────────────────────

/**
 * Thrown by every api function on failure.
 * - `error.status`  – HTTP status code (0 = network error)
 * - `error.message` – User-readable message
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH  (/api/admin/…)
// ═════════════════════════════════════════════════════════════════════════════



export const authApi = {
  /**
   * Log in as admin.
   * Stores the returned JWT and user profile in sessionStorage.
   *
   * @param {string} identifier (email or username)
   * @param {string} password
   * @returns {Promise<{ token: string, admin: object }>}
   */
  async login(identifier, password) {
    // Send both email and username so the backend controller finds whichever key it expects
    const data = await post("/auth/login", {
      email: identifier,
      username: identifier,
      password,
    });

    const token = data.token || data.accessToken || data.jwt;
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    }

    const adminUser =
      data.admin ||
      data.user ||
      data.data || {
        name: identifier.includes("@") ? identifier.split("@")[0] : identifier,
        email: identifier.includes("@") ? identifier : `${identifier}@grandazure.com`,
        role: "Administrator",
      };

    sessionStorage.setItem("adminUser", JSON.stringify(adminUser));

    return data;
  },

  /**
   * Log out (invalidates the token on the backend).
   * Always clears the local token and adminUser.
   */
  async logout() {
    try {
      await post("/auth/logout", {});
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem("adminUser");
    }
  },

  /**
   * Fetch the currently authenticated admin's profile.
   * Falls back gracefully to cached session data if endpoint is not implemented yet.
   *
   * @returns {Promise<{ id, name, role, email }>}
   */
  async getMe() {
    try {
      return await get("/admin/me");
    } catch {
      try {
        return await get("/auth/me");
      } catch {
        const cached = sessionStorage.getItem("adminUser");
        if (cached) return JSON.parse(cached);
        return {
          name: "System Administrator",
          email: "admin@grandazure.com",
          role: "Administrator",
        };
      }
    }
  },

  /** Read the stored token (null when not logged in). */
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  /** Read cached user object from sessionStorage. */
  getUser() {
    const cached = sessionStorage.getItem("adminUser");
    return cached ? JSON.parse(cached) : null;
  },

  /** Returns true when a token is stored locally. */
  isLoggedIn() {
    return Boolean(sessionStorage.getItem(TOKEN_KEY));
  },

  /** Clear the local session without hitting the backend. */
  clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem("adminUser");
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// MENU  (/api/menu/…)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Menu API — categories and items.
 *
 * Backend endpoints expected:
 *   GET    /api/menu/categories              → [{ id, name }]
 *   GET    /api/menu/items                   → [MenuItem]
 *   GET    /api/menu/items?category=starters → [MenuItem]  (filtered)
 *   GET    /api/menu/items/:id               → MenuItem
 *   POST   /api/menu/items                   → MenuItem    (admin)
 *   PUT    /api/menu/items/:id               → MenuItem    (admin)
 *   DELETE /api/menu/items/:id               → { message } (admin)
 *
 * MenuItem shape:
 *   { id, name, category, description, price, image, isVeg, isPopular }
 */
export const menuApi = {
  /** Fetch all menu categories. */
  getCategories() {
    return get("/menu/categories");
  },

  /**
   * Fetch menu items, optionally filtered by category.
   * @param {string} [category]  – category id, e.g. "starters"
   */
  getItems(category) {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return get(`/menu/items${query}`);
  },

  /**
   * Fetch a single menu item by id.
   * @param {number|string} id
   */
  getItem(id) {
    return get(`/menu/items/${id}`);
  },

  /**
   * Create a new menu item (admin only).
   * @param {{ name, category, description, price, image, isVeg, isPopular }} item
   */
  createItem(item) {
    return post("/menu/items", item);
  },

  /**
   * Update an existing menu item (admin only).
   * @param {number|string} id
   * @param {Partial<MenuItem>} updates
   */
  updateItem(id, updates) {
    return put(`/menu/items/${id}`, updates);
  },

  /**
   * Delete a menu item (admin only).
   * @param {number|string} id
   */
  deleteItem(id) {
    return del(`/menu/items/${id}`);
  },

  /**
   * Toggle the isPopular flag on a menu item (admin only).
   * @param {number|string} id
   * @param {boolean} isPopular
   */
  setPopular(id, isPopular) {
    return patch(`/menu/items/${id}`, { isPopular });
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// ORDERS  (/api/orders/…)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Order API — placing and tracking orders.
 *
 * Backend endpoints expected:
 *   POST /api/orders                  → Order          (place new order)
 *   GET  /api/orders/:id              → Order          (get single order)
 *   GET  /api/orders?table=12         → [Order]        (orders for a table)
 *   GET  /api/orders?status=pending   → [Order]        (admin: filter by status)
 *   PATCH /api/orders/:id/status      → Order          (admin: update status)
 *
 * Order shape:
 *   {
 *     id, tableNumber, status, items: [{ id, name, quantity, price }],
 *     subtotal, tax, total, createdAt, updatedAt, timeline: [TimelineStep]
 *   }
 *
 * Order statuses (suggested):
 *   "pending" | "preparing" | "serving" | "delivered" | "billed" | "completed"
 */
export const orderApi = {
  /**
   * Place a new order.
   *
   * @param {{
   *   tableNumber: string | number,
   *   items: Array<{ id: number, quantity: number }>,
   *   notes?: string
   * }} orderPayload
   * @returns {Promise<Order>}
   */
  placeOrder(orderPayload) {
    return post("/orders", orderPayload);
  },

  /**
   * Fetch a single order by its id.
   * @param {string|number} orderId
   */
  getOrder(orderId) {
    return get(`/orders/${orderId}`);
  },

  /**
   * Fetch all orders for a specific table.
   * @param {string|number} tableNumber
   */
  getOrdersByTable(tableNumber) {
    return get(`/orders?table=${encodeURIComponent(tableNumber)}`);
  },

  /**
   * Fetch all orders, optionally filtered by status (admin).
   * @param {string} [status] – e.g. "pending", "preparing"
   */
  getAllOrders(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return get(`/orders${query}`);
  },

  /**
   * Update an order's status (admin only).
   *
   * @param {string|number} orderId
   * @param {"pending"|"preparing"|"serving"|"delivered"|"billed"|"completed"} status
   */
  updateStatus(orderId, status) {
    return patch(`/orders/${orderId}/status`, { status });
  },

  /**
   * Cancel an order (admin only).
   * @param {string|number} orderId
   * @param {string} [reason]
   */
  cancelOrder(orderId, reason = "") {
    return patch(`/orders/${orderId}/status`, {
      status: "cancelled",
      reason,
    });
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// TABLES  (/api/tables/…)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Table management API.
 *
 * Backend endpoints expected:
 *   GET   /api/tables                → [Table]
 *   GET   /api/tables/:number        → Table
 *   PATCH /api/tables/:number/status → Table   (admin)
 *
 * Table shape:
 *   { number, capacity, status: "available" | "occupied" | "reserved" }
 */
export const tableApi = {
  /** Fetch all tables. */
  getTables() {
    return get("/tables");
  },

  /**
   * Fetch a single table by its number.
   * @param {string|number} tableNumber
   */
  getTable(tableNumber) {
    return get(`/tables/${tableNumber}`);
  },

  /**
   * Update table status (admin only).
   * @param {string|number} tableNumber
   * @param {"available"|"occupied"|"reserved"} status
   */
  updateTableStatus(tableNumber, status) {
    return patch(`/tables/${tableNumber}/status`, { status });
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN  (/api/admin/…)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Admin dashboard and management API.
 *
 * Backend endpoints expected:
 *   GET /api/admin/dashboard     → { todayOrders, revenue, pendingOrders, tables }
 *   GET /api/admin/orders        → [Order]  (all orders, admin view)
 *   GET /api/admin/orders/live   → [Order]  (only active/pending/preparing)
 */
export const adminApi = {
  /**
   * Fetch dashboard summary stats.
   * @returns {Promise<{
   *   todayOrders: number,
   *   revenue: number,
   *   pendingOrders: number,
   *   occupiedTables: number
   * }>}
   */
  getDashboardStats() {
    return get("/admin/dashboard");
  },

  /**
   * Fetch all orders from the admin view (with richer data than the customer view).
   * @param {{ status?: string, date?: string, tableNumber?: string }} [filters]
   */
  getOrders(filters = {}) {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v != null && v !== "")
      )
    ).toString();
    return get(`/admin/orders${params ? `?${params}` : ""}`);
  },

  /**
   * Fetch only the live / in-progress orders (for the kitchen display).
   */
  getLiveOrders() {
    return get("/admin/orders/live");
  },
};

// ─── Default export (grouped for convenience) ─────────────────────────────────

export default {
  auth: authApi,
  menu: menuApi,
  order: orderApi,
  table: tableApi,
  admin: adminApi,
};

