import { createBrowserRouter, Outlet } from "react-router";
import { BookingFlow } from "./pages/BookingFlow";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BookingFlow />,
  },
]);