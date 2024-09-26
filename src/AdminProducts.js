import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminProducts() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/products?page=${currentPage}`)
      .then((response) => {
        setProducts(response.data.data);
        setTotalPages(response.data.last_page);
      })
      .catch((e) => console.log(e));
  }, [id,currentPage]);
  const handleProductRemove = (proId) => {
    if (window.confirm(t("Are you sure you want to delete this product?"))) {
      axios
        .delete(`http://127.0.0.1:8000/api/products/${proId}`)
        .then(() => {
          const updatedProducts = products.filter((product) => product.id !== proId);
          if (updatedProducts.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          setProducts(updatedProducts);
          setSuccessMessage("Product deleted successfully!");
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
      <h2>{t("Posted Products")}</h2>
      <table className="table text-center table-dark table-striped">
        <thead>
          <tr>
            <th>{t("Title")}</th>
            <th>{t("Posted By")}</th>
            <th>{t("Phone Number")}</th>
            <th>{t("Posted At")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr>
              <td>{product.Ad_title}</td>
              <td>{product.name}</td>
              <td>{product.phone}</td>
              <td>{product.created_at.slice(0, 10)}</td>
              <td>
                <div className="actions">
                  <i
                    className="fas fa-trash-alt"
                    onClick={() => handleProductRemove(product.id)}
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

export default React.memo(AdminProducts);
