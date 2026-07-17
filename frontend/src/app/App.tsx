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
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from "./redux/store";



// ======================== MAIN APP ========================


export default function App(){

  return (
  <Provider store={store}>
    <BrowserRouter>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<SplashScreen/>}></Route>
          <Route path="/login" element={<LoginScreen/>}/>
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/business-select" element={<BusinessSelectScreen />} />
          <Route path="/manage-inventory" element={<ManageInventoryScreen />} />
          <Route path="/add-product" element={<AddProductScreen />} />
          <Route path="/restock-goods" element={<RestockGoodsScreen />} />
          <Route path="/view-inventory" element={<ViewInventoryScreen />} />
          <Route path="/customers" element={<ManageCustomersScreen />} />
          <Route path="/add-customer" element={<AddEditCustomerScreen />} />
          <Route path="/edit-customer/:id" element={<AddEditCustomerScreen />} />
          <Route path="/view-customer/:id" element={<ViewCustomerScreen />} />
          <Route path="/home/:traderId?" element={<HomeScreen />} />
          <Route path="/profile" element={<ProfileDashboardScreen />} />
          <Route path="/sales-report" element={<SalesReportScreen />} />
          <Route path="/transactions" element={<TransactionsScreen />} />
          <Route path="/orders-list" element={<OrdersListScreen />} />
          <Route path="/view-order/:id" element={<ViewOrderScreen />} />
          <Route path="/edit-order/:id" element={<EditOrderScreen />} />
          <Route path="/add-order" element={<AddOrderScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/order-confirm" element={<OrderConfirmScreen />} />
        </Routes>
      </PhoneFrame>
    </BrowserRouter>
  </Provider>
  );

}
