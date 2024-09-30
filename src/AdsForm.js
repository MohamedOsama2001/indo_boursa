import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
function AdsForm() {
  const { t } = useTranslation();
  const [mediaType, setMediaType] = useState("image");
  const [mediaFile, setMediaFile] = useState(null);
  const [title, setTitle] = useState("");
  const [mobile, setMobile] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
  };
  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("media_type", mediaType);
    formData.append("media_path", mediaFile);
    formData.append("title", title);
    formData.append("mobile", mobile);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
      setLoading(false);
    }
  };
  return (
    <>
      <div className="ads-form">
        <div className="container">
          <div className="head mb-5">
            <h2 className="text-center">{t("POST YOUR AD")}</h2>
            <div className="line"></div>
          </div>
          {message && (
            <div className="message">
              <i class="far fa-check-circle"></i> {t(message)}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="row">
              <div className="col-lg-6">
                <label for="media_type" className="form-label">
                  {t("Media Type")}:
                </label>
                <select
                  className="form-select border border-dark"
                  name="media_type"
                  value={mediaType}
                  onChange={handleMediaTypeChange}
                >
                  <option value="Image">{t("Image")}</option>
                  <option value="video">{t("Video")}</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  name="user_id"
                  value={user.id}
                  hidden
                />
                {errors.media_type && (
                  <div className="text-danger">{errors.media_type}</div>
                )}
              </div>
              <div className="col-lg-6">
                <label for="choose" className="form-label">
                  {t("Choose")} {t(mediaType)}:
                </label>
                <br />
                <input
                  className="border border-dark p-1"
                  type="file"
                  accept={mediaType === "image" ? "image/*" : "video/*"}
                  onChange={handleFileChange}
                />
                {errors.media_path && (
                  <div className="text-danger">{errors.media_path}</div>
                )}
              </div>
              <div className="col-lg-6">
                <label htmlFor="title" className="form-label">
                  {t("Title")}:
                </label>
                <input
                  type="text"
                  className="form-control border border-dark"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("Title")}
                />
                {errors.title && (
                  <div className="text-danger">{errors.title}</div>
                )}
              </div>
              <div className="col-lg-6">
                <label htmlFor="mobile" className="form-label">
                  {t("Mobile")}:
                </label>
                <input
                  type="text"
                  className="form-control border border-dark"
                  id="mobile"
                  name="mobile"
                  value={mobile}
                  placeholder={t("Phone Number")}
                  onChange={(e) => setMobile(e.target.value)}
                />
                {errors.mobile && (
                  <div className="text-danger">{errors.mobile}</div>
                )}
              </div>
              <div className="col-lg-12 text-center mt-5">
                <button className="btn btn-danger" type="submit">
                  {loading ? (
                    <span>
                      <i className="fas fa-spinner fa-spin"></i>{" "}
                      {t("Uploading...")}
                    </span>
                  ) : (
                    t("Post now")
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default React.memo(AdsForm);
