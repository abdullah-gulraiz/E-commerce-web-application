import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AdminLogin from "../pages/AdminLogin";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Account from "../pages/Account";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import AdminLayout from "../layouts/AdminLayout";
import OrderDetail from "../pages/OrderDetail";
import AdminProducts from "../adminpages/AdminProducts";
import AdminProductForm from "../adminpages/AdminProductForm";
import AdminCategories from "../adminpages/AdminCategories";
import AdminCategoryForm from "../adminpages/AdminCategoryForm";
import AdminOrders from "../adminpages/AdminOrders";
import AdminOrderDetail from "../adminpages/AdminOrderDetail";
import PrivateAdmin from "./PrivateAdmin";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },

  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      
    ],
  },

  {
    element : <AdminRoute />,
    children : [
      {
        path: "/admin",
        element: <AdminLogin />,
      },
    ]
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/layout",
        element: <Layout />,
        children: [
          {
            path: "shop",
            element: <Home />,
          },
          {
            path: "shop/:id",
            element: <ProductDetail />,
          },
          {
            path: "account",
            element: <Account />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
          {
            path: "checkout/:id",
            element: <OrderDetail />,
          },
        ],
      },
    ],
  },

  {
    element: <PrivateAdmin />,
    children: [
      {
        path: "/adminlayout",
        element: <AdminLayout />,
        children: [
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "products/new",
            element: <AdminProductForm />,
          },
          {
            path: "products/:id/edit",
            element: <AdminProductForm />,
          },
          {
            path: "categories",
            element: <AdminCategories />,
          },
          {
            path: "categories/new",
            element: <AdminCategoryForm />,
          },
          {
            path: "categories/:id/edit",
            element: <AdminCategoryForm />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "orders/:id",
            element: <AdminOrderDetail />,
          },
        ],
      },
    ],
  },
]);

const PageRoute = () => {
  return <RouterProvider router={routes} />;
};

export default PageRoute;