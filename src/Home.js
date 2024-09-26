import React, {
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./CategoriesRedux";
import Modal from "react-modal";
import axios from "axios";
import { useTranslation } from "react-i18next";
const LazyLoadedImage = lazy(() => import("./LazyLoadImages"));
const LazyLoadedVideo = React.lazy(() => import("./LazyLoadedVideo"));

function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const [products, setProducts] = useState([]);
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(fetchData());
    setLoading(false);
  }, [dispatch]);
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/ads");
        setAds(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ads", error);
        setLoading(false);
      }
    };
    fetchAds();
  }, []);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);
  const openModal = useCallback((ad) => {
    setSelectedAd(ad);
    setIsOpen(true);
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const startTime = Date.now();
    const duration = 20000;
    intervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progressPercentage = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(progressPercentage);

      if (elapsedTime >= duration) {
        clearInterval(intervalRef.current);
        setIsOpen(false);
        setSelectedAd(null);
        setProgress(0);
      }
    }, 100);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedAd(null);
    setProgress(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);
  const handleAddReels = useCallback(() => {
    if (user) {
      navigate("/ads/add");
    } else {
      alert(t("You must logged in first."));
    }
  }, [navigate, t, user]);
  const addToFavorite = useCallback(
    (product) => {
      if (!user) {
        alert(t("You must logged in first."));
        return;
      }
      const savedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      const isFavorite = savedFavorites.some((fav) => fav.id === product.id);
      let updatedFavorites;
      let message;
      if (isFavorite) {
        updatedFavorites = savedFavorites.filter(
          (fav) => fav.id !== product.id
        );
        message = "Removed from favourites";
      } else {
        updatedFavorites = [...savedFavorites, product];
        message = "Added to favourites";
      }

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      localStorage.setItem("message", message);
      setFavorites(updatedFavorites);
      window.location.reload();
    },
    [user, t]
  );
  useEffect(() => {
    const savedMessage = localStorage.getItem("message");
    if (savedMessage) {
      setMessage(savedMessage);
      localStorage.removeItem("message");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }, []);
  const filteredCars = useMemo(
    () =>
      products
        .filter((product) => product.subcategory.name === "Cars for Sale")
        .slice(0, 3),
    [products]
  );

  const filteredJobs = useMemo(
    () =>
      products
        .filter((product) => product.category.name === "Jobs")
        .slice(0, 3),
    [products]
  );
  if (loading) {
    return (
      <div
        style={{
          marginTop: "300px",
          textAlign: "center",
          fontSize: "25px",
          marginBottom: "200px",
        }}
      >
        You are Welcome Data is Loadin Now......
      </div>
    );
  }
  return (
    <div>
      {message && <div className="message">{t(message)}</div>}
      <main>
        <div className="container" style={{ marginTop: "200px" }}>
          <div className="head">
            <h2>{t("Add Or View Ads")}</h2>
            <div className="line"></div>
          </div>
          <div style={styles.container}>
            <div onClick={handleAddReels} style={styles.addCircle}>
              <div>
                <i class="fas fa-plus"></i>
                <span className="ms-2">{t("Add")}</span>
              </div>
            </div>
            {ads.map((ad) => (
              <div
                key={ad.id}
                style={styles.circle}
                onClick={() => openModal(ad)}
              >
                {ad.media_type === "image" ? (
                  <LazyLoadedImage
                    src={`http://127.0.0.1:8000/${ad.media_path}`}
                    alt="Ad"
                    style={styles.media}
                  />
                ) : ad.media_type === "video" ? (
                  <i className="fas fa-video" style={{ fontSize: "25px" }}></i>
                ) : null}
              </div>
            ))}
          </div>

          {selectedAd && (
            <Modal
              isOpen={isOpen}
              onRequestClose={() => setIsOpen(false)}
              contentLabel="Ad Modal"
              style={styles.modal}
            >
              {selectedAd.media_type === "image" ? (
                <LazyLoadedImage
                  src={`http://127.0.0.1:8000/${selectedAd.media_path}`}
                  alt="Ad"
                  style={styles.media2}
                />
              ) : (
                <LazyLoadedVideo
                  controls
                  autoPlay
                  style={styles.media2}
                  src={`http://127.0.0.1:8000/${selectedAd.media_path}`}
                />
              )}
              <div style={styles.progressContainer}>
                <div
                  style={{ ...styles.progressBar, width: `${progress}%` }}
                ></div>
              </div>

              <button onClick={closeModal} style={styles.closeButton}>
                <i class="fas fa-times"></i>
              </button>
            </Modal>
          )}
        </div>
      </main>
      <section>
        <div id="demo" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#demo"
              data-bs-slide-to="0"
              className="active"
            ></button>
            <button
              type="button"
              data-bs-target="#demo"
              data-bs-slide-to="1"
            ></button>
            <button
              type="button"
              data-bs-target="#demo"
              data-bs-slide-to="2"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={"images/3.jpg"} alt="1" className="d-block" />
            </div>
            <div className="carousel-item">
              <img src={"images/3.jpg"} alt="2" className="d-block" />
            </div>
            <div className="carousel-item">
              <img src={"images/3.jpg"} alt="3" className="d-block" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="categories mb-5">
          <div className="container">
            <div className="head">
              <h2>{t("Categories")}</h2>
              <div className="line"></div>
            </div>
            <div className="categories-items mt-5">
              {data.map((category) => (
                <>
                  <div className="category-item">
                    <div className="category-item-image">
                      <LazyLoadedImage
                        src={category.image}
                        draggable="false"
                        alt=""
                      />
                    </div>
                    <div className="category-item-name mt-4">
                      <h3>
                        <Link to={`/categories/${category.id}`}>
                          {t(category.name)}
                        </Link>
                      </h3>
                    </div>
                  </div>
                </>
              ))}
              <div className="view-all">
                <Link to={"/categories"}>{t("View All")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="car-sale mb-5">
          <div className="container">
            <div className="car-sale-head d-flex justify-content-between mb-4">
              <h3>Cars for Sale</h3>
              <Link
                className="text-danger"
                style={{
                  textDecoration: "none",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                to={"/categories/1"}
              >
                {t("View more")} <i class="fas fa-angle-right"></i>
              </Link>
            </div>
            <div className="car-sale-items">
              <div className="row">
                {filteredCars.length>0?(
                filteredCars.map((filteredProduct) => (
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="favs-item">
                      <div className="item-image">
                        <LazyLoadedImage
                          src={`${process.env.REACT_APP_API_BASE_URL}/${filteredProduct.product_image[0].product_image}`}
                        />
                      </div>
                      <div className="item-body ps-3 pt-3 pm-3">
                        <div className="price-heart">
                          <h4 className="text-danger">
                            {filteredProduct.price} EGP
                          </h4>
                          <i
                            className={`fav-icon fas fa-heart me-3 ${
                              favorites.some(
                                (fav) => fav.id === filteredProduct.id
                              )
                                ? "active"
                                : ""
                            }`}
                            style={{ fontSize: "20px" }}
                            onClick={() => addToFavorite(filteredProduct)}
                          ></i>
                        </div>
                        <p>{filteredProduct.Ad_title}</p>
                        <p>{filteredProduct.location}</p>
                        <Link
                          to={`/products/${filteredProduct.id}`}
                          className="btn btn-outline-danger mb-3"
                        >
                          <i class="far fa-eye"></i> {t("View")}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))):(
                  <div className="text-center py-5" style={{fontSize:"25px"}}>
                    <h4>{t('No products available.')}</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="car-sale mb-5">
          <div className="container">
            <div className="car-sale-head d-flex justify-content-between mb-4">
              <h3>Jobs</h3>
              <Link
                className="text-danger"
                style={{
                  textDecoration: "none",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                to={"/categories/4"}
              >
                {t("View more")} <i class="fas fa-angle-right"></i>
              </Link>
            </div>
            <div className="car-sale-items">
              <div className="row">
                {filteredJobs.length>0?(
                filteredJobs.map((filteredProduct) => (
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="favs-item">
                      <div className="item-image">
                        <LazyLoadedImage
                          src={`${process.env.REACT_APP_API_BASE_URL}/${filteredProduct.product_image[0].product_image}`}
                        />
                      </div>
                      <div className="item-body ps-3 pt-3 pm-3">
                        <div className="price-heart">
                          <h4 className="text-danger">
                            {filteredProduct.price} EGP
                          </h4>
                          <i
                            className={`fav-icon fas fa-heart me-3 ${
                              favorites.some(
                                (fav) => fav.id === filteredProduct.id
                              )
                                ? "active"
                                : ""
                            }`}
                            style={{ fontSize: "20px" }}
                            onClick={() => addToFavorite(filteredProduct)}
                          ></i>
                        </div>
                        <p>{filteredProduct.Ad_title}</p>
                        <p>{filteredProduct.location}</p>
                        <Link
                          to={`/products/${filteredProduct.id}`}
                          className="btn btn-outline-danger mb-3"
                        >
                          <i class="far fa-eye"></i> {t("View")}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))):(
                  <div className="text-center py-5" style={{fontSize:"25px"}}>
                    <h4>{t('No products available.')}</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    justifyContent: "start",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "50px",
    overflowX: "auto",
  },
  circle: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "2px solid green",
  },
  addCircle: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "2px solid gray",
    fontSize: "20px",
    textDecoration: "none",
    color: "black",
  },
  modal: {
    content: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      inset: "30% 30% 25% 25%",
    },
  },
  progressContainer: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    width: "calc(100% - 20px)",
    height: "10px",
    backgroundColor: "#ddd",
    borderRadius: "5px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: "5px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "10px",
    cursor: "pointer",
  },
  media: {
    width: "95%",
    height: "95%",
    borderRadius: "50%",
    objectFit: "cover",
  },
  media2: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  detailsContainer: {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: "10px",
    textAlign: "center",
  },
  detailsText: {
    margin: "5px 0",
  },
};

export default React.memo(Home);
