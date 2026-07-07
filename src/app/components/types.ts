
export type Screen =
    | "splash" | "login" | "register" | "business-select"
    | "manage-customers" | "add-customer" | "edit-customer" | "view-customer"
    | "manage-inventory" | "add-product" | "restock-goods" | "view-inventory"
    | "home" | "profile-dashboard" | "sales-report"
    | "orders-list" | "view-order" | "edit-order" | "add-order" | "cart" | "order-confirm"
    | "transactions";

export type AppMode = "wholesale" | "retail";
export type PaymentStatus = "paid" | "unpaid" | "partial";
export type PaymentMethod = "cash" | "gpay" | "check";
export type Metric = "piece" | "box" | "kg" | "litre" | "packet";