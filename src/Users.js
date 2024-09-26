import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Users() {
    const [categories,setcategories]=useState([]);
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/subcategories?category_id=1')
            .then(response => {
                setcategories(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {categories.map(category => (
                    <li>{category.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Users;