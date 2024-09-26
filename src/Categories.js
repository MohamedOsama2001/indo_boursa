import React, { lazy, Suspense, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchData } from './CategoriesRedux';
import { useTranslation } from "react-i18next";
const LazyLoadedImage = lazy(() => import("./LazyLoadImages"));

function Categories() {
    const {t} = useTranslation();
    const dispatch=useDispatch()
    const data=useSelector(state=>state.data)
    useEffect(()=>{
        dispatch(fetchData())
    },[dispatch])
    return (
        <>
            <main>
                <div class="all-categories">
                    <div class="container">
                        <div class="head">
                            <h2>{t("Categories")}</h2>
                            <div class="line"></div>
                        </div>
                        <div class="categories-content mt-5">
                            <div class="row">
                            <Suspense fallback={<div style={{textAlign: "center",fontSize: "25px",marginBottom: "100px",}}>Loading...</div>}>
                                {data.map(category => (
                                    <>
                                        <div class="col-lg-4 col-md-6 col-sm-12">
                                            <div class="category-image">
                                                <LazyLoadedImage src={category.image} alt="" draggable="none" />
                                                <div class="image-overlay">
                                                    <h4>{t(category.name)}</h4>
                                                    <Link to={`/categories/${category.id}`}>{t("View")}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))}
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default React.memo(Categories)
