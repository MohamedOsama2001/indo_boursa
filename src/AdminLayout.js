import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminLayout() {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);
  return (
    <>
      <header>
        <nav
          className="navbar navbar-expand-lg navbar-custom fixed-top"
          style={{ zIndex: "9" }}
        >
          <div className="container">
            <Link className="navbar-brand" to={"/admin/dashboard"}>
              <img
                src={"/images/adminlogo.jpg"}
                style={{ width: "80px" }}
                alt="Logo"
              />
            </Link>
            <button
              className="navbar-toggler bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <span
                    className="admin-name navbar-text d-inline-block me-lg-3"
                    style={{ textTransform: "capitalize" }}
                  >
                    {user.name}
                  </span>
                </li>
                <li className="mt-2">
                  <Link className="setting ms-lg-5" to={'/admin/updatepswd'}>
                    setting
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="lang-btn mt-2 ms-lg-5" onClick={handleLogout}>
                    {t("logout")}
                  </button>
                </li>
                <li className="nav-item">
                  {i18n.language === "en" ? (
                    <button
                      className="lang-btn mt-2 ms-lg-5"
                      onClick={() => changeLanguage("id")}
                    >
                      {t("Indonesian")}
                    </button>
                  ) : (
                    <button
                      className="lang-btn mt-2 ms-lg-5"
                      onClick={() => changeLanguage("en")}
                    >
                      {t("English")}
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <aside>
        <div className="sidebar" id="sidebar">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to={"/admin/dashboard"} className="btn nav-link active" id="tab1">
                {t("Dashboard")}
              </Link>
            </li>
            <li className="nav-item">
              <button
                type="button"
                class="btn nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {t("Users")}
              </button>
              <ul class="dropdown-menu">
                <li>
                  <Link class="dropdown-item" to={"/admin/users"}>
                    {t("Show Users")}
                  </Link>
                </li>
                {user?.rule !== "subuser" && (
                  <li>
                    <Link class="dropdown-item" to={"/admin/users/add"}>
                      {t("Add Sub User")}
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </aside>
      <section className="outlet-content">
        <Outlet />
      </section>
    </>
  );
}

export default React.memo(AdminLayout);
