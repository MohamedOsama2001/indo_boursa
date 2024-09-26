import React, { useEffect, useState } from "react";
import axios from "axios";
import "./all.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation

function Header() {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")));
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoritesCount(savedFavorites.length);
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setShowResults(false);
  }, [location]);
  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.user) {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setIsModalOpen(false);
        if (user.rule === "admin" || user.rule === "subuser") {
          navigate("/admin/dashboard");
          window.location.reload();
        } else {
          navigate("/");
          window.location.reload();
        }
      } else {
        alert(t("invalid email or password"));
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response && error.response.data.message) {
        alert(t(error.response.data.message));
      } else if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/register",
        {
          name,
          email,
          password,
        }
      );
      if (response.data && response.data.user) {
        alert(t("Registration successful!"));
        setIsRegisterModalOpen(false);
        window.location.reload();
      } else {
        alert(t("Registration failed!"));
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const results = products.filter((product) =>
        product.Ad_title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
        style={{ zIndex: "9" }}
      >
        <div className="container">
          <Link to={"/"} className="navbar-brand">
            <img
              src={"/images/lastlogo.png"}
              alt="Logo"
              style={{ width: "150px", height: "150px" }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <div className="d-flex flex-column flex-lg-row w-100 align-items-lg-center justify-content-lg-between">
              <div className="navbar-center d-flex justify-content-center my-2 my-lg-0 ms-lg-5">
                <form className="d-flex w-100 w-lg-50 ms-lg-5">
                  <input
                    className="form-control me-2 ms-lg-5 border border-danger"
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ width: "400px" }}
                    type="search"
                    placeholder={t("search")} // Use translation function
                    aria-label="Search"
                  ></input>
                  {showResults && (
                    <div className="search-result">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                          <Link
                            to={`/products/${item.id}`}
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                            }}
                            className="result"
                          >
                            <p>{item.Ad_title}</p>
                            <hr />
                          </Link>
                        ))
                      ) : (
                        <div>{t("not found")}</div> // Use translation function
                      )}
                    </div>
                  )}
                </form>
              </div>
              <div className="d-flex  ms-lg-auto">
                {user ? (
                  <>
                    <div className="user-actions d-flex  ms-lg-auto">
                      <div className="dropdown">
                        <div
                          className="user-name dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          {user.name}
                        </div>
                        <ul className="dropdown-menu">
                          <li className="ms-2">
                            <h5 style={{ fontSize: "25px" }}>
                              {t("hello")}, {user.name}
                            </h5>
                          </li>
                          <hr />
                          <li className="mb-3">
                            <Link
                              to={"/myads"}
                              className="dropdown-item d-flex"
                              href="#"
                            >
                              <i className="fab fa-buysellads text-dark me-3 mt-1"></i>
                              <span>{t("my_ads")}</span>
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item d-flex" to={"/favs"}>
                              <i className="fas fa-heart text-dark me-3 mt-1"></i>
                              <span>{t("favorites")}</span>
                            </Link>
                          </li>
                          <hr />
                          <li>
                            <Link className="dropdown-item d-flex" to={"/user/updatepswd"}>
                              <i className="fas fa-sliders-h me-3 text-dark mt-1"></i>
                              <span>{t("settings")}</span>
                            </Link>
                          </li>
                          <hr />
                          <li>
                            <div
                              className="dropdown-item d-flex cursor-pointer"
                              onClick={handleLogout}
                            >
                              <i className="fas fa-sign-out-alt me-3 text-dark mt-1"></i>
                              <button
                                style={{
                                  fontSize: "20px",
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                                className=""
                              >
                                {t("logout")}
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <Link to={"/favs"}>
                        <i
                          className="fas fa-heart ms-3 me-3 mt-1"
                          style={{ position: "relative" }}
                        >
                          {favoritesCount >= 0 && (
                            <span className="favorites-count">
                              {favoritesCount}
                            </span>
                          )}
                        </i>
                      </Link>
                      <Link className="btn btn-danger me-3" to={"/sell"}>
                        {t("Sell")}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-danger me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      {t("login")}
                    </button>
                    <button
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#registerModal"
                      className="btn btn-danger"
                    >
                      {t("register")}
                    </button>
                  </>
                )}
                {i18n.language === "en" ? (
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={() => changeLanguage("id")}
                  >
                    {t("Indonesian")}
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={() => changeLanguage("en")}
                  >
                    {t("English")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: "darkred" }}
            >
              <h5 className="modal-title text-light" id="exampleModalLabel">
                {t("login")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ backgroundColor: "white" }}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handlelogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-danger">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    name="email"
                  />
                  <div>We 'll never share your email with anyone else</div>
                  {errors.email && (
                    <div className="text-danger">{errors.email[0]}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-danger">
                    {t("password")}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    name="password"
                  />
                  {errors.password && (
                    <div className="text-danger">{errors.password[0]}</div>
                  )}
                </div>
                <div className="form-check mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="mySwitch"
                      name="darkmode"
                      value="yes"
                    />
                    <label
                      className="form-check-label"
                      for="mySwitch"
                      style={{ color: "#11afe9;" }}
                    >
                      Remmember me
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-danger">
                  {t("login")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div
          className="modal fade"
          id="registerModal"
          tabIndex="-1"
          aria-labelledby="registerModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "darkred" }}
              >
                <h5 className="modal-title text-light" id="registerModalLabel">
                  {t("register")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ backgroundColor: "white" }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-danger">
                      {t("name")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      name="name"
                    />
                    {errors.name && (
                      <div className="text-danger">{errors.name[0]}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-danger">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      placeholder="Enter email"
                      name="email"
                    />
                    <div>We 'll never share your email with anyone else.</div>
                    {errors.email && (
                      <div className="text-danger">{errors.email[0]}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label text-danger"
                    >
                      {t("password")}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      placeholder="Enter password"
                      name="password"
                    />
                    <div>
                      Password must contain upper, lower case, one number and
                      one special character.
                    </div>
                    {errors.password && (
                      <div className="text-danger">{errors.password[0]}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-danger">
                    {t("register")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Header);
