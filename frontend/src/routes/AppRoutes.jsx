import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";

function Home() {
  return (
    <div className="container page">
      <h1>Product MLM</h1>
      <p>Product-based referral platform.</p>
    </div>
  );
}

function Login() {
  return (
    <div className="container page">
      <h1>Login</h1>
    </div>
  );
}

function Register() {
  return (
    <div className="container page">
      <h1>Create account</h1>
    </div>
  );
}

function Products() {
  return (
    <div className="container page">
      <h1>Products</h1>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="container page">
      <h1>Dashboard</h1>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
