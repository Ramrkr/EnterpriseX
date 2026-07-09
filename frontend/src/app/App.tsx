import { useState } from "react";
import { CartItem, Customer, Order, PaymentRecord, Product, Trader } from "./components/models";
import { AppMode,Screen } from "./components/types";
import { api} from "./components/utility";
import { PhoneFrame} from "./components/pages/phone-frame";
import { ManageInventoryScreen } from "./components/pages/manage-inventory";
import { AddProductScreen } from "./components/pages/add-product";
import { SplashScreen } from "./components/pages/splash-screen";
import { LoginScreen } from "./components/pages/login";
import { BusinessSelectScreen } from "./components/pages/business-selection";
import { RestockGoodsScreen } from "./components/pages/restock";
import { RegisterScreen } from "./components/pages/register";
import { ViewInventoryScreen } from "./components/pages/view-inventory";
import { AddEditCustomerScreen, ManageCustomersScreen, ViewCustomerScreen } from "./components/pages/manage-customers";
import { ProfileDashboardScreen } from "./components/pages/profile-dashboard";
import { SalesReportScreen } from "./components/pages/sales-report";
import { TransactionsScreen } from "./components/pages/transactions";
import { OrdersListScreen } from "./components/pages/orders-list";
import { ViewOrderScreen } from "./components/pages/view-orders";
import { EditOrderScreen } from "./components/pages/edit-orders";
import { AddOrderScreen } from "./components/pages/add-order";
import { CartScreen } from "./components/pages/cart";
import { OrderConfirmScreen } from "./components/pages/order-confirm";
import { HomeScreen } from "./components/pages/home-page";
import { loadAppData } from "./components/loadAppData";


