export const putAuthentication = (opts) => {
    const token = localStorage.getItem('The Kul-est Token');
    const options = opts || {};
    return {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    };
};

export const a_fetch = (url, opts) => {
    return fetch(url, putAuthentication(opts));
}

/*
const sumar = (a, b) => {
    return a + doblar(b);
}

const doblar = (x) => {
    return x*2;
}
*/
