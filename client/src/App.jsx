import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Groceries from "./pages/Groceries.jsx";
import Arrival from "./pages/Arrival.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Groceries flow */}
        <Route path="/groceries" element={<Groceries />} />
        <Route path="/arrival" element={<Arrival />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Account */}
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </Router>
  );
}
