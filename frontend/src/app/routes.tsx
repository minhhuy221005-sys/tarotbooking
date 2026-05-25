import { createBrowserRouter } from "react-router";
import { BookingFlow } from "../features/booking/pages/BookingFlow";
import { AdminDashboard } from "../features/admin/pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BookingFlow />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);
