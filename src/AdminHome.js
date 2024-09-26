import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminHome() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/users?page=${currentPage}`)
      .then((response) => {
        setUsers(response.data.data);
        setTotalPages(response.data.last_page);
      })
      .catch((e) => console.log(e));
  }, [currentPage]);
  const filteredUsers = users.filter(user => user.rule === "user");
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className="adminPanel-head">
        <h2>{t("Reports")}</h2>
        <h2>{t("Total")}: {filteredUsers.length}</h2>
      </div>
      <table className="table text-center table-dark table-striped">
        <thead>
          <tr>
            <th>{t("Name")}</th>
            <th>{"Email"}</th>
            <th>{t("Posted Products")}</th>
            <th>{t("Posted Ads")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.product.length}
                <Link to={`/admin/products/${user.id}`}>
                  <i className="far fa-eye"></i>
                </Link>
              </td>
              <td>
                {user.ad.length}
                <Link to={`/admin/ads/${user.id}`}>
                  <i class="far fa-eye"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination text-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span>Page {currentPage} of {totalPages}</span>
        
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

export default React.memo(AdminHome);
