import { createBrowserRouter } from "react-router";
import { BookingFlow } from "../features/booking/pages/BookingFlow";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BookingFlow />,
  },
]);
