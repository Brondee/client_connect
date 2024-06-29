import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Routes, Route } from "react-router-dom";
import Specialists from "./screens/Specialists/Specialists";
import DateTime from "./screens/DateTime/DateTime";
import Services from "./screens/Services/Services";
import Confirm from "./screens/Confirm/Confirm";
import Admin from "./screens/Admin/Admin";
import Edit from "./screens/Edit/Edit";
import Add from "./screens/Add/Add";
import Categories from "./screens/Categories/Categories";
import General from "./screens/General/General";
import Orders from "./screens/Orders/Orders";

function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  });

  return (
    <Routes>
      <Route path="/orders" element={<Orders />} />
      <Route path="/general" element={<General />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/add" element={<Add />} />
      <Route path="/edit" element={<Edit />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route path="/date" element={<DateTime />} />
      <Route path="/specialists" element={<Specialists />} />
      <Route index element={<Services />} />
    </Routes>
  );
}

export default App;
