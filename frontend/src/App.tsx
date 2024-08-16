import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Products from "./pages/products/Products";
import PresistLogin from "./components/PresistLogin";
import RequireAuth from "./components/RequireAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductGroups from "./pages/groups/ProductGroups";
import CustomersPage from "./pages/customers/Customers";
import SellsPage from "./pages/Sell/SellPage";
import ProductDetailsPage from "./pages/details/ProductDetails";
import PurchasesPage from "./pages/purchase/PurchasePage";
import DebtsPage from "./pages/debts/Debts";
import CustomerDetailsPage from "./pages/customer/CustomerDetails";
import NotificationsPage from "./pages/notifications/Notifications";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover={false}
        theme="light"
      />
      <Routes>
        <Route element={<PresistLogin />}>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Layout />}>
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/groups" element={<ProductGroups />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/sells" element={<SellsPage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/debts" element={<DebtsPage />} />
              <Route path="/customer/:id" element={<CustomerDetailsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
