import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import LazyLoadImage from './LazyLoadImages';

function SubCategories() {
    const {t} = useTranslation();
    const { id } = useParams();
    const [category, setcatgory] = useState([])
    const [subcategories, setsubgategories] = useState([])
    const [catProducts, setCatProducts] = useState([])
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });
    const [buttonText, setButtonText] = useState(null);

    const [message,setMessage]=useState('')
    const user=JSON.parse(localStorage.getItem("user"))
    const [filteredProducts, setFilteredProducts] = useState([]);
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/categories/${id}`)
            .then((response) => {
                setcatgory(response.data)
                setsubgategories(response.data.subcategory)
            })
            .catch((e) => console.log(e))
    }, [id])
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/categories/${id}/products`)
            .then((response) => {
                setCatProducts(response.data)
                setFilteredProducts(response.data)
            })
            .catch((e) => console.log(e))
    }, [id])
    const handleFilter = (e) => {
        e.preventDefault();
        const selectedSubcategory = e.target.elements.subcategory.value;
        if (selectedSubcategory) {
            const filtered = catProducts.filter(product => product.subcategory_id === parseInt(selectedSubcategory));
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(catProducts);
        }
    };
    const handleCall=(phoneNumber)=>{
        if(!user){
            alert(t("You must logged in first."))
            return;
        }
        if(phoneNumber){
            setButtonText(phoneNumber)
        }
        else{
            console.log('not found')
        }
    }
    const handleWhats=(phoneNumber)=>{
        if(!user){
            alert(t("You must logged in first."))
            return;
        }
        if(phoneNumber){
            window.open(`https://wa.me/${phoneNumber}`,'_blank')
        }
        else{
            console.log('not found')
        }
    }
    useEffect(() => {
        const savedMessage = localStorage.getItem('message');
        if (savedMessage) {
            setMessage(savedMessage);
            localStorage.removeItem('message');
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }
    }, []);
    const addToFavorite = (product) => {
        if(!user){
            alert(t("You must logged in first."))
            return;
        }
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = savedFavorites.some(fav => fav.id === product.id);
        let updatedFavorites;
        let message;
        if (isFavorite) {
            updatedFavorites = savedFavorites.filter(fav => fav.id !== product.id);
            message = 'Removed from favourites';
        } else {
            updatedFavorites = [...savedFavorites, product];
            message = 'Added to favourites';
        }
        
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        localStorage.setItem('message', message);
        setFavorites(updatedFavorites);
        window.location.reload();
    };
    return (
        <>
            <main>
                {message && <div className="message">{t(message)}</div>}
                <div className='subcategories'>
                    <LazyLoadImage src={`/${category.image}`} alt={category.name} />
                    <div className='subcat-overlay'>
                        <div className='subcat-header text-center pt-5'>
                            <h2>{t(category.name)}</h2>
                            <p>{t("Let's find what do you need")}</p>
                        </div>
                        <div className='subcat-form mt-5'>
                            <form onSubmit={handleFilter}>
                                <div className='container'>
                                    <div className="row">
                                        <div className="col">
                                            <label for="category" className="form-label text-light">Category:</label>
                                            <input type="text" className="category form-control" name="category" value={t(category.name)} readOnly />
                                        </div>
                                        <div className="col">
                                            <label for="subcategory" className="form-label text-light">Choose SubCategories:</label>
                                            <select className="form-select subcategory" name='subcategory'>
                                                {subcategories.map(item => (
                                                    <option value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='text-center mt-5'>
                                        <button type="submit" className="btn btn-danger">{t("Filter")}</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </main>
            <section>
                <div className='container'>
                    <div className='Ads'>
                    <div id="demo" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
                        <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                        <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
                    </div>

                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={'/images/3.jpg'} alt="1" className="d-block" />
                        </div>
                        <div className="carousel-item">
                            <img src={'/images/3.jpg'} alt="2" className="d-block" />
                        </div>
                        <div className="carousel-item">
                            <img src={'/images/3.jpg'} alt="3" className="d-block" />
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </section>
            <section>
                <div className='container'>
                    {
                        Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                    filteredProducts.map((item => (
                        <div to={`/products/${item.id}`} className='product'>
                            <div className='product-image'>
                                <LazyLoadImage src={`${process.env.REACT_APP_API_BASE_URL}/${item.product_image[0].product_image}`} />
                            </div>
                            <div className='product-content'>
                                <div className='price-heart'>
                                    <h3 className='text-danger'>{item.price} EGP</h3>
                                    <i
                                        className={`fav-icon fas fa-heart ${favorites.some(fav => fav.id === item.id) ? 'active' : ''}`}
                                        style={{ fontSize: "25px", cursor: 'pointer' }}
                                        onClick={() => addToFavorite(item)}
                                    ></i>
                                </div>
                                <p>{item.Ad_title}</p>
                                <p className='mb-5'>{item.location}</p>
                                <div className='product-buttons'>
                                    <div className='contact-method'>
                                    <button className='btn btn-danger me-2' onClick={()=>handleCall(item.phone)}><i class="fas fa-phone"></i> {buttonText===item.phone?item.phone:t("Show Phone Number")}</button>
                                    <button className='btn btn-success' onClick={()=>handleWhats(item.phone)}><i class="fab fa-whatsapp"></i> {t("WhatsApp")}</button>
                                    </div>
                                    <div className='view'>
                                        <Link className='btn btn-outline-danger' to={`/products/${item.id}`}><i className="far fa-eye"></i> {t("View")}</Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                    ))))
                    :(
                        <p style={{textAlign:"center",fontSize:"25px"}}>{t("No products found")}.</p>
                    )}
                    
                </div>

            </section>
        </>
    )
}

export default React.memo(SubCategories)
