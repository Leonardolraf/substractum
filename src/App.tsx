import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import Profile from "@/pages/Profile";
import ProfileAdmin from "@/pages/ProfileAdmin";
import ProfileSeller from "@/pages/ProfileSeller";
import AdminDashboard from "@/pages/AdminDashboard";
import SellerDashboard from "@/pages/SellerDashboard";
import Payment from "@/pages/Payment";
import CreateOrderPage from "@/pages/CreateOrderPage";
import OrdersPage from "@/pages/OrdersPage";
import MyOrders from "@/pages/MyOrders";
import OrderDetail from "@/pages/OrderDetail";
import QuickActions from "@/pages/QuickActions";
import MyProducts from "@/pages/MyProducts";
import SalesReport from "@/pages/SalesReport";
import HelpCenter from "@/pages/HelpCenter";
import OrderCompleted from "@/pages/OrderCompleted";
import OrderDetailPage from "@/pages/OrderDetailPage";
import NotFound from "@/pages/NotFound";
import Vendas from "@/pages/Vendas";
import SendPrescription from "@/pages/SendPrescription";
import PrescriptionRequests from "@/pages/PrescriptionRequests";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-admin" element={<ProtectedRoute requiredRole="admin"><ProfileAdmin /></ProtectedRoute>} />
        <Route path="/profile-seller" element={<ProtectedRoute requiredRole="seller"><ProfileSeller /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/quick-actions" element={<QuickActions />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/seller-dashboard" element={<ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/create-order" element={<ProtectedRoute requiredRole="seller"><CreateOrderPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute requiredRole="seller"><OrdersPage /></ProtectedRoute>} />
        <Route path="/order-completed/:orderId" element={<ProtectedRoute><OrderCompleted /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute requiredRole="seller"><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/admin/orders/:orderId"element={<ProtectedRoute requiredRole="admin"><OrderDetailPage /></ProtectedRoute>}/>
        <Route path="/vendas" element={<ProtectedRoute requiredRole="seller"><Vendas /></ProtectedRoute>} />
        <Route path="/send-prescription" element={<SendPrescription />} />
        <Route path="/prescription-requests" element={<ProtectedRoute requiredRole="seller"><PrescriptionRequests /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