// ======================== MAIN APP ========================

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [mode, setMode] = useState<AppMode>("wholesale");
  const [traderId, setTraderId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCustomerId, setCartCustomerId] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const { traders,products,orders,customers,payments } = loadAppData();
  const { setTraders,setOrders,setProducts,setCustomers,setPayments } = loadAppData();

  function go(s: Screen) { setScreen(s); }

  async function addCustomer(data: Omit<Customer, "id">) {
    const created = await api<Customer>('/customers', { method: 'POST', body: JSON.stringify(data) });
    setCustomers(p => [...p, created]);
    go("manage-customers");
  }

  async function updateCustomer(data: Omit<Customer, "id">) {
    const updated = await api<Customer>(`/customers/${editingCustomer?.id}`, { method: 'PUT', body: JSON.stringify(data) });
    setCustomers(p => p.map(c => c.id === updated.id ? updated : c));
    go("manage-customers");
  }

  async function addProduct(data: Omit<Product, "id">) {
    const created = await api<Product>('/products', { method: 'POST', body: JSON.stringify(data) });
    setProducts(p => [...p, created]);
    go("manage-inventory");
  }

  async function restockProduct(productId: string, qty: number) {
    const updated = await api<Product>(`/products/${productId}/restock`, { method: 'PUT', body: JSON.stringify({ qty }) });
    setProducts(p => p.map(prod => prod.id === productId ? updated : prod));
    go("manage-inventory");
  }

  async function placeOrder(data: Omit<Order, "id" | "date">) {
    const order = await api<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ ...data, date: new Date().toISOString().slice(0, 10), payment: { status: 'unpaid', amountPaid: 0 } }),
    });
    setOrders(p => [...p, order]);
    setCurrentOrder(order);
    setCart([]);
    go("order-confirm");
  }

  async function saveEditedOrder(updated: Order) {
    const persisted = await api<Order>(`/orders/${updated.id}`, { method: 'PUT', body: JSON.stringify(updated) });
    setOrders(p => p.map(o => o.id === persisted.id ? persisted : o));
    go("orders-list");
  }

  const content = (() => {
    switch (screen) {
      case "splash": return <SplashScreen onComplete={() => go("login")} />;
      case "login": return <LoginScreen onLogin={() => go("business-select")} onRegister={() => go("register")} />;
      case "register": return <RegisterScreen onBack={() => go("login")} onRegister={() => go("login")} />;
      case "business-select": return (
        <BusinessSelectScreen
          onWholesale={id => { setMode("wholesale"); setTraderId(id); go("home"); }}
          onRetail={() => { setMode("retail"); setTraderId(""); go("home"); }}
          onManageCustomers={() => go("manage-customers")}
          onManageInventory={() => go("manage-inventory")}
        />
      );
      case "manage-inventory": return <ManageInventoryScreen onBack={() => go("business-select")} onAdd={() => go("add-product")} onRestock={() => go("restock-goods")} onView={() => go("view-inventory")} />;
      case "add-product": return <AddProductScreen onBack={() => go("manage-inventory")} onSave={addProduct} />;
      case "restock-goods": return <RestockGoodsScreen onBack={() => go("manage-inventory")} onSave={restockProduct} />;
      case "view-inventory": return <ViewInventoryScreen onBack={() => go(screen === "view-inventory" && traderId ? "home" : "manage-inventory")} />;
      case "manage-customers": return (
        <ManageCustomersScreen onBack={() => go("business-select")}
          onAdd={() => { setEditingCustomer(null); go("add-customer"); }}
          onView={c => { setSelectedCustomer(c); go("view-customer"); }}
          onEdit={c => { setEditingCustomer(c); go("edit-customer"); }}
          onDelete={async id => {
            await api(`/customers/${id}`, { method: 'DELETE' });
            setCustomers(p => p.filter(c => c.id !== id));
          }} />
      );
      case "add-customer": return <AddEditCustomerScreen onBack={() => go("manage-customers")} onSave={addCustomer} />;
      case "edit-customer": return <AddEditCustomerScreen customer={editingCustomer || undefined} onBack={() => go("manage-customers")} onSave={updateCustomer} />;
      case "view-customer": return <ViewCustomerScreen customer={selectedCustomer!} onBack={() => go("manage-customers")} />;
      case "home": return (
        <HomeScreen mode={mode} traderId={traderId}
          onOrders={() => go("orders-list")} onTransactions={() => go("transactions")}
          onInventory={() => go("view-inventory")} onSwitch={() => go("business-select")}
          onSalesReport={() => go("sales-report")} onProfile={() => go("profile-dashboard")} />
      );
      case "profile-dashboard": return <ProfileDashboardScreen onBack={() => go("home")} />;
      case "sales-report": return <SalesReportScreen onBack={() => go("home")} />;
      case "transactions": return <TransactionsScreen orders={orders} payments={payments} mode={mode} traderId={traderId} onBack={() => go("home")} onUpdatePayment={async (id, rec) => {
        const persisted = await api<Record<string, PaymentRecord>>(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(rec) });
        setPayments(p => ({ ...p, [id]: rec }));
      }} />;
      case "orders-list": return (
        <OrdersListScreen orders={orders} mode={mode} traderId={traderId} onBack={() => go("home")}
          onAdd={() => { setCart([]); go("add-order"); }}
          onView={o => { setViewingOrder(o); go("view-order"); }}
          onEdit={o => { setEditingOrder(o); go("edit-order"); }}
          onDelete={async id => {
            await api(`/orders/${id}`, { method: 'DELETE' });
            setOrders(p => p.filter(o => o.id !== id));
          }}
          onUpdateStatus={async (id, s) => {
            const updated = await api<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: s }) });
            setOrders(p => p.map(o => o.id === id ? updated : o));
          }} />
      );
      case "view-order": return viewingOrder ? <ViewOrderScreen order={viewingOrder} payment={payments[viewingOrder.id]} onBack={() => go("orders-list")} /> : null;
      case "edit-order": return editingOrder ? <EditOrderScreen order={editingOrder} products={mode === "retail" ? products : products.filter(p => p.traderId === traderId)} onBack={() => go("orders-list")} onSave={saveEditedOrder} /> : null;
      case "add-order": return <AddOrderScreen customers={customers} cart={cart} products={products} mode={mode} traderId={traderId} onBack={() => go("orders-list")} onUpdateCart={setCart} onViewCart={cid => { setCartCustomerId(cid); go("cart"); }} />;
      case "cart": return <CartScreen cart={cart} customerId={cartCustomerId} customers={customers} mode={mode} traderId={traderId} onBack={() => go("add-order")} onConfirm={placeOrder} />;
      case "order-confirm": return currentOrder ? <OrderConfirmScreen order={currentOrder} onHome={() => go("home")} /> : null;
      default: return null;
    }
  })();

  return <PhoneFrame>{content}</PhoneFrame>;
}
