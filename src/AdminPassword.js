import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function AdminPassword() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/${user.id}/update-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );
      alert(t("Password updated successfully please log in again"));
      localStorage.clear();
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response) {
        alert(t(error.response.data.message));
      }
    }
  };

  return (
    <>
      <main>
        <div className="adminPanel-head">
          <h2>{t("Update Password")}</h2>
        </div>
        <div className="adminpswd-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label>{t("Current Password")}:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control mt-2"
              />
              {errors.current_password && (
                <div style={{ color: "burlywood" }}>
                  {errors.current_password}
                </div>
              )}
            </div>
            <div className="form-group mt-3">
              <label>{t("New Password")}:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control mt-2"
              />
              {errors.new_password && (
                <div style={{ color: "burlywood" }}>{errors.new_password}</div>
              )}
            </div>
            <div className="form-group mt-3">
              <label>{t("Confirm New Password")}:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control mt-2"
              />
              {errors.confirmPassword && (
                <div style={{ color: "burlywood" }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <div className="my-3">
              Password must contain upper, lower case, one number and one
              special character.
            </div>
            <button type="submit" className="btn form-btn">
              {t("Update Password")}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default React.memo(AdminPassword);
