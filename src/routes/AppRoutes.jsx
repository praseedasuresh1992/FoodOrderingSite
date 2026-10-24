import { Routes, Route } from "react-router-dom";

import WelcomePage from "../pages/WelcomePage";
import HomePage from "../pages/HomePage";
import MenuPage from "../pages/MenuPage";
import OrderPage from "../pages/OrderPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminProfilePage from "../pages/AdminProfilePage";
// import AboutPage from "../pages/AboutPage";
// import ContactPage from "../pages/ContactPage";
// import OrderPage from "../pages/OrderPage";

export default function AppRoutes() {
  return (
    <Routes> 
      <Route path="/" element={<WelcomePage />} />

      <Route path="/home" element={<HomePage />} />

      <Route path="/menu" element={<MenuPage />} />

      <Route path="/order" element={<OrderPage/>}/>

      <Route path="/orderDetails" element={<OrderDetailsPage/>}/>

      <Route path="/login" element={<AdminLoginPage />}/>
      <Route path="/admin/login" element={<AdminLoginPage />}/>

      <Route path="/adminProfile" element={<AdminProfilePage />}/>
      <Route path="/admin/profile" element={<AdminProfilePage />}/>

      {/* <Route path="/about" element={<AboutPage />} /> */}

      {/* <Route path="/contact" element={<ContactPage />} /> */}

      {/* <Route path="/order" element={<OrderPage />} /> */}
    </Routes>
  );
}