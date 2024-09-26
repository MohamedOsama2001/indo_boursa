import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div>
            <footer className="footer">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-4 text-center text-md-start footer-logo">
              <Link to={'/'}>
                <img src={'/images/lastlogo.png'} alt="Logo" style={{width:"100px",height:"100px"}}/>
              </Link>
            </div>
            <div className="descrp col-12 col-md-4 text-center mb-3 mb-md-0">
              <p className="mb-0">Welcome to our website. We provide high-quality products and services to meet your needs. Stay connected with us to know more about our offerings.</p>
            </div>
            <div className="col-12 col-md-4 text-center text-md-end footer-social-icons">
              <a href="#" className="fs-4"><i className="fab fa-facebook"></i></a>
              <a href="#" className="fs-4"><i className="fab fa-twitter"></i></a>
              <a href="#" className="fs-4"><i className="fab fa-instagram"></i></a>
              <a href="#" className="fs-4"><i className="fab fa-whatsapp"></i></a>
              <a href="#" className="fs-4"><i className="fas fa-envelope"></i></a>
            </div>
          </div>
        </div>
      </footer>
        </div>
        
    )
}

export default Footer
