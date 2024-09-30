import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
function AddSubuser() {
  const {t} = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const addSubuser = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/users", {
        name,
        email,
        password,
        rule:"subuser"
      });
      setSuccessMessage("User Created Successfully");
      setErrors([]);
      setTimeout(()=>{
        navigate('/admin/users')
      },3000)
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
      setSuccessMessage('')
    }
  };
  return (
    <>
      <div className="adminPanel-head">
        <h2>{t("Add Sub User")}</h2>
      </div>
      <div className="subuser-form">
        <form onSubmit={addSubuser}>
          {successMessage && (
            <div className="message">
              <i class="far fa-check-circle"></i> {t(successMessage)}
            </div>
          )}
          <div class="mb-3 mt-3">
            <label for="name" class="form-label">
              {t("Name")}:
            </label>
            <input
              type="text"
              class="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Name")}
              name="name"
            />
            {errors.name && (
              <div style={{ color: "burlywood" }}>{errors.name[0]}</div>
            )}
          </div>
          <div class="mb-3 mt-3">
            <label for="email" class="form-label">
              Email:
            </label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div style={{ color: "burlywood" }}>{errors.email[0]}</div>
            )}
          </div>
          <div class="mb-3">
            <label for="pwd" class="form-label">
              {t("password")}:
            </label>
            <input
              type="password"
              class="form-control"
              id="pwd"
              placeholder={t("password")}
              name="pswd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div style={{ color: "burlywood" }}>{errors.password[0]}</div>
            )}
          </div>
          <button type="submit" class="btn form-btn">
            {t("Add")}
          </button>
        </form>
      </div>
    </>
  );
}

export default React.memo(AddSubuser);
