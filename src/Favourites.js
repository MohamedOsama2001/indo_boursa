import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LazyLoadImage from './LazyLoadImages';

function Favourites() {
    const {t} = useTranslation();
    const [favorites, setFavorites] = useState([]);
    const [message, setMessage] = useState('');
    useEffect(()=>{
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
        const savedMessage = localStorage.getItem('favoriteMessage');
        if (savedMessage) {
            setMessage(savedMessage);
            localStorage.removeItem('favoriteMessage');
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }
    },[])
    const removeFromFav=(productId)=>{
        const updatedFavorites = favorites.filter(item => item.id !== productId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteMessage', 'Removed from favourites');
        window.location.reload();
    }
    return (
        <>
            <main>
                {message && <div className="message">{t(message)}</div>}
                <div className='favs'>
                    <div className='head'>
                        <h2>{t("Favourites")}</h2>
                        <div className='line'></div>
                    </div>
                    <div className='favs-items mt-5'>
                        <div className='container'>
                            <div className='row'>
                                {favorites.map((item => (
                                    <div className='col-lg-4 col-md-6 col-sm-12'>
                                        <div className='favs-item mb-4'>
                                            <div className='item-image'>
                                                <LazyLoadImage src={`${process.env.REACT_APP_API_BASE_URL}/${item.product_image[0].product_image}`} />
                                            </div>
                                            <div className='item-body ps-3 pt-3 pm-3'>
                                                <div className='price-heart'>
                                                <h4 className='text-danger'>{item.price} EGP</h4>
                                                <i onClick={()=>removeFromFav(item.id)} className="fas fa-heart text-danger me-3" style={{fontSize:"20px"}}></i>
                                                </div>
                                                <p>{item.Ad_title}</p>
                                                <p>{item.location}</p>
                                                <Link to={`/products/${item.id}`} className='btn btn-outline-danger mb-3'><i class="far fa-eye"></i> {t("View")}</Link>
                                            </div>
                                        </div>
                                    </div>
                                )))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>

    )
}

export default React.memo(Favourites)
