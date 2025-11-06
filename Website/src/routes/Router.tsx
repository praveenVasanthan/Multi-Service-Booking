import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";

const Router = createBrowserRouter([
  {
    index: true,
    element: <Home />,
  },
]);

export default Router;
