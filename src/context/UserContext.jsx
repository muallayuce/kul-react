import React, { createContext, useEffect, useState } from "react";

// Define your base URL
const BASE_URL = 'http://localhost:8000';

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('The Kul-est Token'));

    useEffect(()=>{
        const fetchUser = async () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            };

            try {
                const response = await fetch(BASE_URL + '/users', requestOptions); 

                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }

                // If the request is successful, you can optionally handle the response data here
                // For example, you might want to parse the response JSON and update some state variables
            } catch (error) {
                console.error(error);
                setToken(null);
            }
            
            localStorage.setItem('The Kul-est Token', token);
        };

        fetchUser();
    }, [token]);


        return (
            <UserContext.Provider value={[token, setToken]}>
                {props.children}
            </UserContext.Provider>
        )
};



// calismiyor, fetch url yanlis???? baseurl yok?? boyle bir endpoint yok ki????