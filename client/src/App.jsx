import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Groceries from "./pages/Groceries";
import Arrival from "./pages/Arrival"; 
import OrderConfirmation from "./pages/OrderConfirmation";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groceries" element={<Groceries />} />
          <Route path="/arrival" element={<Arrival />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </Layout>
    </Router>
  );
}

