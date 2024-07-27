import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Products from "./components/Products";
import PresistLogin from "./components/PresistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route element={<PresistLogin />}>
          <Route path="/products" element={<Products />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
