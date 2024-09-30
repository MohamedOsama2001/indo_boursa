import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LazyLoadImage from './LazyLoadImages';

function MyAds() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [userProduct, setUSerProduct] = useState([]);
  const [userAds, setUserAds] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const {t} = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${user.id}/products?page=${currentPage}`)
      .then((response) => {
        setUSerProduct(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user,currentPage]);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/ads/${user.id}/ads?page=${currentPage}`)
      .then((response) => {
        setUserAds(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user,currentPage]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleReelRemove=(adId)=>{
    if (window.confirm(t("Are you sure you want to delete this reel?"))) {
      axios
        .delete(`http://127.0.0.1:8000/api/ads/${adId}`)
        .then(() => {
          const updatedAds = userAds.filter((ad) => ad.id !== adId);
          if (updatedAds.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          setUserAds(updatedAds);
          setSuccessMessage("Reel deleted successfully!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((e) => console.log(e));
    }
  }
  const handleProductRemove=(proId)=>{
    if (window.confirm(t("Are you sure you want to delete this product?"))) {
      axios
        .delete(`http://127.0.0.1:8000/api/products/${proId}`)
        .then(() => {
          const updatedProducts = userProduct.filter((product) => product.id !== proId);
          if (updatedProducts.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          setUSerProduct(updatedProducts);
          setSuccessMessage("Product deleted successfully!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((e) => console.log(e));
    }
  }
  return (
    <>
    {successMessage && (
        <div className="message">
          <i class="far fa-check-circle"></i> {t(successMessage)}
        </div>
      )}
      <main>
        <div className="My-Ads">
          <div className="head">
            <h2>{t("Manage and view your Ads")}</h2>
            <div className="line"></div>
          </div>
          <div className="tabs">
            <button
              className={`tab-button ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => handleTabChange("products")}
            >
              {t("Products")}
            </button>
            <button
              className={`tab-button ${activeTab === "reels" ? "active" : ""}`}
              onClick={() => handleTabChange("reels")}
            >
              {t("Reels")}
            </button>
          </div>
          <div className="My-Ads-items mt-5">
            <div className="container">
              <div className="row">
                {activeTab === "products" && userProduct.length === 0 && (
                  <div className="col-12 no-aval">
                    <p>{t("No products available.")}</p>
                  </div>
                )}
                {activeTab === "products" &&
                  userProduct.map((item) => (
                    <div key={item.id} className="col-lg-4 col-md-6 col-sm-12">
                      <div className="My-Ads-item mb-4">
                        <div className="item-image">
                          <LazyLoadImage
                            src={`${process.env.REACT_APP_API_BASE_URL}/${item.product_image[0].product_image}`}
                            alt={item.Ad_title}
                          />
                        </div>
                        <div className="item-body ps-3 pt-3 pm-3">
                          <h4 className="text-danger">{item.price} EGP</h4>
                          <p>{item.Ad_title}</p>
                          <p>{item.location}</p>
                        </div>
                        <div className="item-overlay">
                          <div className="item-icons">
                            <i className="fas fa-trash" onClick={()=>handleProductRemove(item.id)}></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  }
                {activeTab === "reels" && userAds.length === 0 && (
                  <div className="col-12 no-aval">
                    <p>{t("No reels available.")}</p>
                  </div>
                )}
                {activeTab === "reels" && (
                  <div className="col-12">
                    <table className="table table-striped text-center">
                      <thead>
                        <tr>
                          <th className="text-danger" scope="col">{t("Type")}</th>
                          <th className="text-danger" scope="col">{t("Title")}</th>
                          <th className="text-danger" scope="col">{t("Mobile")}</th>
                          <th className="text-danger" scope="col">{t("Actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userAds.map((ad, index) => (
                          <tr key={ad.id}>
                            <td>{ad.media_type}</td>
                            <td>{ad.title}</td>
                            <td>{ad.mobile}</td>
                            <td><i class="delete-icon fas fa-trash" onClick={()=>handleReelRemove(ad.id)}></i></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default React.memo(MyAds);
