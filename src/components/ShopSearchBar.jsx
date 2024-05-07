import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import './SearchBar.css';
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";

const ShopSearchBar = ({ setSearchTerm }) => {
    const [input, setInput] = useState('');

    const handleChange = (value) => {
        setInput(value);
        setSearchTerm(value);
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
                            <i className="bi bi-bag-plus-fill" id='new-product'></i>
                        </button>
                    </Tooltip>
                </Link>
            </header>
        </div>
    );
};

export default ShopSearchBar;