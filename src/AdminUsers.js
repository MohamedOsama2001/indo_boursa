import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function AdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));
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
  const deleteUser = (userId) => {
    if (window.confirm(t("Are you sure you want to delete this user?"))) {
      axios
        .delete(`http://127.0.0.1:8000/api/users/${userId}`)
        .then(() => {
          const updatedUsers = users.filter((user) => user.id !== userId);
          if (updatedUsers.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          setUsers(updatedUsers);
          setSuccessMessage("User deleted successfully!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((e) => console.log(e));
    }
  };
  const handlePageChange = (pageNumber) => {
    // إذا كانت الصفحة الجديدة متاحة
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber); // تحديث الصفحة الحالية
    }
  }
  return (
    <>
      {successMessage && (
        <div className="message">
          <i class="far fa-check-circle"></i> {t(successMessage)}
        </div>
      )}
      <div className="adminPanel-head">
        <h2>{t("Users")}</h2>
        <h2>
          {t("Total")}: {users.length}
        </h2>
      </div>
      <table className="table text-center table-dark table-striped">
        <thead>
          <tr>
            <th>{t("Name")}</th>
            <th>{t("Email")}</th>
            <th>{t("Role")}</th>
            {currentUser.rule !== "subuser" && <th>{t("Actions")}</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.rule}</td>

              {currentUser.rule !== "subuser" && (
                <td>
                  <div className="actions">
                    <i
                      className="fas fa-trash-alt"
                      onClick={() => deleteUser(user.id)}
                    ></i>
                  </div>
                </td>
              )}
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

export default React.memo(AdminUsers);
