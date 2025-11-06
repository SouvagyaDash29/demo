import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/HomePage/Navbar";
import Home from "./components/HomePage/Home";
import Footer from "./components/HomePage/Footer";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import { CustomerAuthProvider } from "./contexts/CustomerAuthContext";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Temples from "./components/HomePage/Temples";
import AboutUs from "./components/HomePage/AboutUs";
import Login from "./components/Admin/Login";
import CustomerRegistration from "./components/Customer/CustomerRegistration";
import CustomerLogin from "./components/Customer/CustomerLogin";
import ForgotPin from "./components/Customer/ForgotPin";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AllTempleList from "./components/Admin/AllTempleList";
import TempleServices from "./components/Admin/TempleServices";
import AdvancePolicies from "./components/Admin/AdvancePolicies";
import RefundPolicies from "./components/Admin/RefundPolicies";
import PricingRules from "./components/Admin/PricingRules";
import HallsManagement from "./components/Admin/HallsManagement";
import CustomerDashboard from "./components/Customer/CustomerDashboard";
import MyServices from "./components/Customer/MyServices";
import CustomerTemples from "./components/Customer/CustomerTemples";
import CustomerBookings from "./components/Customer/CustomerBookings";
import CustomerProfile from "./components/Customer/CustomerProfile";
import ServiceDetails from "./components/Customer/ServiceDetails";
import BookSeva from "./components/Customer/BookSeva";
import TempleDetails from "./components/HomePage/TempleDetails";
import ManageTemple from "./components/Admin/ManageTemple";
import SellerRegistration from "./components/Seller/SellerRegistartion";
import TempleGroup from "./components/Admin/TempleGroup";
import SellerApproval from "./components/Seller/SellerApproval";
import AdminServices from "./components/Admin/AdminServices";
import SellerDashboard from "./components/Seller/SellerDashboard";
import SellerProduct from "./components/Seller/SellerProduct";
import SellerOrder from "./components/Seller/SellerOrder";
import AddProduct from "./components/Seller/AddProduct";
import OrderDetailsPage from "./components/Seller/OrderDetailsPage";
import AddVariation from "./components/Seller/AddVariation";
import CatalogSteup from "./components/Admin/CatalogSteup";

function AppContent() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  const isAdminRoute = [
    "/dashboard",
    "/temple-list",
    "/services",
    "/advance-policies",
    "/refund-policies",
    "/pricing-rules",
    "/templeadmin",
    "/addtemple",
    "/add-groups",
    "/sellerApproval",
    "/admin-services",
    "/catalog-setup"
  ].some((route) => location.pathname.startsWith(route));

  const isCustomerRoute = [
    "/customer-temples",
    "/book-seva",
    "/customer-bookings",
    "/customer-dashboard",
    "/halls-management",
    "/seller-Application",
    "/customer-services",
    "/customer-profile",
    "/seller-Application",
    "/seller-Dashboard",
    "/seller-Products",
    "/seller-Orders",
    "/seller-AddProduct",
    "/seller-Profile",
    "/seller-Order-details",
    "/seller-EditProduct",
    "/seller-AddVariation"
  ].some((route) => location.pathname.startsWith(route));

  const hideNavAndFooter = isAdminRoute || isCustomerRoute;

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/temples" element={<Temples />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/templeDetails/:templeId" element={<TempleDetails />} />
        {/* Admin routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/addtemple"
          element={
            <AdminLayout>
              <ManageTemple />
            </AdminLayout>
          }
        />
        <Route
          path="/add-groups"
          element={
            <AdminLayout>
              <TempleGroup />
            </AdminLayout>
          }
        />
        <Route
          path="/catalog-setup"
          element={
            <AdminLayout>
              <CatalogSteup />
            </AdminLayout>
          }
        />
        <Route
          path="/temple-list"
          element={
            <AdminLayout>
              <AllTempleList />
            </AdminLayout>
          }
        />
        <Route
          path="/services"
          element={
            <AdminLayout>
              <TempleServices />
            </AdminLayout>
          }
        />
        <Route
          path="/advance-policies"
          element={
            <AdminLayout>
              <AdvancePolicies />
            </AdminLayout>
          }
        />
        <Route
          path="/refund-policies"
          element={
            <AdminLayout>
              <RefundPolicies />
            </AdminLayout>
          }
        />
        <Route
          path="/pricing-rules"
          element={
            <AdminLayout>
              <PricingRules />
            </AdminLayout>
          }
        />
        <Route
          path="/halls-management"
          element={
            <AdminLayout>
              <HallsManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/sellerApproval"
          element={
            <AdminLayout>
              <SellerApproval />
            </AdminLayout>
          }
        />
        <Route
          path="/admin-services"
          element={
            <AdminLayout>
              <AdminServices />
            </AdminLayout>
          }
        />
        {/* Customer routes */}
        <Route path="/customer-register" element={<CustomerRegistration />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/seller-register" element={<CustomerRegistration />} />
        <Route path="/seller-login" element={<CustomerLogin />} />
        <Route path="/forgot-pin" element={<ForgotPin />} />
        <Route path="/sellerforgot-pin" element={<ForgotPin />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-services" element={<MyServices />} />
        <Route path="/customer-temples" element={<CustomerTemples />} />
        <Route path="/customer-bookings" element={<CustomerBookings />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/book-seva/:templeId" element={<BookSeva />} />
        {/* <Route path="/seller-Application" element={<SellerRegistration />} /> */}
        <Route path="/seller-Dashboard" element={<SellerDashboard />} />
        <Route path="/seller-Application" element={<SellerRegistration />} />
        <Route path="/seller-Products" element={<SellerProduct />} />
        <Route path="/seller-Orders" element={<SellerOrder />} />
        <Route path="/seller-Order-details" element={<OrderDetailsPage />} />
        <Route path="/seller-AddProduct" element={<AddProduct />} />
        <Route path="/seller-EditProduct" element={<AddProduct />} />
        <Route path="/seller-AddVariation" element={<AddVariation />} />
        <Route path="/seller-Profile" element={<CustomerProfile />} />
        <Route
          path="/customer-services/:serviceId"
          element={<ServiceDetails />}
        />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CustomerAuthProvider>
        <Router>
          <AppContent />
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </CustomerAuthProvider>
    </ThemeProvider>
  );
};

export default App;
