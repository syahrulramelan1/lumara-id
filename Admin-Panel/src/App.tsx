import { lazy, Suspense } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import HomeLayout from "./pages/HomeLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy-loaded pages — masing-masing jadi chunk terpisah, dimuat saat dibutuhkan.
const Landing        = lazy(() => import("./pages/Landing"));
const Products       = lazy(() => import("./pages/Products"));
const CreateProduct  = lazy(() => import("./pages/CreateProduct"));
const EditProduct    = lazy(() => import("./pages/EditProduct"));
const Categories     = lazy(() => import("./pages/Categories"));
const CreateCategory = lazy(() => import("./pages/CreateCategory"));
const EditCategory   = lazy(() => import("./pages/EditCategory"));
const Orders         = lazy(() => import("./pages/Orders"));
const EditOrder      = lazy(() => import("./pages/EditOrder"));
const Reviews        = lazy(() => import("./pages/Reviews"));
const EditReview     = lazy(() => import("./pages/EditReview"));
const Users          = lazy(() => import("./pages/Users"));
const EditUser       = lazy(() => import("./pages/EditUser"));
const HelpDesk       = lazy(() => import("./pages/HelpDesk"));
const Notifications  = lazy(() => import("./pages/Notifications"));
const Profile        = lazy(() => import("./pages/Profile"));
const Settings       = lazy(() => import("./pages/Settings"));

const RouteFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const lazyRoute = (el: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{el}</Suspense>
);

const protect = (el: React.ReactNode) => <ProtectedRoute>{el}</ProtectedRoute>;

const router = createHashRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: protect(<HomeLayout />),
    children: [
      { index: true,                         element: lazyRoute(<Landing />) },
      { path: "products",                    element: lazyRoute(<Products />) },
      { path: "products/create-product",     element: lazyRoute(<CreateProduct />) },
      { path: "products/:id",                element: lazyRoute(<EditProduct />) },
      { path: "categories",                  element: lazyRoute(<Categories />) },
      { path: "categories/create-category",  element: lazyRoute(<CreateCategory />) },
      { path: "categories/:id",              element: lazyRoute(<EditCategory />) },
      { path: "orders",                      element: lazyRoute(<Orders />) },
      { path: "orders/:id",                  element: lazyRoute(<EditOrder />) },
      { path: "reviews",                     element: lazyRoute(<Reviews />) },
      { path: "reviews/:id",                 element: lazyRoute(<EditReview />) },
      { path: "users",                       element: lazyRoute(<Users />) },
      { path: "users/:id",                   element: lazyRoute(<EditUser />) },
      { path: "help-desk",                   element: lazyRoute(<HelpDesk />) },
      { path: "notifications",               element: lazyRoute(<Notifications />) },
      { path: "profile",                     element: lazyRoute(<Profile />) },
      { path: "settings",                    element: lazyRoute(<Settings />) },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
