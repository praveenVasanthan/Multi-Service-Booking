import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Services from "../pages/Service/List";
import ServiceForm from "../pages/Service/Form";
import BookingList from "../pages/Booking/BookingList";
import BookingView from "../pages/Booking/BookingView";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        children: [
          { index: true, element: <Services /> },
          { path: "form/:id?", element: <ServiceForm /> },
        ],
      },
      {
        path: "booking",
        children: [
          { index: true, element: <BookingList /> },
          {
            path: "detail/:id",
            element: <BookingView />,
          },
        ],
      },
    ],
  },
]);

export default Router;
