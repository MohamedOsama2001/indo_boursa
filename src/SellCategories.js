import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from './CategoriesRedux'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";

function SellCategories() {
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    useEffect(() => {
        dispatch(fetchData())
    }, [dispatch])
    return (
        <>
            <main>
                <div className="all-categories">
                    <div className="container">
                        <div className="head">
                            <h2>{t("Choose a category")}</h2>
                            <div className="line"></div>
                        </div>
                        <div className='sell-categ-items mt-5 mb-5'>
                            <div className='row'>
                                {data.map((item=>(
                                    <Link className='col-lg-4 col-md-6 col-sm-12 mb-3' to={`/sell/${item.id}`}>
                                        <h3>{t(item.name)}</h3>
                                    </Link>
                                )))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>

    )
}

export default React.memo(SellCategories)
