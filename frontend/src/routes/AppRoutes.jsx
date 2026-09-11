import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <div>Home</div>;
}

function Login() {
  return <div>Login</div>;
}

function Register() {
  return <div>Register</div>;
}

function Products() {
  return <div>Products</div>;
}

function Dashboard() {
  return <div>Dashboard</div>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public */}
        <Route path="/products" element={<Products />} />

        {/* User */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
