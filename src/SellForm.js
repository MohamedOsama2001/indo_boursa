import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";

function SellForm() {
    const {t} = useTranslation();
    const navigate=useNavigate()
    const { id } = useParams();
    const [category, setcatgory] = useState([])
    const [subcategories, setsubgategories] = useState([])
    const [successMessage,setSuccessMessage]=useState('')
    const fileRef = useRef(null);
    const radioRef = useRef(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')))
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/categories/${id}`)
            .then((response) => {
                setcatgory(response.data)
                setsubgategories(response.data.subcategory)
            })
            .catch((e) => console.log(e))
    }, [id])
    const [formData, setFormData] = useState({
        category_id:id,
        subcategory_id: '',
        type: '',
        Ad_title: '',
        Ad_descrp: '',
        location: '',
        price: '',
        name: '',
        phone: '',
        contact_method: '',
        user_id:user.id
    });
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })};
    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('category_id', formData.category_id);
        data.append('subcategory_id', formData.subcategory_id);
        data.append('type', formData.type);
        data.append('Ad_title', formData.Ad_title);
        data.append('Ad_descrp', formData.Ad_descrp);
        data.append('location', formData.location);
        data.append('price', formData.price);
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        data.append('contact_method', formData.contact_method);
        data.append('user_id', formData.user_id);
        images.forEach((image, index) => {
            data.append(`product_image[${index}]`, image);
        });

        try {
            await axios.post('http://127.0.0.1:8000/api/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage('Your AD Posted Successfully')
            setFormData({
                category_id:id,
                subcategory_id: '',
                type: '',
                Ad_title: '',
                Ad_descrp: '',
                location: '',
                price: '',
                name: '',
                phone: '',
                contact_method: '',
                user_id:user.id
            });
            setImages([]);
            setErrors({});
            if(fileRef.current){
                fileRef.current.value=''
            }
            if(radioRef.current){
                radioRef.current.checked=false
            }
            setTimeout(()=>{
                navigate('/myads')
            },3000)
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };
    return (
        <>
            <main>
                <div className='post-form'>
                    <div className='container'>
                        <div className='head mb-5'>
                            <h2 className='text-center'>{t("POST YOUR AD")}</h2>
                            <div className='line'></div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {successMessage&&(<div className='message'><i class="far fa-check-circle"></i> {successMessage}</div>)}
                            <div class="row">
                                <div class="col-lg-6">
                                    <label for="category" class="form-label">{t("Category")}:</label>
                                    <input type='text' className='form-control'  value={t(category.name)} readOnly/>
                                    <input type='text' className='form-control' name='user_id'  value={user.id} hidden/>
                                    {errors.category_id && <p className='text-danger'>{errors.category_id}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="subcategory_id" class="form-label">{t("Sub Category")}:</label>
                                    <select class="form-select border border-dark" name='subcategory_id' value={formData.subcategory_id} onChange={handleChange}>
                                        <option value="">{t("Select")}</option>
                                        {subcategories.map((item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )))}
                                    </select>
                                    {errors.subcategory_id && <p className='text-danger'>{errors.subcategory_id}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="product_image" class="form-label">{t("Upload images")}:</label>
                                    <input type="file" ref={fileRef} class="form-control" name="product_image" onChange={handleImageChange} multiple />
                                    {errors.product_image && <p className='text-danger'>{errors.product_image}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="brand" class="form-label">{t(category.name==="Jobs"?"Employment Type":"Type or Brand")}:</label>
                                    <input type="text" class="form-control" name="type" value={formData.type} onChange={handleChange} placeholder={category.name==="Jobs"?t("Full-time or Part-time ......."):""} />
                                    {errors.type && <p className='text-danger'>{errors.type}</p>}
                                </div>
                                <div class="col-12">
                                    <label for="Ad_title" class="form-label">{t("Title")}:</label>
                                    <input type="text" class="form-control" name="Ad_title" value={formData.Ad_title} onChange={handleChange} />
                                    {errors.Ad_title && <p className='text-danger'>{errors.Ad_title}</p>}
                                </div>
                                <div class="col-12">
                                    <label for="Ad_descrp" class="form-label">{t("Description")}:</label>
                                    <textarea class="form-control border border-dark" rows="5" id="comment" name="Ad_descrp" value={formData.Ad_descrp} onChange={handleChange} placeholder={t('Descripe the item you are selling')}></textarea>
                                    {errors.Ad_descrp && <p className='text-danger'>{errors.Ad_descrp}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="location" class="form-label">{t("Location")}:</label>
                                    <input type="text" class="form-control" name="location" value={formData.location} onChange={handleChange} placeholder={t('Location')} />
                                    {errors.location && <p className='text-danger'>{errors.location}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="price" class="form-label">{t(category.name==="Jobs"?"Salary":"Price")}:</label>
                                    <input type="text" class="form-control" name="price" value={formData.price} onChange={handleChange} />
                                    {errors.price && <p className='text-danger'>{errors.price}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="name" class="form-label">{t("Name")}:</label>
                                    <input type="text" class="form-control" name="name" value={formData.name} onChange={handleChange}/>
                                    {errors.name && <p className='text-danger'>{errors.name}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="phone" class="form-label">{t("Phone Number")}:</label>
                                    <input type="text" class="form-control" name="phone" value={formData.phone} onChange={handleChange}/>
                                    {errors.phone && <p className='text-danger'>{errors.phone}</p>}
                                </div>
                                <div class="col-lg-6">
                                    <label for="contact_method" class="form-label">{t("Contact Methods")}:</label><br />
                                    <input type="radio" ref={radioRef} class="form-check-input me-2 border border-dark"  name="contact_method" value="phone_number"  onChange={handleChange} />{t("Phone Number")}
                                    <input type="radio" ref={radioRef} class="form-check-input ms-2 me-2 border border-dark"  name="contact_method" value="whatsapp" onChange={handleChange} />WhatsApp
                                    <input type="radio" ref={radioRef} class="form-check-input ms-2 me-2 border border-dark"  name="contact_method" value="both" onChange={handleChange} />{t("Both")}
                                    {errors.contact_method && <p className='text-danger'>{errors.contact_method}</p>}
                                </div>
                                <div className='col-lg-12 text-center mt-5'>
                                    <button value='submit' className='btn btn-danger'>{t("Post now")}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

        </>
    )   
}

export default React.memo(SellForm)
