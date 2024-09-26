import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
  const {t} = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user=JSON.parse(localStorage.getItem('user'))
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
      alert(t('Password updated successfully please log in again'));
      localStorage.clear()
      navigate('/')
      window.location.reload()
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
        <div className="update-password-form">
          <div className="container">
            <div className="head mb-5">
              <h2 className="text-center">{t("Update Password")}</h2>
              <div className="line"></div>
            </div>
            <form className="border border-dark p-5 mb-5" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('Current Password')}:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="form-control border-dark"
          />
          {errors.current_password && (
            <div className="text-danger">{errors.current_password}</div>
          )}
        </div>
        <div className="form-group">
          <label>{t('New Password')}:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control border-dark"
          />
          {errors.new_password && (
            <div className="text-danger">{errors.new_password}</div>
          )}
        </div>
        <div className="form-group">
          <label>{t('Confirm New Password')}:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control border-dark"
          />
          {errors.confirmPassword && (
            <div className="text-danger">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="mt-3">
                      Password must contain upper, lower case, one number and
                      one special character.
                    </div>
        <button type="submit" className="btn btn-danger mt-3">
          {t('Update Password')}
        </button>
      </form>

          </div>
        </div>
      </main>
    </>
  );
}

export default React.memo(UpdatePassword);
