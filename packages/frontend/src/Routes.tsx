import { Route, Routes } from "react-router-dom";
import Home from "./_components/Home";
import NotFound from "./_components/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
