import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminAds() {
  const {t} = useTranslation();
  const { id } = useParams();
  const [ads, setAds] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/ads/${id}/ads?page=${currentPage}`)
      .then((response) => {
        setAds(response.data.data);
        setTotalPages(response.data.last_page);
      })
      .catch((e) => console.log(e));
  }, [id,currentPage]);
  const handleReelRemove = (adId) => {
    if (window.confirm(t("Are you sure you want to delete this reel?"))) {
      axios
        .delete(`http://127.0.0.1:8000/api/ads/${adId}`)
        .then(() => {
          const updatedAds = ads.filter((ad) => ad.id !== adId);
          if (updatedAds.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          setAds(updatedAds);
          setSuccessMessage("Reel deleted successfully!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((e) => console.log(e));
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      {successMessage && (
        <div className="message">
          <i class="far fa-check-circle"></i> {t(successMessage)}
        </div>
      )}
      <h2>{t("Posted Ads")}</h2>
      <table className="table text-center table-dark table-striped">
        <thead>
          <tr>
            <th>{t("Type")}</th>
            <th>{t("Posted By")}</th>
            <th>{t("Phone Number")}</th>
            <th>{t("Posted At")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr>
              <td>{ad.media_type}</td>
              <td style={{ textTransform: "capitalize" }}>{ad.user.name}</td>
              <td>{ad.mobile}</td>
              <td>{ad.created_at.slice(0, 10)}</td>
              <td>
                <div className="actions">
                  <i
                    className="fas fa-trash-alt"
                    onClick={() => handleReelRemove(ad.id)}
                  ></i>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default React.memo(AdminAds);
