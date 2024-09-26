import React from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./Categories";
import MainLayout from "./MainLayout";
import SellCategories from "./SellCategories";
import SellForm from "./SellForm";
import ChoosenProduct from "./ChoosenProduct";
import AdminLayout from "./AdminLayout";
import AddSubuser from "./AddSubuser";
import AdsForm from "./AdsForm";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized";
import "./i18n";
import UpdatePassword from "./UpdatePassword.js";
import AdminPassword from "./AdminPassword.js";
const LazyHome=React.lazy(()=>import("./Home.js"));
const LazySubcategories=React.lazy(()=>import("./SubCategories.js"));
const LazyMyAds=React.lazy(()=>import("./MyAds.js"));
const LazyFavourites=React.lazy(()=>import("./Favourites.js"));
const LazyAdminHome=React.lazy(()=>import("./AdminHome.js"));
const LazyAdminUsers=React.lazy(()=>import("./AdminUsers.js"));
const LazyAdminAds=React.lazy(()=>import("./AdminAds.js"));
const LazyAdminProducts=React.lazy(()=>import("./AdminProducts.js"));
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" Component={MainLayout}>
            <Route path="/" element={
              <React.Suspense fallback="loading....">
                <LazyHome/>
              </React.Suspense>
            } />
            <Route path="/categories" Component={Categories}></Route>
            <Route path="/categories/:id" element={
              <React.Suspense fallback="loading....">
                <LazySubcategories/>
              </React.Suspense>
            }></Route>
            <Route path="/products/:id" Component={ChoosenProduct}></Route>
            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route path="/sell" Component={SellCategories}></Route>
              <Route path="/sell/:id" Component={SellForm}></Route>
              <Route path="/myads" element={
                <React.Suspense fallback="loading....">
                  <LazyMyAds/>
                </React.Suspense>
              }></Route>
              <Route path="/favs" element={
                <React.Suspense fallback="loading....">
                  <LazyFavourites/>
                </React.Suspense>
              }></Route>
              <Route path="/ads/add" Component={AdsForm}></Route>
              <Route path="/user/updatepswd" Component={UpdatePassword}></Route>
            </Route>
          </Route>
          <Route
            element={<ProtectedRoute allowedRoles={["admin", "subuser"]} />}
          >
            <Route path="/admin" Component={AdminLayout}>
              <Route path="/admin/dashboard" element={
                <React.Suspense fallback="loading....">
                  <LazyAdminHome/>
                </React.Suspense>
              } />
              <Route
                path="/admin/products/:id"
                element={
                  <React.Suspense fallback="loading....">
                    <LazyAdminProducts/>
                  </React.Suspense>
                }
              ></Route>
              <Route path="/admin/ads/:id" element={
                <React.Suspense fallback="loading....">
                  <LazyAdminAds/>
                </React.Suspense>
              }></Route>
              <Route path="/admin/users" element={
                <React.Suspense fallback="loading....">
                  <LazyAdminUsers/>
                </React.Suspense>
              }></Route>
              <Route path="/admin/users/add" Component={AddSubuser}></Route>
              <Route path="/admin/updatepswd" Component={AdminPassword}></Route>
            </Route>
          </Route>
          <Route path="/unauthorized" element={<Unauthorized/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
