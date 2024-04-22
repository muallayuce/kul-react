import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import './SearchBar.css';
import { BASE_URL } from '../App';

const SearchBar = ({ setSearchResults }) => {
    const [input, setInput] = useState('');

    const fetchData = (value) => {
        fetch(`${BASE_URL}/products/?product_name=${encodeURIComponent(value)}`)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data); // Utiliza setSearchResults de las props
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
            </header>
        </div>
    );
};

export default SearchBar;