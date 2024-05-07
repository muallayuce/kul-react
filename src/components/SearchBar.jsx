import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import './SearchBar.css';
import { BASE_URL } from '../App';
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { a_fetch } from "./NetworkUtils";

const SearchBar = ({ setSearchResults }) => {
    const [input, setInput] = useState('');

    const fetchData = (value) => {
        a_fetch(`${BASE_URL}/products/?product_name=${encodeURIComponent(value)}`)
            .then((response) => response.json())
            .then((data) => {
                const firstImage = data.map(product => ({
                    ...product,
                    images: product.images.length > 0 ? [product.images[0]] : []
                }));
                setSearchResults(firstImage);
            })
            .catch((error) => {
                console.error("Error fetching search results:", error);
            });
    };

    const handleChange = (value) => {
        setInput(value);
        if (value.length >= 3) { //If imore than 3 characters, fetch products
            fetchData(value);
        } else {
            fetchData(''); // If less than 3 characters, fetch all products
        }
    };


    return (
        <div className="search-bar-container">
            <header className='search-header'>

                <div className="input-wrapper">
                    <FontAwesomeIcon icon={faSearch} id='search-icon' />
                    <input placeholder="Search..." value={input} onChange={(e) => handleChange(e.target.value)}></input>
                </div>
                <Link to='/new/product'>
                    <Tooltip title='Sell a product' placement="top" arrow id="sell-tooltip" >
                        <button className="new-product-button">
                            <i class="bi bi-bag-plus-fill" id='new-product'></i>
                        </button>
                    </Tooltip>
                </Link>
                <Link to='/myshop'>
                    <Tooltip title='My shop' placement="top" arrow id="shop-tooltip" >
                        <button className="shop-button">
                            <i class="bi bi-shop" id='shop-icon'></i>
                        </button>
                    </Tooltip>
                </Link>
                <Link to='/mycart'>
                    <Tooltip title='My cart' placement="top" arrow id="kart-tooltip" >
                        <button className="kart-button">
                            <i class="bi bi-cart4" id='kart-icon'></i>
                        </button>
                    </Tooltip>
                </Link>
            </header>
        </div>
    );
};

export default SearchBar;