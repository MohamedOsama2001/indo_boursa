import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ChoosenProduct() {
  const {t} = useTranslation();
  const { id } = useParams();
  const [choosenProduct, setChoosenProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [buttonText, setButtonText] = useState("Show Phone Number");
  useEffect(() => {
    const savedMessage = localStorage.getItem("message");
    if (savedMessage) {
      setMessage(savedMessage);
      localStorage.removeItem("message");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((response) => {
        setChoosenProduct(response.data);
        setLoading(false);
        const savedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        const found = savedFavorites.some((fav) => fav.id === response.data.id);
        setIsFavorite(found);
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
      });
  }, [id]);
  const handleShowNumber = () => {
    if (!user) {
      alert(t("You must logged in first."));
      return;
    }
    setButtonText(choosenProduct.phone);
  };
  const handleWhats = (phoneNumber) => {
    if (!user) {
      alert(t("You must logged in first."));
      return;
    }
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    } else {
      console.log("not found");
    }
  };
  const addToFav = () => {
    if (!user) {
      alert(t("You must logged in first."));
      return;
    }
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites;
    let message;

    if (isFavorite) {
      updatedFavorites = savedFavorites.filter(
        (fav) => fav.id !== choosenProduct.id
      );
      message = "Removed from favourites";
    } else {
      updatedFavorites = [...savedFavorites, choosenProduct];
      message = "Added to favourites";
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    localStorage.setItem("message", message);
    setIsFavorite(!isFavorite);
    window.location.reload();
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (
    !choosenProduct ||
    !choosenProduct.product_image ||
    choosenProduct.product_image.length === 0
  ) {
    return <div>No product found or no images available.</div>;
  }
  const encodedLocation = encodeURIComponent(choosenProduct.location);
  const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  return (
    <>
      <main>
        {message && <div className="message">{t(message)}</div>}
        <div className="choosen-product">
          <div className="container">
            <div id="demo" className="carousel slide" data-bs-ride="carousel">
              {choosenProduct.product_image.length > 1 && (
                <div className="carousel-indicators">
                  {choosenProduct.product_image.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#demo"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                    ></button>
                  ))}
                </div>
              )}
              <div className="carousel-inner">
                {choosenProduct.product_image.map((image, index) => (
                  <div
                    key={image.id}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={`http://127.0.0.1:8000/${image.product_image}`}
                      alt="Product"
                      className="d-block w-100"
                    />
                  </div>
                ))}
              </div>
              {choosenProduct.product_image.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#demo"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon"></span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#demo"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </>
              )}
            </div>
            <div className="details">
              <div className="price-fav">
                <h3 className="text-danger">{choosenProduct.price} EGP</h3>
                <i
                  class={`far fa-heart ${isFavorite ? "text-danger" : ""}`}
                  style={{ fontSize: "25px", cursor: "pointer" }}
                  onClick={addToFav}
                ></i>
              </div>
              <h5>{choosenProduct.Ad_title}</h5>
              <a
                style={{ textDecoration: "none", color: "#282c34" }}
                href={googleMapsURL}
                target="_blank"
              >
                <p>
                  <i class="fas fa-map-marker-alt"></i>{" "}
                  {choosenProduct.location}
                </p>
              </a>
            </div>
            <div className="details">
              <h4>{t("Description")}</h4>
              <p>{choosenProduct.Ad_descrp}</p>
            </div>
            <div className="details">
              <div className="row">
                <div className="col-lg-6">
                  <div
                    className="mb-3"
                    style={{
                      border: "1px solid rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      padding: "10px 10px",
                    }}
                  >
                    <h4 className="mb-4">{t("Listed By")}: {choosenProduct.name}</h4>
                    <p>{t("Contact Methods")}: </p>
                    <button
                      className="btn btn-danger mb-3 mt-3"
                      style={{
                        width: "auto",
                        height: "50px",
                        fontSize: "20px",
                      }}
                      onClick={handleShowNumber}
                    >
                      <i class="fas fa-phone"></i> {t(buttonText)}
                    </button>
                    <br />
                    <button
                      className="btn btn-success"
                      onClick={() => handleWhats(choosenProduct.phone)}
                      style={{
                        width: "250px",
                        height: "50px",
                        fontSize: "20px",
                      }}
                    >
                      <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                  </div>
                </div>
                {choosenProduct.category.name!=="Jobs" && (
                  <div className="col-lg-6">
                  <div
                    className="mb-3"
                    style={{
                      border: "1px solid rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      padding: "8px 10px",
                    }}
                  >
                    <h4 className="mb-3">{t("Your safety matters to us")}!</h4>
                    <ul>
                      <li>
                        {t("Only meet in public / crowded places for example metro stations and malls.")}
                      </li>
                      <li>
                        {t("Never go alone to meet a buyer / seller, always take someone with you.")}
                      </li>
                      <li>
                        {t("Check and inspect the product properly before purchasingit.")}
                      </li>
                      <li>
                        {t("Never pay anything in advance or transfer money before inspecting the product.")}
                      </li>
                    </ul>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default React.memo(ChoosenProduct);
